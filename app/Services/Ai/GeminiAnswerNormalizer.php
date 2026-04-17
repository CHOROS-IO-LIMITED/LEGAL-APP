<?php

namespace App\Services\AI;

use App\Exceptions\GeminiException;
use App\Services\AI\Contracts\AnswerNormalizer;
use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use JsonException;
use Throwable;

final class GeminiAnswerNormalizer implements AnswerNormalizer
{
    private const MAX_ATTEMPTS = 5;
    private const BASE_DELAY_MS = 800;
    private const MAX_DELAY_MS = 8000;

    public function __construct(
        private readonly HttpFactory $http
    ) {}

    /**
     * @param array<string, mixed> $answers
     * @param array<string, mixed> $schema
     * @return array{
     *     normalized_answers: array<string, mixed>,
     *     warnings: array<int, string>,
     *     raw_text?: string|null
     * }
     */
    public function normalize(array $answers, array $schema): array
    {
        if (! config('services.gemini.enabled')) {
            return [
                'normalized_answers' => [],
                'warnings' => ['Gemini normalization is disabled.'],
                'raw_text' => null,
            ];
        }

        $apiKey = (string) config('services.gemini.key');
        $model = (string) config('services.gemini.model');
        $timeout = (int) config('services.gemini.timeout', 60);

        if ($apiKey === '') {
            throw new GeminiException('Gemini API key is not configured.');
        }

        if ($model === '') {
            throw new GeminiException('Gemini model is not configured.');
        }

        $allowedKeys = $this->extractSchemaKeys($schema);
        $systemPrompt = $this->buildPrompt($allowedKeys, $schema, $answers);

        Log::info('Gemini normalization request.', [
            'model' => $model,
            'allowed_keys_count' => count($allowedKeys),
            'answer_keys' => array_keys($answers),
        ]);

        try {
            $response = $this->sendGenerateContentRequest(
                model: $model,
                apiKey: $apiKey,
                timeout: $timeout,
                prompt: $systemPrompt
            );
        } catch (GeminiException $e) {
            Log::warning('Gemini normalization unavailable after retries.', [
                'message' => $e->getMessage(),
            ]);

            return [
                'normalized_answers' => [],
                'warnings' => ['AI normalization is temporarily unavailable. Your original answers were kept unchanged.'],
                'raw_text' => null,
            ];
        }

        $text = (string) data_get($response->json(), 'candidates.0.content.parts.0.text', '');

        Log::info('Gemini raw response received.', [
            'raw_text_preview' => mb_substr($text, 0, 2000),
            'raw_text_length' => mb_strlen($text),
        ]);

        if ($text === '') {
            Log::warning('Gemini returned an empty response.');

            return [
                'normalized_answers' => [],
                'warnings' => ['AI normalization returned an empty response. Your original answers were kept unchanged.'],
                'raw_text' => null,
            ];
        }

        try {
            $decoded = $this->decodeJson($text);
        } catch (GeminiException $e) {
            Log::warning('Gemini returned invalid JSON after successful request.', [
                'message' => $e->getMessage(),
            ]);

            return [
                'normalized_answers' => [],
                'warnings' => ['AI normalization returned an invalid response. Your original answers were kept unchanged.'],
                'raw_text' => $text,
            ];
        }

        if (! isset($decoded['normalized_answers']) || ! isset($decoded['warnings'])) {
            Log::warning('Gemini response missing expected keys.', [
                'decoded' => $decoded,
            ]);
        }

        $normalizedAnswers = Arr::get($decoded, 'normalized_answers', []);
        $warnings = Arr::get($decoded, 'warnings', []);

        if (! is_array($normalizedAnswers)) {
            $normalizedAnswers = [];
        }

        if (! is_array($warnings)) {
            $warnings = ['Gemini returned warnings in an invalid format.'];
        }

        $filteredAnswers = $this->filterAllowedKeys($normalizedAnswers, $allowedKeys);
        $rejectedKeys = array_diff(array_keys($normalizedAnswers), array_keys($filteredAnswers));

        if (! empty($rejectedKeys)) {
            Log::warning('Gemini returned disallowed keys.', [
                'rejected_keys' => array_values($rejectedKeys),
            ]);
        }

        $filteredAnswers = $this->filterToTextFieldsOnly($filteredAnswers, $schema);

        if (empty($filteredAnswers) && empty($warnings)) {
            Log::warning('Gemini returned no usable normalization and no warnings.', [
                'raw_text_preview' => mb_substr($text, 0, 1000),
            ]);
        }

        $cleanWarnings = array_values(array_filter(array_map(
            static fn($warning) => is_string($warning) && trim($warning) !== '' ? trim($warning) : null,
            $warnings
        )));

        Log::info('Gemini normalization result.', [
            'normalized_keys' => array_keys($filteredAnswers),
            'warnings' => $cleanWarnings,
        ]);

        return [
            'normalized_answers' => $filteredAnswers,
            'warnings' => $cleanWarnings,
            'raw_text' => $text,
        ];
    }

