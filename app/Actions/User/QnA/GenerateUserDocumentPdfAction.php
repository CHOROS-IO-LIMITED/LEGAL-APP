<?php

namespace App\Actions\User\QnA;

use App\Models\UserDocument;
use App\Services\User\Documents\GenerateLoanAgreementPdfAction;
use RuntimeException;

class GenerateUserDocumentPdfAction
{
    public function __construct(
        protected GenerateLoanAgreementPdfAction $generateLoanAgreementPdf
    ) {}

    public function handle(UserDocument $userDocument): UserDocument
    {
        $userDocument->loadMissing('document');

        $documentType = $userDocument->document?->document_type;

        $generatedDocument = match ($documentType) {
            'loan_agreement' => $this->generateLoanAgreementPdf->handle($userDocument),
            default => throw new RuntimeException("Unsupported document type [{$documentType}] for PDF generation."),
        };

        $generatedDocument->forceFill([
            'status' => UserDocument::STATUS_PDF_GENERATED,
            'pdf_generated_at' => now(),
        ])->save();

        return $generatedDocument;
    }
}
