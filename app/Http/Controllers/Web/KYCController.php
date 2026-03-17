<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use ComplyCube\ComplyCubeClient;

class KYCController extends Controller
{
    // Show KYC page (optional)
    public function index()
    {
        return inertia('Web/Products/Explore/KYC/Index');
    }

    // Start KYC session
    public function startKyc(Request $request)
    {
        $user = $request->user();

        $ccapi = new ComplyCubeClient(env('COMPLYCUBE_API_KEY'));

        // If user doesn't have a ComplyCube client ID, create one
        if (!$user->complycube_client_id) {
            $nameParts = explode(' ', $user->name, 2);

            $client = $ccapi->clients()->create([
                'type' => 'person',
                'email' => $user->email,
                'personDetails' => [
                    'firstName' => $nameParts[0],
                    'lastName'  => $nameParts[1] ?? 'N/A',
                ],
            ]);

            $user->complycube_client_id = $client->id;
        }

        // Always set KYC status to pending
        $user->kyc_status = 'pending';
        $user->save();

        $clientId = $user->complycube_client_id;

        // Optionally store product slug to redirect if user cancels KYC
        if ($request->has('product_slug')) {
            session(['kyc_product_slug' => $request->input('product_slug')]);
        }

        $session = $ccapi->flow()->createSession([
            'clientId' => $clientId,
            'workflowTemplateId' => env('COMPLYCUBE_WORKFLOW_ID'),
            'successUrl' => route('kyc.success'),
            'cancelUrl' => route('kyc.cancel'),
        ]);

        return redirect($session->redirectUrl);
    }

    // KYC success → redirect to checkout
    public function success()
    {
        return redirect()->route('product.checkout');
    }

    // KYC cancel → redirect back to product details
    public function cancel()
    {
        // $slug = session('kyc_product_slug', 'default-product');
        // return redirect()->route('product.details', ['document' => $slug]);
        return redirect()->route('product.details.index');
    }
}
