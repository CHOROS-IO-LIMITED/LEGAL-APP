@php
    $repNumber = 1;

    $n145 = $repNumber + ($borrowerIsCompany ? 4 : 0);
    $n146 = $n145 + 1;
    $n147 = $n146 + 1;
    $n148 = $n147 + 1;
    $n149 = $n148 + 1;
    $n1410 = $n149 + 1;
    $n1411 = $n1410 + 1;
    $n1412 = $n1411 + ($useLandDefinition ? 1 : 0);
    $n1413 = $n1412 + 1;
    $n1414 = $n1413 + 1;
    $n1415 = $n1414 + 1;
@endphp

@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '14.',
    'title' => 'REPRESENTATIONS AND WARRANTIES',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' => 'The Borrower represents, warrants and undertakes to the Lender that:',
])

@if ($borrowerIsCompany)
    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '14.1',
        'text' =>
            'it is a duly incorporated limited liability company validly existing under the laws of its jurisdiction of incorporation;',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '14.2',
        'text' => 'it has the power to own its assets and carry on its business as it is being conducted; and',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '14.3',
        'text' =>
            'no limit on its powers will be exceeded as a result of the borrowing or grant of security contemplated by the Finance Documents; and',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '14.4',
        'text' =>
            'the entry into and performance by it of the transactions contemplated by this agreement do not and will not contravene or conflict with:',
    ])

    <div style="margin-left: 30px; margin-bottom: 12px;">
        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(a)',
            'text' => 'its constitutional documents;',
        ])

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(b)',
            'text' =>
                'any agreement or instrument binding on it or its assets or constitute a default or termination event (however described) under any such agreement or instrument; or',
        ])

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(c)',
            'text' => 'any law or regulation or judicial or official order, applicable to it; and',
            'marginBottom' => '0',
        ])
    </div>
@endif

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n145,
    'text' =>
        'it has taken all necessary action and obtained all required or desirable authorisations to enable it to enter into, exercise its rights and comply with its obligations in this agreement and the Finance Documents and to make them admissible in evidence in its jurisdiction of incorporation. All such authorisations are in full force and effect; and',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n146,
    'text' => 'its obligations under the Finance Documents are legal, valid, binding and enforceable; and',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n147,
    'text' =>
        'no Event of Default or Potential Event of Default has occurred or is continuing, or is reasonably likely to result from making the Loan or the entry into, the performance of, or any transaction contemplated by any of the Finance Documents; and',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n148,
    'text' =>
        'it (or any director of the Borrower if it is a limited company or any member if it is an LLP) is not or has not been bankrupt and no bankruptcy petition has ever been presented in relation to it; and',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n149,
    'text' =>
        'it (or any director of the Borrower if it is a limited company or any member of the Borrower if it is an LLP), has never entered in to an individual voluntary arrangement, administration order or any formal or informal composition or arrangement for the benefit of its / their creditors; and',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n1410,
    'text' =>
        'it is not in default under any agreement to which it is a party or under which it may be bound; and',
])

@if ($useLandDefinition)
    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '14.' . $n1411,
        'text' =>
            'neither it, nor any of its directors or shareholders (if the Borrower is a corporate entity) or any member of the Borrower’s family (if the Borrower is an individual), nor any third party will take up residence in any part of the Property or the Buildings thereon nor shall the it grant any lease, tenancy or other right of occupation in respect thereof whilst the Loan, or any part of it, remains outstanding PROVIDED THAT the Borrower shall be permitted to grant an assured shorthold tenancy of the whole of the Property on arm’s length terms and in the form of a document which have been approved in writing by the Lender or the Lender’s Solicitors (such approval not to be unreasonably withheld or delayed); and',
    ])
@endif

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n1412,
    'text' =>
        'no other event or circumstance is outstanding which constitutes (or, with the expiry of a grace period, the giving of notice, the making of any determination or any combination thereof, would constitute) a default or termination event (howsoever described) under any other agreement or instrument which is binding on the Borrower or to which any of its assets is subject which has or is reasonably likely to have a material adverse effect on its business, assets or condition or ability to perform its obligations under any of the Finance Documents; and',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n1413,
    'text' =>
        'no litigation, arbitration or administrative proceedings are taking place, pending or, to the Borrower\'s knowledge, threatened against it, any of its directors or any of its assets, which, if adversely determined, might reasonably be expected to have a material adverse effect on its business, assets or condition, or its ability to perform its obligations under any of the Finance Documents; and',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n1414,
    'text' =>
        'the information, in written or electronic format, supplied by, or on its behalf, to the Lender in connection with the Loan and the Finance Documents was, at the time it was supplied or at the date it was stated to be given (as the case may be), to the best of its knowledge and belief having made all due enquiry:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'if it was factual information, complete, true and accurate in all material respects;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' =>
            'if it was a financial projection or forecast, prepared on the basis of recent historical information and on the basis of reasonable assumptions and was fair and made on reasonable grounds;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' =>
            'if it was an opinion or intention, made after careful consideration and was fair and made on reasonable grounds; and',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(d)',
        'text' =>
            'not misleading in any material respect, nor rendered misleading by a failure to disclose other information,',
    ])
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' =>
        'except to the extent that it was amended, superseded or updated by more recent information supplied by, or on behalf of, the Borrower to the Lender; and',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '14.' . $n1415,
    'text' =>
        'the Security Document create a valid, legally binding and enforceable Security for the obligations expressed to be secured by it in favour of the Lender, having the priority and ranking expressed to be created in the Security Document and ranking ahead of all (if any) Security and rights of third parties except those preferred by law.',
    'marginBottom' => '14px',
])
