<?php

// namespace App\Http\Controllers\Admin;

// use App\Actions\Admin\Dashboard\Review\ApproveUserDocumentForSignatureAction;
// use App\Actions\Admin\Dashboard\Review\MarkUserDocumentCompletedAction;
// use App\Actions\Admin\Dashboard\Review\RejectUserDocumentAfterReviewAction;
// use App\Http\Controllers\Controller;
// use App\Http\Requests\Admin\Dashboard\Review\RejectUserDocumentRequest;
// use App\Models\UserDocument;

// class AdminUserDocumentWorkflowController extends Controller
// {
//     public function approveForSignature(
//         UserDocument $userDocument,
//         ApproveUserDocumentForSignatureAction $action
//     ) {
//         $this->authorize('approveForSignature', $userDocument);

//         $action->handle($userDocument);

//         return back()->with('success', 'Document approved and sent to the signature stage.');
//     }

//     public function reject(
//         RejectUserDocumentRequest $request,
//         UserDocument $userDocument,
//         RejectUserDocumentAfterReviewAction $action
//     ) {
//         $action->handle(
//             userDocument: $userDocument,
//             lawyerNote: $request->string('lawyer_note')->toString(),
//         );

//         return back()->with('success', 'Document rejected and returned to the client.');
//     }

//     public function markCompleted(
//         UserDocument $userDocument,
//         MarkUserDocumentCompletedAction $action
//     ) {
//         $this->authorize('markCompleted', $userDocument);

//         $action->handle($userDocument);

//         return back()->with('success', 'Document marked as completed.');
//     }
// }
