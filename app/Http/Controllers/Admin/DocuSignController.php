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
        $secret = (string) config('services.docusign.connect_secret');

        if ($secret !== '') {
            $provided = (string) $request->header('X-DocuSign-Signature-1', '');
            $computed = base64_encode(hash_hmac('sha256', $rawBody, $secret, true));

            if (! hash_equals($computed, $provided)) {
                Log::warning('DocuSign webhook HMAC validation failed.');

                return response('Invalid signature.', 401);
            }
        }

        $payload = $request->json()->all();

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
