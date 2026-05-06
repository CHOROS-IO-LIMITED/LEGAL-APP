<?php

namespace App\Actions\Admin\Documents;

use App\Models\Document;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoreDocumentFiles
{
    public function handle(array $data, ?Document $document = null): array
    {
        $disk = config('filesystems.default');
        $payload = Arr::except($data, ['image', 'document']);

        Log::info('Starting document file storage process.', [
            'disk' => $disk,
            'document_id' => $document?->id,
            'has_image_upload' => ($data['image'] ?? null) instanceof UploadedFile,
            'has_document_upload' => ($data['document'] ?? null) instanceof UploadedFile,
        ]);

        if (($data['image'] ?? null) instanceof UploadedFile) {
            if ($document?->image_path) {
                Storage::disk($disk)->delete($document->image_path);

                Log::info('Old document image deleted.', [
                    'document_id' => $document->id,
                    'old_image_path' => $document->image_path,
                ]);
            }

            /** @var UploadedFile $image */
            $image = $data['image'];

            $payload['image_path'] = $image->store('documents/images', $disk);
            $payload['image_original_name'] = $image->getClientOriginalName();
            $payload['image_mime'] = $image->getClientMimeType();
            $payload['image_size'] = $image->getSize();

            Log::info('Document image stored successfully.', [
                'document_id' => $document?->id,
                'image_path' => $payload['image_path'],
                'image_original_name' => $payload['image_original_name'],
                'image_mime' => $payload['image_mime'],
                'image_size' => $payload['image_size'],
            ]);
        }

        if (($data['document'] ?? null) instanceof UploadedFile) {
            if ($document?->document_path) {
                Storage::disk($disk)->delete($document->document_path);

                Log::info('Old document file deleted.', [
                    'document_id' => $document->id,
                    'old_document_path' => $document->document_path,
                ]);
            }

            /** @var UploadedFile $uploadedDocument */
            $uploadedDocument = $data['document'];

            $payload['document_path'] = $uploadedDocument->store('documents/files', $disk);
            $payload['document_original_name'] = $uploadedDocument->getClientOriginalName();
            $payload['document_mime'] = $uploadedDocument->getClientMimeType();
            $payload['document_size'] = $uploadedDocument->getSize();

            Log::info('Document file stored successfully.', [
                'document_id' => $document?->id,
                'document_path' => $payload['document_path'],
                'document_original_name' => $payload['document_original_name'],
                'document_mime' => $payload['document_mime'],
                'document_size' => $payload['document_size'],
            ]);
        }

        $baseTitle = trim((string) ($payload['title'] ?? $document?->title ?? Str::random(8)));

        if (! $document || $baseTitle !== $document->title) {
            $payload['slug'] = $this->generateUniqueSlug($baseTitle, $document);

            Log::info('Document slug generated.', [
                'document_id' => $document?->id,
                'title' => $baseTitle,
                'slug' => $payload['slug'],
            ]);
        }

        Log::info('Document file storage process completed.', [
            'document_id' => $document?->id,
            'payload_keys' => array_keys($payload),
        ]);

        return $payload;
    }

    protected function generateUniqueSlug(string $title, ?Document $document = null): string
    {
        $base = Str::slug($title);

        if ($base === '') {
            $base = Str::lower(Str::random(8));
        }

        $slug = $base;
        $counter = 1;

        while (
            Document::query()
            ->when($document, fn($query) => $query->whereKeyNot($document->getKey()))
            ->where('slug', $slug)
            ->exists()
        ) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
