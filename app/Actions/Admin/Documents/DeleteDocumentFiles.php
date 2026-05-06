<?php

namespace App\Actions\Admin\Documents;

use App\Models\Document;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DeleteDocumentFiles
{
    public function handle(Document $document): void
    {
        $disk = config('filesystems.default');

        Log::info('Starting document file delete process.', [
            'disk' => $disk,
            'document_id' => $document->id,
            'image_path' => $document->image_path,
            'document_path' => $document->document_path,
        ]);

        if ($document->image_path) {
            Storage::disk($disk)->delete($document->image_path);

            Log::info('Document image deleted successfully.', [
                'document_id' => $document->id,
                'image_path' => $document->image_path,
            ]);
        } else {
            Log::info('No document image to delete.', [
                'document_id' => $document->id,
            ]);
        }

        if ($document->document_path) {
            Storage::disk($disk)->delete($document->document_path);

            Log::info('Document file deleted successfully.', [
                'document_id' => $document->id,
                'document_path' => $document->document_path,
            ]);
        } else {
            Log::info('No document file to delete.', [
                'document_id' => $document->id,
            ]);
        }

        Log::info('Document file delete process completed.', [
            'document_id' => $document->id,
        ]);
    }
}
