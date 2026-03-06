<?php

namespace App\Http\Controllers\Web\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Web/Products/Explore/Checkout/Index');
    }
}
