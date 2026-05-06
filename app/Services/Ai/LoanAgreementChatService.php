<?php

namespace App\Services\Ai;

use App\Services\Ai\Prompts\LoanAgreementChatPrompt;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

final class LoanAgreementChatService
{
    /**
     * @param array<string, mixed> $answers
     * @param array<string, mixed> $schema
     * @return array{
     *     message: string,
     *     next_question_key: string|null,
     *     follow_up_needed: bool,
     *     warnings: array<int, string>
     * }
     */
    public function chat(
        array $answers,
        array $schema,
        ?string $currentQuestion,
        ?string $userMessage
    ): array {
        $enabled = (bool) config('services.gemini.enabled', true);
        $apiKey = (string) config('services.gemini.key');
        $model = (string) config('services.gemini.model', 'gemini-2.5-flash');
        $timeout = (int) config('services.gemini.timeout', 60);

        if (! $enabled) {
            throw new RuntimeException('Gemini is disabled.');
        }

        if ($apiKey === '') {
            throw new RuntimeException('Gemini API key is missing.');
        }

        $prompt = LoanAgreementChatPrompt::build(
            $answers,
            $schema,
            $currentQuestion,
            $userMessage
        );

        $maxAttempts = 3;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            $response = Http::timeout($timeout)
                ->acceptJson()
                ->post(
                    "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                    [
                        'contents' => [
                            [
                                'parts' => [
                                    ['text' => $prompt],
                                ],
                            ],
                        ],
                        'generationConfig' => [
                            'temperature' => 0.2,
                            'responseMimeType' => 'application/json',
                        ],
                    ]
                );

            if ($response->successful()) {
                return $this->parseResponse($response, $model);
            }

            $status = $response->status();
            $body = $response->json() ?? $response->body();

            Log::warning('Gemini chat request attempt failed.', [
                'model' => $model,
                'attempt' => $attempt,
                'status' => $status,
                'body' => $body,
            ]);

            $isRetryable = in_array($status, [429, 500, 502, 503, 504], true);

            if (! $isRetryable) {
                throw new RuntimeException("Gemini chat request failed with status {$status}.");
            }

            if ($attempt < $maxAttempts) {
                usleep($attempt * 500000); // 0.5s, 1.0s
                continue;
            }

            throw new RuntimeException("Gemini chat request failed with status {$status} after {$maxAttempts} attempts.");
        }

        throw new RuntimeException('Gemini chat request failed.');
    }

    /**
     * @return array{
     *     message: string,
     *     next_question_key: string|null,
     *     follow_up_needed: bool,
     *     warnings: array<int, string>
     * }
     */
    private function parseResponse(Response $response, string $model): array
    {
        $payload = $response->json();

        $text = data_get($payload, 'candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            Log::error('Gemini chat returned empty text.', [
                'model' => $model,
                'payload' => $payload,
            ]);

            throw new RuntimeException("Gemini model {$model} returned empty text.");
        }

        $decoded = json_decode($text, true);

        if (! is_array($decoded)) {
            Log::error('Gemini chat returned invalid JSON.', [
                'model' => $model,
                'raw_text' => $text,
            ]);

            throw new RuntimeException("Gemini model {$model} returned invalid JSON.");
        }

        return [
            'message' => is_string($decoded['message'] ?? null)
                ? $decoded['message']
                : 'Sorry, I could not process that.',
            'next_question_key' => is_string($decoded['next_question_key'] ?? null)
                ? $decoded['next_question_key']
                : null,
            'follow_up_needed' => (bool) ($decoded['follow_up_needed'] ?? false),
            'warnings' => is_array($decoded['warnings'] ?? null)
                ? array_values(array_filter($decoded['warnings'], static fn($warning) => is_string($warning) && trim($warning) !== ''))
                : [],
        ];
    }
}
