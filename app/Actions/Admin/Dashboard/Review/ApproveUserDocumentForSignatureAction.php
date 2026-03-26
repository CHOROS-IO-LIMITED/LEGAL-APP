<?php

namespace App\Actions\Admin\Dashboard\Review;

use App\Models\UserDocument;
use App\Services\DocuSign\DocuSignService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ApproveUserDocumentForSignatureAction
{
    public function __construct(
        protected DocuSignService $docuSignService
    ) {}

    public function handle(UserDocument $userDocument): array
    {
        if (! $userDocument->canBeApprovedByLawyer()) {
            throw new RuntimeException('This document cannot be approved for signature.');
        }

        return DB::transaction(function () use ($userDocument) {
            $envelope = $this->docuSignService->createDraftEnvelope($userDocument);
            $envelopeId = (string) ($envelope['envelopeId'] ?? '');

            if ($envelopeId === '') {
                throw new RuntimeException('DocuSign did not return an envelope id.');
            }

            $userDocument->update([
                'status' => UserDocument::STATUS_SIGNATURE,
                'approved_for_signature_at' => now(),
                'sent_for_signature_at' => null,
                'signature_provider' => 'docusign',
                'signature_envelope_id' => $envelopeId,
                'signature_status' => strtolower((string) ($envelope['status'] ?? 'created')),
                'rejected_at' => null,
            ]);

            $returnUrl = route('admin.documents.docusign.return', [
                'userDocument' => $userDocument->id,
            ]);

            $senderViewUrl = $this->docuSignService->createSenderView($envelopeId, $returnUrl);

            return [
                'userDocument' => $userDocument->fresh(['user', 'document']),
                'senderViewUrl' => $senderViewUrl,
            ];
        });
    }
}
