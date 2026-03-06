<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductDetailsController extends Controller
{

    public function index($index = 0)
    {
        return Inertia::render('Web/Products/Explore/ProductDetails/Index', [
            'selectedIndex' => $index
        ]);
    }
}
