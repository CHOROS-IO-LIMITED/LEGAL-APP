@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '4.',
    'title' => 'TERM',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '4.1',
    'text' =>
        'The term of this Loan is for the period from and including the date of this agreement to and including the Repayment Date (the “Loan Term”).',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '4.2',
    'text' =>
        'If the Purpose fails to complete for whatever reason, or has not completed by the end of the Loan Term, then the full sum of the Loan shall be payable immediately to the Lender with the accrued Interest (defined below).',
    'marginBottom' => '14px',
])
