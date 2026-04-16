<?php

namespace App\Support\Documents\LoanAgreement;

use NumberFormatter;

final class LoanAgreementAnswerMapper
{
    /**
     * @param array<string, mixed> $answers
     * @return array<string, mixed>
     */
    public function map(array $answers): array
    {
        $agreementDate = $this->string($answers, 'agreement_date');

        $lenderEntityType = $this->string($answers, 'lender_entity_type');
        $borrowerEntityType = $this->string($answers, 'borrower_entity_type');

        $lender = $lenderEntityType === 'company'
            ? $this->mapCompanyParty($answers, 'lender')
            : $this->mapIndividualParty($answers, 'lender');

        $borrower = $borrowerEntityType === 'company'
            ? $this->mapCompanyParty($answers, 'borrower')
            : $this->mapIndividualParty($answers, 'borrower');

        $borrowerCount = $this->int($answers, 'borrower_count') ?? 1;
        $loanAmount = $this->numericString($answers, 'loan_amount');
        $loanTermMonths = $this->int($answers, 'loan_term_months');

        $securityTypes = $this->normalizedSecurityTypes($answers);
        $guarantors = $this->mapGuarantors($answers);

        $interestStructure = $this->string($answers, 'interest_structure');
        $interestPaymentTiming = $this->string($answers, 'interest_payment_timing');
        $repaymentAccountLocation = $this->string($answers, 'repayment_account_location');

        $borrowerOperationalInformationRequired = $this->string($answers, 'borrower_operational_information_required');
        $borrowerOperationalInformationItems = $this->array($answers, 'borrower_operational_information_items');

        $lenderAssignmentAllowed = $this->string($answers, 'lender_assignment_allowed');
        $borrowerAssignmentAllowed = $this->string($answers, 'borrower_assignment_allowed');

        $executionMethod = $this->string($answers, 'execution_method');
        $useDocusignExecution = $this->string($answers, 'use_docusign_execution');

        $exclusiveJurisdiction = $this->string($answers, 'exclusive_jurisdiction');

        $includeBoardResolutions = $this->string($answers, 'include_board_resolutions') === 'yes';
        $includeShareholderResolutions = $this->string($answers, 'include_shareholder_resolutions') === 'yes';
        $requireBankruptcySearch = $this->string($answers, 'require_bankruptcy_search') === 'yes';

        $hasFirstCharge = in_array('first_charge', $securityTypes, true);
        $hasSecondCharge = in_array('second_charge', $securityTypes, true);
        $hasDebenture = in_array('debenture', $securityTypes, true);
        $hasPersonalGuarantee = in_array('personal_guarantee', $securityTypes, true);
        $hasSecurityDocuments = $securityTypes !== [];

        return [
            'agreement_date' => $agreementDate,
            'agreement_year' => $this->extractYear($agreementDate),

            'answering_party_role' => $this->string($answers, 'answering_party_role'),
            'confirm_same_person' => $this->string($answers, 'confirm_same_person'),

            'loan_amount' => $loanAmount,
            'loan_amount_words' => $this->numberToSterlingWords($loanAmount),
            'loan_security_type' => $this->string($answers, 'loan_security_type'),
            'loan_drawdown_type' => $this->string($answers, 'loan_drawdown_type'),
            'loan_term_months' => $loanTermMonths,
            'loan_term_display' => $loanTermMonths ? "{$loanTermMonths} month" . ($loanTermMonths === 1 ? '' : 's') : null,

            'loan_purpose' => $this->string($answers, 'loan_purpose'),
            'purpose_is_property_development' => $this->string($answers, 'purpose_is_property_development'),
            'development_property_address' => $this->string($answers, 'development_property_address'),
            'development_type' => $this->string($answers, 'development_type'),
            'development_exit_strategy' => $this->string($answers, 'development_exit_strategy'),
            'is_property_development' => $this->string($answers, 'purpose_is_property_development') === 'yes',

            'property_control_required' => $this->string($answers, 'property_control_required'),
            'property_control_occupy_restriction' => $this->string($answers, 'property_control_occupy_restriction'),
            'property_control_create_interest_restriction' => $this->string($answers, 'property_control_create_interest_restriction'),
            'property_control_rent_restriction' => $this->string($answers, 'property_control_rent_restriction'),
            'has_property_controls' => $this->string($answers, 'property_control_required') === 'yes',

            'interest_structure' => $interestStructure,
            'fixed_interest_amount' => $this->numericString($answers, 'fixed_interest_amount'),
            'fixed_interest_amount_words' => $this->numberToSterlingWords($this->numericString($answers, 'fixed_interest_amount')),
            'fixed_interest_irrespective_of_duration' => $this->string($answers, 'fixed_interest_irrespective_of_duration'),

            'interest_rate_percent' => $this->numericString($answers, 'interest_rate_percent'),
            'interest_payment_timing' => $interestPaymentTiming,
            'rolled_up_interest_compounds' => $this->string($answers, 'rolled_up_interest_compounds'),
            'default_interest_rate_percent' => $this->numericString($answers, 'default_interest_rate_percent'),

            'is_fixed_interest' => $interestStructure === 'fixed_amount',
            'is_rate_interest' => $interestStructure === 'rate',
            'is_interest_monthly' => $interestStructure === 'rate' && $interestPaymentTiming === 'monthly',
            'is_interest_yearly' => $interestStructure === 'rate' && $interestPaymentTiming === 'yearly',
            'is_interest_rolled_up' => $interestStructure === 'rate' && $interestPaymentTiming === 'rolled_up',
            'is_interest_compounding' => $interestStructure === 'rate'
                && $interestPaymentTiming === 'rolled_up'
                && $this->string($answers, 'rolled_up_interest_compounds') === 'yes',
            'is_interest_simple_rolled_up' => $interestStructure === 'rate'
                && $interestPaymentTiming === 'rolled_up'
                && $this->string($answers, 'rolled_up_interest_compounds') === 'no',

            'repayment_account_location' => $repaymentAccountLocation,
            'repayment_overseas_bank_country' => $this->string($answers, 'repayment_overseas_bank_country'),
            'repayments_to_overseas_account' => $repaymentAccountLocation === 'overseas',

            'security_types' => $securityTypes,
            'security_items' => $this->mapSecurityItems($answers),
            'has_first_charge' => $hasFirstCharge,
            'has_second_charge' => $hasSecondCharge,
            'has_debenture' => $hasDebenture,
            'has_personal_guarantee' => $hasPersonalGuarantee,
            'has_security_documents' => $hasSecurityDocuments,

            'first_charge_property_address' => $this->string($answers, 'first_charge_property_address'),
            'first_charge_title_number' => $this->string($answers, 'first_charge_title_number'),

            'second_charge_property_address' => $this->string($answers, 'second_charge_property_address'),
            'second_charge_title_number' => $this->string($answers, 'second_charge_title_number'),
            'second_charge_consent_required' => $this->string($answers, 'second_charge_consent_required'),
            'requires_second_charge_holder_confirmation' => $hasSecondCharge,

            'debenture_secured_assets_description' => $this->string($answers, 'debenture_secured_assets_description'),

            'guarantors' => $guarantors,
            'guarantor_count' => count($guarantors),

            'borrower_count' => $borrowerCount,
            'has_multiple_borrowers' => $borrowerCount > 1,

            'borrower_operational_information_required' => $borrowerOperationalInformationRequired,
            'borrower_operational_information_items' => $borrowerOperationalInformationItems,
            'has_borrower_operational_information_covenant' => $borrowerEntityType === 'company'
                && $borrowerOperationalInformationRequired === 'yes',
            'has_audited_annual_accounts_covenant' => in_array(
                'audited_annual_accounts',
                $borrowerOperationalInformationItems,
                true
            ),
            'has_monthly_management_accounts_covenant' => in_array(
                'monthly_management_accounts',
                $borrowerOperationalInformationItems,
                true
            ),
            'has_shareholder_or_creditor_notices_covenant' => in_array(
                'shareholder_or_creditor_notices',
                $borrowerOperationalInformationItems,
                true
            ),
            'has_other_reasonably_requested_information_covenant' => in_array(
                'other_reasonably_requested_information',
                $borrowerOperationalInformationItems,
                true
            ),

            'lender_assignment_allowed' => $lenderAssignmentAllowed,
            'borrower_assignment_allowed' => $borrowerAssignmentAllowed,

            'execution_method' => $executionMethod,
            'use_docusign_execution' => $useDocusignExecution,
            'uses_electronic_execution_only' => $executionMethod === 'electronic_only',
            'uses_docusign_execution' => $useDocusignExecution === 'yes',

            'exclusive_jurisdiction' => $exclusiveJurisdiction,
            'jurisdiction_type' => $exclusiveJurisdiction === 'no' ? 'non-exclusive' : 'exclusive',
            'governing_law' => 'England and Wales',

            'include_schedule_1' => true,
            'include_schedule_1_paragraph_1' => $borrowerEntityType === 'company',
            'include_board_resolutions' => $includeBoardResolutions,
            'include_shareholder_resolutions' => $includeShareholderResolutions,
            'require_bankruptcy_search' => $requireBankruptcySearch,
            'include_schedule_1_finance_documents_section' => true,
            'include_schedule_1_security_documents' => $hasSecurityDocuments,
            'include_schedule_1_second_charge_confirmation' => $hasSecondCharge,
            'include_schedule_1_financial_information_section' => true,
            'include_schedule_1_bankruptcy_searches_section' => $requireBankruptcySearch,
            'include_schedule_1_guarantor_bankruptcy_search' => $requireBankruptcySearch && $hasPersonalGuarantee && count($guarantors) > 0,
            'include_schedule_1_other_documents_section' => true,

            'include_guarantors_schedule' => $hasPersonalGuarantee && count($guarantors) > 0,

            'lender' => $lender,
            'borrower' => $borrower,

            'meta' => [
                'document_title' => 'Loan Agreement',
            ],
        ];
    }

