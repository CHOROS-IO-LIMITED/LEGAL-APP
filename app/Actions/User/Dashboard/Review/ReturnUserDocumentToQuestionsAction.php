<?php

namespace App\Actions\User\Dashboard\Review;

use App\Models\UserDocument;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ReturnUserDocumentToQuestionsAction
{
    public function handle(UserDocument $userDocument, string $clientNote): UserDocument
    {
        if (! $userDocument->canBeReturnedToQuestions()) {
            throw new RuntimeException('This document cannot be returned to the questionnaire.');
        }

        return DB::transaction(function () use ($userDocument, $clientNote) {
            $userDocument->update([
                'status' => UserDocument::STATUS_QNA_PENDING,
                'client_note' => $clientNote,
                'lawyer_note' => null,
                'submitted_for_approval_at' => null,
                'approved_for_signature_at' => null,
                'sent_for_signature_at' => null,
                'rejected_at' => null,
            ]);

            return $userDocument->fresh(['user', 'document']);
        });
    }
}
