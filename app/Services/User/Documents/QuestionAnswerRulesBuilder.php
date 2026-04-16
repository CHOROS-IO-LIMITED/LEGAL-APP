<?php

namespace App\Services\User\Documents;

final class QuestionAnswerRulesBuilder
{
    /**
     * @param array<string, mixed> $schema
     * @param array<string, mixed> $answers
     * @return array<string, array<int, string>>
     */
    public function build(array $schema, array $answers): array
    {
        $rules = [
            'answers' => ['required', 'array'],
        ];

        $visibleQuestions = $this->getVisibleQuestions(
            is_array($schema['questions'] ?? null) ? $schema['questions'] : [],
            $answers
        );

        foreach ($visibleQuestions as $question) {
            $rules["answers.{$question['key']}"] = $this->rulesForQuestion($question);
        }

        return $rules;
    }

    /**
     * @param array<int, array<string, mixed>> $questions
     * @param array<string, mixed> $answers
     * @return array<int, array<string, mixed>>
     */
    public function getVisibleQuestions(array $questions, array $answers): array
    {
        $visible = [];

        foreach ($questions as $question) {
            $visible[] = $question;

            $followUps = $question['follow_ups'] ?? [];

            if (! is_array($followUps)) {
                continue;
            }

            foreach ($followUps as $followUp) {
                $when = $followUp['when'] ?? null;
                $nestedQuestions = $followUp['questions'] ?? null;

                if (! is_array($when) || ! is_array($nestedQuestions)) {
                    continue;
                }

                if ($this->matchesCondition($when, $answers)) {
                    $visible = [...$visible, ...$this->getVisibleQuestions($nestedQuestions, $answers)];
                }
            }
        }

        return $visible;
    }

    /**
     * @param array<string, mixed> $question
     * @return array<int, string>
     */
    private function rulesForQuestion(array $question): array
    {
        $type = (string) ($question['type'] ?? 'text');
        $required = (bool) ($question['required'] ?? false);
        $rules = $required ? ['required'] : ['nullable'];

        return match ($type) {
            'text', 'textarea', 'select' => [...$rules, 'string', 'max:5000'],
            'date' => [...$rules, 'date'],
            'number' => [...$rules, 'numeric'],
            'checkbox' => $this->checkboxRules($question, $rules),
            default => [...$rules, 'string'],
        };
    }

    /**
     * @param array<string, mixed> $question
     * @param array<int, string> $baseRules
     * @return array<int, string>
     */
    private function checkboxRules(array $question, array $baseRules): array
    {
        $options = $question['options'] ?? [];

        if (is_array($options) && count($options) <= 1) {
            return [...$baseRules, 'boolean'];
        }

        return [...$baseRules, 'array'];
    }

    /**
     * @param array<string, mixed> $when
     * @param array<string, mixed> $answers
     */
    private function matchesCondition(array $when, array $answers): bool
    {
        $field = (string) ($when['field'] ?? '');
        $operator = (string) ($when['operator'] ?? '');
        $expected = $when['value'] ?? null;
        $actual = $answers[$field] ?? null;

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

    private function isTruthy(mixed $value): bool
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
}
