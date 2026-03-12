<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Services\Documents\DocumentQueryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminProductController extends Controller
{
    public function index(Request $request, DocumentQueryService $documentQueryService): Response
    {
        $this->authorize('viewAny', Document::class);

        $user = Auth::user();

        $filters = $request->only(['search', 'price', 'sort']);

        $documents = $documentQueryService->paginateForAdmin($filters);

        return Inertia::render('Admin/AdminProduct/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'documents' => $documents,
            'filters' => $filters,
            'stats' => [
                'total_documents' => Document::count(),
                'active_products' => Document::whereNotNull('document_path')->count(),
                'draft_products' => Document::whereNull('document_path')->count(),
                'top_product' => Document::query()->latest()->value('title'),
            ],
            'can' => [
                'create_document' => $request->user()->can('create', Document::class),
            ],
        ]);
    }
}