    /**
     * @param array<string, mixed> $answers
     * @return array<string, mixed>
     */
    private function mapIndividualParty(array $answers, string $prefix): array
    {
        $firstName = $this->string($answers, "{$prefix}_first_name");
        $middleName = $this->string($answers, "{$prefix}_middle_name");
        $lastName = $this->string($answers, "{$prefix}_last_name");

        $fullName = $this->combineName($firstName, $middleName, $lastName);

        return [
            'entity_type' => 'individual',
            'display_name' => $fullName,
            'full_name' => $fullName,
            'address' => $this->string($answers, "{$prefix}_home_address"),
            'email' => null,
            'company_name' => null,
            'company_number' => null,
            'company_address' => null,
            'is_director' => null,
            'company_position' => null,
            'signatory' => [
                'name' => $fullName,
                'title' => null,
            ],
        ];
    }

    /**
     * @param array<string, mixed> $answers
     * @return array<string, mixed>
     */
    private function mapCompanyParty(array $answers, string $prefix): array
    {
        $companyName = $this->string($answers, "{$prefix}_company_name");
        $companyNumber = $this->string($answers, "{$prefix}_company_number");
        $companyAddress = $this->string($answers, "{$prefix}_company_address");
        $directorWillSign = $this->string($answers, "{$prefix}_director_will_sign");
        $signatoryFirst = $this->string($answers, "{$prefix}_signatory_first_name");
        $signatoryMiddle = $this->string($answers, "{$prefix}_signatory_middle_name");
        $signatoryLast = $this->string($answers, "{$prefix}_signatory_last_name");
        $signatoryName = $this->combineName($signatoryFirst, $signatoryMiddle, $signatoryLast);

        if ($directorWillSign !== 'yes') {
            $signatoryName = null;
        }

        return [
            'entity_type' => 'company',
            'display_name' => $companyName,
            'full_name' => $companyName,
            'address' => $companyAddress,
            'email' => null,
            'company_name' => $companyName,
            'company_number' => $companyNumber,
            'company_address' => $companyAddress,
            'is_director' => $this->string($answers, "{$prefix}_is_director"),
            'company_position' => $this->string($answers, "{$prefix}_company_position"),
            'signatory' => [
                'name' => $signatoryName,
                'title' => $signatoryName
                    ? $this->resolveCompanySignatoryTitle($answers, $prefix)
                    : null,
            ],
        ];
    }

