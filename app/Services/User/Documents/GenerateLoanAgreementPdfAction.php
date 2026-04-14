<?php

namespace App\Services\User\Documents;

use App\Models\UserDocument;
use App\Support\Documents\LoanAgreement\LoanAgreementAnswerMapper;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

final class GenerateLoanAgreementPdfAction
{
    public function __construct(
        private LoanAgreementAnswerMapper $mapper
    ) {}

    public function handle(UserDocument $userDocument): UserDocument
    {
        $answers = is_array($userDocument->answers_json) ? $userDocument->answers_json : [];

        $viewData = $this->mapper->map($answers);

        $pdf = Pdf::loadView('pdf.loan-agreement', [
            'data' => $viewData,
            'userDocument' => $userDocument,
        ])->setPaper('a4', 'portrait');

        $disk = config('filesystems.default');

        $fileName = sprintf(
            'generated-documents/%s/loan-agreement.pdf',
            $userDocument->id
        );

        if (
            $userDocument->generated_pdf_path &&
            Storage::disk($disk)->exists($userDocument->generated_pdf_path)
        ) {
            Storage::disk($disk)->delete($userDocument->generated_pdf_path);
        }

        $stored = Storage::disk($disk)->put($fileName, $pdf->output());

        if (! $stored) {
            throw new RuntimeException('Failed to store generated loan agreement PDF.');
        }

        $userDocument->forceFill([
            'generated_pdf_path' => $fileName,
            'generated_pdf_original_name' => 'loan-agreement.pdf',
        ])->save();

        return $userDocument->refresh();
    }
}
