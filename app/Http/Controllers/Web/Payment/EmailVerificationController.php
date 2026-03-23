<?php

namespace App\Http\Controllers\Web\Payment;

use App\Actions\UserDocuments\GenerateUserDocumentQuestionSchemaAction;
use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    public function index(Request $request): Response
    {
        $batchUuid = $request->string('batch_uuid')->toString();

        abort_if(blank($batchUuid), 404);

        $userDocuments = UserDocument::query()
            ->ownedBy($request->user()->id)
            ->batch($batchUuid)
            ->get();

        abort_if($userDocuments->isEmpty(), 404);

        return Inertia::render('Web/Products/Explore/Verification/Index', [
            'batchUuid' => $batchUuid,
            'email' => $request->user()->email,
        ]);
    }

    public function continue(
        Request $request,
        GenerateUserDocumentQuestionSchemaAction $generateSchema
    ): RedirectResponse {
        $batchUuid = (string) $request->input('batch_uuid');

        abort_if(blank($batchUuid), 404);

        $userDocuments = UserDocument::query()
            ->with('document')
            ->ownedBy($request->user()->id)
            ->batch($batchUuid)
            ->get();

        abort_if($userDocuments->isEmpty(), 404);

        /** @var \App\Models\UserDocument $userDocument */
        foreach ($userDocuments as $userDocument) {
            if (! $userDocument->document) {
                continue;
            }

            if (
                empty($userDocument->question_schema_json)
                || ! is_array($userDocument->question_schema_json)
                || empty($userDocument->question_schema_json['questions'])
            ) {
                $generateSchema->handle($userDocument, force: true);
            }

            if (in_array($userDocument->status, [
                UserDocument::STATUS_VERIFICATION_PENDING,
                UserDocument::STATUS_VERIFICATION_COMPLETED,
            ], true)) {
                $userDocument->update([
                    'status' => UserDocument::STATUS_QNA_PENDING,
                ]);
            }
        }

        return redirect()->route('product.qna.show', [
            'batch_uuid' => $batchUuid,
        ]);
    }
}
