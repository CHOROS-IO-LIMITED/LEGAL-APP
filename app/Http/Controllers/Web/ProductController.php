<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Document;
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
        $products = Document::query()
            ->active()
            ->ordered()
            ->get([
                'id',
                'title',
                'slug',
                'price',
                'description',
                'short_description',
                'image_path',
                'document_path',
                'created_at',
            ]);

        return Inertia::render('Web/Products/Index', [
            'products' => $products,
        ]);
    }
}
