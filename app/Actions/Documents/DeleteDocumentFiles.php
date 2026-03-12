<?php

namespace App\Actions\Documents;

use App\Models\Document;
use Illuminate\Support\Facades\Storage;

class DeleteDocumentFiles
{
    public function handle(Document $document): void
    {
        if ($document->image_path) {
            Storage::disk('public')->delete($document->image_path);
        }

        if ($document->document_path) {
            Storage::disk('public')->delete($document->document_path);
        }
    }
}
