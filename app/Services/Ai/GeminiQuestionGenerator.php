<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiQuestionGenerator
{
    public function generateQuestions(array $documentContext): array
    {
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-3-flash-preview');

        if (! $apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $schema = [
            'type' => 'object',
            'properties' => [
                'document_type' => [
                    'type' => 'string',
                ],
                'questions' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'key' => ['type' => 'string'],
                            'label' => ['type' => 'string'],
                            'type' => ['type' => 'string'],
                            'required' => ['type' => 'boolean'],
                            'placeholder' => ['type' => 'string'],
                            'help_text' => ['type' => 'string'],
                            'min' => ['type' => 'number'],
                            'max' => ['type' => 'number'],
                            'options' => [
                                'type' => 'array',
                                'items' => ['type' => 'string'],
                            ],
                            'fields' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'key' => ['type' => 'string'],
                                        'label' => ['type' => 'string'],
                                        'type' => ['type' => 'string'],
                                        'required' => ['type' => 'boolean'],
                                    ],
                                    'required' => ['key', 'label', 'type', 'required'],
                                ],
                            ],
                        ],
                        'required' => ['key', 'label', 'type', 'required'],
                    ],
                ],
            ],
            'required' => ['document_type', 'questions'],
        ];

        $prompt = <<<PROMPT
Generate intake questions for a legal document workflow.

Return JSON only.
No markdown.
No explanation.
No extra text.

Allowed field types:
text, email, number, date, textarea, select, repeatable_group

Rules:
- Generate only the minimum necessary questions.
- Use snake_case keys.
- Use user-friendly labels.
- If the document may involve recipients, include:
  - recipient_count
  - recipients as a repeatable_group with fields: name, email
- Include names, emails, addresses, dates, and money fields only if relevant.
- Keep the result suitable for a frontend form renderer.

Document title: {$documentContext['title']}
Document description: {$documentContext['description']}
Admin AI instructions: {$documentContext['ai_prompt']}
PROMPT;

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        $payload = [
            'systemInstruction' => [
                'parts' => [
                    [
                        'text' => 'You are a structured output generator for legal intake forms. Always return valid JSON that matches the provided schema.',
                    ],
                ],
            ],
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                    ],
                ],
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'responseSchema' => $schema,
                'temperature' => 0.2,
            ],
        ];

        $response = Http::timeout(60)
            ->acceptJson()
            ->withQueryParameters([
                'key' => $apiKey,
            ])
            ->post($url, $payload);

        if (! $response->successful()) {
            throw new RuntimeException('Gemini request failed: ' . $response->body());
        }

        $json = $response->json();

        $text = data_get($json, 'candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            throw new RuntimeException('Gemini returned an empty response.');
        }

        $decoded = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
            throw new RuntimeException('Gemini returned invalid JSON: ' . json_last_error_msg());
        }

        if (! array_key_exists('document_type', $decoded) || ! array_key_exists('questions', $decoded)) {
            throw new RuntimeException('Gemini JSON does not match the expected structure.');
        }

        return $decoded;
    }
}
