<?php

// namespace App\Concerns\File;

// use App\Models\UserDocument;
// use Closure;
// use Illuminate\Contracts\Validation\ValidationRule;
// use Illuminate\Support\Arr;

// class UserDocumentAnswersValidation implements ValidationRule
// {
//     public function __construct(
//         protected UserDocument $userDocument
//     ) {}

//     public function validate(string $attribute, mixed $value, Closure $fail): void
//     {
//         if (! is_array($value)) {
//             $fail('Answers must be a valid object.');
//             return;
//         }

//         $schema = $this->userDocument->question_schema_json;

//         if (! is_array($schema) || ! isset($schema['questions']) || ! is_array($schema['questions'])) {
//             $fail('Question schema is missing or invalid.');
//             return;
//         }

//         $activeQuestions = $this->collectActiveQuestions($schema['questions'], $value);

//         foreach ($activeQuestions as $question) {
//             $this->validateQuestion($question, $value, $fail);
//         }
//     }

//     protected function collectActiveQuestions(array $questions, array $answers): array
//     {
//         $active = [];

//         foreach ($questions as $question) {
//             if (! is_array($question) || empty($question['key'])) {
//                 continue;
//             }

//             $active[] = $question;

//             foreach (($question['follow_ups'] ?? []) as $followUp) {
//                 $when = $followUp['when'] ?? null;
//                 $nested = $followUp['questions'] ?? [];

//                 if (! is_array($when) || ! is_array($nested)) {
//                     continue;
//                 }

//                 if ($this->matchesCondition($when, $answers)) {
//                     $active = [...$active, ...$this->collectActiveQuestions($nested, $answers)];
//                 }
//             }
//         }

//         return $active;
//     }

//     protected function validateQuestion(array $question, array $answers, Closure $fail): void
//     {
//         $key = $question['key'] ?? null;
//         $label = $question['label'] ?? $key ?? 'This field';
//         $required = (bool) ($question['required'] ?? false);
//         $type = $question['type'] ?? 'text';

//         if (! $key) {
//             return;
//         }

//         $answer = Arr::get($answers, $key);

//         if ($type === 'checkbox') {
//             $this->validateCheckboxQuestion($question, $answer, $label, $required, $fail);
//             return;
//         }

//         if ($required && $this->isEmpty($answer)) {
//             $fail("{$label} [{$key}] is required.");
//             return;
//         }

//         if ($this->isEmpty($answer)) {
//             return;
//         }

//         switch ($type) {
//             case 'number':
//                 if (! is_numeric($answer)) {
//                     $fail("{$label} must be a valid number.");
//                     return;
//                 }

//                 if (isset($question['min']) && is_numeric($question['min']) && $answer < $question['min']) {
//                     $fail("{$label} must be at least {$question['min']}.");
//                     return;
//                 }

//                 if (isset($question['max']) && is_numeric($question['max']) && $answer > $question['max']) {
//                     $fail("{$label} must not be greater than {$question['max']}.");
//                     return;
//                 }
//                 break;

//             case 'date':
//                 if (! is_string($answer) || ! $this->isValidDate($answer)) {
//                     $fail("{$label} must be a valid date.");
//                     return;
//                 }
//                 break;

//             case 'select':
//                 $options = is_array($question['options'] ?? null) ? $question['options'] : [];

//                 if (! is_scalar($answer)) {
//                     $fail("{$label} contains an invalid option.");
//                     return;
//                 }

//                 if ($options !== [] && ! in_array((string) $answer, $options, true)) {
//                     $fail("{$label} contains an invalid option.");
//                     return;
//                 }
//                 break;

//             case 'text':
//             case 'textarea':
//             default:
//                 if (is_array($answer) || is_object($answer)) {
//                     $fail("{$label} must be a valid value.");
//                     return;
//                 }
//                 break;
//         }
//     }

//     protected function validateCheckboxQuestion(
//         array $question,
//         mixed $answer,
//         string $label,
//         bool $required,
//         Closure $fail
//     ): void {
//         $options = is_array($question['options'] ?? null) ? $question['options'] : [];
//         $isSingleCheckbox = count($options) <= 1;

//         if ($isSingleCheckbox) {
//             if ($required && ! $this->isAcceptedCheckboxValue($answer, $options)) {
//                 $fail("{$label} must be accepted.");
//                 return;
//             }

//             if (! $this->isEmpty($answer) && ! $this->isAcceptedCheckboxValue($answer, $options)) {
//                 $fail("{$label} must be accepted.");
//                 return;
//             }

//             return;
//         }

//         if ($required && $this->isEmpty($answer)) {
//             $fail("{$label} is required.");
//             return;
//         }

//         if ($this->isEmpty($answer)) {
//             return;
//         }

//         if (! is_array($answer)) {
//             $fail("{$label} must be a list.");
//             return;
//         }

//         foreach ($answer as $item) {
//             if (! in_array((string) $item, $options, true)) {
//                 $fail("{$label} contains an invalid option.");
//                 return;
//             }
//         }
//     }

//     protected function isAcceptedCheckboxValue(mixed $answer, array $options = []): bool
//     {
//         $expectedOption = $options[0] ?? null;

//         if (is_bool($answer)) {
//             return $answer === true;
//         }

//         if (is_numeric($answer)) {
//             return (string) $answer === '1';
//         }

//         if (is_string($answer)) {
//             $normalized = strtolower(trim($answer));

//             if (in_array($normalized, ['1', 'true', 'yes', 'on', 'checked'], true)) {
//                 return true;
//             }

//             if ($expectedOption !== null && trim($answer) === (string) $expectedOption) {
//                 return true;
//             }

//             return false;
//         }

//         if (is_array($answer)) {
//             if ($answer === []) {
//                 return false;
//             }

//             if ($expectedOption === null) {
//                 return count($answer) > 0;
//             }

//             return in_array((string) $expectedOption, array_map('strval', $answer), true);
//         }

//         return false;
//     }

//     protected function matchesCondition(array $when, array $answers): bool
//     {
//         $field = $when['field'] ?? null;
//         $operator = $when['operator'] ?? 'equals';
//         $expected = $when['value'] ?? null;

//         if (! $field) {
//             return false;
//         }

//         $actual = Arr::get($answers, $field);

//         return match ($operator) {
//             'equals' => is_array($actual)
//                 ? in_array((string) $expected, array_map('strval', $actual), true)
//                 : (string) $actual === (string) $expected,

//             'not_equals' => is_array($actual)
//                 ? ! in_array((string) $expected, array_map('strval', $actual), true)
//                 : (string) $actual !== (string) $expected,

//             'truthy' => $this->isTruthy($actual),
//             'falsy' => ! $this->isTruthy($actual),

//             default => false,
//         };
//     }

//     protected function isTruthy(mixed $value): bool
//     {
//         if (is_array($value)) {
//             return count($value) > 0;
//         }

//         if (is_bool($value)) {
//             return $value;
//         }

//         if (is_numeric($value)) {
//             return (float) $value !== 0.0;
//         }

//         if (is_string($value)) {
//             return in_array(strtolower(trim($value)), ['1', 'true', 'yes', 'on', 'checked'], true);
//         }

//         return ! empty($value);
//     }

//     protected function isValidDate(string $value): bool
//     {
//         $date = date_create($value);

//         if (! $date) {
//             return false;
//         }

//         return $date->format('Y-m-d') === $value;
//     }

//     protected function isEmpty(mixed $value): bool
//     {
//         if (is_array($value)) {
//             return count($value) === 0;
//         }

//         return $value === null || $value === '';
//     }
// }
