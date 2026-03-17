<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiQuestionGenerator
{
    public function generateQuestions(array $documentContext): array
    {
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-2.5-flash');

        $schema = [
            'type' => 'object',
            'properties' => [
                'document_type' => ['type' => 'string'],
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
You are generating intake questions for a legal document workflow.

Return valid JSON only.
Do not include markdown.
Do not include explanations outside the JSON.

Allowed field types:
text, email, number, date, textarea, select, repeatable_group

Rules:
- Generate only the minimum necessary questions.
- Use snake_case keys.
- Use user-friendly labels.
- If the document may involve recipients, ask:
  1. recipient_count
  2. recipients as a repeatable_group with fields: name, email
- Include names, emails, addresses, dates, and money fields only if relevant.
- Keep the response suitable for a frontend form renderer.

Document title: {$documentContext['title']}
Document description: {$documentContext['description']}
Admin AI instructions: {$documentContext['ai_prompt']}
PROMPT;

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        $response = Http::timeout(60)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'X-goog-api-key' => $apiKey,
            ])
            ->post($url, [
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
                ],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Gemini request failed: ' . $response->body());
        }

        $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (! $text) {
            throw new RuntimeException('Gemini returned an empty response.');
        }

        $decoded = json_decode($text, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('Gemini returned invalid JSON.');
        }

        return $decoded;
    }
}
