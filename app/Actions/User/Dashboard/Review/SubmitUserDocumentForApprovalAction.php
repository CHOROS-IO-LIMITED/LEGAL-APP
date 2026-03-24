<?php

namespace App\Actions\User\Dashboard\Review;

use App\Models\UserDocument;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SubmitUserDocumentForApprovalAction
{
    public function handle(
        UserDocument $userDocument,
        ?string $clientNote = null,
        array $signatureRecipients = []
    ): UserDocument {
        if (! $userDocument->canBeSubmittedForApproval()) {
            throw new RuntimeException('This document cannot be submitted for approval.');
        }

        if (empty($signatureRecipients)) {
            throw new RuntimeException('At least one signature recipient is required.');
        }

        $normalizedRecipients = collect($signatureRecipients)
            ->values()
            ->map(function (array $recipient, int $index) {
                return [
                    'name' => trim((string) ($recipient['name'] ?? '')),
                    'email' => trim((string) ($recipient['email'] ?? '')),
                    'role' => trim((string) ($recipient['role'] ?? '')),
                    'routing_order' => $index + 1,
                    'status' => $recipient['status'] ?? 'pending',
                    'signed_at' => $recipient['signed_at'] ?? null,
                    'sign_url' => $recipient['sign_url'] ?? null,
                ];
            })
            ->all();

        $primaryRecipient = $normalizedRecipients[0] ?? null;

        return DB::transaction(function () use ($userDocument, $clientNote, $normalizedRecipients, $primaryRecipient) {
            $userDocument->loadMissing('user', 'document');

            $userDocument->fill([
                'status' => UserDocument::STATUS_PENDING_APPROVAL,
                'client_note' => $clientNote,
                'lawyer_note' => null,
                'submitted_for_approval_at' => now(),
                'signature_recipients_json' => $normalizedRecipients,
                'docusign_client_name' => $primaryRecipient['name'] ?? $userDocument->user?->name,
                'docusign_client_email' => $primaryRecipient['email'] ?? $userDocument->user?->email,
            ]);

            $userDocument->save();

            return $userDocument->fresh(['user', 'document']);
        });
    }
}
