<?php

namespace App\Http\Controllers\Web\Payment;

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

    public function continue(Request $request): RedirectResponse
    {
        $batchUuid = (string) $request->input('batch_uuid');

        abort_if(blank($batchUuid), 404);

        $userDocuments = UserDocument::query()
            ->ownedBy($request->user()->id)
            ->batch($batchUuid)
            ->get();

        abort_if($userDocuments->isEmpty(), 404);

        UserDocument::query()
            ->ownedBy($request->user()->id)
            ->batch($batchUuid)
            ->update([
                'status' => UserDocument::STATUS_QNA_PENDING,
            ]);

        return redirect()->route('product.qna', [
            'batch_uuid' => $batchUuid,
        ]);
    }
}
