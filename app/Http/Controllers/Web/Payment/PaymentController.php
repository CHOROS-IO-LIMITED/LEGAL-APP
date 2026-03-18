<?php

namespace App\Http\Controllers\Web\Payment;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $batchUuid = $request->string('batch_uuid')->toString();

        abort_if(blank($batchUuid), 404);

        $userDocuments = UserDocument::query()
            ->with('document:id,title')
            ->ownedBy($request->user()->id)
            ->batch($batchUuid)
            ->get();

        abort_if($userDocuments->isEmpty(), 404);

        return Inertia::render('Web/Products/Explore/Checkout/Index', [
            'batchUuid' => $batchUuid,
            'documents' => $userDocuments->map(fn(UserDocument $userDocument) => [
                'id' => $userDocument->id,
                'price' => $userDocument->price,
                'document' => [
                    'title' => $userDocument->document?->title,
                ],
            ]),
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
                'status' => UserDocument::STATUS_VERIFICATION_PENDING,
            ]);

        return redirect()->route('email.verify', [
            'batch_uuid' => $batchUuid,
        ]);
    }
}
