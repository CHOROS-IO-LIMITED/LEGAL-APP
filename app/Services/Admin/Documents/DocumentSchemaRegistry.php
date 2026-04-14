<?php

namespace App\Services\Admin\Documents;

use App\Enums\DocumentType;
use App\Models\Document;
use App\Support\Documents\LoanAgreement\LoanAgreementQuestionSchema;

class DocumentSchemaRegistry
{
    public function questionSchema(Document $document): ?array
    {
        return $this->questionSchemaByType((string) $document->document_type);
    }

    public function questionSchemaByType(string $documentType): ?array
    {
        return match ($documentType) {
            DocumentType::LOAN_AGREEMENT->value => LoanAgreementQuestionSchema::make(),
            DocumentType::NDA->value => null,
            default => null,
        };
    }
}
