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
            throw new RuntimeException('This document cannot be rejected.');
        }

        return DB::transaction(function () use ($userDocument, $lawyerNote) {
            $userDocument->update([
                'status' => UserDocument::STATUS_REJECTED,
                'lawyer_note' => trim($lawyerNote),
                'rejected_at' => now(),
                'approved_for_signature_at' => null,
                'sent_for_signature_at' => null,
                'signature_provider' => null,
                'signature_envelope_id' => null,
                'signature_status' => null,
                'signed_pdf_path' => null,
                'signed_pdf_original_name' => null,
                'signed_pdf_mime' => null,
                'signed_pdf_size' => null,
                'completed_at' => null,
                'signature_completed_at' => null,
            ]);

            return $userDocument->fresh(['user', 'document']);
        });
    }
}
