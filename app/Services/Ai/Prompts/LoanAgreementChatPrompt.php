<?php

namespace App\Services\Ai\Prompts;

final class LoanAgreementChatPrompt
{
    /**
     * @param array<string, mixed> $answers
     * @param array<string, mixed> $schema
     */
    public static function build(
        array $answers,
        array $schema,
        ?string $currentQuestion,
        ?string $userMessage
    ): string {
        $answersJson = self::json($answers);
        $schemaKeysJson = self::extractKeys($schema);
        $currentQuestionText = $currentQuestion ?? 'null';
        $userMessageText = $userMessage ?? 'null';

        return <<<PROMPT
You are a legal assistant helping a user complete a Loan Agreement questionnaire.

IMPORTANT RULES:
- Do NOT draft legal clauses.
- Do NOT invent facts.
- Only guide, explain, and ask follow-up questions.
- Keep answers concise but clear.
- Use plain English for explanations.

Your role:
1. Explain questions clearly
2. Suggest the next logical question
3. Ask follow-up questions if something is unclear
4. Warn the user if something is risky or incomplete

---

LEGAL KNOWLEDGE (from internal system):

- If there are multiple borrowers, explain "joint and several liability"
- First charge = lender has first priority over the property
- Second charge = lower priority and may require consent from the first charge holder
- Debenture = company-wide security, generally for a corporate borrower
- Personal guarantee = an individual becomes responsible if the borrower fails to pay

- The purpose of the loan must be clear. If the borrower uses the loan for a different purpose, that can put them in breach.

- Interest:
  - Fixed = same amount regardless of time
  - Rate = depends on time
  - Rolled-up = paid at the end
  - Compounding = interest on interest

- Jurisdiction:
  - The agreement is governed by the laws of England and Wales
  - Exclusive jurisdiction of England and Wales is standard

- Overseas repayments may require additional clauses

---

CURRENT STATE:

Answers so far:
$answersJson

Current question:
$currentQuestionText

User message:
$userMessageText

---

TASK:

Return ONLY JSON in exactly this format:

{
  "message": "Your explanation or next question",
  "next_question_key": null,
  "follow_up_needed": false,
  "warnings": []
}

RULES:
- If the user asks a legal meaning, explain clearly in plain English.
- If the user gives an incomplete answer, ask a follow-up.
- If it makes sense to move forward, suggest the next question key from the schema.
- If something appears risky or incomplete, add a warning.
- Do NOT output markdown.
- Do NOT output code fences.
- Do NOT output anything outside the JSON object.

Schema keys available:
$schemaKeysJson

PROMPT;
    }

    /**
     * @param array<string, mixed> $data
     */
    private static function json(array $data): string
    {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return is_string($json) ? $json : '{}';
    }

    /**
     * @param array<string, mixed> $schema
     */
    private static function extractKeys(array $schema): string
    {
        $keys = [];

        foreach ($schema['steps'] ?? [] as $step) {
            if (! is_array($step)) {
                continue;
            }

            foreach ($step['questions'] ?? [] as $question) {
                if (is_array($question)) {
                    self::collectQuestionKeys($question, $keys);
                }
            }
        }

        $json = json_encode(array_values(array_unique($keys)), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return is_string($json) ? $json : '[]';
    }

    /**
     * @param array<string, mixed> $question
     * @param array<int, string> $keys
     */
    private static function collectQuestionKeys(array $question, array &$keys): void
    {
        if (isset($question['key']) && is_string($question['key']) && trim($question['key']) !== '') {
            $keys[] = $question['key'];
        }

        if (($question['type'] ?? null) === 'repeater' && isset($question['fields']) && is_array($question['fields'])) {
            foreach ($question['fields'] as $field) {
                if (is_array($field)) {
                    self::collectQuestionKeys($field, $keys);
                }
            }
        }

        if (isset($question['follow_ups']) && is_array($question['follow_ups'])) {
            foreach ($question['follow_ups'] as $followUp) {
                if (! is_array($followUp) || ! isset($followUp['questions']) || ! is_array($followUp['questions'])) {
                    continue;
                }

                foreach ($followUp['questions'] as $nestedQuestion) {
                    if (is_array($nestedQuestion)) {
                        self::collectQuestionKeys($nestedQuestion, $keys);
                    }
                }
            }
        }
    }
}
