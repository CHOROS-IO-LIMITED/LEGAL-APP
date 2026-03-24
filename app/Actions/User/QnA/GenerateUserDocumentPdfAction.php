<?php

namespace App\Actions\User\QnA;

use App\Models\UserDocument;
use App\Services\Ai\GeminiLegalDocumentComposer;
use App\Services\User\Documents\PdfDocumentStorage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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

        if (! isset($composed['html']) || ! is_string($composed['html']) || trim($composed['html']) === '') {
            throw new RuntimeException('Generated document HTML is missing or invalid.');
        }

        $oldPdfPath = $userDocument->generated_pdf_path;
        $disk = config('filesystems.default');

        return DB::transaction(function () use ($userDocument, $composed, $oldPdfPath, $disk) {
            $stored = $this->pdfStorage->store($userDocument, $composed['html']);

            $userDocument->update([
                'generated_pdf_path' => $stored['path'],
                'generated_pdf_original_name' => $stored['original_name'],
                'generated_pdf_mime' => $stored['mime'],
                'generated_pdf_size' => $stored['size'],
                'status' => UserDocument::STATUS_PDF_GENERATED,
                'pdf_generated_at' => now(),

                // Reset post-generation review/signature state because this is a newly regenerated draft.
                'submitted_for_approval_at' => null,
                'approved_for_signature_at' => null,
                'sent_for_signature_at' => null,
                'rejected_at' => null,
                'completed_at' => null,
                'lawyer_note' => null,
            ]);

            if (
                $oldPdfPath &&
                $oldPdfPath !== $stored['path'] &&
                Storage::disk($disk)->exists($oldPdfPath)
            ) {
                Storage::disk($disk)->delete($oldPdfPath);
            }

            return $userDocument->fresh(['document', 'user']);
        });
    }
}
