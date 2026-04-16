<?php

namespace App\Services\Ai;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

final class GeminiLegalIntakeAssistant
{
    public function assist(array $context): array
    {
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model');
        $timeout = (int) config('services.gemini.timeout');

        if (! $apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $payload = [
            'generationConfig' => [
                'temperature' => 0.0,
                'topP' => 0.8,
                'topK' => 20,
                'maxOutputTokens' => 2048,
                'responseMimeType' => 'application/json',
            ],
            'contents' => [[
                'parts' => [[
                    'text' => $this->buildPrompt($context),
                ]],
            ]],
        ];

        try {
            $response = Http::timeout($timeout)
                ->acceptJson()
                ->post(
                    sprintf(
                        'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s',
                        $model,
                        $apiKey
                    ),
                    $payload
                );
        } catch (ConnectionException $e) {
            throw new RuntimeException('Gemini connection failed.', previous: $e);
        }

        if (! $response->successful()) {
            Log::error('Gemini legal intake assistant failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'model' => $model,
            ]);

            throw new RuntimeException('Gemini legal intake assistant failed.');
        }

        $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            throw new RuntimeException('Gemini returned an empty response.');
        }

        $decoded = json_decode($text, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('Gemini returned invalid JSON.');
        }

        return [
            'assistant_message' => (string) ($decoded['assistant_message'] ?? ''),
            'suggested_answers' => is_array($decoded['suggested_answers'] ?? null) ? $decoded['suggested_answers'] : [],
            'missing_fields' => is_array($decoded['missing_fields'] ?? null) ? $decoded['missing_fields'] : [],
            'warnings' => is_array($decoded['warnings'] ?? null) ? $decoded['warnings'] : [],
        ];
    }

    private function buildPrompt(array $context): string
    {
        $schema = json_encode($context['schema'] ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        $answers = json_encode($context['answers'] ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        $userMessage = (string) ($context['user_message'] ?? '');

        return <<<PROMPT
You are an AI intake assistant for a legal document system.

Your role is LIMITED and NON-AUTHORITATIVE.

You must:
1. Help identify missing intake data.
2. Suggest normalized answer values only if they are directly supported by the user's message.
3. Never invent legal facts.
4. Never invent names, dates, addresses, company numbers, or signatory details.
5. Never search external sources.
6. Never claim a company number or registered office unless the user explicitly typed it.
7. Never rewrite the legal agreement.
8. Never decide the final legal meaning of answers.

Return STRICT JSON only in this format:
{
  "assistant_message": "short helpful message to the client",
  "suggested_answers": {
    "field_key": "value"
  },
  "missing_fields": ["field_key_1", "field_key_2"],
  "warnings": ["warning 1", "warning 2"]
}

QUESTION SCHEMA:
{$schema}

CURRENT ANSWERS:
{$answers}

LATEST USER MESSAGE:
{$userMessage}

Rules:
- If a value is missing, list its key in missing_fields.
- If the user message clearly supplies a value, place it in suggested_answers.
- If unsure, leave it out.
- assistant_message must be short, practical, and ask only for the missing legal intake fields.
- warnings should be used for ambiguity only.
PROMPT;
    }
}
