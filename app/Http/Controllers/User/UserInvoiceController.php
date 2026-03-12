<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserInvoiceController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('User/Invoice/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }
}
