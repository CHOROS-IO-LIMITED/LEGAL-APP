<?php

namespace App\Http\Controllers\User;

use App\Actions\User\Dashboard\Review\ReturnUserDocumentToQuestionsAction;
use App\Actions\User\Dashboard\Review\SubmitUserDocumentForApprovalAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\Dashboard\Review\ReturnUserDocumentToQuestionsRequest;
use App\Http\Requests\User\Dashboard\Review\SubmitUserDocumentForApprovalRequest;
use App\Models\UserDocument;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserDocumentDashboardActionController extends Controller
{
    public function submitForApproval(
        SubmitUserDocumentForApprovalRequest $request,
        UserDocument $userDocument,
        SubmitUserDocumentForApprovalAction $action
    ) {
        $action->handle(
            userDocument: $userDocument,
            clientNote: $request->string('client_note')->toString() ?: null,
            signatureRecipients: $request->validated('signature_recipients', []),
        );

        return back()->with('success', 'Document submitted to the lawyer for approval.');
    }

    public function returnToQuestions(
        ReturnUserDocumentToQuestionsRequest $request,
        UserDocument $userDocument,
        ReturnUserDocumentToQuestionsAction $action
    ) {
        $action->handle(
            userDocument: $userDocument,
            clientNote: $request->string('client_note')->toString(),
        );

        return redirect()
            ->route('product.qna.show', ['batch_uuid' => $userDocument->batch_uuid])
            ->with('success', 'You can now revise your answers and regenerate the document.');
    }

    public function download(UserDocument $userDocument): StreamedResponse
    {
        $this->authorize('download', $userDocument);

        $disks = config('filesystems.default');
        $path = $userDocument->currentPdfPath();

        abort_unless(is_string($path) && $path !== '', 404, 'Document file not found.');

        /** @var FilesystemAdapter $storage */
        $storage = Storage::disk($disks);

        return $storage->download(
            $path,
            $userDocument->currentPdfOriginalName()
        );
    }
}
