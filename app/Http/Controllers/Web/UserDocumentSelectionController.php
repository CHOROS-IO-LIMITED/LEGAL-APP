<?php

namespace App\Http\Controllers\Web;

use App\Actions\UserDocuments\CreateUserDocumentSelectionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreUserDocumentSelectionRequest;
use Illuminate\Http\RedirectResponse;

class UserDocumentSelectionController extends Controller
{
    public function store(
        StoreUserDocumentSelectionRequest $request,
        CreateUserDocumentSelectionAction $action
    ): RedirectResponse {
        $this->authorize('create', \App\Models\UserDocument::class);

        $batchUuid = $action->handle(
            $request->user(),
            $request->validated('document_ids')
        );

        return redirect()->route('product.kyc', [
            'batch_uuid' => $batchUuid,
        ])->with('success', 'Documents selected successfully. Continue to KYC.');
    }
}
