<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\Dashboard\Review\SyncUserDocumentSignatureStatusAction;
use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DocuSignController extends Controller
{
    public function handleReturn(
        Request $request,
        UserDocument $userDocument,
        SyncUserDocumentSignatureStatusAction $syncAction
    ): RedirectResponse {
        $this->authorize('manageSignature', $userDocument);

        $syncAction->handle($userDocument);

        return redirect()
            ->route('admin.dashboard')
            ->with('success', 'Returned from DocuSign. Signature status has been refreshed.');
    }

    public function connectWebhook(
        Request $request,
        SyncUserDocumentSignatureStatusAction $syncAction
    ): Response {
        $rawBody = $request->getContent();
        $secret = trim((string) config('services.docusign.connect_secret'));

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
                    'provided_headers_present' => array_values(array_filter([
                        'X-DocuSign-Signature-1' => $request->header('X-DocuSign-Signature-1'),
                        'X-DocuSign-Signature-2' => $request->header('X-DocuSign-Signature-2'),
                        'X-DocuSign-Signature-3' => $request->header('X-DocuSign-Signature-3'),
                    ])),
                    'digest' => $request->header('x-authorization-digest'),
                    'content_type' => $request->header('content-type'),
                    'body_length' => strlen($rawBody),
                ]);

                return response('Invalid signature.', 401);
            }
        }

        $payload = json_decode($rawBody, true);

        if (! is_array($payload)) {
            return response('Invalid JSON payload.', 400);
        }

        $envelopeId =
            data_get($payload, 'data.envelopeId') ??
            data_get($payload, 'envelopeId') ??
            data_get($payload, 'data.envelopeSummary.envelopeId') ??
            data_get($payload, 'envelopeSummary.envelopeId');

        if (! $envelopeId) {
            return response('No envelope id.', 202);
        }

        $userDocument = UserDocument::query()
            ->where('signature_envelope_id', $envelopeId)
            ->first();

        if (! $userDocument) {
            return response('Envelope not mapped.', 202);
        }

        try {
            $syncAction->handle($userDocument);
        } catch (\Throwable $e) {
            Log::error('DocuSign webhook sync failed.', [
                'user_document_id' => $userDocument->id,
                'envelope_id' => $envelopeId,
                'message' => $e->getMessage(),
            ]);

            return response('Sync failed.', 500);
        }

        return response('OK', 200);
    }
}
