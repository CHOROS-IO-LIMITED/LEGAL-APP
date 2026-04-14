<?php

namespace App\Concerns\File\UserDocuments;

use App\Models\UserDocument;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UserDocumentAnswersValidation implements ValidationRule
{
    public function __construct(
        protected UserDocument $userDocument
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_array($value)) {
            $fail('Answers must be a valid object.');
            return;
        }

        $schema = $this->userDocument->question_schema_json;

        if (! is_array($schema) || ! isset($schema['steps']) || ! is_array($schema['steps'])) {
            $fail('Question schema is missing or invalid.');
            return;
        }

        $visibleQuestions = $this->flattenVisibleQuestionsFromSteps($schema['steps'], $value);

        foreach ($visibleQuestions as $question) {
            $key = $question['key'] ?? null;

            if (! $key) {
                continue;
            }

            $required = (bool) ($question['required'] ?? false);
            $answer = $value[$key] ?? null;

            if (! $required) {
                continue;
            }

            if ($this->isEmptyAnswer($question, $answer)) {
                $label = $question['label'] ?? $key;
                $fail("{$label} [{$key}] is required.");
            }
        }
    }

    /**
     * @param array<int, mixed> $steps
     * @param array<string, mixed> $answers
     * @return array<int, array<string, mixed>>
     */
    protected function flattenVisibleQuestionsFromSteps(array $steps, array $answers): array
    {
        $result = [];

        foreach ($steps as $step) {
            if (! is_array($step)) {
                continue;
            }

            $questions = $step['questions'] ?? [];

            if (! is_array($questions)) {
                continue;
            }

            $result = array_merge($result, $this->flattenVisibleQuestions($questions, $answers));
        }

        return $result;
    }

    /**
     * @param array<int, mixed> $questions
     * @param array<string, mixed> $answers
     * @return array<int, array<string, mixed>>
     */
    protected function flattenVisibleQuestions(array $questions, array $answers): array
    {
        $result = [];

        foreach ($questions as $question) {
            if (! is_array($question)) {
                continue;
            }

            $result[] = $question;

            foreach (($question['follow_ups'] ?? []) as $followUp) {
                if (! is_array($followUp)) {
                    continue;
                }

                if ($this->matchesCondition($followUp['when'] ?? [], $answers)) {
                    $result = array_merge(
                        $result,
                        $this->flattenVisibleQuestions($followUp['questions'] ?? [], $answers)
                    );
                }
            }
        }

        return $result;
    }

    protected function matchesCondition(array $when, array $answers): bool
    {
        $field = $when['field'] ?? null;
        $operator = $when['operator'] ?? null;
        $expected = $when['value'] ?? null;
        $actual = $field ? ($answers[$field] ?? null) : null;

        return match ($operator) {
            'equals' => is_array($actual)
                ? in_array((string) $expected, array_map('strval', $actual), true)
                : (string) $actual === (string) $expected,
            'not_equals' => is_array($actual)
                ? ! in_array((string) $expected, array_map('strval', $actual), true)
                : (string) $actual !== (string) $expected,
            'truthy' => $this->isTruthy($actual),
            'falsy' => ! $this->isTruthy($actual),
            default => false,
        };
    }

    protected function isTruthy(mixed $value): bool
    {
        if (is_array($value)) {
            return count($value) > 0;
        }

        if (is_bool($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (float) $value !== 0.0;
        }

        if (is_string($value)) {
            return in_array(strtolower(trim($value)), ['1', 'true', 'yes', 'on', 'checked'], true);
        }

        return ! empty($value);
    }

    protected function isEmptyAnswer(array $question, mixed $answer): bool
    {
        $type = $question['type'] ?? 'text';

        if ($type === 'checkbox') {
            $options = $question['options'] ?? [];

            if (count($options) <= 1) {
                return $answer !== true;
            }

            return ! is_array($answer) || count($answer) === 0;
        }

        if (is_array($answer)) {
            return count($answer) === 0;
        }

        return $answer === null || $answer === '';
    }
}
