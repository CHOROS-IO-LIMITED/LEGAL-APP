<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class KYCController extends Controller
{

    public function index()
    {
        return Inertia::render('Web/Products/Explore/KYC/Index');
    }
}
