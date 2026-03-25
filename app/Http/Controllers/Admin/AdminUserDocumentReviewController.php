<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\Dashboard\Review\RejectUserDocumentAfterReviewAction;
use App\Actions\User\Dashboard\Review\ApproveUserDocumentForSignatureAction;
use App\Actions\User\Dashboard\Review\MarkUserDocumentCompletedAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Dashboard\Review\RejectUserDocumentAfterReviewRequest;
use App\Models\UserDocument;
use Illuminate\Http\RedirectResponse;

class AdminUserDocumentReviewController extends Controller
{
    public function approve(
        UserDocument $userDocument,
        ApproveUserDocumentForSignatureAction $action
    ): RedirectResponse {
        $this->authorize('approveForSignature', $userDocument);

        $action->handle($userDocument);

        return back()->with('success', 'Document approved and moved to signature workflow.');
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

    public function markCompleted(
        UserDocument $userDocument,
        MarkUserDocumentCompletedAction $action
    ): RedirectResponse {
        $this->authorize('markCompleted', $userDocument);

        $action->handle($userDocument);

        return back()->with('success', 'Document marked as completed.');
    }
}
