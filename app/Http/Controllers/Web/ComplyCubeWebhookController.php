<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ComplyCubeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $rawBody = $request->getContent();
        $signature = $request->header('X-ComplyCube-Signature')
            ?? $request->header('complycube-signature');

        if (!$signature) {
            Log::error('ComplyCube webhook missing signature');
            // Always return 200 to prevent retries
            return response()->json(['success' => true]);
        }

        $computedSignature = hash_hmac(
            'sha256',
            $rawBody,
            env('COMPLYCUBE_WEBHOOK_SECRET')
        );

        if (!hash_equals($computedSignature, $signature)) {
            Log::warning('ComplyCube webhook invalid signature');
            return response()->json(['success' => true]);
        }

        $payload = json_decode($rawBody, true);

        if (!$payload || !isset($payload['type'], $payload['payload'])) {
            Log::error('ComplyCube webhook invalid payload');
            return response()->json(['success' => true]);
        }

        $event = $payload['type'];
        $data = $payload['payload'];
        $clientId = $data['clientId'] ?? null;

        if (!$clientId) {
            Log::error('ComplyCube webhook missing clientId');
            return response()->json(['success' => true]);
        }

        $user = User::where('complycube_client_id', $clientId)->first();

        if (!$user) {
            Log::warning('ComplyCube webhook user not found', [
                'clientId' => $clientId,
            ]);
            return response()->json(['success' => true]);
        }

        $originalStatus = $user->kyc_status;
        $outcome = $data['outcome'] ?? $data['status'] ?? null;

        switch ($event) {
            case 'workflow.session.completed':
            case 'check.completed':
                $user->kyc_status = match ($outcome) {
                    'clear' => 'approved',
                    'rejected' => 'rejected',
                    'attention' => 'pending',
                    'complete' => 'approved',
                    default => 'pending',
                };
                break;

            case 'check.failed':
                $user->kyc_status = 'rejected';
                break;

            case 'check.pending':
                $user->kyc_status = 'pending';
                break;

            default:
                Log::info('ComplyCube webhook event ignored', [
                    'event' => $event,
                    'clientId' => $clientId,
                ]);
                return response()->json(['success' => true]);
        }

        $user->save();

        Log::info('ComplyCube KYC updated', [
            'user_id' => $user->id,
            'clientId' => $clientId,
            'old_status' => $originalStatus,
            'new_status' => $user->kyc_status,
            'event' => $event,
        ]);

        return response()->json(['success' => true]);
    }
}
