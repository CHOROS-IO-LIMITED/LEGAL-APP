<?php

namespace App\Actions\Admin\Dashboard\Review;

use App\Models\UserDocument;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class RejectUserDocumentAfterReviewAction
{
    public function handle(UserDocument $userDocument, string $lawyerNote): UserDocument
    {
        if (! $userDocument->canBeRejectedByLawyer()) {
            throw new RuntimeException('This document cannot be returned for amendment.');
        }

        $lawyerNote = trim($lawyerNote);

        if ($lawyerNote === '') {
            throw new RuntimeException('A lawyer note is required when returning a document.');
        }

        return DB::transaction(function () use ($userDocument, $lawyerNote) {
            $userDocument->update([
                'status' => UserDocument::STATUS_REJECTED,
                'lawyer_note' => $lawyerNote,
                'rejected_at' => now(),
                'approved_for_signature_at' => null,
                'sent_for_signature_at' => null,
            ]);

            return $userDocument->fresh(['user', 'document']);
        });
    }
}
