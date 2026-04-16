@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '29.',
    'title' => 'NOTICES',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '29.1',
    'text' =>
        'Any notice or other communication given to a party under or in connection with, this agreement shall be:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'in writing;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' =>
            'delivered by hand, by pre-paid first-class post or other next working day delivery service or sent by email to any such email address that has been previously used in correspondence between the parties; and',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' =>
            'if sent by post, sent to the address of a party as set out at the start of this agreement or to any other address as is notified in writing by one party to the other from time to time.',
        'marginBottom' => '0',
    ])
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '29.2',
    'text' =>
        'Any notice or other communication in writing given under this agreement under or in connection with any Finance Document shall be deemed to have been received:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'if delivered by hand, at the time it is left at the relevant address;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' =>
            'if posted by pre-paid first-class post or other next working day delivery service, on the second Business Day after posting; and',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' =>
            'if sent by fax, at the time of transmission, or, if this time falls outside business hours, when business hours resume. In this clause 29.2(c) business hours means 9.00 am to 5.00 pm Monday to Friday on a day that is not a public holiday in the place of receipt.',
        'marginBottom' => '0',
    ])
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '29.3',
    'text' =>
        'A notice or other communication given as described in clause 29.2(a) or clause 29.2(c) on a day that is not a Business Day, or after normal business hours, in the place it is received, shall be deemed to have been received on the next Business Day.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '29.4',
    'text' =>
        'A notice or other communication given under or in connection with this agreement is not valid if sent by e-mail.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '29.5',
    'text' =>
        'This clause does not apply to the service of any proceedings or other documents in any legal action or, where applicable, any arbitration or other method of dispute resolution.',
])
