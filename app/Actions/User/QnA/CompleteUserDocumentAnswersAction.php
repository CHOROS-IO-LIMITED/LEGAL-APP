<?php

namespace App\Actions\User\QnA;

use App\Models\UserDocument;

class CompleteUserDocumentAnswersAction
{
    /**
     * @param array<string, mixed> $answers
     */
    public function handle(UserDocument $userDocument, array $answers): UserDocument
    {
        $userDocument->forceFill([
            'answers_json' => $answers,
            'status' => UserDocument::STATUS_QNA_COMPLETED,
            'qna_completed_at' => now(),
        ])->save();

        return $userDocument;
    }
}
