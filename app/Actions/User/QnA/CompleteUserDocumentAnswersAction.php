<?php

namespace App\Actions\User\QnA;

use App\Models\UserDocument;
use Illuminate\Support\Carbon;

class CompleteUserDocumentAnswersAction
{
    /**
     * @param array<string, mixed> $answers
     */
    public function handle(UserDocument $userDocument, array $answers,  array $warnings = []): UserDocument
    {
        $userDocument->forceFill([
            'answers_json' => $answers,
            'ai_warnings_json' => $warnings,
            'status' => UserDocument::STATUS_QNA_COMPLETED,
            'qna_completed_at' => Carbon::now(),
        ])->save();

        return $userDocument->fresh();
    }
}
