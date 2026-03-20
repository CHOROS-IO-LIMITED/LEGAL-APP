<?php

namespace App\Services\Ai;

use App\Models\Document;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class GeminiQuestionGenerator
{
    public function __construct(
        protected PdfTextExtractor $pdfTextExtractor
    ) {}

    public function generateFromDocument(Document $document): array
    {
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-2.5-flash');
        $timeout = (int) config('services.gemini.timeout', 90);
        $disk = config('services.gemini.template_disk', 'public_documents');

        if (! $apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        if (! $document->document_path) {
            throw new RuntimeException('Document template path is missing.');
        }

        $mainPath = Storage::disk($disk)->path($document->document_path);

        if (! is_file($mainPath)) {
            throw new RuntimeException("Main document not found: {$mainPath}");
        }

        $referencePath = $this->resolveReferencePath((string) $document->title);

        $mainText = $this->getCachedExtractedText(
            path: $mainPath,
            cacheKey: 'gemini_main_text_' . md5($mainPath . '|' . @filemtime($mainPath)),
            label: 'main_document',
            documentId: $document->id
        );

        $referenceText = null;

        if ($referencePath && is_file($referencePath)) {
            $referenceText = $this->getCachedExtractedText(
                path: $referencePath,
                cacheKey: 'gemini_reference_text_' . md5($referencePath . '|' . @filemtime($referencePath)),
                label: 'reference_document',
                documentId: $document->id
            );
        }

        $payload = [
            'systemInstruction' => [
                'parts' => [
                    [
                        'text' => implode("\n", [
                            'You are a legal intake schema generator.',
                            'Return valid JSON only.',
                            'You must strictly follow the provided response schema.',
                            'Generate a question decision tree with nested follow_ups.',
                            'Do not flatten conditional logic.',
                            'Do not invent unsupported legal questions.',
                            'Base every question on the provided texts.',
                            'Each question node must represent exactly one askable input.',
                            'Do not use grouped fields.',
                            'Do not output a fields array.',
                            'All keys must be globally unique across the entire schema, including nested follow_ups.',
                        ]),
                    ],
                ],
            ],
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        [
                            'text' => $this->buildPrompt(
                                documentTitle: (string) $document->title,
                                documentDescription: (string) ($document->description ?? ''),
                                mainText: $mainText,
                                referenceText: $referenceText,
                            ),
                        ],
                    ],
                ],
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'responseSchema' => $this->responseSchema(maxDepth: 5),
                'temperature' => 0.0,
                'topP' => 0.8,
                'topK' => 20,
            ],
        ];

        $cacheKey = 'gemini_questions_' . md5(json_encode([
            'document_id' => $document->id,
            'document_updated_at' => (string) $document->updated_at,
            'model' => $model,
            'main_hash' => sha1($mainText),
            'reference_hash' => $referenceText ? sha1($referenceText) : null,
        ]));

        return Cache::remember($cacheKey, now()->addHours(12), function () use (
            $apiKey,
            $model,
            $timeout,
            $payload,
            $document
        ) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

            try {
                $response = Http::timeout($timeout)
                    ->connectTimeout(20)
                    ->retry(2, 1500, throw: false)
                    ->acceptJson()
                    ->withQueryParameters([
                        'key' => $apiKey,
                    ])
                    ->post($url, $payload);
            } catch (ConnectionException $e) {
                Log::error('Gemini timeout error', [
                    'document_id' => $document->id,
                    'message' => $e->getMessage(),
                ]);

                throw new RuntimeException('Gemini request timed out. Please try again.');
            }

            if (! $response->successful()) {
                Log::error('Gemini API failed', [
                    'document_id' => $document->id,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new RuntimeException('Gemini request failed.');
            }

            $decoded = $this->decodeResponse($response->json(), $document->id);

            return $this->normalizeSchema($decoded);
        });
    }

    public function extractMainText(Document $document): string
    {
        $disk = config('services.gemini.template_disk', 'public_documents');

        if (! $document->document_path) {
            throw new RuntimeException('Document template path is missing.');
        }

        $mainPath = Storage::disk($disk)->path($document->document_path);

        if (! is_file($mainPath)) {
            throw new RuntimeException("Main document not found: {$mainPath}");
        }

        return $this->getCachedExtractedText(
            path: $mainPath,
            cacheKey: 'gemini_main_text_' . md5($mainPath . '|' . @filemtime($mainPath)),
            label: 'main_document',
            documentId: $document->id
        );
    }

    public function extractReferenceText(Document $document): ?string
    {
        $referencePath = $this->resolveReferencePath((string) $document->title);

        if (! $referencePath || ! is_file($referencePath)) {
            return null;
        }

        return $this->getCachedExtractedText(
            path: $referencePath,
            cacheKey: 'gemini_reference_text_' . md5($referencePath . '|' . @filemtime($referencePath)),
            label: 'reference_document',
            documentId: $document->id
        );
    }

    protected function resolveReferencePath(string $title): ?string
    {
        $references = config('services.gemini.references', []);
        $normalizedTitle = $this->normalizeTitle($title);

        if (isset($references[$normalizedTitle])) {
            return $references[$normalizedTitle];
        }

        foreach ($references as $key => $path) {
            $normalizedKey = $this->normalizeTitle((string) $key);

            if (
                $normalizedTitle === $normalizedKey ||
                str_contains($normalizedTitle, $normalizedKey) ||
                str_contains($normalizedKey, $normalizedTitle)
            ) {
                return $path;
            }
        }

        return null;
    }

    protected function normalizeTitle(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/[^a-z0-9]+/i', ' ', $value) ?? $value;
        $value = preg_replace('/\s+/', ' ', $value) ?? $value;

        return trim($value);
    }

    protected function getCachedExtractedText(
        string $path,
        string $cacheKey,
        string $label,
        int|string|null $documentId = null,
    ): string {
        return Cache::remember($cacheKey, now()->addDays(7), function () use ($path, $label, $documentId) {
            try {
                $text = $this->pdfTextExtractor->extract($path);
                $text = $this->cleanText($text);

                if ($text !== '') {
                    return $this->truncateText($text, 120_000);
                }
            } catch (\Throwable $e) {
                Log::warning('PDF text extraction failed', [
                    'path' => $path,
                    'label' => $label,
                    'document_id' => $documentId,
                    'message' => $e->getMessage(),
                ]);
            }

            throw new RuntimeException("Unable to extract text from {$label}.");
        });
    }

    protected function buildPrompt(
        string $documentTitle,
        string $documentDescription,
        string $mainText,
        ?string $referenceText,
    ): string {
        $hasReference = $referenceText ? 'YES' : 'NO';

        return <<<PROMPT
You are generating a legal intake questionnaire schema.

OUTPUT RULES:
- Return valid JSON only.
- Strictly match the response schema.
- Build a decision tree, not a flat list.
- Ask one question at a time in the exact logical order.
- Use follow_ups for every conditional path.
- Deep nesting is allowed and expected.
- Do not ask duplicate questions.
- Do not ask irrelevant questions.
- Every question must be grounded in the supplied text.

INTERACTION RULES:
- The frontend shows exactly one question at a time.
- Therefore each question object must represent exactly one user input.
- Do not use grouped fields.
- Do not output a fields array.
- Do not combine multiple asks into one node.
- Every key must be globally unique across the entire schema, including nested follow_ups.

FOLLOW-UP RULES:
- If a question depends on a previous answer, it must go inside follow_ups.
- Use only these operators:
  - equals
  - not_equals
  - truthy
  - falsy

FIELD RULES:
- key: snake_case
- type: text | textarea | number | select | checkbox | date
- required: true/false
- use options for select and checkbox
- use help_text when legal explanation is useful
- use placeholder where useful
- keep top-level questions lean
- push detailed branches into follow_ups

BOOLEAN / BRANCHING RULES:
- For branching questions, prefer select with options like ["yes", "no"].
- Use a single checkbox only for affirmative acknowledgements or consent.
- Do not use checkbox when a yes/no select is clearer.

SPECIAL LOAN / LEGAL FLOW RULES:
- For company vs individual, security, guarantee, property charge, interest type, and jurisdiction, use nested follow_ups.
- If REFERENCE QUESTION TEXT exists, follow its sequence closely.
- Do not flatten company details, signatory details, or security details.
- If the reference starts with identifying who is lender or borrower, preserve that intake flow.

DOCUMENT:
Title: {$documentTitle}
Description: {$documentDescription}

REFERENCE PROVIDED: {$hasReference}

MAIN TEMPLATE TEXT:
<<<MAIN_TEMPLATE
{$mainText}
MAIN_TEMPLATE

REFERENCE QUESTION TEXT:
<<<REFERENCE
{$referenceText}
REFERENCE

Now generate the JSON schema.
PROMPT;
    }

    protected function responseSchema(int $maxDepth = 5): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'document_type' => [
                    'type' => 'string',
                ],
                'questions' => [
                    'type' => 'array',
                    'items' => $this->questionSchema($maxDepth),
                ],
            ],
            'required' => ['document_type', 'questions'],
        ];
    }

    protected function questionSchema(int $depth): array
    {
        $schema = [
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
        ];

        if ($depth > 0) {
            $schema['properties']['follow_ups'] = [
                'type' => 'array',
                'items' => [
                    'type' => 'object',
                    'properties' => [
                        'when' => [
                            'type' => 'object',
                            'properties' => [
                                'field' => ['type' => 'string'],
                                'operator' => ['type' => 'string'],
                                'value' => ['type' => 'string'],
                            ],
                            'required' => ['field', 'operator'],
                        ],
                        'questions' => [
                            'type' => 'array',
                            'items' => $this->questionSchema($depth - 1),
                        ],
                    ],
                    'required' => ['when', 'questions'],
                ],
            ];
        }

        return $schema;
    }

    protected function decodeResponse(array $json, int|string|null $documentId = null): array
    {
        $text = data_get($json, 'candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            Log::error('Gemini empty response', [
                'document_id' => $documentId,
                'response' => $json,
            ]);

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
            Log::error('Gemini invalid JSON', [
                'document_id' => $documentId,
                'error' => json_last_error_msg(),
                'raw_text' => $text,
            ]);

            throw new RuntimeException('Gemini returned invalid JSON: ' . json_last_error_msg());
        }

        if (
            ! isset($decoded['document_type']) ||
            ! isset($decoded['questions']) ||
            ! is_array($decoded['questions'])
        ) {
            Log::error('Gemini schema mismatch', [
                'document_id' => $documentId,
                'decoded' => $decoded,
            ]);

            throw new RuntimeException('Gemini JSON does not match the expected structure.');
        }

        return $decoded;
    }

    protected function normalizeSchema(array $decoded): array
    {
        $seen = [];

        return [
            'document_type' => (string) ($decoded['document_type'] ?? 'document'),
            'questions' => $this->normalizeQuestions($decoded['questions'] ?? [], $seen),
        ];
    }

    protected function normalizeQuestions(array $questions, array &$seen = []): array
    {
        $result = [];

        foreach ($questions as $question) {
            if (! is_array($question)) {
                continue;
            }

            $key = $this->normalizeKey((string) Arr::get($question, 'key', ''));

            if ($key === '' || isset($seen[$key])) {
                continue;
            }

            $type = $this->normalizeType((string) Arr::get($question, 'type', 'text'));

            $normalized = [
                'key' => $key,
                'label' => trim((string) Arr::get($question, 'label', $key)),
                'type' => $type,
                'required' => (bool) Arr::get($question, 'required', false),
            ];

            foreach (['placeholder', 'help_text'] as $textField) {
                $value = trim((string) Arr::get($question, $textField, ''));

                if ($value !== '') {
                    $normalized[$textField] = $value;
                }
            }

            foreach (['min', 'max'] as $bound) {
                if (array_key_exists($bound, $question) && is_numeric($question[$bound])) {
                    $normalized[$bound] = $question[$bound] + 0;
                }
            }

            if (in_array($type, ['select', 'checkbox'], true)) {
                $options = array_values(array_unique(array_filter(array_map(
                    fn($value) => trim((string) $value),
                    Arr::get($question, 'options', [])
                ))));

                if ($options !== []) {
                    $normalized['options'] = $options;
                }
            }

            $seen[$key] = true;

            $followUps = Arr::get($question, 'follow_ups', []);

            if (is_array($followUps) && $followUps !== []) {
                $normalizedFollowUps = [];

                foreach ($followUps as $followUp) {
                    if (! is_array($followUp)) {
                        continue;
                    }

                    $when = Arr::get($followUp, 'when', []);
                    $field = $this->normalizeKey((string) Arr::get($when, 'field', ''));
                    $operator = (string) Arr::get($when, 'operator', '');

                    if ($field === '' || ! in_array($operator, ['equals', 'not_equals', 'truthy', 'falsy'], true)) {
                        continue;
                    }

                    $nestedQuestions = $this->normalizeQuestions(
                        Arr::get($followUp, 'questions', []),
                        $seen
                    );

                    if ($nestedQuestions === []) {
                        continue;
                    }

                    $item = [
                        'when' => [
                            'field' => $field,
                            'operator' => $operator,
                        ],
                        'questions' => $nestedQuestions,
                    ];

                    $value = Arr::get($when, 'value');

                    if (is_scalar($value) && $value !== '') {
                        $item['when']['value'] = (string) $value;
                    }

                    $normalizedFollowUps[] = $item;
                }

                if ($normalizedFollowUps !== []) {
                    $normalized['follow_ups'] = $normalizedFollowUps;
                }
            }

            $result[] = $normalized;
        }

        return array_values($result);
    }

    protected function normalizeKey(string $key): string
    {
        $key = strtolower(trim($key));
        $key = preg_replace('/[^a-z0-9]+/', '_', $key) ?? $key;
        $key = preg_replace('/_+/', '_', $key) ?? $key;

        return trim($key, '_');
    }

    protected function normalizeType(string $type): string
    {
        $type = strtolower(trim($type));

        return match ($type) {
            'string', 'input' => 'text',
            'integer', 'float', 'decimal' => 'number',
            'radio', 'dropdown' => 'select',
            'bool', 'boolean' => 'checkbox',
            default => in_array($type, ['text', 'textarea', 'number', 'select', 'checkbox', 'date'], true)
                ? $type
                : 'text',
        };
    }

    protected function cleanText(string $text): string
    {
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
        $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;

        return trim($text);
    }

    protected function truncateText(string $text, int $maxChars): string
    {
        if (mb_strlen($text) <= $maxChars) {
            return $text;
        }

        return mb_substr($text, 0, $maxChars);
    }
}
