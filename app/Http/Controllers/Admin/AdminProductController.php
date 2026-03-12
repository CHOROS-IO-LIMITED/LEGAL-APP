<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminProductController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Document::class);

        $user = Auth::user();

        $documents = Document::query()
            ->with('user:id,name,email')
            ->latest()
            ->get();

        return Inertia::render('Admin/AdminProduct/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'documents' => $documents,
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
