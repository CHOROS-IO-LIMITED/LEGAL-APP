<?php

namespace App\Services\Documents;

use RuntimeException;
use ZipArchive;

class WordTemplateEditor
{
    public function generate(string $templatePath, string $outputPath, array $resolved): void
    {
        if (! is_dir(dirname($outputPath))) {
            mkdir(dirname($outputPath), 0775, true);
        }

        copy($templatePath, $outputPath);

        $zip = new ZipArchive();

        if ($zip->open($outputPath) !== true) {
            throw new RuntimeException('Unable to open DOCX template.');
        }

        $documentXml = $zip->getFromName('word/document.xml');

        if ($documentXml === false) {
            $zip->close();
            throw new RuntimeException('word/document.xml not found.');
        }

        $documentXml = $this->preprocessDocumentXml($documentXml, $resolved);
        $documentXml = $this->replacePlaceholders($documentXml, $resolved['values'] ?? []);

        $zip->addFromString('word/document.xml', $documentXml);
        $zip->close();
    }

    protected function preprocessDocumentXml(string $xml, array $resolved): string
    {
        $flags = $resolved['flags'] ?? [];
        $choices = $resolved['choices'] ?? [];

        $rules = [
            '/\[DEVELOPMENT OBLIGATIONS\s*/i' => ! empty($flags['is_property_development']) ? 'DEVELOPMENT OBLIGATIONS ' : '',
            '/ONLY INCLUDE IF THE BORROWER IS A COMPANY\.?/i' => '',
            '/ONLY INCLUDE IF PROPERTY IS OFFERED AS SECURITY\.?/i' => '',
            '/IF SECURITY IS TAKEN\.?/i' => '',
            '/ONLY IF MORE THAN ONE BORROWER\.?/i' => '',
            '/SCHEDULE 2 IS ONLY INCLUDED IF A PERSONAL GUARANTEE IF GIVEN/i' => '',
        ];

        foreach ($rules as $pattern => $replacement) {
            $xml = preg_replace($pattern, $replacement, $xml) ?? $xml;
        }

        $xml = $this->resolveOrBlocks($xml, $resolved);
        $xml = $this->removeConditionalBlocks($xml, $resolved);

        return $xml;
    }

    protected function resolveOrBlocks(string $xml, array $resolved): string
    {
        $choices = $resolved['choices'] ?? [];

        if (($choices['lender_intro_variant'] ?? null) === 'company') {
            $xml = preg_replace(
                '/\[Company Name\].*?\(the “Lender”\)\.\s*OR\s*\[Individual’s Name\] of \[ENTER HOME ADDRESS OF INDIVIDUAL\] \(the “Lender”\);/is',
                '[LENDER_COMPANY_BLOCK]',
                $xml
            ) ?? $xml;
        } else {
            $xml = preg_replace(
                '/\[Company Name\].*?\(the “Lender”\)\.\s*OR\s*\[Individual’s Name\] of \[ENTER HOME ADDRESS OF INDIVIDUAL\] \(the “Lender”\);/is',
                '[LENDER_INDIVIDUAL_BLOCK]',
                $xml
            ) ?? $xml;
        }

        if (($choices['borrower_intro_variant'] ?? null) === 'company') {
            $xml = preg_replace(
                '/\[Company Name\].*?\(the “Borrower”\)\.\s*OR\s*\[Individual’s Name\] of \[ENTER HOME ADDRESS OF INDIVIDUAL\] \(the “Borrower”\)\./is',
                '[BORROWER_COMPANY_BLOCK]',
                $xml
            ) ?? $xml;
        } else {
            $xml = preg_replace(
                '/\[Company Name\].*?\(the “Borrower”\)\.\s*OR\s*\[Individual’s Name\] of \[ENTER HOME ADDRESS OF INDIVIDUAL\] \(the “Borrower”\)\./is',
                '[BORROWER_INDIVIDUAL_BLOCK]',
                $xml
            ) ?? $xml;
        }

        return $xml;
    }