    /**
     * @param array<string, mixed> $answers
     */
    private function resolveCompanySignatoryTitle(array $answers, string $prefix): ?string
    {
        $isDirector = $this->string($answers, "{$prefix}_is_director");
        $companyPosition = $this->string($answers, "{$prefix}_company_position");

        if ($isDirector === 'yes') {
            return 'Director';
        }

        return $companyPosition;
    }

    /**
     * @param array<string, mixed> $answers
     * @return array<int, string>
     */
    private function normalizedSecurityTypes(array $answers): array
    {
        $loanSecurityType = $this->string($answers, 'loan_security_type');

        if ($loanSecurityType !== 'secured') {
            return [];
        }

        $types = $this->array($answers, 'security_types');

        return array_values(array_filter($types, function ($item) use ($answers) {
            if ($item === 'debenture') {
                return $this->string($answers, 'borrower_entity_type') === 'company';
            }

            return in_array($item, ['first_charge', 'second_charge', 'debenture', 'personal_guarantee'], true);
        }));
    }

    /**
     * @param array<string, mixed> $answers
     * @return array<int, array{name: string, connection: ?string, is_director_of_borrower: ?string}>
     */
    private function mapGuarantors(array $answers): array
    {
        $value = $answers['guarantors'] ?? [];

        if (! is_array($value)) {
            return [];
        }

        $result = [];

        foreach ($value as $item) {
            if (! is_array($item)) {
                continue;
            }

            $name = isset($item['name']) && is_string($item['name']) ? trim($item['name']) : '';

            if ($name === '') {
                continue;
            }

            $connection = isset($item['connection']) && is_string($item['connection']) ? trim($item['connection']) : null;
            $isDirector = isset($item['is_director_of_borrower']) && is_string($item['is_director_of_borrower'])
                ? trim($item['is_director_of_borrower'])
                : null;

            $result[] = [
                'name' => $name,
                'connection' => $connection !== '' ? $connection : null,
                'is_director_of_borrower' => $isDirector !== '' ? $isDirector : null,
            ];
        }

        return $result;
    }

