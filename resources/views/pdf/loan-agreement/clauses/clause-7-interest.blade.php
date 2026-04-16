@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '7.',
    'title' => 'INTEREST',
])

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

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '7.2',
    'text' =>
        'If the Borrower fails to repay the Loan and the Interest under this agreement on the Repayment Date, then interest on the total unpaid amount shall accrue daily, from the date of non-payment to the date of actual payment (both before and after judgment), at a rate of ' .
        e($data['default_interest_rate_percent'] ?? '[ENTER DEFAULT RATE]') .
        '% above the base rate of the Bank of England per annum. If the base rate of the Bank of England falls below zero, then for the purposes of calculating the default interest rate in this clause, the base rate of the Bank of England shall be assumed to be zero.',
    'marginBottom' => '14px',
])
