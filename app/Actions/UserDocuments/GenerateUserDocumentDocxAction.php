<?php

namespace App\Actions\UserDocuments;

use App\Models\UserDocument;
use App\Services\Documents\LoanAgreementDocxGenerator;

class GenerateUserDocumentDocxAction
{
    public function __construct(
        protected LoanAgreementDocxGenerator $generator
    ) {}

    public function handle(UserDocument $userDocument): array
    {
        $userDocument->loadMissing('document');

        return $this->generator->generate($userDocument);
    }
}
