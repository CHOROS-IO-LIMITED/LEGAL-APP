<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Inertia\Inertia;
use Inertia\Response;

class ProductDetailsController extends Controller
{
    public function list(): Response
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
            ]);

        return Inertia::render('Web/Products/Explore/ProductDetails/Index', [
            'products' => $products,
            'selectedProductId' => null,
        ]);
    }

    public function index(Document $document): Response
    {
        abort_unless($document->is_active, 404);

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
            ]);

        return Inertia::render('Web/Products/Explore/ProductDetails/Index', [
            'products' => $products,
            'selectedProductId' => $document->id,
        ]);
    }
}
