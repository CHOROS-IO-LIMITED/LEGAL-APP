@php
    $exclusiveJurisdiction = $data['exclusive_jurisdiction'] ?? null;
    $jurisdictionType = $exclusiveJurisdiction === 'no' ? 'non-exclusive' : 'exclusive';
@endphp

@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '31.',
    'title' => 'GOVERNING LAW AND JURISDICTION',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '31.1',
    'text' =>
        'This agreement and any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with it or its subject matter or formation shall be governed by and construed in accordance with the law of England and Wales.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '31.2',
    'text' =>
        'Each party irrevocably agrees that the courts of England and Wales shall have ' .
        $jurisdictionType .
        ' jurisdiction over any dispute or claim (including non-contractual disputes or claims) that arises out of, or in connection with this agreement or its subject matter or formation.',
])
