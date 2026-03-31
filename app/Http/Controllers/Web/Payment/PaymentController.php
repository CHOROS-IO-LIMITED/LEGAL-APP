<?php

namespace App\Http\Controllers\Web\Payment;

use App\Actions\User\QnA\GenerateUserDocumentQuestionSchemaAction;
use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\PaymentIntent;
use Stripe\Stripe;

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

        $totalPence = (int) round($userDocuments->sum('price') * 100);

        Stripe::setApiKey(config('services.stripe.secret'));

        $paymentIntent = PaymentIntent::create([
            'amount' => $totalPence,
            'currency' => 'gbp',
            'metadata' => [
                'batch_uuid' => $batchUuid,
                'user_id' => $request->user()->id,
            ],
        ]);

        return Inertia::render('Web/Products/Explore/Checkout/Index', [
            'batchUuid' => $batchUuid,
            'documents' => $userDocuments->map(fn(UserDocument $userDocument) => [
                'id' => $userDocument->id,
                'price' => $userDocument->price,
                'document' => [
                    'title' => $userDocument->document?->title,
                ],
            ]),
            'stripeKey' => config('services.stripe.key'),
            'clientSecret' => $paymentIntent->client_secret,
        ]);
    }

    public function continue(
        Request $request,
        GenerateUserDocumentQuestionSchemaAction $generateSchema
    ): Response {
        $batchUuid = $request->string('batch_uuid')->toString();

        abort_if(blank($batchUuid), 404);

        $userDocuments = UserDocument::query()
            ->with('document')
            ->ownedBy($request->user()->id)
            ->batch($batchUuid)
            ->get();

        abort_if($userDocuments->isEmpty(), 404);

        $paymentIntentId = $request->string('payment_intent')->toString();
        abort_if(blank($paymentIntentId), 400, 'Missing payment verification.');

        Stripe::setApiKey(config('services.stripe.secret'));
        $paymentIntent = PaymentIntent::retrieve($paymentIntentId);

        abort_if($paymentIntent->status !== 'succeeded', 402, 'Payment not completed.');
        abort_if(($paymentIntent->metadata->batch_uuid ?? '') !== $batchUuid, 403, 'Payment mismatch.');
        abort_if((int) ($paymentIntent->metadata->user_id ?? 0) !== $request->user()->id, 403, 'Payment mismatch.');

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

            $userDocument->update([
                'status' => UserDocument::STATUS_QNA_PENDING,
            ]);
        }

        return Inertia::render('Web/Products/Explore/Checkout/Success', [
            'batchUuid' => $batchUuid,
            'documents' => $userDocuments->map(fn(UserDocument $ud) => [
                'id' => $ud->id,
                'price' => $ud->price,
                'document' => ['title' => $ud->document?->title],
            ]),
        ]);
    }
}
