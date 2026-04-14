<?php

namespace App\Http\Controllers\User;

use App\Actions\Admin\Dashboard\Review\SyncUserDocumentSignatureStatusAction;
use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use App\Services\DocuSign\DocuSignService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class UserDocumentSigningController extends Controller
{
    // public function start(
    //     Request $request,
    //     UserDocument $userDocument,
    //     DocuSignService $docuSignService
    // ): Response {
    //     $this->authorize('sign', $userDocument);

    //     $user = Auth::user();
    //     $recipient = $userDocument->findRecipientForEmail($user->email);

    //     if (! $recipient) {
    //         abort(403, 'No matching signing recipient found for the authenticated user.');
    //     }

    //     if (! $userDocument->signature_envelope_id) {
    //         abort(404, 'Signature envelope not found.');
    //     }

    //     $clientUserId = (string) ($recipient['recipient_id'] ?? '');

    //     if ($clientUserId === '') {
    //         abort(422, 'Recipient id is missing for embedded signing.');
    //     }

    //     $returnUrl = route('user.documents.sign.return', [
    //         'userDocument' => $userDocument->id,
    //     ]);

    //     $signingUrl = $docuSignService->createRecipientView(
    //         envelopeId: $userDocument->signature_envelope_id,
    //         recipient: $recipient,
    //         returnUrl: $returnUrl,
    //         clientUserId: $clientUserId
    //     );

    //     return Inertia::location($signingUrl);
    // }

    public function handleReturn(
        Request $request,
        UserDocument $userDocument,
        SyncUserDocumentSignatureStatusAction $syncAction
    ): RedirectResponse {
        $this->authorize('view', $userDocument);

        $syncAction->handle($userDocument);

        return redirect()
            ->route('user.dashboard')
            ->with('success', 'Signature session completed. Document status has been refreshed.');
    }
}