    /**
     * @param array<string, mixed> $answers
     * @return array<int, string>
     */
    private function mapSecurityItems(array $answers): array
    {
        $loanSecurityType = $this->string($answers, 'loan_security_type');
        $securityTypes = $this->normalizedSecurityTypes($answers);

        if ($loanSecurityType !== 'secured' || $securityTypes === []) {
            return [];
        }

        $items = [];

        if (in_array('first_charge', $securityTypes, true)) {
            $propertyAddress = $this->string($answers, 'first_charge_property_address');
            $titleNumber = $this->string($answers, 'first_charge_title_number');

            $text = 'A first charge, registered with the Land Registry, on the property';

            if ($propertyAddress) {
                $text .= " at {$propertyAddress}";
            }

            if ($titleNumber) {
                $text .= " with Land Registry title number {$titleNumber}";
            }

            $text .= '.';

            $items[] = $text;
        }

        if (in_array('second_charge', $securityTypes, true)) {
            $propertyAddress = $this->string($answers, 'second_charge_property_address');
            $titleNumber = $this->string($answers, 'second_charge_title_number');
            $consent = $this->string($answers, 'second_charge_consent_required');

            $text = 'A second charge, registered with the Land Registry, on the property';

            if ($propertyAddress) {
                $text .= " at {$propertyAddress}";
            }

            if ($titleNumber) {
                $text .= " with Land Registry title number {$titleNumber}";
            }

            if ($consent === 'yes') {
                $text .= ', with consent required from the first charge holder';
            } elseif ($consent === 'no') {
                $text .= ', with no consent required from the first charge holder';
            } elseif ($consent === 'unknown') {
                $text .= ', where the consent position from the first charge holder is currently unknown';
            }

            $text .= '.';

            $items[] = $text;
        }

        if (
            in_array('debenture', $securityTypes, true) &&
            $this->string($answers, 'borrower_entity_type') === 'company'
        ) {
            $description = $this->string($answers, 'debenture_secured_assets_description');

            $text = 'A debenture filed at Companies House against the Borrower';

            if ($description) {
                $text .= " covering {$description}";
            }

            $text .= '.';

            $items[] = $text;
        }

        if (in_array('personal_guarantee', $securityTypes, true)) {
            $guarantors = $this->mapGuarantors($answers);
            $borrowerIsCompany = $this->string($answers, 'borrower_entity_type') === 'company';

            if ($borrowerIsCompany) {
                $directorGuarantors = array_values(array_filter($guarantors, function (array $guarantor) {
                    return ($guarantor['is_director_of_borrower'] ?? null) === 'yes';
                }));

                if ($directorGuarantors !== []) {
                    $names = array_map(fn(array $g) => $g['name'], $directorGuarantors);

                    $items[] = 'Personal guarantee' . (count($names) > 1 ? 's' : '') . ' of ' . $this->implodeNames($names) . ', ' .
                        $this->describeDirectorGroup(count($names)) .
                        ' of the Borrower, given under separate Deed' . (count($names) > 1 ? 's' : '') . ' of Guarantee.';
                } elseif ($guarantors !== []) {
                    foreach ($guarantors as $guarantor) {
                        $items[] = 'A personal guarantee of ' . $guarantor['name'] . ' given under a separate Deed of Guarantee.';
                    }
                } else {
                    $items[] = 'A personal guarantee given under a separate Deed of Guarantee.';
                }
            } else {
                if ($guarantors !== []) {
                    foreach ($guarantors as $guarantor) {
                        $items[] = 'A personal guarantee of ' . $guarantor['name'] . ' given under a separate Deed of Guarantee.';
                    }
                } else {
                    $items[] = 'A personal guarantee given under a separate Deed of Guarantee.';
                }
            }
        }

        return $items;
    }

