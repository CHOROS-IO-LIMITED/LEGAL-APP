@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '26.',
    'title' => 'COUNTERPARTS',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '26.1',
    'text' =>
        'This agreement may be executed in any number of counterparts, each of which when executed shall constitute a duplicate original, but all the counterparts shall together constitute one agreement.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '26.2',
    'text' =>
        'Transmission of the executed signature page of this agreement by fax or e-mail (in PDF, JPEG or other agreed format) shall take effect as delivery of an executed counterpart of this agreement. If either method of delivery is adopted, without prejudice to the validity of the deed thus made, each party shall provide the others with the original of such counterpart as soon as reasonably possible thereafter.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '26.3',
    'text' => 'No counterpart shall be effective until each party has executed at least one counterpart.',
])
