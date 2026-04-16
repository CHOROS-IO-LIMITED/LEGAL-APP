@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '6.',
    'title' => 'CONDITIONS PRECEDENT',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '6.1',
    'text' =>
        'The Borrower may not give notice to draw the Loan unless the Lender has received all the documents and evidence specified in Schedule 1 in a form and substance satisfactory to the Lender.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '6.2',
    'text' => 'The Lender\'s obligation to make the Loan is subject to the further conditions precedent that:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' =>
            'the representations and warranties in clause 14 are true and correct and will be true and correct immediately after the Lender has made the proposed Loan; and',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' =>
            'no Event of Default or Potential Event of Default is continuing or would result from the proposed Loan.',
    ])
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '6.3',
    'text' =>
        'The conditions specified in this clause 6 are inserted solely for the Lender\'s benefit. The Lender may waive them, in whole or in part and with or without conditions, without prejudicing the Lender\'s right to require subsequent fulfilment of such conditions.',
    'marginBottom' => '14px',
])
