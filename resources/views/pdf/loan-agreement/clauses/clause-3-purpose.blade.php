@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '3.',
    'title' => 'PURPOSE',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '3.1',
    'text' => 'The Borrower shall only use the Loan for ' . e($loanPurpose) . ' (the “Purpose”).',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '3.2',
    'text' =>
        'The Lender is entitled to but not obliged to monitor or verify how any amount advanced under this agreement is used.',
    'marginBottom' => '14px',
])
