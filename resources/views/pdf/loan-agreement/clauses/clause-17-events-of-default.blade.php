@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '17.',
    'title' => 'EVENTS OF DEFAULT',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' =>
        'Each of the events or circumstances set out in this clause 17 (other than clause 17.16) is an Event of Default.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.1',
    'text' =>
        'The Borrower fails to pay any sum payable by it under either this agreement or any Finance Document, unless its failure to pay is caused solely by an administrative error or technical problem and payment is made within three Business Days of its due date.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.2',
    'text' =>
        'The Borrower fails (other than by failing to pay), to comply with any provision of this agreement or any Finance Document and (if the Lender considers, acting reasonably, that the default is capable of remedy), such default is not remedied within 10 Business Days of the earlier of:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'the Lender notifying the Borrower of the default and the remedy required; or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' => 'the Borrower becoming aware of the default.',
        'marginBottom' => '0',
    ])
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.3',
    'text' =>
        'Any representation, warranty or statement made, repeated or deemed made by the Borrower, or any of its agents, in or pursuant to any Finance Document is (or proves to have been) incomplete, untrue, incorrect or misleading in any material respect when made, repeated or deemed made.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.4',
    'text' => 'If:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'any Borrowed Money is not paid when due or within any originally applicable grace period; or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' =>
            'any Borrowed Money becomes due, or capable of being declared due and payable prior to its stated maturity by reason of an event of default (howsoever described); or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' =>
            'any commitment for Borrowed Money is cancelled or suspended by a creditor of the Borrower by reason of an event of default (howsoever described); or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(d)',
        'text' =>
            'any creditor of the Borrower becomes entitled to declare any Borrowed Money due and payable prior to its stated maturity by reason of an event of default (howsoever described).',
        'marginBottom' => '0',
    ])
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.5',
    'text' =>
        'The Borrower stops or suspends payment of any of its debts, or is unable to, or admits its inability to, pay its debts as they fall due.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.6',
    'text' =>
        'The value of the Borrower\'s assets is less than its liabilities (taking into account contingent and prospective liabilities).',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.7',
    'text' => 'A moratorium is declared in respect of any Indebtedness of the Borrower.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.8',
    'text' => 'Any action, proceedings, procedure or step is taken for:',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' =>
            'the suspension of payments, a moratorium of any Indebtedness, winding up, dissolution, administration or reorganisation (using a voluntary arrangement, scheme of arrangement or otherwise) of the Borrower; or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' => 'the composition, compromise, assignment or arrangement with any creditor; or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' =>
            'the appointment of a liquidator, receiver, administrative receiver, administrator, compulsory manager or other similar officer in respect of the Borrower or any of its assets; or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(d)',
        'text' => 'the enforcement of any Security over any assets of the Borrower.',
        'marginBottom' => '0',
    ])
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.9',
    'text' =>
        'The Borrower commences negotiations, or enters into any composition, compromise, assignment or arrangement, with one or more of its creditors with a view to rescheduling any of its Indebtedness (because of actual or anticipated financial difficulties).',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.10',
    'text' =>
        'A distress, attachment, execution, expropriation, sequestration or another analogous legal process is levied, enforced or sued out on, or against, the Borrower\'s assets.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.11',
    'text' =>
        'Any provision of this any Finance Document is or becomes, for any reason, invalid, unlawful, unenforceable, terminated, disputed or ceases to be effective or to have full force and effect as a result of an action taken by the Borrower.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.12',
    'text' => 'The Borrower repudiates or evidences an intention to repudiate any Finance Document.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.13',
    'text' =>
        'The Borrower suspends or ceases to carry on (or threatens to suspend or cease to carry on) all or a substantial part of its business.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.14',
    'text' =>
        'The death or permanent incapacity of a Guarantor and no replacement Guarantor of equal or better standing is put in place within 10 Business Days of the original Guarantor’s death or permanent incapacity.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.15',
    'text' =>
        'Any event occurs (or circumstances exist) which, in the reasonable opinion of the Lender, has or is likely to materially and adversely affect the Borrower\'s ability to perform all or any of its obligations under, or otherwise comply with the terms of any Finance Document.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '17.16',
    'text' => 'At any time after an Event of Default has occurred the Lender may, by notice to the Borrower:',
])

<div style="margin-left: 30px; margin-bottom: 14px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' =>
            'cancel all outstanding obligations of the Lender under this agreement whereupon they shall immediately be cancelled; and/or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' =>
            'declare that the Loan (and all accrued interest and all other amounts outstanding under this agreement) is immediately due and payable, whereupon they shall become immediately due and payable; and/or',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' =>
            'declare that the Loan be payable on demand, whereupon it shall become immediately payable on demand by the Lender; and/or',
    ])

    @if ($hasFirstCharge || $hasSecondCharge)
        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(d)',
            'text' =>
                'enforce its ' .
                ($hasFirstCharge ? 'First Charge' : 'Second Charge') .
                ' on the Property; and/or',
        ])

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(e)',
            'text' => 'enforce the terms of any Security Document.',
            'marginBottom' => '0',
        ])
    @else
        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(d)',
            'text' => 'enforce the terms of any Security Document.',
            'marginBottom' => '0',
        ])
    @endif
</div>
