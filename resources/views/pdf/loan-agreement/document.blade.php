<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Loan Agreement</title>
    @include('pdf.loan-agreement._styles')
</head>

<body style="font-family: DejaVu Sans, sans-serif; font-size: 11pt; line-height: 1.45; color: #000;">

    @php
        use Carbon\Carbon;

        $agreementDate = $data['agreement_date'] ?? null;
        $agreementYear = $data['agreement_year'] ?? '2026';

        $lender = $data['lender'] ?? [];
        $borrower = $data['borrower'] ?? [];

        $lenderIsCompany = ($lender['entity_type'] ?? null) === 'company';
        $borrowerIsCompany = ($borrower['entity_type'] ?? null) === 'company';

        $displayDateLine = $agreementDate ? Carbon::parse($agreementDate)->format('F j, Y') : '_____________________';

        $loanAmountRaw = $data['loan_amount'] ?? null;
        $loanAmount = is_numeric($loanAmountRaw) ? number_format((float) $loanAmountRaw, 2) : '[ENTER AMOUNT HERE]';
        $loanAmountWords = $data['loan_amount_words'] ?? '[amount in words] Sterling';
        $loanSecurityType = $data['loan_security_type'] ?? null;

        $lenderDisplayName =
            $lender['display_name'] ??
            ($lenderIsCompany
                ? $lender['company_name'] ?? '[LENDER’S FULL NAME]'
                : $lender['full_name'] ?? '[LENDER’S FULL NAME]');

        $borrowerDisplayName =
            $borrower['display_name'] ??
            ($borrowerIsCompany
                ? $borrower['company_name'] ?? '[BORROWER’S FULL NAME]'
                : $borrower['full_name'] ?? '[BORROWER’S FULL NAME]');

        $securityItems = $data['security_items'] ?? [];
        $hasFirstCharge = $data['has_first_charge'] ?? false;
        $hasSecondCharge = $data['has_second_charge'] ?? false;
        $hasDebenture = $data['has_debenture'] ?? false;
        $hasPersonalGuarantee = $data['has_personal_guarantee'] ?? false;

        $firstChargePropertyAddress = $data['first_charge_property_address'] ?? null;
        $firstChargeTitleNumber = $data['first_charge_title_number'] ?? null;

        $secondChargePropertyAddress = $data['second_charge_property_address'] ?? null;
        $secondChargeTitleNumber = $data['second_charge_title_number'] ?? null;
        $secondChargeConsentRequired = $data['second_charge_consent_required'] ?? null;

        $debentureSecuredAssetsDescription = $data['debenture_secured_assets_description'] ?? null;

        $pgGuarantorName = $data['pg_guarantor_name'] ?? null;
        $pgGuarantorConnection = $data['pg_guarantor_connection'] ?? null;

        $loanPurpose = $data['loan_purpose'] ?? '[PLEASE ENTER THE AGREED PURPOSE OF THE LOAN HERE]';
        $loanTermMonths = $data['loan_term_months'] ?? null;
        $repaymentsToOverseasAccount = (bool) ($data['repayments_to_overseas_account'] ?? false);
        $repaymentDateText = $loanTermMonths
            ? $loanTermMonths .
                ' months from the date of this agreement or sooner upon mutual agreement between the parties'
            : '[XX] months from the date of this agreement or sooner upon mutual agreement between the parties';

        $isPropertyDevelopment = (bool) ($data['is_property_development'] ?? false);
        $developmentPropertyAddress = $data['development_property_address'] ?? null;

        $hasPropertySecurity = $hasFirstCharge || $hasSecondCharge;
        $useLandDefinition = $hasPropertySecurity;

        $borrowerCount = (int) ($data['borrower_count'] ?? 1);
        $hasMultipleBorrowers = $borrowerCount > 1;

        $interestStructure = $data['interest_structure'] ?? null;
        $interestPaymentTiming = $data['interest_payment_timing'] ?? null;
        $showInterestPeriodDefinition =
            $interestStructure === 'rate' && in_array($interestPaymentTiming, ['monthly', 'yearly'], true);

        $guarantors = $data['guarantors'] ?? [];
        $securityDocuments = [];

        if ($hasFirstCharge) {
            $securityDocuments[] = 'a First Charge';
        }

        if ($hasSecondCharge) {
            $securityDocuments[] = 'a Second Charge';
        }

        if ($hasDebenture) {
            $securityDocuments[] =
                'a floating charge debenture on all of the Borrower’s unattached plant, machinery, chattels and goods now or at any time after the date of this agreement on or in or used in connection with the business of the Borrower (the “Debenture”)';
        }

        if ($hasPersonalGuarantee && is_array($guarantors)) {
            foreach ($guarantors as $guarantor) {
                $guarantorName = trim((string) ($guarantor['name'] ?? ''));
                if ($guarantorName !== '') {
                    $securityDocuments[] =
                        'a Deed of Guarantee entered into on this date by ' .
                        $guarantorName .
                        ' that shall guarantee the repayment of the Loan amount and any accrued interest to the Lender as well as indemnifying the Lender against any loss or expense incurred or suffered as a result of any breach of this agreement by the Borrower';
                }
            }
        }

        $landTitleNumber = $hasFirstCharge
            ? ($firstChargeTitleNumber ?:
            '[ENTER TITLE NUMBER HERE]')
            : ($secondChargeTitleNumber ?:
            '[ENTER TITLE NUMBER HERE]');

        $landAddress = $hasFirstCharge
            ? ($firstChargePropertyAddress ?:
            ($developmentPropertyAddress ?:
            '[ENTER DEVELOPMENT ADDRESS THAT MAY HAVE THE CHARGE HERE]'))
            : ($secondChargePropertyAddress ?:
            ($developmentPropertyAddress ?:
            '[ENTER DEVELOPMENT ADDRESS THAT MAY HAVE THE CHARGE HERE]'));
    @endphp

    @include('pdf.loan-agreement.components.cover-page')

    <div class="page-break"></div>

    @include('pdf.loan-agreement.components.parties')
    @include('pdf.loan-agreement.components.background')

    @include('pdf.loan-agreement.clauses.clause-1-definitions')
    @include('pdf.loan-agreement.clauses.clause-2-facility')
    @include('pdf.loan-agreement.clauses.clause-3-purpose')
    @include('pdf.loan-agreement.clauses.clause-4-term')
    @include('pdf.loan-agreement.clauses.clause-5-development-obligations')
    @include('pdf.loan-agreement.clauses.clause-6-conditions-precedent')
    @include('pdf.loan-agreement.clauses.clause-7-interest')
    @include('pdf.loan-agreement.clauses.clause-8-repayment')
    @include('pdf.loan-agreement.clauses.clause-9-costs')
    @include('pdf.loan-agreement.clauses.clause-10-payments')

    <div class="page-break"></div>

    @include('pdf.loan-agreement.components.signature-page')
</body>

</html>
