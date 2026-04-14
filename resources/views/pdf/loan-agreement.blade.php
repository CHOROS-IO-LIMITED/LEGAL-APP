<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Loan Agreement</title>
    <style>
        @page {
            margin-top: 26mm;
            margin-right: 20mm;
            margin-bottom: 24mm;
            margin-left: 20mm;
        }

        .page-break {
            page-break-before: always;
        }
    </style>
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
    @endphp

    {{-- COVER PAGE --}}
    <div style="text-align: center; padding-top: 110px;">

        <div style="font-size: 14pt; font-weight: 700; text-transform: uppercase; margin-bottom: 40px;">
            DATED {{ $agreementYear }}
        </div>

        <div style="font-size: 24pt; font-weight: 700; text-transform: uppercase; margin-bottom: 28px;">
            LOAN AGREEMENT
        </div>

        <div style="font-size: 14pt; margin-bottom: 28px;">
            Between
        </div>

        <div style="font-size: 14pt; font-weight: 700; margin-bottom: 14px;">
            (1) {{ $lenderDisplayName }}
        </div>

        <div style="font-size: 14pt; margin-bottom: 14px;">
            and
        </div>

        <div style="font-size: 14pt; font-weight: 700;">
            (2) {{ $borrowerDisplayName }}
        </div>

    </div>

    <div class="page-break"></div>

    {{-- BETWEEN PAGE --}}
    <div style="margin-bottom: 14px;">
        This agreement is dated {{ $displayDateLine }}
    </div>

    <div style="font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">
        BETWEEN
    </div>

    <table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                (1)
            </td>
            <td style="vertical-align: top;">
                @if ($lenderIsCompany)
                    <strong>{{ $lender['company_name'] ?? '[Company Name]' }}</strong>, a company incorporated in
                    England and Wales with company number {{ $lender['company_number'] ?? '[ENTER COMPANY NUMBER]' }}
                    whose registered offices is at
                    {{ $lender['company_address'] ?? '[ENTER REGISTERED OFFICE ADDRESS]' }}
                    (the <strong>“Lender”</strong>).
                @else
                    <strong>{{ $lender['full_name'] ?? '[Individual’s Name]' }}</strong> of
                    {{ $lender['address'] ?? '[ENTER HOME ADDRESS OF INDIVIDUAL]' }}
                    (the <strong>“Lender”</strong>); and
                @endif
            </td>
        </tr>
    </table>

    <table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                (2)
            </td>
            <td style="vertical-align: top;">
                @if ($borrowerIsCompany)
                    <strong>{{ $borrower['company_name'] ?? '[Company Name]' }}</strong>, a company incorporated in
                    England and Wales with company number {{ $borrower['company_number'] ?? '[ENTER COMPANY NUMBER]' }}
                    whose registered offices is at
                    {{ $borrower['company_address'] ?? '[ENTER REGISTERED OFFICE ADDRESS]' }}
                    (the <strong>“Borrower”</strong>).
                @else
                    <strong>{{ $borrower['full_name'] ?? '[Individual’s Name]' }}</strong> of
                    {{ $borrower['address'] ?? '[ENTER HOME ADDRESS OF INDIVIDUAL]' }}
                    (the <strong>“Borrower”</strong>).
                @endif
            </td>
        </tr>
    </table>

    <div style="font-weight: 700; text-transform: uppercase; margin-top: 16px; margin-bottom: 8px;">
        BACKGROUND
    </div>

    <table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                (A)
            </td>
            <td style="vertical-align: top;">
                The Lender has agreed to provide the Borrower with a
                {{ $loanSecurityType === 'secured' ? 'secured' : 'unsecured' }}
                term loan of
                £{{ $loanAmount ?: '[ENTER AMOUNT HERE]' }}
                ({{ $loanAmountWords ?: '[amount in words] Sterling' }})
                under the terms of the agreement below.
            </td>
        </tr>
    </table>

    @if ($loanSecurityType === 'secured' && !empty($securityItems))
        <table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
            <tr>
                <td style="width: 30px; vertical-align: top;">
                    (B)
                </td>
                <td style="vertical-align: top;">
                    As security of its obligations under this agreement, the Borrower wishes to offer the
                    Lender the following securities:
                </td>
            </tr>
        </table>

        <div style="margin-left: 30px; margin-bottom: 14px;">
            @foreach ($securityItems as $index => $item)
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">
                            {{ $index === 0 ? 'i.' : ($index === 1 ? 'ii.' : ($index === 2 ? 'iii.' : $index + 1 . '.')) }}
                        </td>
                        <td style="vertical-align: top;">
                            {{ $item }}
                        </td>
                    </tr>
                </table>
            @endforeach
        </div>
    @endif

    <div style="font-weight: 700; margin-top: 16px; margin-bottom: 8px;">
        Agreed terms
    </div>

    <table style="width: 100%; margin-bottom: 6px; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                1.
            </td>
            <td style="vertical-align: top;">
                <strong>DEFINITIONS AND INTERPRETATION</strong>
            </td>
        </tr>
    </table>

    <table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                1.1
            </td>
            <td style="vertical-align: top;">
                <strong>Definitions</strong>
            </td>
        </tr>
    </table>

    @php
        $loanPurpose = $data['loan_purpose'] ?? '[PLEASE ENTER THE AGREED PURPOSE OF THE LOAN HERE]';
        $loanTermMonths = $data['loan_term_months'] ?? null;
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

    <table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;"></td>
            <td style="vertical-align: top;">
                The following definitions apply in this agreement:
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px; vertical-align: top;"></td>
            <td style="vertical-align: top;">
                <strong>Borrowed Money:</strong> any indebtedness the Borrower owes as a result of:
            </td>
        </tr>
    </table>

    <div style="margin-left: 60px; margin-bottom: 10px;">

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(a)</td>
                <td style="vertical-align: top;">
                    borrowing or raising money (with or without security), including any premium
                    and any capitalised interest on that money;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(b)</td>
                <td style="vertical-align: top;">
                    any bond, note, loan stock, commercial paper or similar instrument;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(c)</td>
                <td style="vertical-align: top;">
                    any acceptance credit facility or dematerialised equivalent, bill-discounting,
                    note purchase or documentary credit facilities;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(d)</td>
                <td style="vertical-align: top;">
                    monies raised by selling, assigning or discounting receivables or other
                    financial assets on terms that recourse may be had to the Borrower if those
                    receivables or financial assets are not paid when due;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(e)</td>
                <td style="vertical-align: top;">
                    any deferred payment for assets or services acquired, other than trade credit
                    that is given in the ordinary course of trading and which does not involve any
                    deferred payment of any amount for more than 60 days;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(f)</td>
                <td style="vertical-align: top;">
                    any rental or hire charges under finance leases (whether for land, machinery,
                    equipment or otherwise);
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(g)</td>
                <td style="vertical-align: top;">
                    any counter-indemnity obligation in respect of any guarantee, bond, indemnity,
                    standby letter of credit or other instrument issued by a third party in
                    connection with the Borrower’s performance of contracts;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(h)</td>
                <td style="vertical-align: top;">
                    any other transaction that has the commercial effect of borrowing (including any
                    forward sale or purchase agreement and any liabilities which are not shown as
                    borrowed money on the Borrower’s balance sheet because they are contingent,
                    conditional or otherwise);
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(i)</td>
                <td style="vertical-align: top;">
                    any derivative transaction entered into in connection with protection against or
                    benefit from fluctuation in any rate or price (and when calculating the value of
                    any derivative transaction, only the mark to market value shall be taken into
                    account); and
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(j)</td>
                <td style="vertical-align: top;">
                    any guarantee, counter-indemnity or other assurances against financial loss that
                    the Borrower has given for any of the items referred to in paragraphs (a) to (i)
                    of this definition incurred by any person.
                </td>
            </tr>
        </table>

    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px; vertical-align: top;"></td>
            <td style="vertical-align: top;">
                When calculating Borrowed Money, no liability shall be taken into account more than once.
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Business Day:</strong> a day other than a Saturday, Sunday or public holiday in England when
                banks in London are open for business.
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Change of Control:</strong> includes (without limitation) the sale, transfer, or other disposal
                (in a single transaction or a series of related transactions) of more than 50% of the issued share
                capital or voting rights of a corporate body, or any arrangement which results in another person or
                entity obtaining effective control of the Company by virtue of obtaining the ability to direct the
                affairs of that corporate body, whether by virtue of ownership of shares, voting rights, contract or
                otherwise.
            </td>
        </tr>
    </table>

    @if ($hasDebenture)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px;"></td>
                <td>
                    <strong>Debenture:</strong> shall have the meaning set out under the Security Documents definition
                    in this clause 1.1.
                </td>
            </tr>
        </table>
    @endif

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Event of Default:</strong> any event or circumstance listed in clause 17.1 to clause 17.15.
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Finance Document:</strong> this
                agreement{{ $loanSecurityType === 'secured' ? ' and the Security Documents' : '' }}.
            </td>
        </tr>
    </table>

    @if ($hasSecondCharge)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px;"></td>
                <td>
                    <strong>First Charge:</strong>
                    @if ($hasFirstCharge)
                        a first charge by way of legal mortgage formally registered at the Land Registry against the
                        title of the Property.
                    @else
                        a first charge by way of legal mortgage formally registered at the Land Registry against the
                        title of the Property held by the first charge holder on or around the date of this agreement.
                    @endif
                </td>
            </tr>
        </table>
    @endif

    @if ($hasPersonalGuarantee)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px;"></td>
                <td>
                    <strong>Guarantors:</strong> Those persons detailed in Schedule 2 who will guarantee and indemnify
                    the Lender against all losses suffered or costs incurred by the default of any action of the
                    Borrower in the agreement.
                </td>
            </tr>
        </table>
    @endif

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Indebtedness:</strong> any obligation to pay or repay money, present or future, whether actual
                or contingent, sole or joint and any guarantee or indemnity of any of those obligations.
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Interest:</strong> shall have the meaning given to it in clause 7.1.
            </td>
        </tr>
    </table>

    @if ($showInterestPeriodDefinition)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px;"></td>
                <td>
                    <strong>Interest Period:</strong> shall have the meaning given to it in clause 7.1.
                </td>
            </tr>
        </table>
    @endif

    @if ($useLandDefinition)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px;"></td>
                <td>
                    <strong>Land:</strong> The leasehold / freehold property known as {{ $landAddress }} holding Land
                    Registry title number {{ $landTitleNumber }}.
                </td>
            </tr>
        </table>
    @endif

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Loan:</strong> the principal amount of the loan as set out in clause 2 below that is made or to
                be made by the Lender to the Borrower under this agreement or (as the context requires) the principal
                amount outstanding for the time being of that loan.
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Loan Term:</strong> shall have the meaning given to it in clause 4.1.
            </td>
        </tr>
    </table>

    @if ($hasPersonalGuarantee)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px;"></td>
                <td>
                    <strong>Personal Guarantee{{ count($guarantors) > 1 ? 's' : '' }}:</strong>
                    The Deed{{ count($guarantors) > 1 ? 's' : '' }} of Guarantee as set out in the Security Documents.
                </td>
            </tr>
        </table>
    @endif

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Potential Event of Default:</strong> any event or circumstance specified in clause 17 that
                would, on the giving of notice, expiry of any grace period or making of any determination under the
                Finance Documents, or satisfaction of any other condition (or any combination thereof), become an Event
                of Default.
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Purpose:</strong> shall have the meaning given to it in clause 3.1.
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>RAO:</strong> The Financial Services and Markets Act 2000 (Regulated Activities) Order 2001 (SI
                2001/544).
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Repayment Date:</strong> {{ $repaymentDateText }}.
            </td>
        </tr>
    </table>

    @if ($hasPropertySecurity)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px;"></td>
                <td>
                    <strong>Restriction:</strong> shall have the meaning given to it in clause 11.2.
                </td>
            </tr>
        </table>
    @endif

    @if ($hasSecondCharge)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px;"></td>
                <td>
                    <strong>Second Charge:</strong> second charge by way of legal mortgage formally registered at the
                    Land Registry against the title of the Property.
                </td>
            </tr>
        </table>
    @endif

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Security:</strong> any mortgage, charge (whether fixed or floating, legal or equitable), pledge,
                lien, assignment by way of security or other security interest securing any obligation of any person or
                any other agreement or arrangement having a similar effect.
            </td>
        </tr>
    </table>

    @if ($loanSecurityType === 'secured' && !empty($securityDocuments))
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px;"></td>
                <td>
                    <strong>Security Documents:</strong>
                </td>
            </tr>
        </table>

        <div style="margin-left: 30px; margin-bottom: 14px;">
            @foreach ($securityDocuments as $index => $securityDocument)
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">
                            {{ chr(97 + $index) }})
                        </td>
                        <td style="vertical-align: top;">
                            {{ $securityDocument }};
                        </td>
                    </tr>
                </table>
            @endforeach

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                <tr>
                    <td style="width: 30px;"></td>
                    <td style="width: 30px; vertical-align: top;">
                        {{ chr(97 + count($securityDocuments)) }})
                    </td>
                    <td style="vertical-align: top;">
                        any other document which confers a Security on the Lender or constitutes a guarantee,
                        indemnity or other assurance in favour of the Lender.
                    </td>
                </tr>
            </table>
        </div>
    @endif

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px;"></td>
            <td>
                <strong>Sterling and £:</strong> the lawful currency for the time being of the United Kingdom.
            </td>
        </tr>
    </table>

    <table style="width: 100%; margin: 14px 0 8px 0; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                1.2
            </td>
            <td style="vertical-align: top;">
                <strong>Interpretation</strong>
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px; vertical-align: top;"></td>
            <td style="vertical-align: top;">
                In this agreement:
            </td>
        </tr>
    </table>

    <div style="margin-left: 30px; margin-bottom: 12px;">

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(a)</td>
                <td style="vertical-align: top;">
                    Clause{{ $useLandDefinition ? ', Schedule' : '' }} and paragraph headings shall not affect the
                    interpretation of this agreement;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(b)</td>
                <td style="vertical-align: top;">
                    a reference to a person shall include a reference to an individual, firm, company, corporation,
                    partnership, unincorporated body of persons, government, state or agency of a state or any
                    association, trust, joint venture or consortium (whether or not having separate legal personality);
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(c)</td>
                <td style="vertical-align: top;">
                    unless the context otherwise requires, words in the singular shall include the plural and in the
                    plural
                    shall include the singular;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(d)</td>
                <td style="vertical-align: top;">
                    unless the context otherwise requires, a reference to one gender shall include a reference to the
                    other
                    genders;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(e)</td>
                <td style="vertical-align: top;">
                    a reference to a party shall include that party's successors, permitted assigns and permitted
                    transferees and this agreement shall be binding on, and enure to the benefit of, the parties to this
                    agreement and their respective personal representatives, successors, permitted assigns and permitted
                    transferees;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(f)</td>
                <td style="vertical-align: top;">
                    a reference to a statute or statutory provision is a reference to it as amended, extended or
                    re-enacted
                    from time to time;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(g)</td>
                <td style="vertical-align: top;">
                    a reference to a statute or statutory provision shall include all subordinate legislation made from
                    time
                    to time under that statute or statutory provision;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(h)</td>
                <td style="vertical-align: top;">
                    a reference to a time of day is to London time;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(i)</td>
                <td style="vertical-align: top;">
                    a reference to writing or written includes fax and email;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(j)</td>
                <td style="vertical-align: top;">
                    an obligation on a party not to do something includes an obligation not to allow that thing to be
                    done;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(k)</td>
                <td style="vertical-align: top;">
                    a reference to this agreement{{ $loanSecurityType === 'secured' ? ' or a Finance Document' : '' }}
                    (or any provision of it) or to any other agreement or document referred to in this agreement
                    {{ $loanSecurityType === 'secured' ? 'or any Finance Document ' : '' }}
                    is a reference to this agreement or that
                    {{ $loanSecurityType === 'secured' ? 'Finance Document' : 'document' }}, as amended (in each case,
                    other than in breach of the provisions of this agreement) from time to time;
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(l)</td>
                <td style="vertical-align: top;">
                    unless the context otherwise requires, a reference to a clause
                    {{ $useLandDefinition ? ' or Schedule' : '' }}
                    is to a clause of this agreement
                    {{ $useLandDefinition ? ' or Schedule to this agreement, and a reference to a paragraph is to a paragraph of the relevant Schedule' : '' }};
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(m)</td>
                <td style="vertical-align: top;">
                    any words following the terms including, include, in particular, for example or any similar
                    expression
                    shall be construed as illustrative and shall not limit the sense of the words, description,
                    definition,
                    phrase or term preceding those terms; and
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(n)</td>
                <td style="vertical-align: top;">
                    a reference to continuing in relation to an Event of Default means an Event of Default that has not
                    been
                    remedied or waived.
                </td>
            </tr>
        </table>

        @if ($useLandDefinition)
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                <tr>
                    <td style="width: 30px;"></td>
                    <td style="width: 30px; vertical-align: top;">(o)</td>
                    <td style="vertical-align: top;">
                        Any reference in this agreement to a charge or mortgage of, or over, the Property includes:
                    </td>
                </tr>
            </table>

            <div style="margin-left: 40px; margin-bottom: 12px;">

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(i)</td>
                        <td style="vertical-align: top;">
                            All buildings and fixtures and fittings which are situated on, or form part, of the Property
                            at any time;
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(ii)</td>
                        <td style="vertical-align: top;">
                            The proceeds of sale of any part of the Property and any other monies paid or payable in
                            respect of or in connection with the Property;
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(iii)</td>
                        <td style="vertical-align: top;">
                            The benefit of any covenants for title given, or entered into, by any predecessor in title
                            of the Borrowers in respect of the Property and any monies paid or payable in respect of
                            those covenants; and
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(iv)</td>
                        <td style="vertical-align: top;">
                            All rights under any licence, agreement for sale or agreement for lease in respect of the
                            Property.
                        </td>
                    </tr>
                </table>

            </div>
        @endif

    </div>

    <table style="width: 100%; margin: 14px 0 8px 0; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                1.3
            </td>
            <td style="vertical-align: top;">
                <strong>Schedules</strong>
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
        <tr>
            <td style="width: 30px; vertical-align: top;"></td>
            <td style="vertical-align: top;">
                The Schedules forms part of this agreement and shall have effect as if set out in full in the body of
                this agreement. Any reference to this agreement includes the Schedules.
            </td>
        </tr>
    </table>

    <table style="width: 100%; margin: 14px 0 8px 0; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                2.
            </td>
            <td style="vertical-align: top;">
                <strong>THE FACILITY</strong>
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                2.1
            </td>
            <td style="vertical-align: top;">
                On the date of this agreement the Lender grants to the Borrower an
                {{ $loanSecurityType === 'secured' ? 'secured' : 'unsecured' }}
                Sterling loan of £{{ $loanAmount }} ({{ $loanAmountWords }})
                on the terms and subject to the conditions of this agreement.
            </td>
        </tr>
    </table>

    @if (($data['loan_drawdown_type'] ?? null) === 'in_stages')
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px; vertical-align: top;">2.2</td>
                <td style="vertical-align: top;">
                    The Borrower may draw down the Loan in parts and at any time during the Loan Term.
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px; vertical-align: top;">2.3</td>
                <td style="vertical-align: top;">
                    There is no minimum or maximum amount that can be borrowed in each drawdown (up to the total amount
                    of the Loan).
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px; vertical-align: top;">2.4</td>
                <td style="vertical-align: top;">
                    Interest shall only accrue from the date of actual borrowing for each drawn amount.
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px; vertical-align: top;">2.5</td>
                <td style="vertical-align: top;">
                    Unless the Borrower draws down the Loan on the date of this agreement, the Borrower shall give the
                    Lender at least two Business Days’ notice of the date on which the Borrower wishes to draw down the
                    Loan specifying the amount, the Business Day for drawdown, and the bank account for payment. Any
                    notice given under this clause shall be irrevocable.
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
            <tr>
                <td style="width: 30px; vertical-align: top;">2.6</td>
                <td style="vertical-align: top;">
                    The total of all amounts drawn down shall not exceed the total amount of the Loan.
                </td>
            </tr>
        </table>
    @endif

    <table style="width: 100%; margin: 14px 0 8px 0; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                3.
            </td>
            <td style="vertical-align: top;">
                <strong>PURPOSE</strong>
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                3.1
            </td>
            <td style="vertical-align: top;">
                The Borrower shall only use the Loan for {{ $loanPurpose }} (the “Purpose”).
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                3.2
            </td>
            <td style="vertical-align: top;">
                The Lender is entitled to but not obliged to monitor or verify how any amount advanced under this
                agreement is used.
            </td>
        </tr>
    </table>

    <table style="width: 100%; margin: 14px 0 8px 0; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                4.
            </td>
            <td style="vertical-align: top;">
                <strong>TERM</strong>
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                4.1
            </td>
            <td style="vertical-align: top;">
                The term of this Loan is for the period from and including the date of this agreement to and including
                the Repayment Date (the “Loan Term”).
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                4.2
            </td>
            <td style="vertical-align: top;">
                If the Purpose fails to complete for whatever reason, or has not completed by the end of the Loan Term,
                then the full sum of the Loan shall be payable immediately to the Lender with the accrued Interest
                (defined below).
            </td>
        </tr>
    </table>

    @if ($isPropertyDevelopment || $useLandDefinition)
        <table style="width: 100%; margin: 14px 0 8px 0; border-collapse: collapse;">
            <tr>
                <td style="width: 30px; vertical-align: top;">
                    5.
                </td>
                <td style="vertical-align: top;">
                    <strong>DEVELOPMENT OBLIGATIONS</strong>
                </td>
            </tr>
        </table>

        @if ($isPropertyDevelopment)
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
                <tr>
                    <td style="width: 30px; vertical-align: top;">
                        5.1
                    </td>
                    <td style="vertical-align: top;">
                        Where the Property (or any buildings thereon) are to be developed, the Borrower agrees with the
                        Lender that it will:
                    </td>
                </tr>
            </table>

            <div style="margin-left: 30px; margin-bottom: 12px;">

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(a)</td>
                        <td style="vertical-align: top;">
                            At all times comply with all local consents including planning permission and building
                            regulation approval that are required in relation to any developments on the Property or any
                            land forming part of the Property; and
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(b)</td>
                        <td style="vertical-align: top;">
                            provide such evidence as shall be required to prove that any new property erected on the
                            Property, or any land forming part of the Property, has been properly registered with the
                            National House Building Council or provide such other warranty or insurance as may be
                            required to comply with this obligation.
                        </td>
                    </tr>
                </table>

            </div>
        @endif

        @if ($useLandDefinition)
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
                <tr>
                    <td style="width: 30px; vertical-align: top;">
                        {{ $isPropertyDevelopment ? '5.2' : '5.1' }}
                    </td>
                    <td style="vertical-align: top;">
                        In relation to the Property:
                    </td>
                </tr>
            </table>

            <div style="margin-left: 30px; margin-bottom: 12px;">

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(a)</td>
                        <td style="vertical-align: top;">
                            the Borrower is the legal and beneficial owner of the Property and has good and marketable
                            title to the Property;
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(b)</td>
                        <td style="vertical-align: top;">
                            @if ($hasSecondCharge)
                                save for the First Charge, the Property is free from any Security other than the
                                Security created by this agreement;
                            @elseif ($hasFirstCharge)
                                the Property is free from any Security other than the Security created by this
                                agreement;
                            @else
                                the Property is free from any Security;
                            @endif
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(c)</td>
                        <td style="vertical-align: top;">
                            the Borrowers have not received or acknowledged notice of any adverse claim by any person in
                            respect of the Property or any interest in it;
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(d)</td>
                        <td style="vertical-align: top;">
                            there are no covenants, agreements, reservations, conditions, interests, rights or other
                            matters whatsoever, which materially adversely affect the Property;
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(e)</td>
                        <td style="vertical-align: top;">
                            there is no breach of any law or regulation which materially adversely affects the Property;
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(f)</td>
                        <td style="vertical-align: top;">
                            no facility necessary for the enjoyment and use of the Property is subject to terms
                            entitling any person to terminate or curtail its use;
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(g)</td>
                        <td style="vertical-align: top;">
                            nothing has arisen, has been created or is subsisting which would be an overriding interest
                            in the Property; and
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
                    <tr>
                        <td style="width: 30px;"></td>
                        <td style="width: 30px; vertical-align: top;">(h)</td>
                        <td style="vertical-align: top;">
                            there is no prohibition on the Borrower assigning its rights in the Property and the entry
                            into this agreement by the Borrower does not and will not constitute a breach of any policy,
                            agreement, document or instrument binding on the Borrower or its assets.
                        </td>
                    </tr>
                </table>

            </div>
        @endif
    @endif

    <table style="width: 100%; margin: 14px 0 8px 0; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                6.
            </td>
            <td style="vertical-align: top;">
                <strong>CONDITIONS PRECEDENT</strong>
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                6.1
            </td>
            <td style="vertical-align: top;">
                The Borrower may not give notice to draw the Loan unless the Lender has received all the documents and
                evidence specified in Schedule 1 in a form and substance satisfactory to the Lender.
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                6.2
            </td>
            <td style="vertical-align: top;">
                The Lender's obligation to make the Loan is subject to the further conditions precedent that:
            </td>
        </tr>
    </table>

    <div style="margin-left: 30px; margin-bottom: 12px;">

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(a)</td>
                <td style="vertical-align: top;">
                    the representations and warranties in clause 14 are true and correct and will be true and correct
                    immediately after the Lender has made the proposed Loan; and
                </td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr>
                <td style="width: 30px;"></td>
                <td style="width: 30px; vertical-align: top;">(b)</td>
                <td style="vertical-align: top;">
                    no Event of Default or Potential Event of Default is continuing or would result from the proposed
                    Loan.
                </td>
            </tr>
        </table>

    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                6.3
            </td>
            <td style="vertical-align: top;">
                The conditions specified in this clause 6 are inserted solely for the Lender's benefit. The Lender may
                waive them, in whole or in part and with or without conditions, without prejudicing the Lender's right
                to require subsequent fulfilment of such conditions.
            </td>
        </tr>
    </table>

    <table style="width: 100%; margin: 14px 0 8px 0; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                7.
            </td>
            <td style="vertical-align: top;">
                <strong>INTEREST</strong>
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                7.1
            </td>
            <td style="vertical-align: top;">
                @if ($data['is_fixed_interest'] ?? false)
                    The Borrower shall pay to the Lender, on the Repayment Date, the sum of
                    £{{ is_numeric($data['fixed_interest_amount'] ?? null) ? number_format((float) $data['fixed_interest_amount'], 2) : '[ENTER AGREED TERM INTEREST]' }}
                    as interest on the Loan (the
                    “Interest”){{ ($data['fixed_interest_irrespective_of_duration'] ?? null) === 'yes' ? ' irrespective of the duration of the Loan Term' : '' }}.
                @elseif ($data['is_interest_yearly'] ?? false)
                    The Borrower shall pay to the Lender interest equal to
                    {{ $data['interest_rate_percent'] ?? '[ENTER AMOUNT]' }}%
                    of the Loan amount per year (the “Interest”). The Interest shall be paid yearly, in full, on the
                    anniversary of this agreement (an “Interest Period”). If the Repayment Date occurs during an
                    Interest Period, the Interest due on the Repayment Date for that final Interest Period shall be
                    calculated as 1/365 of the Interest due for each day between the end date of the last Interest
                    Period and the Repayment Date.
                @elseif ($data['is_interest_compounding'] ?? false)
                    The Borrower shall pay to the Lender interest (“Interest”) equal to
                    {{ $data['interest_rate_percent'] ?? '[ENTER AMOUNT]' }}%
                    of the Loan amount per year. The Interest shall be compounding yearly and paid in full on the
                    Repayment Date. For the avoidance of doubt, the term compounding implies that the Interest payable
                    during the second year shall be
                    {{ $data['interest_rate_percent'] ?? '[ENTER AMOUNT]' }}%
                    of the sum of the Loan and the Interest due for the first year combined. Likewise, the Interest
                    payable in the third year shall be
                    {{ $data['interest_rate_percent'] ?? '[ENTER AMOUNT]' }}%
                    of the sum of the Loan and Interest due for the first and second years combined, and so on.
                @elseif ($data['is_interest_simple_rolled_up'] ?? false)
                    The Borrower shall pay to the Lender simple interest (“Interest”) equal to
                    {{ $data['interest_rate_percent'] ?? '[ENTER AMOUNT]' }}%
                    of the Loan amount per year. The Interest shall not be compounding yearly, but will be paid in full
                    on the Repayment Date. For the avoidance of doubt, so long as the Loan amount does not change, the
                    amount of interest payable in the second and subsequent years shall be the same as the first year
                    and no interest shall be payable on the accrued Interest over the Loan Term.
                @elseif ($data['is_interest_monthly'] ?? false)
                    [MONTHLY INTEREST WORDING NOT YET PROVIDED IN THE TEMPLATE]
                @else
                    [INTEREST PROVISION TO BE COMPLETED]
                @endif
            </td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                7.2
            </td>
            <td style="vertical-align: top;">
                If the Borrower fails to repay the Loan and the Interest under this agreement on the Repayment Date,
                then interest on the total unpaid amount shall accrue daily, from the date of non-payment to the date of
                actual payment (both before and after judgment), at a rate of
                {{ $data['default_interest_rate_percent'] ?? '[ENTER DEFAULT RATE]' }}%
                above the base rate of the Bank of England per annum. If the base rate of the Bank of England falls
                below zero, then for the purposes of calculating the default interest rate in this clause, the base rate
                of the Bank of England shall be assumed to be zero.
            </td>
        </tr>
    </table>

    <div class="page-break"></div>

    {{-- SIGNATURE PAGE --}}
    <div style="margin-bottom: 30px;">
        This agreement has been entered into on the date stated at the beginning of it.
    </div>

    {{-- LENDER --}}
    @if ($lenderIsCompany)
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 42px;">
            <tr>
                <td style="width: 54%; vertical-align: top; padding-right: 26px;">
                    <p style="margin: 0; padding: 0;">
                        Signed by <strong>{{ $lender['signatory']['name'] ?? 'NAME OF DIRECTOR' }}</strong>, acting as
                        a {{ $lender['signatory']['title'] ?? 'director' }}, for and on behalf of
                        <strong>{{ $lender['company_name'] ?? '[COMPANY NAME]' }}</strong>
                    </p>
                </td>
                <td style="width: 46%; vertical-align: top;">
                    <div style="padding-top: 20px;">
                        <div style="width: 100%; border-top: 1px solid #000; height: 0; margin: 0 0 10px 0;"></div>
                        <p style="margin: 0 0 2px 0; padding: 0;">{{ $lender['signatory']['title'] ?? 'Director' }}
                        </p>
                        <p style="margin: 0; padding: 0; font-weight: 700;">Lender</p>
                    </div>
                </td>
            </tr>
        </table>
    @else
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 42px;">
            <tr>
                <td style="width: 54%; vertical-align: top; padding-right: 26px;">
                    <p style="margin: 0; padding: 0;">Signed by {{ $lender['full_name'] ?? '[ENTER NAME]' }}</p>
                </td>
                <td style="width: 46%; vertical-align: top;">
                    <div style="padding-top: 20px;">
                        <div style="width: 100%; border-top: 1px solid #000; height: 0; margin: 0 0 10px 0;"></div>
                        <p style="margin: 0 0 2px 0; padding: 0;">
                            {{ $lender['full_name'] ?? '[ENTER LENDER’S NAME, IF LENDER IS AN INDIVIDUAL]' }}
                        </p>
                        <p style="margin: 0; padding: 0; font-weight: 700;">Lender</p>
                    </div>
                </td>
            </tr>
        </table>
    @endif

    {{-- BORROWER --}}
    @if ($borrowerIsCompany)
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 42px;">
            <tr>
                <td style="width: 54%; vertical-align: top; padding-right: 26px;">
                    <p style="margin: 0; padding: 0;">
                        Signed by <strong>{{ $borrower['signatory']['name'] ?? '[ENTER NAME]' }}</strong>, acting as a
                        {{ $borrower['signatory']['title'] ?? 'director' }}, for and on behalf of
                        <strong>{{ $borrower['company_name'] ?? '[ENTER BORROWER’S COMPANY NAME]' }}</strong>
                    </p>
                </td>
                <td style="width: 46%; vertical-align: top;">
                    <div style="padding-top: 20px;">
                        <div style="width: 100%; border-top: 1px solid #000; height: 0; margin: 0 0 10px 0;"></div>
                        <p style="margin: 0 0 2px 0; padding: 0;">{{ $borrower['signatory']['title'] ?? 'Director' }}
                        </p>
                        <p style="margin: 0; padding: 0; font-weight: 700;">Borrower</p>
                    </div>
                </td>
            </tr>
        </table>
    @else
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
            <tr>
                <td style="width: 54%; vertical-align: top; padding-right: 26px;">
                    <p style="margin: 0; padding: 0;">Signed by {{ $borrower['full_name'] ?? '[ENTER NAME]' }}</p>
                </td>
                <td style="width: 46%; vertical-align: top;">
                    <div style="padding-top: 20px;">
                        <div style="width: 100%; border-top: 1px solid #000; height: 0; margin: 0 0 10px 0;"></div>
                        <p style="margin: 0 0 2px 0; padding: 0;">
                            {{ $borrower['full_name'] ?? '[ENTER BORROWER’S NAME, IF BORROWER IS AN INDIVIDUAL]' }}
                        </p>
                        <p style="margin: 0; padding: 0; font-weight: 700;">Borrower</p>
                    </div>
                </td>
            </tr>
        </table>
    @endif
</body>

</html>
