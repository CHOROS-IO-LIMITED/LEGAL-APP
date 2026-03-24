<?php

namespace App\Actions\Admin\Documents;

use App\Models\Document;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoreDocumentFiles
{
    public function handle(array $data, ?Document $document = null): array
    {
        $disk = config('filesystems.default');
        $payload = Arr::except($data, ['image', 'document']);

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            if ($document?->image_path) {
                Storage::disk($disk)->delete($document->image_path);
            }

            $payload['image_path'] = $data['image']->store('documents/images', $disk);
            $payload['image_original_name'] = $data['image']->getClientOriginalName();
            $payload['image_mime'] = $data['image']->getClientMimeType();
            $payload['image_size'] = $data['image']->getSize();
        }

        if (isset($data['document']) && $data['document'] instanceof UploadedFile) {
            if ($document?->document_path) {
                Storage::disk($disk)->delete($document->document_path);
            }

            $payload['document_path'] = $data['document']->store('documents/files', $disk);
            $payload['document_original_name'] = $data['document']->getClientOriginalName();
            $payload['document_mime'] = $data['document']->getClientMimeType();
            $payload['document_size'] = $data['document']->getSize();
        }

        $baseTitle = $payload['title'] ?? $document?->title ?? Str::random(8);
        $payload['slug'] = Str::slug($baseTitle) . '-' . Str::lower(Str::random(6));

        return $payload;
    }
}
