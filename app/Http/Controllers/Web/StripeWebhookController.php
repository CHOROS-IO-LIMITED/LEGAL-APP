<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;
            $batchUuid = $paymentIntent->metadata->batch_uuid ?? null;
            $userId = $paymentIntent->metadata->user_id ?? null;

            if ($batchUuid && $userId) {
                UserDocument::query()
                    ->where('user_id', $userId)
                    ->where('batch_uuid', $batchUuid)
                    ->update([
                        'status' => UserDocument::STATUS_VERIFICATION_PENDING,
                    ]);
            }
        }

        return response()->json(['received' => true]);
    }
}
