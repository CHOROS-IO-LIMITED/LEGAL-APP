<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StartUserDocumentKycRequest;
use App\Models\UserDocument;
use ComplyCube\ComplyCubeClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KYCController extends Controller
{
    /**
     * Display the KYC page for a specific batch of user documents.
     */
    public function index(Request $request): Response
    {
        // Get batch UUID from query string
        $batchUuid = $request->string('batch_uuid')->toString();

        // Fetch user documents belonging to the authenticated user and batch
        $userDocuments = UserDocument::query()
            ->with('document:id,title,price')
            ->ownedBy($request->user()->id)
            ->batch($batchUuid)
            ->get();

        // Abort if no documents found (invalid or unauthorized batch)
        abort_if($userDocuments->isEmpty(), 404);

        // Render KYC page with document data
        return Inertia::render('Web/Products/Explore/KYC/Index', [
            'batchUuid' => $batchUuid,
            'documents' => $userDocuments->map(fn(UserDocument $userDocument) => [
                'id' => $userDocument->id,
                'status' => $userDocument->status,
                'price' => $userDocument->price,
                'document' => [
                    'id' => $userDocument->document?->id,
                    'title' => $userDocument->document?->title,
                ],
            ]),
        ]);
    }

    /**
     * Start the KYC process for a batch of user documents.
     */
    public function startKyc(StartUserDocumentKycRequest $request): RedirectResponse
    {
        $user = $request->user();
        $batchUuid = $request->validated('batch_uuid');

        // Retrieve all documents under the given batch
        $userDocuments = UserDocument::query()
            ->ownedBy($user->id)
            ->batch($batchUuid)
            ->get();

        // Ensure the batch exists and belongs to the user
        abort_if($userDocuments->isEmpty(), 404);

        // Initialize ComplyCube client
        $ccapi = new ComplyCubeClient(env('COMPLYCUBE_API_KEY'));

        // Create ComplyCube client if not yet created
        if (! $user->complycube_client_id) {
            $nameParts = explode(' ', $user->name, 2);

            $client = $ccapi->clients()->create([
                'type' => 'person',
                'email' => $user->email,
                'personDetails' => [
                    'firstName' => $nameParts[0],
                    'lastName' => $nameParts[1] ?? 'N/A',
                ],
            ]);

            // Save external client ID to user
            $user->complycube_client_id = $client->id;
        }

        // Set user's KYC status to pending
        $user->kyc_status = 'pending';
        $user->save();

        // Update all documents in the batch to KYC pending inside a transaction
        UserDocument::query()
            ->ownedBy($user->id)
            ->batch($batchUuid)
            ->update([
                'status' => UserDocument::STATUS_KYC_PENDING,
            ]);

        // Store batch UUID in session for later use (success/cancel callbacks)
        session(['kyc_batch_uuid' => $batchUuid]);

        // Create ComplyCube KYC session
        $session = $ccapi->flow()->createSession([
            'clientId' => $user->complycube_client_id,
            'workflowTemplateId' => env('COMPLYCUBE_WORKFLOW_ID'),
            'successUrl' => route('kyc.success'),
            'cancelUrl' => route('kyc.cancel'),
        ]);

        // Redirect user to ComplyCube hosted KYC flow
        return redirect($session->redirectUrl);
    }

    /**
     * Handle successful KYC completion.
     */
    public function success(Request $request): RedirectResponse
    {
        $user = $request->user();
        $batchUuid = session('kyc_batch_uuid');

        // Ensure batch exists in session
        abort_unless($batchUuid, 404);

        // Update documents to checkout pending after successful KYC
        UserDocument::query()
            ->ownedBy($user->id)
            ->batch($batchUuid)
            ->update([
                'status' => UserDocument::STATUS_CHECKOUT_PENDING,
            ]);

        // Mark user as verified
        $user->kyc_status = 'verified';
        $user->save();

        // Redirect to checkout with batch reference
        return redirect()->route('product.checkout', [
            'batch_uuid' => $batchUuid,
        ]);
    }

    public function cancel(Request $request): RedirectResponse
    {
        $batchUuid = session('kyc_batch_uuid');

        // If batch exists, revert documents back to KYC pending
        if ($batchUuid) {
            UserDocument::query()
                ->ownedBy($request->user()->id)
                ->batch($batchUuid)
                ->update([
                    'status' => UserDocument::STATUS_KYC_PENDING,
                ]);
        }

        // Redirect user back to product listing/details page
        return redirect()->route('product.details.index');
    }
}
