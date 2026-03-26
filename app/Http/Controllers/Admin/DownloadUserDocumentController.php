<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloadUserDocumentController extends Controller
{
    public function __invoke(UserDocument $userDocument): StreamedResponse
    {
        $this->authorize('download', $userDocument);

        $disk = config('filesystems.default');
        $path = $userDocument->currentPdfPath();

        abort_unless(is_string($path) && $path !== '', 404, 'Document file not found.');

        /** @var \Illuminate\Filesystem\FilesystemAdapter $storage */
        $storage = Storage::disk($disk);

        return $storage->download(
            $path,
            $userDocument->currentPdfOriginalName()
        );
    }
}
