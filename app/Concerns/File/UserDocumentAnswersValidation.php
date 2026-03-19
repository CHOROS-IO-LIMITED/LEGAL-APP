<?php

namespace App\Concerns\File;

use App\Models\UserDocument;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Arr;

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

        if (! is_array($schema) || ! isset($schema['questions']) || ! is_array($schema['questions'])) {
            $fail('Question schema is missing or invalid.');
            return;
        }

        foreach ($schema['questions'] as $question) {
            $this->validateQuestion($question, $value, $fail);
        }
    }

    protected function validateQuestion(array $question, array $answers, Closure $fail): void
    {
        $key = $question['key'] ?? null;
        $label = $question['label'] ?? $key ?? 'This field';
        $required = (bool) ($question['required'] ?? false);
        $type = $question['type'] ?? 'text';

        if (! $key) {
            return;
        }

        $answer = Arr::get($answers, $key);

        if ($required && $this->isEmpty($answer)) {
            $fail("{$label} is required.");
            return;
        }

        if ($this->isEmpty($answer)) {
            return;
        }

        if ($type === 'email' && ! filter_var($answer, FILTER_VALIDATE_EMAIL)) {
            $fail("{$label} must be a valid email address.");
            return;
        }

        if ($type === 'number' && ! is_numeric($answer)) {
            $fail("{$label} must be a valid number.");
            return;
        }

        if ($type === 'checkbox') {
            $options = $question['options'] ?? [];

            if (count($options) === 1) {
                if (! is_bool($answer)) {
                    $fail("{$label} must be true or false.");
                    return;
                }
            }

            if (count($options) > 1) {
                if (! is_array($answer)) {
                    $fail("{$label} must be a list.");
                    return;
                }

                foreach ($answer as $value) {
                    if (! in_array($value, $options, true)) {
                        $fail("{$label} contains an invalid option.");
                        return;
                    }
                }
            }
        }

        if ($type === 'select') {
            $options = $question['options'] ?? [];

            if (is_array($options) && count($options) > 0 && ! in_array($answer, $options, true)) {
                $fail("{$label} contains an invalid option.");
                return;
            }
        }

        if ($type === 'repeatable_group') {
            if (! is_array($answer)) {
                $fail("{$label} must be a list.");
                return;
            }

            $fields = $question['fields'] ?? [];

            foreach ($answer as $index => $row) {
                if (! is_array($row)) {
                    $fail("{$label} item #" . ($index + 1) . " must be a valid object.");
                    continue;
                }

                foreach ($fields as $field) {
                    $fieldKey = $field['key'] ?? null;
                    $fieldLabel = $field['label'] ?? $fieldKey ?? 'Field';
                    $fieldRequired = (bool) ($field['required'] ?? false);

                    if (! $fieldKey) {
                        continue;
                    }

                    $fieldValue = $row[$fieldKey] ?? null;

                    if ($fieldRequired && $this->isEmpty($fieldValue)) {
                        $fail("{$label} item #" . ($index + 1) . " - {$fieldLabel} is required.");
                    }
                }
            }
        }

        foreach (($question['follow_ups'] ?? []) as $followUp) {
            $when = $followUp['when'] ?? null;
            $questions = $followUp['questions'] ?? [];

            if (! is_array($when) || ! is_array($questions)) {
                continue;
            }

            if ($this->matchesCondition($when, $answers)) {
                foreach ($questions as $nestedQuestion) {
                    $this->validateQuestion($nestedQuestion, $answers, $fail);
                }
            }
        }
    }

    protected function matchesCondition(array $when, array $answers): bool
    {
        $field = $when['field'] ?? null;
        $operator = $when['operator'] ?? 'equals';
        $expected = $when['value'] ?? null;

        if (! $field) {
            return false;
        }

        $actual = Arr::get($answers, $field);

        return match ($operator) {
            'equals' => $actual == $expected,
            'not_equals' => $actual != $expected,
            'in' => is_array($expected) && in_array($actual, $expected, true),
            'not_in' => is_array($expected) && ! in_array($actual, $expected, true),
            'truthy' => (bool) $actual === true,
            'falsy' => ! $actual,
            default => false,
        };
    }

    protected function isEmpty(mixed $value): bool
    {
        if (is_array($value)) {
            return count($value) === 0;
        }

        return $value === null || $value === '';
    }
}
