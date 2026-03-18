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
        $model = config('services.gemini.model', env('GEMINI_MODEL', 'gemini-3-flash'));
        $timeout = (int) config('services.gemini.timeout', env('GEMINI_TIMEOUT', 120));
        $disk = config('services.gemini.template_disk', env('GEMINI_TEMPLATE_DISK', 'private'));

        if (! $apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        if (! $document->document_path) {
            throw new RuntimeException('Document template file is missing.');
        }

        if (! Storage::disk($disk)->exists($document->document_path)) {
            throw new RuntimeException("Document template file was not found in disk [{$disk}].");
        }

        $fileContent = Storage::disk($disk)->get($document->document_path);
        $mimeType = $document->document_mime ?: 'application/pdf';
        $base64File = base64_encode($fileContent);

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
You are generating a legal intake questionnaire from a private legal document template.

Analyze the uploaded legal template and extract only the information the client must answer to complete the document later.

Return JSON only.
No markdown.
No explanations.
No extra text.

Allowed field types:
text, email, number, date, textarea, select, checkbox, repeatable_group

Rules:
- Base everything on the uploaded file content.
- The uploaded template may already contain questions, branching, conditions, schedules, clauses, repeating parties, or follow-up logic.
- Preserve important follow-up logic whenever a previous answer changes the next required question.
- Use repeatable_group for repeated entities such as borrowers, lenders, directors, recipients, signatories, witnesses, partners, shareholders, trustees, etc.
- Use snake_case keys.
- Labels must be user-friendly.
- Ask only for information required to complete the document.
- Do not ask for internal law firm notes.
- Keep the structure frontend-friendly and ready for conditional rendering.
- Prefer complete and accurate legal intake logic over overly short output.

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
                    'parts' => [
                        [
                            'inlineData' => [
                                'mimeType' => $mimeType,
                                'data' => $base64File,
                            ],
                        ],
                        [
                            'text' => $prompt,
                        ],
                    ],
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
