@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '15.',
    'title' => 'REPETITION OF WARRANTIES',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '15.1',
    'text' =>
        'Each of the representations warranties and undertakings in clause 14 is deemed to be repeated by the Borrower on:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'the date that the Loan is actually drawn; and',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' => 'each day during the Loan Term,',
        'marginBottom' => '0',
    ])
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' => 'by reference to the facts and circumstances existing on each such date.',
    'marginBottom' => '14px',
])
