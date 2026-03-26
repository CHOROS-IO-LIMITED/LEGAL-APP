<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\Dashboard\Review\ApproveUserDocumentForSignatureAction;
use App\Actions\Admin\Dashboard\Review\RejectUserDocumentAfterReviewAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Dashboard\Review\RejectUserDocumentAfterReviewRequest;
use App\Models\UserDocument;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AdminUserDocumentReviewController extends Controller
{
    public function approve(
        UserDocument $userDocument,
        ApproveUserDocumentForSignatureAction $action
    ): Response {
        $this->authorize('approveForSignature', $userDocument);

        $result = $action->handle($userDocument);

        return Inertia::location($result['senderViewUrl']);
    }

    public function reject(
        RejectUserDocumentAfterReviewRequest $request,
        UserDocument $userDocument,
        RejectUserDocumentAfterReviewAction $action
    ): RedirectResponse {
        $this->authorize('rejectAfterReview', $userDocument);

        $action->handle(
            userDocument: $userDocument,
            lawyerNote: $request->string('lawyer_note')->toString()
        );

        return back()->with('success', 'Document returned to the client for amendment.');
    }
}
