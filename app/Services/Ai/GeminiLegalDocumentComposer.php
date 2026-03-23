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
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-2.5-flash');
        $timeout = (int) config('services.gemini.timeout', 180);

        if (! $apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $payload = [
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'temperature' => 0.0,
                'topP' => 0.8,
                'topK' => 20,
                'maxOutputTokens' => 12000,
            ],
            'contents' => [[
                'parts' => [[
                    'text' => $this->prompt(
                        documentTitle: (string) $document->title,
                        templateSchema: $templateSchema,
                        answers: $answers,
                    ),
                ]],
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
            throw new RuntimeException('Gemini returned an empty assembly plan.');
        }

        $decoded = json_decode(trim($text), true);

        if (! is_array($decoded)) {
            Log::error('Gemini composer invalid JSON', [
                'document_id' => $document->id,
                'raw_text' => $text,
            ]);

            throw new RuntimeException('Gemini returned invalid JSON for document assembly.');
        }

        if (
            ! isset($decoded['title']) ||
            ! isset($decoded['placeholder_values']) ||
            ! isset($decoded['selections']) ||
            ! isset($decoded['remove_tokens'])
        ) {
            throw new RuntimeException('Gemini returned an invalid assembly structure.');
        }

        return $decoded;
    }

    protected function prompt(string $documentTitle, array $templateSchema, array $answers): string
    {
        return <<<PROMPT
You are a legal document assembly planner.

Your job is NOT to rewrite the legal document.
Your job is to decide:
1. which placeholders must be filled,
2. which optional clauses / schedules / OR branches must be kept,
3. which unused alternatives must be removed.

Return JSON only with this exact structure:
{
  "title": "string",
  "placeholder_values": {
    "placeholder_key": "value"
  },
  "selections": {
    "flag_name": true,
    "other_flag_name": false,
    "mode_name": "string"
  },
  "remove_tokens": ["TOKEN_1", "TOKEN_2"]
}

Rules:
- The final generated document must preserve the original legal wording and formatting of the template.
- Do not rewrite clauses.
- Do not paraphrase the legal text.
- Only resolve choices and placeholders based on the supplied answers.
- If an answer is missing, put "[MISSING: field_name]" as the placeholder value.
- Remove unused OR branches and unused optional blocks.
- Preserve clause order and numbering.
- Preserve schedules and execution/signature sections when applicable.
- Return JSON only, with no markdown fences.

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
