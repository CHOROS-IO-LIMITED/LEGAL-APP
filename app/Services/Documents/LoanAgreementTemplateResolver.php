<?php

namespace App\Services\Documents;

class LoanAgreementTemplateResolver
{
    public function resolve(array $answers): array
    {
        $lenderIsCompany = ($answers['lender_entity_type'] ?? null) === 'company';
        $borrowerIsCompany = ($answers['borrower_entity_type'] ?? null) === 'company';

        $hasFirstCharge = ($answers['has_first_charge_property'] ?? null) === 'yes';
        $hasSecondCharge = ($answers['has_second_charge_property'] ?? null) === 'yes';
        $hasDebenture = ($answers['has_debenture'] ?? null) === 'yes';
        $hasPersonalGuarantee = ($answers['has_personal_guarantee'] ?? null) === 'yes';

        $isPropertyDevelopment = ($answers['loan_purpose_property_related'] ?? null) === 'yes';
        $multipleBorrowers = ($answers['multiple_borrowers'] ?? null) === 'yes';

        $interestStructure = $answers['interest_structure'] ?? null;
        $interestPaymentTiming = $answers['interest_payment_timing'] ?? null;
        $interestCompounds = ($answers['interest_compounds'] ?? null) === 'yes';

        $jurisdictionExclusive = ($answers['jurisdiction_exclusive'] ?? null) === 'yes';
        $lenderAssignmentAllowed = ($answers['lender_assignment_allowed'] ?? null) === 'yes';
        $borrowerAssignmentAllowed = ($answers['borrower_assignment_allowed'] ?? null) === 'yes';

        $loanAmount = $this->asMoney($answers['loan_amount_gbp'] ?? null);

        return [
            'values' => [
                'agreement_date_year' => '2026',
                'loan_amount_numeric' => $loanAmount,
                'loan_amount_words' => $this->numberToWords((int) ($answers['loan_amount_gbp'] ?? 0)) . ' Sterling',
                'loan_term' => (string) ($answers['loan_term'] ?? ''),
                'loan_purpose' => (string) ($answers['loan_purpose'] ?? ''),
                'repayment_date_text' => (string) ($answers['loan_term'] ?? ''),
                'jurisdiction_type' => $jurisdictionExclusive ? 'exclusive' : 'non-exclusive',

                'lender_full_name' => $lenderIsCompany
                    ? (string) ($answers['lender_company_name'] ?? '')
                    : (string) ($answers['lender_full_name'] ?? ''),

                'lender_company_number' => (string) ($answers['lender_company_number'] ?? ''),
                'lender_registered_office_address' => (string) ($answers['lender_registered_office_address'] ?? ''),
                'lender_home_address' => (string) ($answers['lender_address'] ?? ''),
                'lender_signatory_name' => (string) ($answers['lender_signatory_name'] ?? $answers['lender_full_name'] ?? ''),

                'borrower_full_name' => $borrowerIsCompany
                    ? (string) ($answers['borrower_company_name'] ?? '')
                    : (string) ($answers['borrower_full_name'] ?? ''),

                'borrower_company_number' => (string) ($answers['borrower_company_number'] ?? ''),
                'borrower_registered_office_address' => (string) ($answers['borrower_registered_office_address'] ?? ''),
                'borrower_home_address' => (string) ($answers['borrower_address'] ?? ''),
                'borrower_signatory_name' => (string) ($answers['borrower_signatory_name'] ?? $answers['borrower_full_name'] ?? ''),

                'first_charge_property_address' => (string) ($answers['first_charge_property_address'] ?? ''),
                'second_charge_property_address' => (string) ($answers['second_charge_property_address'] ?? ''),
                'security_additional_notes' => (string) ($answers['security_additional_notes'] ?? ''),
                'personal_guarantor_details' => (string) ($answers['personal_guarantor_details'] ?? ''),
                'personal_guarantor_connection' => (string) ($answers['personal_guarantor_connection'] ?? ''),
                'interest_rate_value' => (string) ($answers['interest_rate_value'] ?? ''),
                'fixed_interest_amount' => $this->asMoney($answers['fixed_interest_amount'] ?? null),
                'additional_borrower_details' => (string) ($answers['additional_borrower_details'] ?? ''),
                'additional_company_info_required' => (string) ($answers['additional_company_info_required'] ?? ''),
            ],

            'flags' => [
                'lender_is_company' => $lenderIsCompany,
                'borrower_is_company' => $borrowerIsCompany,
                'multiple_borrowers' => $multipleBorrowers,

                'has_security' => $hasFirstCharge || $hasSecondCharge || $hasDebenture || $hasPersonalGuarantee,
                'has_first_charge' => $hasFirstCharge,
                'has_second_charge' => $hasSecondCharge,
                'has_debenture' => $hasDebenture,
                'has_personal_guarantee' => $hasPersonalGuarantee,

                'is_property_development' => $isPropertyDevelopment,

                'drawdown_in_stages' => ($answers['drawdown_method'] ?? null) === 'in_stages',

                'interest_fixed_sum' => $interestStructure === 'fixed_amount',
                'interest_yearly' => $interestStructure === 'rate' && $interestPaymentTiming === 'yearly',
                'interest_rolled_up_compound' => $interestStructure === 'rate' && $interestPaymentTiming === 'rolled_up' && $interestCompounds,
                'interest_rolled_up_simple' => $interestStructure === 'rate' && $interestPaymentTiming === 'rolled_up' && ! $interestCompounds,

                'borrower_company_ops_info_required' => ($answers['borrower_company_operations_info_required'] ?? null) === 'yes',

                'lender_assignment_allowed' => $lenderAssignmentAllowed,
                'borrower_assignment_allowed' => $borrowerAssignmentAllowed,

                'jurisdiction_exclusive' => $jurisdictionExclusive,
            ],

            'choices' => [
                'lender_intro_variant' => $lenderIsCompany ? 'company' : 'individual',
                'borrower_intro_variant' => $borrowerIsCompany ? 'company' : 'individual',
                'security_property_variant' => $hasFirstCharge ? 'first_charge' : ($hasSecondCharge ? 'second_charge' : null),
            ],
        ];
    }

    protected function asMoney(mixed $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        return number_format((float) $value, 2, '.', ',');
    }

    protected function numberToWords(int $number): string
    {
        if (class_exists(\NumberFormatter::class)) {
            $fmt = new \NumberFormatter('en_GB', \NumberFormatter::SPELLOUT);
            return ucfirst((string) $fmt->format($number));
        }

        return (string) $number;
    }
}
