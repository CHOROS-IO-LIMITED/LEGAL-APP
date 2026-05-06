<?php

namespace App\Services\Ai;

use App\Models\Document;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GeminiLegalDocumentComposer
{
    public function compose(Document $document, array $templateSchema, array $answers): array
    {
        $apiKey = config('services.gemini.key');
        $model = config('services.gemini.model');
        $timeout = (int) config('services.gemini.timeout');

        if (! $apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $payload = [
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'temperature' => 0.0,
            ],
            'contents' => [[
                'parts' => [
                    [
                        'text' => $this->prompt(
                            documentTitle: (string) $document->title,
                            templateSchema: $templateSchema,
                            answers: $answers,
                        ),
                    ],
                ],
            ]],
        ];

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

        try {
            $response = Http::timeout($timeout)
                ->connectTimeout(20)
                ->retry(2, 1500, throw: false)
                ->acceptJson()
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($url, $payload);
        } catch (ConnectionException $e) {
            throw new RuntimeException('Gemini compose request failed: ' . $e->getMessage(), 0, $e);
        }

        if (! $response->successful()) {
            Log::error('Gemini legal composer failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'document_id' => $document->id,
            ]);

            throw new RuntimeException('Gemini failed to compose the legal document.');
        }

        $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            throw new RuntimeException('Gemini returned an empty document composition.');
        }

        $decoded = json_decode(trim($text), true);

        if (! is_array($decoded)) {
            Log::error('Gemini composer invalid JSON', [
                'document_id' => $document->id,
                'raw_text' => $text,
            ]);

            throw new RuntimeException('Gemini returned invalid JSON for composed document.');
        }

        if (empty($decoded['html'])) {
            throw new RuntimeException('Gemini did not return composed HTML.');
        }

        return $decoded;
    }

    protected function prompt(string $documentTitle, array $templateSchema, array $answers): string
    {
        return <<<PROMPT
You are assembling a final legal document from a template schema and client answers.

Return JSON only with this exact shape:
{
  "title": "string",
  "html": "full valid HTML for PDF rendering"
}

Rules:
- Preserve the legal order, headings, numbering, schedules, and signature sections.
- Use the template schema as the source of truth.
- Replace all placeholders with supplied answers.
- Resolve all OR options and conditions.
- Remove drafting notes and internal instructions.
- Do not leave unresolved placeholders.
- Output complete HTML suitable for PDF rendering.
- Use a conservative legal style with serif font and black text.
- Do not include markdown fences.
- Do not explain anything outside the JSON object.

DOCUMENT TITLE:
{$documentTitle}

TEMPLATE SCHEMA JSON:
{$this->json($templateSchema)}

CLIENT ANSWERS JSON:
{$this->json($answers)}
PROMPT;
    }

    protected function json(array $value): string
    {
        return json_encode(
            $value,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        ) ?: '{}';
    }
}
