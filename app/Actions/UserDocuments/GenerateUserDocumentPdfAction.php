<?php

namespace App\Actions\UserDocuments;

use App\Models\UserDocument;
use App\Services\Ai\GeminiLegalDocumentComposer;
use App\Services\Documents\Shared\PdfDocumentStorage;
use RuntimeException;

class GenerateUserDocumentPdfAction
{
    public function __construct(
        protected GeminiLegalDocumentComposer $composer,
        protected PdfDocumentStorage $pdfStorage
    ) {}

    public function handle(UserDocument $userDocument): UserDocument
    {
        $userDocument->loadMissing('document');

        if (! $userDocument->document) {
            throw new RuntimeException('User document has no related document.');
        }

        $templateSchema = $userDocument->document->template_schema_json;

        if (! is_array($templateSchema)) {
            throw new RuntimeException('Template schema is missing or invalid.');
        }

        $composed = $this->composer->compose(
            document: $userDocument->document,
            templateSchema: $templateSchema,
            answers: $userDocument->answers_json ?? [],
        );

        $stored = $this->pdfStorage->store($userDocument, $composed['html']);

        $userDocument->update([
            'generated_pdf_path' => $stored['path'],
            'generated_pdf_original_name' => $stored['original_name'],
            'generated_pdf_mime' => $stored['mime'],
            'generated_pdf_size' => $stored['size'],
            'status' => UserDocument::STATUS_PDF_GENERATED,
            'pdf_generated_at' => now(),
        ]);

        return $userDocument->refresh();
    }
}
