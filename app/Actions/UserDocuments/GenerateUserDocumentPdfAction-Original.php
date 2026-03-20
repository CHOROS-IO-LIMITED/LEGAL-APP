<?php

// namespace App\Actions\UserDocuments;

// use App\Models\UserDocument;
// use App\Services\Ai\GeminiPdfGenerator;
// use Barryvdh\DomPDF\Facade\Pdf;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Str;
// use RuntimeException;

// class GenerateUserDocumentPdfAction
// {
//     public function __construct(
//         protected GeminiPdfGenerator $generator
//     ) {}

//     public function handle(UserDocument $userDocument): UserDocument
//     {
//         $userDocument->loadMissing('document', 'user');

//         $generated = $this->generator->generate($userDocument);

//         $safeTitle = Str::slug($generated['document_title'] ?: ($userDocument->document?->title ?? 'document'));
//         $fileName = $safeTitle . '-' . $userDocument->id . '.pdf';
//         $relativePath = 'generated/user-documents/' . $userDocument->id . '/' . $fileName;

//         $pdf = Pdf::loadView('pdf.user-document', [
//             'title' => $generated['document_title'],
//             'documentDate' => $generated['document_date'],
//             'body' => $generated['filled_document_text'],
//             'userDocument' => $userDocument,
//         ])->setPaper('a4');

//         $binary = $pdf->output();

//         if (! $binary) {
//             throw new RuntimeException('Failed to render PDF.');
//         }

//         Storage::disk(config('filesystems.default'))->put($relativePath, $binary);

//         DB::transaction(function () use ($userDocument, $relativePath, $fileName, $binary) {
//             $userDocument->forceFill([
//                 'generated_pdf_path' => $relativePath,
//                 'generated_pdf_original_name' => $fileName,
//                 'generated_pdf_mime' => 'application/pdf',
//                 'generated_pdf_size' => strlen($binary),
//                 'status' => UserDocument::STATUS_PDF_GENERATED,
//                 'pdf_generated_at' => now(),
//             ])->save();
//         });

//         return $userDocument->fresh(['document']);
//     }
// }
