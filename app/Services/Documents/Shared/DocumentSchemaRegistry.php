<?php

namespace App\Services\Documents\Shared;

use App\Models\Document;
use App\Support\Documents\LoanAgreement\LoanAgreementQuestionSchema;
use App\Support\Documents\LoanAgreement\LoanAgreementTemplateSchema;

class DocumentSchemaRegistry
{
    public function questionSchema(Document $document): ?array
    {
        return $this->isLoanAgreement($document)
            ? LoanAgreementQuestionSchema::make()
            : null;
    }

    public function templateSchema(Document $document): ?array
    {
        return $this->isLoanAgreement($document)
            ? LoanAgreementTemplateSchema::make()
            : null;
    }

    protected function isLoanAgreement(Document $document): bool
    {
        $title = strtolower(trim((string) $document->title));

        return $title === 'loan agreement' || str_contains($title, 'loan agreement');
    }
}
