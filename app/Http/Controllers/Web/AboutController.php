<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{

    public function index()
    {
        return Inertia::render('Web/About/Index');
    }
}
