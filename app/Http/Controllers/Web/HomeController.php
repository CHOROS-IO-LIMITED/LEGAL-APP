<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the homepage.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Web/Home/Index');
    }
}
