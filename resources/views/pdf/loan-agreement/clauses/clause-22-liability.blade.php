@if ($hasMultipleBorrowers)
    @include('pdf.loan-agreement.components.clause-heading', [
        'number' => '22.',
        'title' => 'LIABILITY',
    ])


    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '22.1',
        'text' =>
            'Where the Borrower comprises more than one person then all of their obligations under the Finance Documents shall be joint and several.',
    ])
@endif
