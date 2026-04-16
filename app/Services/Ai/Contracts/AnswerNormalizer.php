<?php

namespace App\Services\AI\Contracts;

interface AnswerNormalizer
{
    /**
     * @param array<string, mixed> $answers
     * @param array<string, mixed> $schema
     * @return array{
     *     normalized_answers: array<string, mixed>,
     *     warnings: array<int, string>,
     *     raw_text?: string|null
     * }
     */
    public function normalize(array $answers, array $schema): array;
}
