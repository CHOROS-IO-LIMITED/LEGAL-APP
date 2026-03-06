<?php

namespace App\Http\Controllers\Web\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailVerificationController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Web/Products/Explore/Verification/Index');
    }
}
