@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '8.',
    'title' => 'REPAYMENT',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '8.1',
    'text' =>
        'The Borrower shall repay the Loan to the Lender in full on the Repayment Date together with the Interest owed.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '8.2',
    'text' => 'The Repayment Date can be made sooner by mutual agreement between the parties.',
    'marginBottom' => '14px',
])
