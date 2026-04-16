@php
    $executionMethod = $data['execution_method'] ?? null;
    $useDocuSign = $data['use_docusign_execution'] ?? null;

    $isElectronicOnly = $executionMethod === 'electronic_only';
@endphp

@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '27.',
    'title' => 'EXECUTION',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '27.1',
    'text' => $isElectronicOnly
        ? 'This agreement shall be signed by electronic signature (whatever form the electronic signature takes) and, subject to the electronic signature being made in accordance with clause 27.2, that method of signature is conclusive proof of that Party’s intention to be bound by the terms of this agreement.'
        : 'This agreement may be signed in “wet-ink” or by electronic signature (whatever form the electronic signature takes) and, subject to the electronic signature being made in accordance with clause 27.2, that method of signature is conclusive proof of that Party’s intention to be bound by the terms of this agreement.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '27.2',
    'text' => 'Electronic signatures will need to take the form of:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'an electronic representation of a handwritten signature; or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' =>
            'a digital signature using PKI cryptography which is backed by a digital certificate from the platform (or a TSP) to verify the signatory’s identity and link the signatory to their public key; or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' =>
            $useDocuSign === 'yes'
                ? 'signing via a web-based e-signing platform such as AdobeSign or DocuSign.'
                : 'signing via a web-based e-signing platform.',
        'marginBottom' => '0',
    ])
</div>
