<?php

namespace App\Actions\Admin\Dashboard\Review;

use App\Models\UserDocument;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class MarkUserDocumentCompletedAction
{
    public function handle(UserDocument $userDocument): UserDocument
    {
        if (! $userDocument->canBeMarkedCompleted()) {
            throw new RuntimeException('This document cannot be marked as completed.');
        }

        return DB::transaction(function () use ($userDocument) {
            $userDocument->update([
                'status' => UserDocument::STATUS_COMPLETED,
                'completed_at' => now(),
            ]);

            return $userDocument->fresh(['user', 'document']);
        });
    }
}
