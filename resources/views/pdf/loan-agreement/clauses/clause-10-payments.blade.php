@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '10.',
    'title' => 'PAYMENTS',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '10.1',
    'text' =>
        'The Loan amount shall be paid in cash on the date of this agreement by the Lender to the Borrower by same day telegraphic transfer to the Borrower’s account (details to be shared between the parties on or about the date of this agreement) and receipt of which shall consolidate a full discharge of the Lender’s obligation to make such payment.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '10.2',
    'text' =>
        'All repayments made by the Borrower under this agreement shall be in Sterling and made payable in immediately available cleared funds by same day telegraphic transfer to the Lender’s bank account (details to be shared between the parties on or about the date of this agreement) and receipt of which shall consolidate a full discharge of the Borrower’s obligation to make such payment.',
])

@if ($repaymentsToOverseasAccount)
    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '10.3',
        'text' =>
            'For the avoidance of doubt, if the Borrower needs to make payments to an international bank account, such payments shall be made in Sterling and the Borrower shall only pay the telegraphic transfer fees of their sending bank. The Lender’s bank shall apply an exchange rate (if applicable) and may charge the Lender a fee for doing so. The Borrower is not responsible for any fees or charges by the Lender’s bank and is also not responsible for the exchange rate used by the Lender’s bank.',
    ])
@endif

@include('pdf.loan-agreement.components.clause-row', [
    'number' => $repaymentsToOverseasAccount ? '10.4' : '10.3',
    'text' =>
        'If any payment becomes due on a day that is not a Business Day, the due date of such payment will be extended to the next succeeding Business Day, or, if that Business Day falls in the following calendar month, such due date shall be the immediately preceding Business Day.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => $repaymentsToOverseasAccount ? '10.5' : '10.4',
    'text' =>
        'All payments made by the Borrower under this agreement shall be made in full, without set-off, counterclaim or condition, and free and clear of, and without any deduction or withholding, provided that, if the Borrower is required by law or regulation to make such deduction or withholding, it shall:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'ensure that the deduction or withholding does not exceed the minimum amount legally required;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' =>
            'pay to the relevant taxation or other authorities, as appropriate, the full amount of the deduction or withholding; and',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' => 'furnish to the Lender, within the period for payment permitted by the relevant law, either:',
    ])

    <div style="margin-left: 30px;">
        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(i)',
            'text' =>
                'an official receipt of the relevant taxation authorities concerned on payment to them of amounts so deducted or withheld; or',
        ])

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(ii)',
            'text' =>
                'if such receipts are not issued by the taxation authorities concerned on payment to them of amounts so deducted or withheld, a certificate of deduction or equivalent evidence of the relevant deduction or withholding.',
            'marginBottom' => '0',
        ])
    </div>
</div>
