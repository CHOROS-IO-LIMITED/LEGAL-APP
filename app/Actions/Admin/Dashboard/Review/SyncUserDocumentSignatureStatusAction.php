<?php

namespace App\Actions\Admin\Dashboard\Review;

use App\Models\UserDocument;
use App\Services\DocuSign\DocuSignService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SyncUserDocumentSignatureStatusAction
{
    public function __construct(
        protected DocuSignService $docuSignService
    ) {}

    public function handle(UserDocument $userDocument): UserDocument
    {
        if (! $userDocument->signature_envelope_id) {
            return $userDocument;
        }

        $envelope = $this->docuSignService->getEnvelope($userDocument->signature_envelope_id);
        $recipients = $this->docuSignService->listRecipients($userDocument->signature_envelope_id);

        $envelopeStatus = strtolower((string) ($envelope['status'] ?? ''));
        $signers = $recipients['signers'] ?? [];

        $mappedRecipients = collect($signers)->map(function (array $signer) {
            return [
                'name' => $signer['name'] ?? null,
                'email' => $signer['email'] ?? null,
                'role' => $signer['roleName'] ?? 'Signer',
                'recipient_id' => $signer['recipientId'] ?? null,
                'routing_order' => $signer['routingOrder'] ?? null,
                'status' => strtolower((string) ($signer['status'] ?? 'pending')),
                'signed_at' => $signer['signedDateTime'] ?? null,
                'sign_url' => null,
            ];
        })->values()->all();

        return DB::transaction(function () use ($userDocument, $envelopeStatus, $mappedRecipients) {
            $update = [
                'signature_status' => $envelopeStatus ?: null,
                'signature_recipients_json' => $mappedRecipients,
            ];

            if (in_array($envelopeStatus, ['sent', 'delivered', 'completed'], true) && ! $userDocument->sent_for_signature_at) {
                $update['sent_for_signature_at'] = now();
            }

            if (in_array($envelopeStatus, ['sent', 'delivered', 'completed'], true)) {
                try {
                    $combinedPdf = $this->docuSignService->downloadCombinedDocuments($userDocument->signature_envelope_id);

                    if (! empty($combinedPdf)) {
                        $directory = "generated/user-documents/{$userDocument->id}";
                        $filename = $envelopeStatus === 'completed'
                            ? 'signed-' . $userDocument->id . '.pdf'
                            : 'signature-preview-' . $userDocument->id . '.pdf';

                        $path = "{$directory}/{$filename}";

                        Storage::disk(config('filesystems.default'))->put($path, $combinedPdf);

                        if ($envelopeStatus === 'completed') {
                            $update['signed_pdf_path'] = $path;
                            $update['signed_pdf_original_name'] = 'signed-' . ($userDocument->generated_pdf_original_name ?: 'document.pdf');
                            $update['signed_pdf_mime'] = 'application/pdf';
                            $update['signed_pdf_size'] = strlen($combinedPdf);
                        } else {
                            $update['signed_pdf_path'] = $path;
                            $update['signed_pdf_original_name'] = 'signature-preview-' . ($userDocument->generated_pdf_original_name ?: 'document.pdf');
                            $update['signed_pdf_mime'] = 'application/pdf';
                            $update['signed_pdf_size'] = strlen($combinedPdf);
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning('Unable to download DocuSign combined PDF during sync.', [
                        'user_document_id' => $userDocument->id,
                        'envelope_id' => $userDocument->signature_envelope_id,
                        'status' => $envelopeStatus,
                        'message' => $e->getMessage(),
                    ]);
                }
            }

            if ($envelopeStatus === 'completed') {
                $update['status'] = UserDocument::STATUS_COMPLETED;
                $update['completed_at'] = $userDocument->completed_at ?: now();
                $update['signature_completed_at'] = now();
            }

            $userDocument->update($update);

            return $userDocument->fresh(['user', 'document']);
        });
    }
}
