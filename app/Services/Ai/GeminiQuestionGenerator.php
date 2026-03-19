<?php

namespace App\Services\Ai;

use App\Models\Document;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class GeminiQuestionGenerator
{
    public function generateFromDocument(Document $document): array
    {
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-3-flash-preview');
        $timeout = (int) config('services.gemini.timeout', 120);
        $disk = config('services.gemini.template_disk', 'public_documents');

        if (! $apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $templatePath = null;
        $templates = config('services.gemini.templates', []);
        $documentTitle = strtolower($document->title);

        foreach ($templates as $key => $path) {
            if (str_contains($documentTitle, $key)) {
                $templatePath = $path;
                break;
            }
        }

        $finalPath = $templatePath ?: Storage::disk($disk)->path($document->document_path);

        if (! file_exists($finalPath)) {
            throw new RuntimeException("Template file not found: {$finalPath}");
        }

        $fileContent = file_get_contents($finalPath);
        $mimeType = $document->document_mime ?: 'application/pdf';
        $base64File = base64_encode($fileContent);

        $templateBase64 = null;

        if ($templatePath && file_exists($templatePath)) {
            $templateContent = file_get_contents($templatePath);
            $templateBase64 = base64_encode($templateContent);
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
                                        'placeholder' => ['type' => 'string'],
                                        'help_text' => ['type' => 'string'],
                                        'options' => [
                                            'type' => 'array',
                                            'items' => ['type' => 'string'],
                                        ],
                                    ],
                                    'required' => ['key', 'label', 'type', 'required'],
                                ],
                            ],
                            'follow_ups' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'when' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'field' => ['type' => 'string'],
                                                'operator' => ['type' => 'string'],
                                                'value' => [
                                                    'nullable' => true,
                                                ],
                                            ],
                                            'required' => ['field', 'operator'],
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
                                                ],
                                                'required' => ['key', 'label', 'type', 'required'],
                                            ],
                                        ],
                                    ],
                                    'required' => ['when', 'questions'],
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
You are generating a legal intake questionnaire.

You are given:
1. A document template (target document)
2. A reference questionnaire template (if provided)

Instructions:
- If a reference questionnaire is provided, use it as the PRIMARY structure.
- Adapt it to match the target document.
- Preserve follow-up logic, repeatable groups, and conditions from the reference.
- If no reference is provided, analyze the document normally.

Rules:
- Return JSON only
- No explanations
- Follow the schema strictly
- Use snake_case keys
- Only include questions needed to complete the document

Document title: {$document->title}
Document description: {$document->description}
PROMPT;

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        $payload = [
            'systemInstruction' => [
                'parts' => [
                    [
                        'text' => 'You are a legal intake schema generator. Always return valid JSON that matches the provided schema.',
                    ],
                ],
            ],
            'contents' => [
                [
                    'parts' => array_filter([
                        [
                            'inlineData' => [
                                'mimeType' => $mimeType,
                                'data' => $base64File,
                            ],
                        ],

                        $templateBase64 ? [
                            'inlineData' => [
                                'mimeType' => 'application/pdf',
                                'data' => $templateBase64,
                            ],
                        ] : null,

                        [
                            'text' => $prompt,
                        ],
                    ]),
                ],
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'responseSchema' => $schema,
                'temperature' => 0.1,
            ],
        ];

        $response = Http::timeout($timeout)
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

        $text = trim($text);

        if (str_starts_with($text, '```')) {
            $text = preg_replace('/^```(?:json)?\s*/', '', $text) ?? $text;
            $text = preg_replace('/\s*```$/', '', $text) ?? $text;
            $text = trim($text);
        }

        $decoded = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
            throw new RuntimeException('Gemini returned invalid JSON: ' . json_last_error_msg());
        }

        if (
            ! isset($decoded['document_type']) ||
            ! isset($decoded['questions']) ||
            ! is_array($decoded['questions'])
        ) {
            throw new RuntimeException('Gemini JSON does not match the expected structure.');
        }

        return $decoded;
    }
}
