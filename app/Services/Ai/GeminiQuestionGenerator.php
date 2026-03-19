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

        $documentTitle = strtolower($document->title);

        // MAIN DOCUMENT (always used)
        $mainPath = Storage::disk($disk)->path($document->document_path);

        // OPTIONAL REFERENCE (ONLY for loan agreement)
        $referencePath = null;

        if (str_contains($documentTitle, 'loan agreement')) {
            $referencePath = base_path('private/documents/Loan Agreement questions.pdf');
        }

        $parts = [];

        // Main document (always)
        if (!file_exists($mainPath)) {
            throw new RuntimeException("Main document not found: {$mainPath}");
        }

        $parts[] = [
            'inlineData' => [
                'mimeType' => $document->document_mime ?: 'application/pdf',
                'data' => base64_encode(file_get_contents($mainPath)),
            ],
        ];

        // Reference (only if loan agreement)
        if ($referencePath && file_exists($referencePath)) {
            $parts[] = [
                'inlineData' => [
                    'mimeType' => 'application/pdf',
                    'data' => base64_encode(file_get_contents($referencePath)),
                ],
            ];
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
You are a legal intake questionnaire generator.

You will generate a structured JSON schema for a document.

You are given:
1. A MAIN document (the actual template)
2. OPTIONAL reference questionnaire (ONLY for Loan Agreement)

---

CRITICAL BEHAVIOR:

- You MUST generate a DECISION TREE (not a flat list)
- Questions must be asked ONE at a time in logical order
- Use "follow_ups" for ALL conditional logic
- Do NOT flatten questions
- Do NOT repeat questions
- Do NOT ask irrelevant questions

---

LOAN AGREEMENT SPECIAL RULES (ONLY IF REFERENCE IS PROVIDED):

- STRICTLY follow the structure of the reference PDF
- FIRST QUESTION MUST BE:
  "Who is the lender or borrower?"

- Build flow like this:
  Answer → Next question → Follow-up → Next

- Example:
  lender/borrower → individual/company → company details → director → signatory

- Include:
  ✔ security logic
  ✔ personal guarantee logic
  ✔ property charge logic
  ✔ interest structure
  ✔ jurisdiction
  ✔ explanations via help_text

---

FOLLOW-UP RULES:

- Use follow_ups for:
  ✔ company vs individual
  ✔ security types
  ✔ interest types
  ✔ jurisdiction
  ✔ guarantees

- Deep nesting is REQUIRED

---

FIELD RULES:

- key → snake_case
- type → text | number | select | checkbox
- required → true/false
- options → required for select/checkbox
- help_text → REQUIRED when legal explanation needed

---

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "document_type": "string",
  "questions": [...]
}

---

IMPORTANT:

- DO NOT generate all questions flat
- DO NOT skip logical flow
- DO NOT return explanations outside JSON

---

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
                    'contents' => [
                        [
                            'parts' => array_merge(
                                $parts,
                                [
                                    ['text' => $prompt],
                                ]
                            ),
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
