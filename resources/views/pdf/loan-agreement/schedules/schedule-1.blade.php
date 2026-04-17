@php
    $includeCompanySection = $borrowerIsCompany;

    $requireBoardResolutions = ($data['include_board_resolutions'] ?? null) === 'yes';
    $requireShareholderResolutions = ($data['include_shareholder_resolutions'] ?? null) === 'yes';
    $requireBankruptcySearches = ($data['require_bankruptcy_search'] ?? null) === 'yes';

    $requireSecondChargeConfirmation = $hasSecondCharge;
    $hasSecurityDocuments = !empty($securityItems);
    $hasGuarantors = $hasPersonalGuarantee && !empty($guarantors);

    $scheduleNumber = 1;

    $constitutionalNumber = null;
    if ($includeCompanySection) {
        $constitutionalNumber = (string) $scheduleNumber++;
    }

    $financeDocumentsNumber = (string) $scheduleNumber++;
    $financialInformationNumber = (string) $scheduleNumber++;

    $bankruptcySearchesNumber = null;
    if ($requireBankruptcySearches) {
        $bankruptcySearchesNumber = (string) $scheduleNumber++;
    }

    $otherDocumentsNumber = (string) $scheduleNumber++;
@endphp

<div class="page-break"></div>

<div style="font-weight:700; margin-bottom:10px;">
    Schedule 1 &nbsp;&nbsp;&nbsp; CONDITIONS PRECEDENT
</div>

@if ($includeCompanySection)
    @include('pdf.loan-agreement.components.clause-heading', [
        'number' => $constitutionalNumber . '.',
        'title' => 'Constitutional Documents',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => $constitutionalNumber . '.1',
        'text' => 'A copy of the constitutional documents of the Borrower.',
    ])

    @if ($requireBoardResolutions)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => $constitutionalNumber . '.2',
            'text' => 'A copy of the resolutions duly passed by the Borrower\'s board of directors:',
        ])

        <div style="margin-left: 30px; margin-bottom: 12px;">
            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(a)',
                'text' =>
                    'approving the entry into, and terms of, and transactions contemplated by the Finance Documents and resolving that the Borrower executes this agreement;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(b)',
                'text' =>
                    'authorising a specified person or persons to execute this agreement on its behalf, to give notices and take all other action in connection with Finance Documents;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(c)',
                'text' =>
                    'confirming no limit on the powers of the Borrower or its directors to borrow money, give guarantees or create security would be exceeded by its entry into or performance of its obligations under this agreement or any of the Finance Documents;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(d)',
                'text' =>
                    'confirming that borrowing the Loan amount or granting security in respect of the Loan would not mean any borrowing or security (or similar limit binding on the Borrower) would be exceeded; and',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(e)',
                'text' =>
                    'confirming that entry into this agreement is in the commercial interests of the Borrower (stating the reasons for such conclusion).',
                'marginBottom' => '0',
            ])
        </div>
    @endif

    @if ($requireShareholderResolutions)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => $constitutionalNumber . '.3',
            'text' =>
                'A copy of a resolution signed by all the holders of the issued shares in the Borrower, approving Finance Documents.',
        ])
    @endif
@endif

@include('pdf.loan-agreement.components.clause-heading', [
    'number' => $financeDocumentsNumber . '.',
    'title' => 'Finance Documents',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => $financeDocumentsNumber . '.1',
    'text' => 'This agreement, duly executed by the Borrower.',
])

@if ($hasSecurityDocuments)
    @include('pdf.loan-agreement.components.clause-row', [
        'number' => $financeDocumentsNumber . '.2',
        'text' => 'The Security Documents duly executed by the Borrower and/or Guarantors, as necessary.',
    ])
@endif

@if ($requireSecondChargeConfirmation)
    @include('pdf.loan-agreement.components.clause-row', [
        'number' => $financeDocumentsNumber . '.3',
        'text' =>
            'If the Lender is to receive a Second Charge over the Property, a confirmation from any First Charge holder that the registration of the Restriction is permitted against the title of the Property.',
    ])
@endif

@include('pdf.loan-agreement.components.clause-heading', [
    'number' => $financialInformationNumber . '.',
    'title' => 'Financial Information',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => $financialInformationNumber . '.1',
    'text' =>
        'All information required by the Lender to enable it to comply with all "know your customer" or similar identification procedures under all applicable laws and regulations.',
])

@if ($requireBankruptcySearches)
    @include('pdf.loan-agreement.components.clause-heading', [
        'number' => $bankruptcySearchesNumber . '.',
        'title' => 'Bankruptcy Searches',
    ])

    @include('pdf.loan-agreement.components.clause-row', [
        'number' => $bankruptcySearchesNumber . '.1',
        'text' => $borrowerIsCompany
            ? 'A clear bankruptcy search against the Borrower and all company directors and shareholders of the Borrower including and excluding any middle names;'
            : 'A clear bankruptcy search against the Borrower including and excluding any middle names;',
    ])

    @if ($hasGuarantors)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => $bankruptcySearchesNumber . '.2',
            'text' =>
                'A clear bankruptcy search against all the Guarantors including and excluding any middle names.',
        ])
    @endif
@endif

@include('pdf.loan-agreement.components.clause-heading', [
    'number' => $otherDocumentsNumber . '.',
    'title' => 'Other documents and evidence',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => $otherDocumentsNumber . '.1',
    'text' =>
        'A copy of any other authorisation, document, opinion or assurance which the Lender considers necessary or desirable for the entry into, and performance of, the transactions contemplated by the Finance Documents, or for the Finance Documents to be valid and enforceable.',
])
