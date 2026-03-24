<?php

namespace App\Actions\Admin\Documents;

use App\Models\Document;
use Illuminate\Support\Facades\Storage;

class DeleteDocumentFiles
{
    public function handle(Document $document): void
    {
        $disk = config('filesystems.default');

        if ($document->image_path) {
            Storage::disk($disk)->delete($document->image_path);
        }

        if ($document->document_path) {
            Storage::disk($disk)->delete($document->document_path);
        }
    }
}
