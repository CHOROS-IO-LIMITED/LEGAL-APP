@if ($useLandDefinition)
    @include('pdf.loan-agreement.components.clause-heading', [
        'number' => '13.',
        'title' => 'LEASES AND LICENCES AFFECTING THE PROPERTY',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '13.1',
        'text' =>
            'The Borrowers shall not, without the prior written consent of the Lender, such consent not to be unreasonably withheld or delayed:',
    ])

    <div style="margin-left: 30px; margin-bottom: 14px;">
        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(a)',
            'text' =>
                'grant, or agree to grant, any licence or tenancy affecting the whole or any part of the Property, or exercise the statutory powers of leasing (or agreeing to lease) or of accepting (or agreeing to accept) surrenders under sections 99 or 100 of the LPA 1925; or',
        ])

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(b)',
            'text' =>
                'in any other way dispose of (or agree to dispose of), accept the surrender of (or agree to accept the surrender of), surrender (or agree to surrender) or create any legal or equitable estate or interest in the whole or any part of the Property; or',
        ])

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(c)',
            'text' =>
                'let any person into occupation of or share occupation of the whole or any part of the Property; or',
        ])

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(d)',
            'text' => 'grant any consent or licence under any lease or licence affecting the Property.',
            'marginBottom' => '0',
        ])
    </div>
@endif
