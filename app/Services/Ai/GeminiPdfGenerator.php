<?php

namespace App\Services\Ai;

use App\Models\UserDocument;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class GeminiPdfGenerator
{
    public function __construct(
        protected DocumentTextExtractor $documentTextExtractor
    ) {}

    public function generate(UserDocument $userDocument): array
    {
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.pdf_model', 'gemini-3-flash-preview');
        $timeout = (int) config('services.gemini.timeout', 180);
        $disk = config('services.gemini.template_disk', 'public_documents');

        if (! $apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        if (! $userDocument->document) {
            throw new RuntimeException('User document has no related document.');
        }

        if (! $userDocument->document->document_path) {
            throw new RuntimeException('Document template path is missing.');
        }

        $templatePath = Storage::disk($disk)->path($userDocument->document->document_path);

        if (! is_file($templatePath)) {
            throw new RuntimeException("Template document not found: {$templatePath}");
        }

        $templateText = $this->getCachedExtractedText(
            path: $templatePath,
            cacheKey: 'gemini_pdf_template_text_' . md5($templatePath . '|' . @filemtime($templatePath)),
            label: 'pdf_template',
            userDocumentId: $userDocument->id
        );

        $answers = $userDocument->answers_json ?? [];

        if (! is_array($answers) || $answers === []) {
            throw new RuntimeException('No answers found for PDF generation.');
        }

        $payload = [
            'systemInstruction' => [
                'parts' => [
                    [
                        'text' => implode("\n", [
                            'You are a legal document assembly engine.',
                            'Return valid JSON only.',
                            'Do not explain.',
                            'Do not add commentary.',
                            'Fill the document using only the supplied answers.',
                            'Remove drafting notes and unused alternatives.',
                            'Do not invent unsupported facts.',
                            'If data is missing, use [MISSING: field_name].',
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
                                documentTitle: (string) $userDocument->document->title,
                                documentDescription: (string) ($userDocument->document->description ?? ''),
                                templateText: $templateText,
                                answers: $answers
                            ),
                        ],
                    ],
                ],
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'responseSchema' => $this->responseSchema(),
                'temperature' => 0.0,
                'topP' => 0.8,
                'topK' => 20,
                'maxOutputTokens' => 12000,
            ],
        ];

        $cacheKey = 'gemini_filled_document_' . md5(json_encode([
            'user_document_id' => $userDocument->id,
            'document_updated_at' => (string) $userDocument->document->updated_at,
            'answers_updated_at' => (string) $userDocument->updated_at,
            'answers' => $answers,
            'model' => $model,
            'template_hash' => sha1($templateText),
        ]));

        return Cache::remember($cacheKey, now()->addHours(12), function () use (
            $apiKey,
            $model,
            $timeout,
            $payload,
            $userDocument
        ) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

            try {
                $response = Http::timeout($timeout)
                    ->connectTimeout(20)
                    ->retry(1, 1500, throw: false)
                    ->acceptJson()
                    ->withQueryParameters([
                        'key' => $apiKey,
                    ])
                    ->post($url, $payload);
            } catch (ConnectionException $e) {
                Log::error('Gemini PDF generation timeout', [
                    'user_document_id' => $userDocument->id,
                    'model' => $model,
                    'timeout' => $timeout,
                    'message' => $e->getMessage(),
                ]);

                throw new RuntimeException('Gemini request timed out while generating the PDF content.');
            }

            if (! $response->successful()) {
                Log::error('Gemini PDF generation failed', [
                    'user_document_id' => $userDocument->id,
                    'model' => $model,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new RuntimeException('Gemini request failed while generating the PDF content.');
            }

            return $this->decodeResponse($response->json(), $userDocument->id);
        });
    }

    protected function buildPrompt(
        string $documentTitle,
        string $documentDescription,
        string $templateText,
        array $answers,
    ): string {
        $answersJson = json_encode($answers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return <<<PROMPT
Assemble a final legal document from the template and answers.

Document title: {$documentTitle}
Document description: {$documentDescription}

Rules:
- Return JSON only.
- Use the template as the source structure.
- Fill blanks from the answers.
- Keep only the clauses supported by the answers.
- Remove drafting notes, unused alternatives, and instructions.
- Do not invent facts.
- If data is missing, write [MISSING: field_name].
- Preserve signatures and schedules only if applicable.
- No markdown. No code fences.

Answers:
{$answersJson}

Template:
{$templateText}

Return:
{
  "document_title": "...",
  "document_date": "...",
  "filled_document_text": "..."
}
PROMPT;
    }

    protected function responseSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'document_title' => ['type' => 'string'],
                'document_date' => ['type' => 'string'],
                'filled_document_text' => ['type' => 'string'],
            ],
            'required' => ['document_title', 'document_date', 'filled_document_text'],
        ];
    }

    protected function decodeResponse(array $json, int|string|null $userDocumentId = null): array
    {
        $text = data_get($json, 'candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            Log::error('Gemini PDF empty response', [
                'user_document_id' => $userDocumentId,
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
            Log::error('Gemini PDF invalid JSON', [
                'user_document_id' => $userDocumentId,
                'error' => json_last_error_msg(),
                'raw_text' => $text,
            ]);

            throw new RuntimeException('Gemini returned invalid JSON: ' . json_last_error_msg());
        }

        if (
            ! isset($decoded['document_title']) ||
            ! isset($decoded['document_date']) ||
            ! isset($decoded['filled_document_text'])
        ) {
            Log::error('Gemini PDF schema mismatch', [
                'user_document_id' => $userDocumentId,
                'decoded' => $decoded,
            ]);

            throw new RuntimeException('Gemini JSON does not match the expected structure.');
        }

        return [
            'document_title' => trim((string) $decoded['document_title']),
            'document_date' => trim((string) $decoded['document_date']),
            'filled_document_text' => $this->cleanText((string) $decoded['filled_document_text']),
        ];
    }

    protected function getCachedExtractedText(
        string $path,
        string $cacheKey,
        string $label,
        int|string|null $userDocumentId = null,
    ): string {
        return Cache::remember($cacheKey, now()->addDays(7), function () use ($path, $label, $userDocumentId) {
            try {
                $text = $this->documentTextExtractor->extract($path);
                $text = $this->cleanText($text);

                if ($text !== '') {
                    return $this->truncateText($text, 35000);
                }
            } catch (\Throwable $e) {
                Log::warning('Document extraction failed for generator', [
                    'path' => $path,
                    'label' => $label,
                    'user_document_id' => $userDocumentId,
                    'message' => $e->getMessage(),
                ]);
            }

            throw new RuntimeException("Unable to extract text from {$label}.");
        });
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
