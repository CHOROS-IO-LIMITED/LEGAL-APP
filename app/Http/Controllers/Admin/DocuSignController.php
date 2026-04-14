<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\Dashboard\Review\SyncUserDocumentSignatureStatusAction;
use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use App\Services\DocuSign\DocuSignService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DocuSignController extends Controller
{
    public function handleReturn(
        Request $request,
        UserDocument $userDocument,
        SyncUserDocumentSignatureStatusAction $syncAction,
        DocuSignService $docuSignService
    ): RedirectResponse {
        $this->authorize('manageSignature', $userDocument);

        $envelopeId = $userDocument->signature_envelope_id;

        Log::info('DocuSign return reached.', [
            'user_document_id' => $userDocument->id,
            'envelope_id' => $envelopeId,
            'query' => $request->query(),
            'url' => $request->fullUrl(),
        ]);

        if ($envelopeId) {
            try {
                $envelope = $docuSignService->getEnvelope($envelopeId);
                $recipients = $docuSignService->listRecipients($envelopeId);

                Log::info('DocuSign envelope after sender view.', [
                    'user_document_id' => $userDocument->id,
                    'envelope_id' => $envelopeId,
                    'status' => $envelope['status'] ?? null,
                    'email_subject' => $envelope['emailSubject'] ?? null,
                    'created_date_time' => $envelope['createdDateTime'] ?? null,
                    'sent_date_time' => $envelope['sentDateTime'] ?? null,
                    'completed_date_time' => $envelope['completedDateTime'] ?? null,
                ]);

                Log::info('DocuSign FULL recipient state after sender view.', [
                    'user_document_id' => $userDocument->id,
                    'envelope_id' => $envelopeId,
                    'recipient_count' => $recipients['recipientCount'] ?? null,
                    'current_routing_order' => $recipients['currentRoutingOrder'] ?? null,
                    'signers' => collect($recipients['signers'] ?? [])->map(function (array $signer) {
                        return [
                            'name' => $signer['name'] ?? null,
                            'email' => $signer['email'] ?? null,
                            'recipient_id' => $signer['recipientId'] ?? null,
                            'routing_order' => $signer['routingOrder'] ?? null,
                            'status' => $signer['status'] ?? null,
                            'delivery_method' => $signer['deliveryMethod'] ?? null,
                            'sent_date_time' => $signer['sentDateTime'] ?? null,
                            'delivered_date_time' => $signer['deliveredDateTime'] ?? null,
                            'completed_date_time' => $signer['completedDateTime'] ?? null,
                            'declined_date_time' => $signer['declinedDateTime'] ?? null,
                        ];
                    })->values()->all(),
                ]);
            } catch (\Throwable $e) {
                Log::error('Failed to inspect DocuSign envelope on return.', [
                    'user_document_id' => $userDocument->id,
                    'envelope_id' => $envelopeId,
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        } else {
            Log::warning('UserDocument has no signature_envelope_id on DocuSign return.', [
                'user_document_id' => $userDocument->id,
            ]);
        }

        try {
            $syncAction->handle($userDocument);

            Log::info('DocuSign sync action completed after return.', [
                'user_document_id' => $userDocument->id,
                'envelope_id' => $envelopeId,
            ]);
        } catch (\Throwable $e) {
            Log::error('DocuSign sync action failed after return.', [
                'user_document_id' => $userDocument->id,
                'envelope_id' => $envelopeId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return redirect()
            ->route('admin.dashboard')
            ->with('success', 'Returned from DocuSign. Signature status has been refreshed.');
    }

    public function connectWebhook(
        Request $request,
        SyncUserDocumentSignatureStatusAction $syncAction,
        DocuSignService $docuSignService
    ): Response {
        $rawBody = $request->getContent();
        $secret = trim((string) config('services.docusign.connect_secret'));

        Log::info('DocuSign webhook received.', [
            'content_type' => $request->header('content-type'),
            'body_length' => strlen($rawBody),
            'headers_present' => [
                'X-DocuSign-Signature-1' => $request->hasHeader('X-DocuSign-Signature-1'),
                'X-DocuSign-Signature-2' => $request->hasHeader('X-DocuSign-Signature-2'),
                'X-DocuSign-Signature-3' => $request->hasHeader('X-DocuSign-Signature-3'),
                'x-authorization-digest' => $request->hasHeader('x-authorization-digest'),
            ],
        ]);

        if ($secret !== '') {
            $computed = base64_encode(hash_hmac('sha256', $rawBody, $secret, true));

            $providedSignatures = array_filter([
                (string) $request->header('X-DocuSign-Signature-1', ''),
                (string) $request->header('X-DocuSign-Signature-2', ''),
                (string) $request->header('X-DocuSign-Signature-3', ''),
            ]);

            $valid = false;

            foreach ($providedSignatures as $provided) {
                if ($provided !== '' && hash_equals($computed, trim($provided))) {
                    $valid = true;
                    break;
                }
            }

            if (! $valid) {
                Log::warning('DocuSign webhook HMAC validation failed.', [
                    'computed' => $computed,
                    'provided_signatures' => $providedSignatures,
                    'digest' => $request->header('x-authorization-digest'),
                    'content_type' => $request->header('content-type'),
                    'body_length' => strlen($rawBody),
                ]);

                return response('Invalid signature.', 401);
            }
        }

        $payload = json_decode($rawBody, true);

        if (! is_array($payload)) {
            Log::warning('DocuSign webhook invalid JSON payload.', [
                'body_preview' => mb_substr($rawBody, 0, 1000),
            ]);

            return response('Invalid JSON payload.', 400);
        }

        Log::info('DocuSign webhook parsed payload.', [
            'event' => data_get($payload, 'event') ?? data_get($payload, 'data.event'),
            'envelope_id_candidates' => [
                data_get($payload, 'data.envelopeId'),
                data_get($payload, 'envelopeId'),
                data_get($payload, 'data.envelopeSummary.envelopeId'),
                data_get($payload, 'envelopeSummary.envelopeId'),
            ],
        ]);

        $envelopeId =
            data_get($payload, 'data.envelopeId') ??
            data_get($payload, 'envelopeId') ??
            data_get($payload, 'data.envelopeSummary.envelopeId') ??
            data_get($payload, 'envelopeSummary.envelopeId');

        if (! $envelopeId) {
            Log::warning('DocuSign webhook missing envelope id.', [
                'payload' => $payload,
            ]);

            return response('No envelope id.', 202);
        }

        $userDocument = UserDocument::query()
            ->where('signature_envelope_id', $envelopeId)
            ->first();

        if (! $userDocument) {
            Log::warning('DocuSign webhook envelope not mapped.', [
                'envelope_id' => $envelopeId,
            ]);

            return response('Envelope not mapped.', 202);
        }

        try {
            $envelope = $docuSignService->getEnvelope($envelopeId);
            $recipients = $docuSignService->listRecipients($envelopeId);

            Log::info('DocuSign live state from webhook before sync.', [
                'user_document_id' => $userDocument->id,
                'envelope_id' => $envelopeId,
                'envelope_status' => $envelope['status'] ?? null,
                'current_routing_order' => $recipients['currentRoutingOrder'] ?? null,
                'signers' => collect($recipients['signers'] ?? [])->map(function (array $signer) {
                    return [
                        'name' => $signer['name'] ?? null,
                        'email' => $signer['email'] ?? null,
                        'recipient_id' => $signer['recipientId'] ?? null,
                        'routing_order' => $signer['routingOrder'] ?? null,
                        'status' => $signer['status'] ?? null,
                        'sent_date_time' => $signer['sentDateTime'] ?? null,
                        'delivered_date_time' => $signer['deliveredDateTime'] ?? null,
                        'completed_date_time' => $signer['completedDateTime'] ?? null,
                    ];
                })->values()->all(),
            ]);

            $syncAction->handle($userDocument);

            Log::info('DocuSign webhook sync completed.', [
                'user_document_id' => $userDocument->id,
                'envelope_id' => $envelopeId,
            ]);
        } catch (\Throwable $e) {
            Log::error('DocuSign webhook sync failed.', [
                'user_document_id' => $userDocument->id,
                'envelope_id' => $envelopeId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response('Sync failed.', 500);
        }

        return response('OK', 200);
    }
}