    /**
     * @param array<int, string> $names
     */
    private function implodeNames(array $names): string
    {
        $names = array_values(array_filter(array_map('trim', $names)));

        $count = count($names);

        if ($count === 0) {
            return '[ENTER GUARANTOR NAME]';
        }

        if ($count === 1) {
            return $names[0];
        }

        if ($count === 2) {
            return $names[0] . ' and ' . $names[1];
        }

        $last = array_pop($names);

        return implode(', ', $names) . ' and ' . $last;
    }

    private function describeDirectorGroup(int $count): string
    {
        return match ($count) {
            2 => 'both being directors',
            3 => 'all being directors',
            default => 'being a director',
        };
    }

    /**
     * @param array<string, mixed> $answers
     */
    private function string(array $answers, string $key): ?string
    {
        $value = $answers[$key] ?? null;

        if ($value === null) {
            return null;
        }

        if (is_string($value)) {
            $trimmed = trim($value);

            return $trimmed === '' ? null : $trimmed;
        }

        if (is_numeric($value)) {
            return (string) $value;
        }

        return null;
    }

    /**
     * @param array<string, mixed> $answers
     */
    private function int(array $answers, string $key): ?int
    {
        $value = $answers[$key] ?? null;

        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        return null;
    }

    /**
     * @param array<string, mixed> $answers
     */
    private function numericString(array $answers, string $key): ?string
    {
        $value = $answers[$key] ?? null;

        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            $number = (float) $value;

            return fmod($number, 1.0) === 0.0
                ? number_format((int) $number, 0, '.', '')
                : rtrim(rtrim(number_format($number, 2, '.', ''), '0'), '.');
        }

        if (is_string($value)) {
            $normalized = preg_replace('/[^\d.]/', '', $value ?? '');

            return $normalized !== '' ? $normalized : null;
        }

        return null;
    }

    /**
     * @param array<string, mixed> $answers
     * @return array<int, string>
     */
    private function array(array $answers, string $key): array
    {
        $value = $answers[$key] ?? [];

        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter(array_map(function ($item) {
            if (is_string($item)) {
                $trimmed = trim($item);

                return $trimmed === '' ? null : $trimmed;
            }

            if (is_numeric($item)) {
                return (string) $item;
            }

            return null;
        }, $value)));
    }

    private function combineName(?string $firstName, ?string $middleName, ?string $lastName): string
    {
        return trim(implode(' ', array_values(array_filter([
            $firstName,
            $middleName,
            $lastName,
        ]))));
    }

    private function extractYear(?string $date): ?string
    {
        if (! $date) {
            return null;
        }

        $timestamp = strtotime($date);

        return $timestamp ? date('Y', $timestamp) : null;
    }

    private function numberToSterlingWords(?string $amount): ?string
    {
        if (! $amount || ! class_exists(NumberFormatter::class)) {
            return null;
        }

        $number = (float) $amount;
        $whole = (int) floor($number);
        $decimal = (int) round(($number - $whole) * 100);

        $formatter = new NumberFormatter('en_GB', NumberFormatter::SPELLOUT);

        $words = ucfirst((string) $formatter->format($whole));

        if ($decimal > 0) {
            $decimalWords = (string) $formatter->format($decimal);

            return "{$words} and {$decimalWords} Pence Sterling";
        }

        return "{$words} Sterling";
    }
}
