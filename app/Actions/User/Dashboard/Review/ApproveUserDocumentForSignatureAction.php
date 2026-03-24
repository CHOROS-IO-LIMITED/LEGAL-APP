<?php

namespace App\Actions\User\Dashboard\Review;

use App\Models\UserDocument;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ApproveUserDocumentForSignatureAction
{
    public function handle(UserDocument $userDocument): UserDocument
    {
        if (! $userDocument->canBeApprovedByLawyer()) {
            throw new RuntimeException('This document cannot be approved for signature.');
        }

        return DB::transaction(function () use ($userDocument) {
            $userDocument->update([
                'status' => UserDocument::STATUS_SIGNATURE,
                'approved_for_signature_at' => now(),
                'sent_for_signature_at' => now(),
                'signature_provider' => 'docusign',
            ]);

            return $userDocument->fresh(['user', 'document']);
        });
    }
}
