@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '2.',
    'title' => 'THE FACILITY',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '2.1',
    'text' =>
        'On the date of this agreement the Lender grants to the Borrower an ' .
        ($loanSecurityType === 'secured' ? 'secured' : 'unsecured') .
        ' Sterling loan of £' .
        e($loanAmount) .
        ' (' .
        e($loanAmountWords) .
        ') on the terms and subject to the conditions of this agreement.',
])

@if (($data['loan_drawdown_type'] ?? null) === 'in_stages')
    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '2.2',
        'text' => 'The Borrower may draw down the Loan in parts and at any time during the Loan Term.',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '2.3',
        'text' =>
            'There is no minimum or maximum amount that can be borrowed in each drawdown (up to the total amount of the Loan).',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '2.4',
        'text' => 'Interest shall only accrue from the date of actual borrowing for each drawn amount.',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '2.5',
        'text' =>
            'Unless the Borrower draws down the Loan on the date of this agreement, the Borrower shall give the Lender at least two Business Days’ notice of the date on which the Borrower wishes to draw down the Loan specifying the amount, the Business Day for drawdown, and the bank account for payment. Any notice given under this clause shall be irrevocable.',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '2.6',
        'text' => 'The total of all amounts drawn down shall not exceed the total amount of the Loan.',
        'marginBottom' => '14px',
    ])
@endif