    protected function removeConditionalBlocks(string $xml, array $resolved): string
    {
        $flags = $resolved['flags'] ?? [];

        if (empty($flags['has_first_charge']) && empty($flags['has_second_charge'])) {
            $xml = preg_replace('/\[Land:.*?ONLY INCLUDE IF FIRST OR SECOND CHARGE IS OFFERED AS SECURITY/is', '', $xml) ?? $xml;
            $xml = preg_replace('/CLAUSES 11\.2 TO 11\.8 ARE IF THERE IS A CHARGE PUT ON THE PROPERTY AS SECURITY.*?\]/is', '', $xml) ?? $xml;
        }

        if (empty($flags['has_debenture'])) {
            $xml = preg_replace('/CLAUSES 11\.9 TO 11\.11 ARE IF A DEBENTURE IS GIVEN AS SECURITY.*?\]/is', '', $xml) ?? $xml;
        }

        if (empty($flags['has_personal_guarantee'])) {
            $xml = preg_replace('/\[Guarantors:.*?\]/is', '', $xml) ?? $xml;
            $xml = preg_replace('/\[\s*GUARANTORS.*?\]/is', '', $xml) ?? $xml;
        }

        if (empty($flags['borrower_is_company'])) {
            $xml = preg_replace('/ONLY INCLUDE CLAUSES 14\.1 TO 14\.4 IF THE BORROWER IS A COMPANY.*?\]/is', '', $xml) ?? $xml;
            $xml = preg_replace('/ONLY INCLUDE PARAGRAPH 1 OF SCHEDULE 1 IF THE BORROWER IS A COMPANY\..*?Other documents and evidence/is', 'Other documents and evidence', $xml) ?? $xml;
        }

        if (empty($flags['multiple_borrowers'])) {
            $xml = preg_replace('/LIABILITY \(ONLY IF MORE THAN ONE BORROWER\).*?ASSIGNMENT AND TRANSFER/is', 'ASSIGNMENT AND TRANSFER', $xml) ?? $xml;
        }

        if (empty($flags['is_property_development'])) {
            $xml = preg_replace('/\[DEVELOPMENT OBLIGATIONS.*?\]/is', '', $xml) ?? $xml;
        }

        return $xml;
    }

    protected function escapeXml(string $value): string
    {
        return str_replace(
            ['&', '<', '>'],
            ['&amp;', '&lt;', '&gt;'],
            $value
        );
    }

    protected function replacePlaceholders(string $xml, array $values): string
    {
        $map = [
            '[LENDER’S FULL NAME]' => $values['lender_full_name'] ?? '',
            '[BORROWER’S FULL NAME]' => $values['borrower_full_name'] ?? '',
            '[ENTER AMOUNT HERE]' => $values['loan_amount_numeric'] ?? '',
            '[amount in words]' => $values['loan_amount_words'] ?? '',
            '[ENTER AGREED PURPOSE OF THE LOAN HERE]' => $values['loan_purpose'] ?? '',
            '[XX] months' => $values['loan_term'] ?? '',
            '[ENTER AMOUNT]' => $values['interest_rate_value'] ?? '',
            '[ENTER AGREED TERM INTEREST]' => $values['fixed_interest_amount'] ?? '',
            '[exclusive OR non-exclusive]' => $values['jurisdiction_type'] ?? 'exclusive',

            '[LENDER_COMPANY_BLOCK]' => $this->buildLenderCompanyBlock($values),
            '[LENDER_INDIVIDUAL_BLOCK]' => $this->buildLenderIndividualBlock($values),
            '[BORROWER_COMPANY_BLOCK]' => $this->buildBorrowerCompanyBlock($values),
            '[BORROWER_INDIVIDUAL_BLOCK]' => $this->buildBorrowerIndividualBlock($values),
        ];

        foreach ($map as $search => $replace) {
            $xml = str_replace($search, $this->escapeXml($replace), $xml);
        }

        return $xml;
    }

    protected function buildLenderCompanyBlock(array $values): string
    {
        return trim(sprintf(
            '%s, a company incorporated in England and Wales with company number %s whose registered offices is at %s (the “Lender”).',
            $values['lender_full_name'] ?? '',
            $values['lender_company_number'] ?? '',
            $values['lender_registered_office_address'] ?? ''
        ));
    }

    protected function buildLenderIndividualBlock(array $values): string
    {
        return trim(sprintf(
            '%s of %s (the “Lender”);',
            $values['lender_full_name'] ?? '',
            $values['lender_home_address'] ?? ''
        ));
    }

    protected function buildBorrowerCompanyBlock(array $values): string
    {
        return trim(sprintf(
            '%s, a company incorporated in England and Wales with company number %s whose registered offices is at %s (the “Borrower”).',
            $values['borrower_full_name'] ?? '',
            $values['borrower_company_number'] ?? '',
            $values['borrower_registered_office_address'] ?? ''
        ));
    }

    protected function buildBorrowerIndividualBlock(array $values): string
    {
        return trim(sprintf(
            '%s of %s (the “Borrower”).',
            $values['borrower_full_name'] ?? '',
            $values['borrower_home_address'] ?? ''
        ));
    }
}
