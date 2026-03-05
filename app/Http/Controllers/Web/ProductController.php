<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display the product page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Web/Products/Index');
    }
}