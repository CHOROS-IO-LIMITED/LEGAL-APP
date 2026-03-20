<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Documents\DeleteDocumentFiles;
use App\Actions\Documents\StoreDocumentFiles;
use App\Actions\Documents\Shared\SyncDocumentSchemasAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDocumentRequest;
use App\Http\Requests\Admin\UpdateDocumentRequest;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class AdminDocumentController extends Controller
{
    public function store(
        StoreDocumentRequest $request,
        StoreDocumentFiles $storeDocumentFiles,
        SyncDocumentSchemasAction $syncDocumentSchemas
    ): RedirectResponse {
        $this->authorize('create', Document::class);

        DB::transaction(function () use ($request, $storeDocumentFiles, $syncDocumentSchemas) {
            $payload = $storeDocumentFiles->handle($request->validated());

            $document = Document::create([
                ...$payload,
                'user_id' => $request->user()->id,
            ]);

            $syncDocumentSchemas->handle($document);
        });

        return back()->with('success', 'Document created successfully.');
    }

    public function update(
        UpdateDocumentRequest $request,
        Document $document,
        StoreDocumentFiles $storeDocumentFiles,
        SyncDocumentSchemasAction $syncDocumentSchemas
    ): RedirectResponse {
        $this->authorize('update', $document);

        DB::transaction(function () use ($request, $document, $storeDocumentFiles, $syncDocumentSchemas) {
            $payload = $storeDocumentFiles->handle($request->validated(), $document);
            $document->update($payload);
            $document->refresh();

            $syncDocumentSchemas->handle($document);
        });

        return back()->with('success', 'Document updated successfully.');
    }

    public function destroy(
        Document $document,
        DeleteDocumentFiles $deleteDocumentFiles
    ): RedirectResponse {
        $this->authorize('delete', $document);

        DB::transaction(function () use ($document, $deleteDocumentFiles) {
            $deleteDocumentFiles->handle($document);
            $document->delete();
        });

        return back()->with('success', 'Document deleted successfully.');
    }
}
