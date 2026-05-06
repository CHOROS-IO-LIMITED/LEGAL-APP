<?php

namespace App\Actions\User\QnA;

use App\Models\UserDocument;
use App\Services\Ai\Contracts\AnswerNormalizer;
use App\Support\Documents\LoanAgreement\NormalizedAnswerMerger;
use Illuminate\Support\Facades\Log;

final class NormalizeUserDocumentAnswersAction
{
    public function __construct(
        private readonly AnswerNormalizer $answerNormalizer,
        private readonly NormalizedAnswerMerger $merger,
    ) {}

    /**
     * @return array{
     *     normalized_answers: array<string, mixed>,
     *     merged_answers: array<string, mixed>,
     *     warnings: array<int, string>
     * }
     */
    public function handle(UserDocument $userDocument, array $submittedAnswers): array
    {
        $schema = is_array($userDocument->question_schema_json)
            ? $userDocument->question_schema_json
            : [];

        if ($schema === []) {
            return [
                'normalized_answers' => [],
                'merged_answers' => $submittedAnswers,
                'warnings' => ['Question schema was not available, so AI normalization was skipped.'],
            ];
        }

        $result = $this->answerNormalizer->normalize($submittedAnswers, $schema);

        $normalizedAnswers = is_array($result['normalized_answers'] ?? null)
            ? $result['normalized_answers']
            : [];

        $warnings = is_array($result['warnings'] ?? null)
            ? $result['warnings']
            : [];

        $mergedAnswers = $this->merger->merge($submittedAnswers, $normalizedAnswers);

        Log::info('User document answers normalized with Gemini.', [
            'user_document_id' => $userDocument->id,
            'normalized_keys' => array_keys($normalizedAnswers),
            'warnings' => $warnings,
        ]);

        return [
            'normalized_answers' => $normalizedAnswers,
            'merged_answers' => $mergedAnswers,
            'warnings' => $warnings,
        ];
    }
}
