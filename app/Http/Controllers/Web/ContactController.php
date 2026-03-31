<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function index()
    {
        return inertia('Web/Contact/Index');
    }

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'message'    => 'required|string',
        ]);

        try {
            Mail::alwaysFrom(
                config('mail.from.address'),
                config('mail.from.name')
            );

            Mail::to(config('mail.from.address'))
                ->send(new ContactMessage($validated));

            return back()->with('success', 'Message sent successfully!');
        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());

            return back()->with('error', 'Failed to send message.');
        }
    }
}
