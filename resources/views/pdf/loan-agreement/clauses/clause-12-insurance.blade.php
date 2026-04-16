@if ($useLandDefinition)
    @php
        $insurancePaymentSuffix = $hasSecondCharge
            ? ' after any allocation payable to any First Charge holder are made'
            : '';
    @endphp

    @include('pdf.loan-agreement.components.clause-heading', [
        'number' => '12.',
        'title' => 'INSURANCE',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '12.1',
        'text' =>
            'The Borrower shall insure and keep insured the Property against fire, explosion, lightning, earthquake, storm, flood, bursting and overflowing of water tanks, apparatus or pipes, escape of water or oil, impact by aircraft and articles dropped from them, impact by vehicles, riot, civil commotion, malicious damage, break-in, theft or attempted theft, falling trees and branches and aerials, subsidence, heave, landslip, collision, accidental damage to underground services, public liability to anyone else and any other risks which the Lender reasonably requires to be insured against from time to time.',
    ])

    @if ($isPropertyDevelopment)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '12.2',
            'text' =>
                'If the Borrower undertakes any construction, modification or other works on or to the Property, they shall ensure that the Property is fully insured for such works.',
        ])
    @endif

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => $isPropertyDevelopment ? '12.3' : '12.2',
        'text' => 'The Borrower:',
    ])

    <div style="margin-left: 30px; margin-bottom: 12px;">
        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(a)',
            'text' =>
                'shall promptly pay all premiums in respect of any insurance policy on the Property and do all other things necessary to keep such policy in full force and effect; and',
        ])

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(b)',
            'text' =>
                'shall (if the Lender so require) produce to the Lender the receipts for all premiums and other payments necessary for effecting and keeping up any insurance policies on the Property.',
        ])
    </div>

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => $isPropertyDevelopment ? '12.4' : '12.3',
        'text' =>
            'The Borrowers shall not do or omit to do or permit to be done or omitted anything that may invalidate or otherwise prejudice any insurance policies relating to the Property.',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => $isPropertyDevelopment ? '12.5' : '12.4',
        'text' =>
            'All monies payable under any of the insurance policies relating to the Property at any time (whether or not the security constituted by this agreement has become enforceable) shall:',
    ])

    <div style="margin-left: 30px; margin-bottom: 14px;">
        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(a)',
            'text' => 'immediately be paid to the Lender' . $insurancePaymentSuffix . '; or',
        ])

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(b)',
            'text' =>
                'if they are not paid directly to the Lender by the insurers' .
                $insurancePaymentSuffix .
                ', be held, pending such payment, by the Borrowers upon trust for the Lender.',
            'marginBottom' => '0',
        ])
    </div>
@endif
