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

        switch ($type) {
            case 'email':
                if (! is_string($answer) || ! filter_var($answer, FILTER_VALIDATE_EMAIL)) {
                    $fail("{$label} must be a valid email address.");
                    return;
                }
                break;

            case 'number':
                if (! is_numeric($answer)) {
                    $fail("{$label} must be a valid number.");
                    return;
                }

                if (isset($question['min']) && is_numeric($question['min']) && $answer < $question['min']) {
                    $fail("{$label} must be at least {$question['min']}.");
                    return;
                }

                if (isset($question['max']) && is_numeric($question['max']) && $answer > $question['max']) {
                    $fail("{$label} must not be greater than {$question['max']}.");
                    return;
                }
                break;

            case 'date':
                if (! is_string($answer) || ! $this->isValidDate($answer)) {
                    $fail("{$label} must be a valid date.");
                    return;
                }
                break;

            case 'checkbox':
                $options = is_array($question['options'] ?? null) ? $question['options'] : [];

                if (count($options) <= 1) {
                    if (! is_bool($answer)) {
                        $fail("{$label} must be true or false.");
                        return;
                    }
                } else {
                    if (! is_array($answer)) {
                        $fail("{$label} must be a list.");
                        return;
                    }

                    foreach ($answer as $item) {
                        if (! in_array($item, $options, true)) {
                            $fail("{$label} contains an invalid option.");
                            return;
                        }
                    }
                }
                break;

            case 'select':
                $options = is_array($question['options'] ?? null) ? $question['options'] : [];

                if (! is_scalar($answer)) {
                    $fail("{$label} contains an invalid option.");
                    return;
                }

                if ($options !== [] && ! in_array((string) $answer, $options, true)) {
                    $fail("{$label} contains an invalid option.");
                    return;
                }
                break;

            case 'repeatable_group':
                if (! is_array($answer)) {
                    $fail("{$label} must be a list.");
                    return;
                }

                $fields = is_array($question['fields'] ?? null) ? $question['fields'] : [];

                foreach ($answer as $index => $row) {
                    if (! is_array($row)) {
                        $fail("{$label} item #" . ($index + 1) . " must be a valid object.");
                        continue;
                    }

                    foreach ($fields as $field) {
                        $this->validateRepeatableGroupField($field, $row, $label, $index, $fail);
                    }
                }
                break;

            case 'text':
            case 'textarea':
            default:
                if (is_array($answer) || is_object($answer)) {
                    $fail("{$label} must be a valid value.");
                    return;
                }
                break;
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

    protected function validateRepeatableGroupField(
        array $field,
        array $row,
        string $parentLabel,
        int $index,
        Closure $fail
    ): void {
        $fieldKey = $field['key'] ?? null;
        $fieldLabel = $field['label'] ?? $fieldKey ?? 'Field';
        $fieldRequired = (bool) ($field['required'] ?? false);
        $fieldType = $field['type'] ?? 'text';

        if (! $fieldKey) {
            return;
        }

        $fieldValue = Arr::get($row, $fieldKey);
        $fullLabel = "{$parentLabel} item #" . ($index + 1) . " - {$fieldLabel}";

        if ($fieldRequired && $this->isEmpty($fieldValue)) {
            $fail("{$fullLabel} is required.");
            return;
        }

        if ($this->isEmpty($fieldValue)) {
            return;
        }

        switch ($fieldType) {
            case 'email':
                if (! is_string($fieldValue) || ! filter_var($fieldValue, FILTER_VALIDATE_EMAIL)) {
                    $fail("{$fullLabel} must be a valid email address.");
                }
                break;

            case 'number':
                if (! is_numeric($fieldValue)) {
                    $fail("{$fullLabel} must be a valid number.");
                }
                break;

            case 'date':
                if (! is_string($fieldValue) || ! $this->isValidDate($fieldValue)) {
                    $fail("{$fullLabel} must be a valid date.");
                }
                break;

            case 'select':
                $options = is_array($field['options'] ?? null) ? $field['options'] : [];
                if ($options !== [] && ! in_array((string) $fieldValue, $options, true)) {
                    $fail("{$fullLabel} contains an invalid option.");
                }
                break;

            case 'checkbox':
                $options = is_array($field['options'] ?? null) ? $field['options'] : [];

                if (count($options) <= 1) {
                    if (! is_bool($fieldValue)) {
                        $fail("{$fullLabel} must be true or false.");
                    }
                } else {
                    if (! is_array($fieldValue)) {
                        $fail("{$fullLabel} must be a list.");
                        return;
                    }

                    foreach ($fieldValue as $item) {
                        if (! in_array($item, $options, true)) {
                            $fail("{$fullLabel} contains an invalid option.");
                            return;
                        }
                    }
                }
                break;
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
            'equals' => is_array($actual)
                ? in_array($expected, $actual, true)
                : $actual == $expected,

            'not_equals' => is_array($actual)
                ? ! in_array($expected, $actual, true)
                : $actual != $expected,

            'truthy' => (bool) $actual === true,
            'falsy' => ! $actual,

            default => false,
        };
    }

    protected function isValidDate(string $value): bool
    {
        $date = date_create($value);

        if (! $date) {
            return false;
        }

        return $date->format('Y-m-d') === $value;
    }

    protected function isEmpty(mixed $value): bool
    {
        if (is_array($value)) {
            return count($value) === 0;
        }

        return $value === null || $value === '';
    }
}
