<?php

// namespace App\Services\User\Documents;

// use App\Models\UserDocument;
// use Barryvdh\DomPDF\Facade\Pdf;
// use Illuminate\Support\Facades\Storage;

// class PdfDocumentStorage
// {
//     public function store(UserDocument $userDocument, string $html): array
//     {
//         $disk = config('filesystems.default', 'public');
//         $filename = 'generated-documents/user-document-' . $userDocument->id . '-' . now()->format('YmdHis') . '.pdf';

//         $pdf = Pdf::loadHTML($html)
//             ->setPaper('a4')
//             ->setOption('isHtml5ParserEnabled', true)
//             ->setOption('isRemoteEnabled', false);

//         Storage::disk($disk)->put($filename, $pdf->output());

//         return [
//             'path' => $filename,
//             'original_name' => 'loan-agreement-' . $userDocument->id . '.pdf',
//             'mime' => 'application/pdf',
//             'size' => Storage::disk($disk)->size($filename),
//         ];
//     }
// }
