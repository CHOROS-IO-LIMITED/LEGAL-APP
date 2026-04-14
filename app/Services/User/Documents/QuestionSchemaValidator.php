<?php

namespace App\Services\User\Documents;

use RuntimeException;

final class QuestionSchemaValidator
{
    /**
     * @param array<string, mixed> $schema
     * @return array<string, mixed>
     */
    public function validate(array $schema): array
    {
        $documentType = $schema['document_type'] ?? null;

        if (! is_string($documentType) || trim($documentType) === '') {
            throw new RuntimeException('Question schema must contain a non-empty document_type.');
        }

        $steps = $schema['steps'] ?? null;

        if (! is_array($steps) || $steps === []) {
            throw new RuntimeException('Question schema must contain a non-empty steps array.');
        }

        $seenKeys = [];

        foreach ($steps as $stepIndex => $step) {
            if (! is_array($step)) {
                throw new RuntimeException("Step at index {$stepIndex} must be an array.");
            }

            if (! isset($step['title']) || ! is_string($step['title']) || trim($step['title']) === '') {
                throw new RuntimeException("Step at index {$stepIndex} must contain a non-empty title.");
            }

            if (! isset($step['questions']) || ! is_array($step['questions'])) {
                throw new RuntimeException("Step [{$step['title']}] must contain a questions array.");
            }

            $this->validateQuestions($step['questions'], $seenKeys, ["steps", (string) $stepIndex, 'questions']);
        }

        return $schema;
    }

    /**
     * @param array<int, mixed> $questions
     * @param array<string, bool> $seenKeys
     * @param array<int, string> $path
     */
    private function validateQuestions(array $questions, array &$seenKeys, array $path): void
    {
        foreach ($questions as $index => $question) {
            if (! is_array($question)) {
                throw new RuntimeException('Question at ' . implode('.', [...$path, (string) $index]) . ' must be an array.');
            }

            $key = $question['key'] ?? null;
            $label = $question['label'] ?? null;
            $type = $question['type'] ?? null;

            if (! is_string($key) || trim($key) === '') {
                throw new RuntimeException('Every question must have a non-empty key.');
            }

            if (isset($seenKeys[$key])) {
                throw new RuntimeException("Duplicate question key detected: {$key}");
            }

            $seenKeys[$key] = true;

            if (! is_string($label) || trim($label) === '') {
                throw new RuntimeException("Question [{$key}] must have a non-empty label.");
            }

            if (! is_string($type) || trim($type) === '') {
                throw new RuntimeException("Question [{$key}] must have a non-empty type.");
            }

            if (isset($question['follow_ups'])) {
                if (! is_array($question['follow_ups'])) {
                    throw new RuntimeException("Question [{$key}] follow_ups must be an array.");
                }

                foreach ($question['follow_ups'] as $followUpIndex => $followUp) {
                    if (! is_array($followUp)) {
                        throw new RuntimeException("Question [{$key}] follow-up at index {$followUpIndex} must be an array.");
                    }

                    if (! isset($followUp['when']) || ! is_array($followUp['when'])) {
                        throw new RuntimeException("Question [{$key}] follow-up at index {$followUpIndex} must contain a when condition.");
                    }

                    if (! isset($followUp['questions']) || ! is_array($followUp['questions'])) {
                        throw new RuntimeException("Question [{$key}] follow-up at index {$followUpIndex} must contain a questions array.");
                    }

                    $this->validateQuestions(
                        $followUp['questions'],
                        $seenKeys,
                        [...$path, (string) $index, 'follow_ups', (string) $followUpIndex, 'questions']
                    );
                }
            }
        }
    }
}
