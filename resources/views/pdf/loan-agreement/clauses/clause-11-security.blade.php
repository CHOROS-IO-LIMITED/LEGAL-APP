@if ($loanSecurityType === 'secured')
    @php
        $hasPropertyCharge = $hasFirstCharge || $hasSecondCharge;

        $restrictionChargeLabel = $hasSecondCharge ? 'Second Charge' : 'First Charge';

        $restrictionLenderText = $lenderIsCompany
            ? ($lender['company_name'] ?? '[LENDER’S NAME]') .
                ' (company number ' .
                ($lender['company_number'] ?? '[LENDER’S CO NO]') .
                ')'
            : $lender['full_name'] ?? '[LENDER’S NAME]';

        $restrictionAgreementDate = $agreementDate
            ? \Carbon\Carbon::parse($agreementDate)->format('j F Y')
            : '[ENTER AGREEMENT DATE]';

        $debentureRegistrationAmountText =
            'the full value of the Loan and Interest as well as the cost of any losses, costs, claims, liabilities, damages, demands and expenses suffered or incurred by the Lender arising out of, or in connection with any failure of the Borrower to perform or discharge any of the Borrower’s obligations or liabilities in this agreement';

        $restrictionText =
            'No disposition of the registered estate by the proprietor of the registered estate or by the proprietor of any registered charge, not being a charge registered before the entry of this restriction, is to be registered without a written consent signed by the proprietor for the time being of the charge dated ' .
            $restrictionAgreementDate .
            ' in favor of ' .
            $restrictionLenderText .
            ', or their conveyancer.';
    @endphp

    @include('pdf.loan-agreement.components.clause-heading', [
        'number' => '11.',
        'title' => 'SECURITY',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '11.1',
        'text' =>
            'The Borrower hereby agrees to enter into, or put into effect, the Security Documents as of the date of this agreement.',
    ])

    @if ($hasPropertyCharge)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tr>
                <td style="width: 30px; vertical-align: top;">11.2</td>
                <td style="vertical-align: top;">
                    For the purposes of the registration of the {{ $restrictionChargeLabel }}, the Borrower consents to
                    the
                    entry of the following restriction, in Form P or otherwise, against the Borrower’s title to the
                    Property
                    at the Land Registry (the “Restriction”):
                    <div style="margin-top: 8px; margin-left: 18px;">
                        "{{ $restrictionText }}"
                    </div>
                </td>
            </tr>
        </table>

        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '11.3',
            'text' =>
                'The Borrower shall ensure the Restriction is entered against the Property’s title within 10 Business Days of the Borrower’s purchase of the Property or the date of this agreement, whichever comes first.',
        ])

        @if ($hasSecondCharge)
            @include('pdf.loan-agreement.components.clause-row', [
                'number' => '11.4',
                'text' =>
                    'The Borrower shall provide the Lender with confirmation from the holder of any First Charge that they approve the Restriction being entered against the title of the Property.',
            ])

            @include('pdf.loan-agreement.components.clause-row', [
                'number' => '11.5',
                'text' =>
                    'The Lender understands and agrees that their charge shall be subordinate to the First Charge and shall enter into any reasonable Deed of Subordination / Deed of Priority negotiated with the holder of the First Charge on or around the date of this agreement or the date of purchase of the Property by the Borrower, whichever comes first. The Lender is aware that if they refuse to enter into such a deed, the Restriction may be unregistrable and/or unenforceable and shall not hold the Borrower liable for the Restriction’s lack of registration / enforceability.',
            ])
        @endif

        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '11.' . ($hasSecondCharge ? '6' : '4'),
            'text' =>
                'The Borrower shall also provide the Lender with all necessary assistance and/or documentation to permit the Lender to lodge the Restriction with the Land Registry, if the Lender so chooses. However, such assistance does not negate the Borrower’s obligation to register the Restriction.',
        ])

        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '11.' . ($hasSecondCharge ? '7' : '5'),
            'text' =>
                'The Lender consents to the removal of the Restriction upon payment from the Borrower of the full value of the Loan and Interest as well as the cost of any losses, costs, claims, liabilities, damages, demands and expenses suffered or incurred by the Lender arising out of, or in connection with any failure of the Borrower to perform or discharge any of the Borrower’s obligations or liabilities in this agreement and shall provide the Borrower with all necessary assistance and/or documentation to permit the Borrower to remove the Restriction from the Land Registry at the Borrower’s own cost.',
        ])

        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '11.' . ($hasSecondCharge ? '8' : '6'),
            'text' =>
                'The Borrower further provides to the Lender, as security for its obligations under this agreement, by way of fixed charge, all present and future estates, interests, rights and benefits belonging to or enuring to the Borrower under the terms of any lease granted in respect of the Property.',
        ])
    @endif

    @if ($hasDebenture)
        @php
            $debentureStartNumber = $hasPropertyCharge ? ($hasSecondCharge ? 9 : 7) : 2;
        @endphp

        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '11.' . $debentureStartNumber,
            'text' =>
                'For the purpose of the registration of the Debenture, the Borrower consents to the entry of the Debenture against its public record held at Companies House and undertakes to register the Debenture within 10 Business Days of the date of this agreement. The Debenture must be in favour of the Lender for ' .
                $debentureRegistrationAmountText .
                '.',
        ])

        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '11.' . ($debentureStartNumber + 1),
            'text' =>
                'The Borrower shall also provide the Lender with all necessary assistance and/or documentation to permit the Lender to lodge the Debenture against the Borrower’s record at Companies House. However, such assistance does not negate the Borrower’s obligation to register the Debenture.',
        ])

        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '11.' . ($debentureStartNumber + 2),
            'text' =>
                'The Lender consents to the removal of the Debenture upon payment from the Borrower of the full value of the Loan and Interest as well as the cost of any losses, costs, claims, liabilities, damages, demands and expenses suffered or incurred by the Lender arising out of, or in connection with any failure of the Borrower to perform or discharge any of the Borrower’s obligations or liabilities in this agreement and shall provide the Borrower with all necessary assistance and/or documentation to permit the Borrower to remove / satisfy the Debenture on the record of the Borrower held at Companies House. The cost of which shall be borne by the Borrower.',
            'marginBottom' => '14px',
        ])
    @endif
@endif
