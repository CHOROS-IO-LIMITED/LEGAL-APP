<?php

namespace App\Services\Documents;

use App\Models\Document;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DocumentQueryService
{
    public function paginateForAdmin(array $filters = []): LengthAwarePaginator
    {
        return Document::query()
            ->with('user:id,name,email')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(($filters['price'] ?? null) === 'highest', fn($q) => $q->orderByDesc('price'))
            ->when(($filters['price'] ?? null) === 'lowest', fn($q) => $q->orderBy('price'))
            ->when(($filters['sort'] ?? null) === 'az', fn($q) => $q->orderBy('title'))
            ->when(($filters['sort'] ?? null) === 'za', fn($q) => $q->orderByDesc('title'))
            ->latest()
            ->paginate(8)
            ->withQueryString();
    }
}
