@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '16.',
    'title' => 'COVENANTS',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' =>
        'The Borrower covenants with the Lender that, as from the date of this agreement until all its liabilities under all of the Finance Documents have been discharged, it will:',
])

@php
    $clauseNumber = 1;
@endphp

@if ($borrowerIsCompany && $hasBorrowerOperationalInformationCovenant)
    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '16.' . $clauseNumber,
        'text' => 'deliver to the Lender:',
    ])

    @if ($hasAuditedAnnualAccountsCovenant)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '',
            'text' =>
                'within 180 days (or sooner if they are available) after the end of each of its financial years, its audited consolidated accounts;',
            'indent' => true,
        ])
    @endif

    @if ($hasMonthlyManagementAccountsCovenant)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '',
            'text' => 'within 30 days after the end of each month, its monthly management accounts;',
            'indent' => true,
        ])
    @endif

    @if ($hasShareholderOrCreditorNoticesCovenant)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '',
            'text' =>
                'promptly, all notices or other documents dispatched by the Borrower to its shareholders (or any class of them) or to its creditors generally; and',
            'indent' => true,
        ])
    @endif

    @if ($hasOtherReasonablyRequestedInformationCovenant)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '',
            'text' =>
                'promptly such financial or other information as the Lender may, from time to time, reasonably request relating to the Borrower or its business; and',
            'indent' => true,
        ])
    @endif

    @php
        $clauseNumber++;
    @endphp
@endif

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '16.' . $clauseNumber,
    'text' =>
        'promptly, after becoming aware of them, notify the Lender of any litigation, arbitration or administrative proceedings or claim of the kind described in clause 14.13; and',
])

@php
    $clauseNumber++;
@endphp

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '16.' . $clauseNumber,
    'text' =>
        'promptly obtain all consents or authorisations under any law or regulation (and do all that is needed to maintain them in full force and effect) to enable it to perform its obligations under the Finance Documents and to ensure the legality, validity, enforceability and admissibility in evidence of the Finance Documents in its jurisdiction of incorporation; and',
])

@php
    $clauseNumber++;
@endphp

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '16.' . $clauseNumber,
    'text' =>
        'procure that any of its unsecured and unsubordinated obligations and liabilities under any of the Finance Documents rank, and will rank, at least pari passu in right and priority of payments with all its other unsecured and unsubordinated obligations and liabilities, present or future, actual or contingent, except for those obligations and liabilities mandatorily preferred by law of general application to companies; and',
])

@php
    $clauseNumber++;
@endphp

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '16.' . $clauseNumber,
    'text' =>
        'comply, in all respects, with all laws, if failure to do so has or is reasonably likely to have a material adverse effect on its business, assets or condition, or its ability to perform its obligations under the Finance Documents; and',
])

@php
    $clauseNumber++;
@endphp

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '16.' . $clauseNumber,
    'text' =>
        'notify the Lender of any Potential Event of Default, Event of Default, breach of warranty, covenant or other obligation under this agreement (and the steps, if any, being taken to remedy it) promptly on becoming aware of its occurrence; and',
])

@php
    $clauseNumber++;
@endphp

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '16.' . $clauseNumber,
    'text' =>
        'if the Lender is obliged for any reason to comply with "know your customer" or similar identification procedures in circumstances where the necessary information is not already available to it, the Borrower will, promptly on the request of the Lender, supply (or procure the supply of) such documentation and other evidence as is reasonably requested in order for the Lender to be able to carry out, and be satisfied that it has complied with, all necessary "know your customer" or other similar checks under all applicable laws and regulations pursuant to the transactions contemplated in the Finance Documents; and',
])

@php
    $clauseNumber++;
@endphp

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '16.' . $clauseNumber,
    'text' =>
        'carry on and conduct its business in a proper and efficient manner and will not make any substantial change to the general nature or scope of its business as carried on at the date of this agreement;',
])
