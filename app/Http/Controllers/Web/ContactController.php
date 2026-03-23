<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Show the contact page.
     */
    public function index()
    {
        return Inertia::render('Web/Contact/Index');
    }

    /**
     * Handle form submission.
     */
    public function submit(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'first_name'      => 'required|string|max:255',
            'last_name'       => 'required|string|max:255',
            'email'           => 'required|email|max:255',
            'message'         => 'required|string',
            'recaptcha_token' => 'required|string',
        ]);

        try {
            // Verify reCAPTCHA v3 token
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret'   => env('RECAPTCHA_SECRET_KEY'),
                'response' => $validated['recaptcha_token'],
            ]);

            $body = $response->json();

            if (!($body['success'] ?? false) || ($body['score'] ?? 0) < 0.5) {
                return response()->json(['message' => 'reCAPTCHA verification failed.'], 422);
            }

            // Ensure Mail uses correct "from" address
            Mail::alwaysFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));

            // Send email using ContactMessage Mailable
            Mail::to(env('MAIL_USERNAME'))->send(new ContactMessage($validated));

            return response()->json(['message' => 'Message sent successfully!'], 200);
        } catch (\Exception $e) {
            // Log full error for debugging
            Log::error('Contact form submission error: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'There was an error sending your message. Please try again later.'
            ], 500);
        }
    }
}