    private function sendGenerateContentRequest(
        string $model,
        string $apiKey,
        int $timeout,
        string $prompt
    ): Response {
        $url = sprintf(
            'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s',
            $model,
            $apiKey
        );

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        [
                            'text' => $prompt,
                        ],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0,
                'topP' => 0.1,
                'topK' => 1,
                'responseMimeType' => 'application/json',
            ],
        ];

        $lastException = null;

        for ($attempt = 1; $attempt <= self::MAX_ATTEMPTS; $attempt++) {
            try {
                $response = $this->http
                    ->timeout($timeout)
                    ->connectTimeout(min($timeout, 15))
                    ->acceptJson()
                    ->asJson()
                    ->post($url, $payload);

                if ($response->successful()) {
                    if ($attempt > 1) {
                        Log::info('Gemini request succeeded after retry.', [
                            'attempt' => $attempt,
                            'status' => $response->status(),
                        ]);
                    }

                    return $response;
                }

                if (! $this->isRetryableStatus($response->status())) {
                    Log::error('Gemini request failed with non-retryable status.', [
                        'attempt' => $attempt,
                        'status' => $response->status(),
                        'body' => $response->json() ?: $response->body(),
                    ]);

                    throw new GeminiException(
                        sprintf('Gemini request failed with status %d.', $response->status())
                    );
                }

                if ($attempt === self::MAX_ATTEMPTS) {
                    Log::error('Gemini request failed after max retries.', [
                        'attempt' => $attempt,
                        'status' => $response->status(),
                        'body' => $response->json() ?: $response->body(),
                    ]);

                    throw new GeminiException('Gemini request failed after retries.');
                }

                $delayMs = $this->backoffDelayMs($attempt);

                Log::warning('Transient Gemini error; retrying.', [
                    'attempt' => $attempt,
                    'status' => $response->status(),
                    'delay_ms' => $delayMs,
                ]);

                usleep($delayMs * 1000);
            } catch (RequestException $e) {
                $lastException = $e;

                $status = $e->response?->status();

                if ($status === null || ! $this->isRetryableStatus($status) || $attempt === self::MAX_ATTEMPTS) {
                    Log::error('Gemini request exception.', [
                        'attempt' => $attempt,
                        'message' => $e->getMessage(),
                        'status' => $status,
                        'response' => $e->response?->json(),
                    ]);

                    throw new GeminiException('Gemini request failed after retries.', previous: $e);
                }

                $delayMs = $this->backoffDelayMs($attempt);

                Log::warning('Transient Gemini exception; retrying.', [
                    'attempt' => $attempt,
                    'message' => $e->getMessage(),
                    'status' => $status,
                    'delay_ms' => $delayMs,
                ]);

                usleep($delayMs * 1000);
            } catch (Throwable $e) {
                $lastException = $e;

                Log::error('Unexpected Gemini client failure.', [
                    'attempt' => $attempt,
                    'message' => $e->getMessage(),
                ]);

                throw new GeminiException('Unexpected Gemini client failure.', previous: $e);
            }
        }

        throw new GeminiException(
            'Gemini request failed after retries.',
            previous: $lastException instanceof Throwable ? $lastException : null
        );
    }

    private function isRetryableStatus(int $status): bool
    {
        return in_array($status, [429, 500, 502, 503, 504], true);
    }

    private function backoffDelayMs(int $attempt): int
    {
        $base = min(self::MAX_DELAY_MS, self::BASE_DELAY_MS * (2 ** ($attempt - 1)));
        $jitter = random_int(0, 400);

        return min(self::MAX_DELAY_MS, $base + $jitter);
    }

    /**
     * @param array<int, string> $allowedKeys
     * @param array<string, mixed> $schema
     * @param array<string, mixed> $answers
     */
    private function buildPrompt(array $allowedKeys, array $schema, array $answers): string
    {
        $schemaSummary = [
            'title' => $schema['title'] ?? null,
            'document_type' => $schema['document_type'] ?? null,
            'version' => $schema['version'] ?? null,
            'allowed_keys' => $allowedKeys,
        ];

        return <<<PROMPT
You are a legal document intake data normalizer.

You are helping normalize answers for a Loan Agreement questionnaire.
You must NOT draft contract clauses.
You must NOT invent facts.
You must NOT guess missing facts.
You must NOT change the legal meaning of an answer.
You must ONLY normalize existing answers into cleaner structured values.

Return VALID JSON ONLY in exactly this shape:
{
  "normalized_answers": {},
  "warnings": []
}

Rules:
1. Only return keys from the allowed_keys list.
2. Do not add keys that are not in allowed_keys.
3. Only include a key in normalized_answers if you are confident it is supported by the user's existing answers.
4. Preserve unclear items by adding a warning instead of guessing.
5. Normalize common user shorthand where safe:
   - "500k" -> "500000"
   - "12 mos" -> "12"
   - currency strings like "£50,000" -> "50000"
   - trim whitespace
6. For yes/no radio fields, only return "yes" or "no" if explicit or unmistakable.
7. For checkbox arrays, only use values that are clearly valid schema options.
8. For repeaters like guarantors, preserve structure and only include clearly supported items.
9. Do not remove user answers. You are only proposing cleaned values.
10. Do not output markdown. Do not wrap JSON in code fences.
11. For free-text fields such as loan purpose, property descriptions, addresses, company position, and asset descriptions, you may correct spelling, grammar, punctuation, capitalization, and obvious formatting issues if the meaning stays the same.
12. For free-text fields, you may rewrite long, messy, or informal wording into a shorter clear sentence, but only if the meaning is preserved exactly.
13. Keep normalized free-text answers neutral, professional, and suitable for legal intake, but not as drafted contract clauses.
14. If a free-text answer is vague, incomplete, contradictory, or too unclear to understand confidently, do not guess. Leave it out of normalized_answers and add a warning.
15. If text appears to be gibberish, random characters, keyboard smashing, or not meaningful language, do not normalize it. Add a warning instead.
16. Do not add facts, dates, names, addresses, legal conclusions, or commercial details that the user did not provide.
17. Do not convert uncertainty into certainty. If the user says "maybe", "probably", "around", or similar, preserve that uncertainty if you normalize the text.
18. For number, date, radio, and checkbox fields, prefer exact schema-compatible values and do not embellish them.
19. If a field already appears valid and clean, you may leave it unchanged or omit it from normalized_answers.
20. If a textarea answer is understandable but may be too broad for a legal agreement, you may keep a cleaned version and add a warning suggesting more specificity.
21. For names and addresses, correct only obvious formatting issues. Do not guess missing parts.
22. For loan_purpose specifically, make the wording concise and clear, but preserve exactly what the user said about the use of funds.
23. If the answer suggests property development clearly and explicitly, you may normalize related wording, but do not infer extra facts beyond the user’s own text.
24. If the answer is too unclear to map safely to any field, return no normalized value for that field and add a warning.

Schema summary:
{$this->jsonEncode($schemaSummary)}

Current answers:
{$this->jsonEncode($answers)}
PROMPT;
    }

    /**
     * @param array<string, mixed> $decoded
     * @param array<int, string> $allowedKeys
     * @return array<string, mixed>
     */
    private function filterAllowedKeys(array $decoded, array $allowedKeys): array
    {
        $allowed = array_flip($allowedKeys);

        $result = [];

        foreach ($decoded as $key => $value) {
            if (! is_string($key)) {
                continue;
            }

            if (! array_key_exists($key, $allowed)) {
                continue;
            }

            $result[$key] = $value;
        }

        return $result;
    }

    /**
     * @param array<string, mixed> $answers
     * @param array<string, mixed> $schema
     * @return array<string, mixed>
     */
    private function filterToTextFieldsOnly(array $answers, array $schema): array
    {
        $textKeys = $this->extractTextFieldKeys($schema);

        return array_filter(
            $answers,
            static fn($key) => in_array($key, $textKeys, true),
            ARRAY_FILTER_USE_KEY
        );
    }

    /**
     * @param array<string, mixed> $schema
     * @return array<int, string>
     */
    private function extractTextFieldKeys(array $schema): array
    {
        $keys = [];
        $steps = $schema['steps'] ?? [];

        if (! is_array($steps)) {
            return [];
        }

        foreach ($steps as $step) {
            if (! is_array($step)) {
                continue;
            }

            $questions = $step['questions'] ?? [];

            if (! is_array($questions)) {
                continue;
            }

            foreach ($questions as $question) {
                if (is_array($question)) {
                    $this->collectTextKeys($question, $keys);
                }
            }
        }

        return array_values(array_unique(array_filter($keys, static fn($key) => $key !== '')));
    }

    /**
     * @param array<string, mixed> $question
     * @param array<int, string> $keys
     */
    private function collectTextKeys(array $question, array &$keys): void
    {
        $type = $question['type'] ?? null;
        $key = $question['key'] ?? null;

        if (in_array($type, ['text', 'textarea'], true) && is_string($key) && $key !== '') {
            $keys[] = $key;
        }

        if ($type === 'repeater') {
            $fields = $question['fields'] ?? [];

            if (is_array($fields)) {
                $hasTextField = false;

                foreach ($fields as $field) {
                    if (! is_array($field)) {
                        continue;
                    }

                    $fieldType = $field['type'] ?? null;

                    if (in_array($fieldType, ['text', 'textarea'], true)) {
                        $hasTextField = true;
                        break;
                    }
                }

                if ($hasTextField && is_string($key) && $key !== '') {
                    $keys[] = $key;
                }
            }
        }

        $followUps = $question['follow_ups'] ?? [];

        if (! is_array($followUps)) {
            return;
        }

        foreach ($followUps as $followUp) {
            if (! is_array($followUp)) {
                continue;
            }

            $nestedQuestions = $followUp['questions'] ?? [];

            if (! is_array($nestedQuestions)) {
                continue;
            }

            foreach ($nestedQuestions as $nestedQuestion) {
                if (is_array($nestedQuestion)) {
                    $this->collectTextKeys($nestedQuestion, $keys);
                }
            }
        }
    }

    /**
     * @param array<string, mixed> $schema
     * @return array<int, string>
     */
    private function extractSchemaKeys(array $schema): array
    {
        $keys = [];
        $steps = $schema['steps'] ?? [];

        if (! is_array($steps)) {
            return [];
        }

        foreach ($steps as $step) {
            if (! is_array($step)) {
                continue;
            }

            $questions = $step['questions'] ?? [];

            if (is_array($questions)) {
                $this->collectQuestionKeys($questions, $keys);
            }
        }

        return array_values(array_unique(array_filter($keys, static fn($key) => $key !== '')));
    }

    /**
     * @param array<int, mixed> $questions
     * @param array<int, string> $keys
     */
    private function collectQuestionKeys(array $questions, array &$keys): void
    {
        foreach ($questions as $question) {
            if (! is_array($question)) {
                continue;
            }

            $type = $question['type'] ?? null;
            $key = $question['key'] ?? null;

            if (is_string($key) && $key !== '' && ! in_array($type, ['info', 'group'], true)) {
                $keys[] = $key;
            }

            $followUps = $question['follow_ups'] ?? [];

            if (! is_array($followUps)) {
                continue;
            }

            foreach ($followUps as $followUp) {
                if (! is_array($followUp)) {
                    continue;
                }

                $nestedQuestions = $followUp['questions'] ?? [];

                if (is_array($nestedQuestions)) {
                    $this->collectQuestionKeys($nestedQuestions, $keys);
                }
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function decodeJson(string $json): array
    {
        try {
            $decoded = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            Log::warning('Gemini returned invalid JSON.', [
                'raw_text_preview' => mb_substr($json, 0, 2000),
                'error' => $e->getMessage(),
                'json_length' => strlen($json),
            ]);

            throw new GeminiException('Gemini returned invalid JSON.', previous: $e);
        }

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param array<string, mixed> $value
     */
    private function jsonEncode(array $value): string
    {
        try {
            return json_encode(
                $value,
                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
            );
        } catch (JsonException) {
            return '{}';
        }
    }
}
