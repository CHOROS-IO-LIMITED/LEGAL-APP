@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '1.',
    'title' => 'DEFINITIONS AND INTERPRETATION',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '1.1',
    'title' => 'Definitions',
    'marginBottom' => '10px',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' => 'The following definitions apply in this agreement:',
    'marginBottom' => '10px',
])

<table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
    <tr>
        <td style="width: 30px;"></td>
        <td style="vertical-align: top;">
            <strong>Borrowed Money:</strong> any indebtedness the Borrower owes as a result of:
        </td>
    </tr>
</table>

<div style="margin-left: 60px; margin-bottom: 10px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'borrowing or raising money (with or without security), including any premium and any capitalised interest on that money;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' => 'any bond, note, loan stock, commercial paper or similar instrument;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' => 'any acceptance credit facility or dematerialised equivalent, bill-discounting, note purchase or documentary credit facilities;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(d)',
        'text' => 'monies raised by selling, assigning or discounting receivables or other financial assets on terms that recourse may be had to the Borrower if those receivables or financial assets are not paid when due;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(e)',
        'text' => 'any deferred payment for assets or services acquired, other than trade credit that is given in the ordinary course of trading and which does not involve any deferred payment of any amount for more than 60 days;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(f)',
        'text' => 'any rental or hire charges under finance leases (whether for land, machinery, equipment or otherwise);',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(g)',
        'text' => 'any counter-indemnity obligation in respect of any guarantee, bond, indemnity, standby letter of credit or other instrument issued by a third party in connection with the Borrower’s performance of contracts;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(h)',
        'text' => 'any other transaction that has the commercial effect of borrowing (including any forward sale or purchase agreement and any liabilities which are not shown as borrowed money on the Borrower’s balance sheet because they are contingent, conditional or otherwise);',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(i)',
        'text' => 'any derivative transaction entered into in connection with protection against or benefit from fluctuation in any rate or price (and when calculating the value of any derivative transaction, only the mark to market value shall be taken into account); and',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(j)',
        'text' => 'any guarantee, counter-indemnity or other assurances against financial loss that the Borrower has given for any of the items referred to in paragraphs (a) to (i) of this definition incurred by any person.',
    ])
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' => 'When calculating Borrowed Money, no liability shall be taken into account more than once.',
])

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Business Day',
    'definition' => 'a day other than a Saturday, Sunday or public holiday in England when banks in London are open for business.',
])

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Change of Control',
    'definition' => 'includes (without limitation) the sale, transfer, or other disposal (in a single transaction or a series of related transactions) of more than 50% of the issued share capital or voting rights of a corporate body, or any arrangement which results in another person or entity obtaining effective control of the Company by virtue of obtaining the ability to direct the affairs of that corporate body, whether by virtue of ownership of shares, voting rights, contract or otherwise.',
])

@if ($hasDebenture)
    @include('pdf.loan-agreement.components.definition-row', [
        'term' => 'Debenture',
        'definition' => 'shall have the meaning set out under the Security Documents definition in this clause 1.1.',
    ])
@endif

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Event of Default',
    'definition' => 'any event or circumstance listed in clause 17.1 to clause 17.15.',
])

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Finance Document',
    'definition' => 'this agreement' . ($loanSecurityType === 'secured' ? ' and the Security Documents' : '') . '.',
])

@if ($hasSecondCharge)
    @include('pdf.loan-agreement.components.definition-row', [
        'term' => 'First Charge',
        'definition' => $hasFirstCharge
            ? 'a first charge by way of legal mortgage formally registered at the Land Registry against the title of the Property.'
            : 'a first charge by way of legal mortgage formally registered at the Land Registry against the title of the Property held by the first charge holder on or around the date of this agreement.',
    ])
@endif

@if ($hasPersonalGuarantee)
    @include('pdf.loan-agreement.components.definition-row', [
        'term' => 'Guarantors',
        'definition' => 'Those persons detailed in Schedule 2 who will guarantee and indemnify the Lender against all losses suffered or costs incurred by the default of any action of the Borrower in the agreement.',
    ])
@endif

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Indebtedness',
    'definition' => 'any obligation to pay or repay money, present or future, whether actual or contingent, sole or joint and any guarantee or indemnity of any of those obligations.',
])

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Interest',
    'definition' => 'shall have the meaning given to it in clause 7.1.',
])

@if ($showInterestPeriodDefinition)
    @include('pdf.loan-agreement.components.definition-row', [
        'term' => 'Interest Period',
        'definition' => 'shall have the meaning given to it in clause 7.1.',
    ])
@endif

@if ($useLandDefinition)
    @include('pdf.loan-agreement.components.definition-row', [
        'term' => 'Land',
        'definition' => 'The leasehold / freehold property known as ' . e($landAddress) . ' holding Land Registry title number ' . e($landTitleNumber) . '.',
    ])
@endif

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Loan',
    'definition' => 'the principal amount of the loan as set out in clause 2 below that is made or to be made by the Lender to the Borrower under this agreement or (as the context requires) the principal amount outstanding for the time being of that loan.',
])

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Loan Term',
    'definition' => 'shall have the meaning given to it in clause 4.1.',
])

@if ($hasPersonalGuarantee)
    @include('pdf.loan-agreement.components.definition-row', [
        'term' => 'Personal Guarantee' . (count($guarantors) > 1 ? 's' : ''),
        'definition' => 'The Deed' . (count($guarantors) > 1 ? 's' : '') . ' of Guarantee as set out in the Security Documents.',
    ])
@endif

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Potential Event of Default',
    'definition' => 'any event or circumstance specified in clause 17 that would, on the giving of notice, expiry of any grace period or making of any determination under the Finance Documents, or satisfaction of any other condition (or any combination thereof), become an Event of Default.',
])

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Purpose',
    'definition' => 'shall have the meaning given to it in clause 3.1.',
])

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'RAO',
    'definition' => 'The Financial Services and Markets Act 2000 (Regulated Activities) Order 2001 (SI 2001/544).',
])

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Repayment Date',
    'definition' => e($repaymentDateText) . '.',
])

@if ($hasPropertySecurity)
    @include('pdf.loan-agreement.components.definition-row', [
        'term' => 'Restriction',
        'definition' => 'shall have the meaning given to it in clause 11.2.',
    ])
@endif

@if ($hasSecondCharge)
    @include('pdf.loan-agreement.components.definition-row', [
        'term' => 'Second Charge',
        'definition' => 'second charge by way of legal mortgage formally registered at the Land Registry against the title of the Property.',
    ])
@endif

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Security',
    'definition' => 'any mortgage, charge (whether fixed or floating, legal or equitable), pledge, lien, assignment by way of security or other security interest securing any obligation of any person or any other agreement or arrangement having a similar effect.',
])

@if ($loanSecurityType === 'secured' && !empty($securityDocuments))
    @include('pdf.loan-agreement.components.clause-row', [
        'number' => '',
        'text' => '<strong>Security Documents:</strong>',
    ])

    <div style="margin-left: 30px; margin-bottom: 14px;">
        @foreach ($securityDocuments as $index => $securityDocument)
            @include('pdf.loan-agreement.components.list-row', [
                'marker' => chr(97 + $index) . ')',
                'text' => e($securityDocument) . ';',
            ])
        @endforeach

        @include('pdf.loan-agreement.components.list-row', [
            'marker' => chr(97 + count($securityDocuments)) . ')',
            'text' => 'any other document which confers a Security on the Lender or constitutes a guarantee, indemnity or other assurance in favour of the Lender.',
        ])
    </div>
@endif

@include('pdf.loan-agreement.components.definition-row', [
    'term' => 'Sterling and £',
    'definition' => 'the lawful currency for the time being of the United Kingdom.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '1.2',
    'title' => 'Interpretation',
    'marginBottom' => '8px',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' => 'In this agreement:',
    'marginBottom' => '8px',
])

<div style="margin-left: 30px; margin-bottom: 12px;">
    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(a)',
        'text' => 'Clause' . ($useLandDefinition ? ', Schedule' : '') . ' and paragraph headings shall not affect the interpretation of this agreement;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(b)',
        'text' => 'a reference to a person shall include a reference to an individual, firm, company, corporation, partnership, unincorporated body of persons, government, state or agency of a state or any association, trust, joint venture or consortium (whether or not having separate legal personality);',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(c)',
        'text' => 'unless the context otherwise requires, words in the singular shall include the plural and in the plural shall include the singular;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(d)',
        'text' => 'unless the context otherwise requires, a reference to one gender shall include a reference to the other genders;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(e)',
        'text' => 'a reference to a party shall include that party\'s successors, permitted assigns and permitted transferees and this agreement shall be binding on, and enure to the benefit of, the parties to this agreement and their respective personal representatives, successors, permitted assigns and permitted transferees;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(f)',
        'text' => 'a reference to a statute or statutory provision is a reference to it as amended, extended or re-enacted from time to time;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(g)',
        'text' => 'a reference to a statute or statutory provision shall include all subordinate legislation made from time to time under that statute or statutory provision;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(h)',
        'text' => 'a reference to a time of day is to London time;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(i)',
        'text' => 'a reference to writing or written includes fax and email;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(j)',
        'text' => 'an obligation on a party not to do something includes an obligation not to allow that thing to be done;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(k)',
        'text' => 'a reference to this agreement' . ($loanSecurityType === 'secured' ? ' or a Finance Document' : '') .
            ' (or any provision of it) or to any other agreement or document referred to in this agreement ' .
            ($loanSecurityType === 'secured' ? 'or any Finance Document ' : '') .
            'is a reference to this agreement or that ' .
            ($loanSecurityType === 'secured' ? 'Finance Document' : 'document') .
            ', as amended (in each case, other than in breach of the provisions of this agreement) from time to time;',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(l)',
        'text' => 'unless the context otherwise requires, a reference to a clause ' .
            ($useLandDefinition ? ' or Schedule' : '') .
            ' is to a clause of this agreement' .
            ($useLandDefinition ? ' or Schedule to this agreement, and a reference to a paragraph is to a paragraph of the relevant Schedule' : '') .
            ';',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(m)',
        'text' => 'any words following the terms including, include, in particular, for example or any similar expression shall be construed as illustrative and shall not limit the sense of the words, description, definition, phrase or term preceding those terms; and',
    ])

    @include('pdf.loan-agreement.components.list-row', [
        'marker' => '(n)',
        'text' => 'a reference to continuing in relation to an Event of Default means an Event of Default that has not been remedied or waived.',
    ])

    @if ($useLandDefinition)
        @include('pdf.loan-agreement.components.list-row', [
            'marker' => '(o)',
            'text' => 'Any reference in this agreement to a charge or mortgage of, or over, the Property includes:',
        ])

        <div style="margin-left: 40px; margin-bottom: 12px;">
            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(i)',
                'text' => 'All buildings and fixtures and fittings which are situated on, or form part, of the Property at any time;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(ii)',
                'text' => 'The proceeds of sale of any part of the Property and any other monies paid or payable in respect of or in connection with the Property;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(iii)',
                'text' => 'The benefit of any covenants for title given, or entered into, by any predecessor in title of the Borrowers in respect of the Property and any monies paid or payable in respect of those covenants; and',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(iv)',
                'text' => 'All rights under any licence, agreement for sale or agreement for lease in respect of the Property.',
            ])
        </div>
    @endif
</div>

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '1.3',
    'title' => 'Schedules',
    'marginBottom' => '8px',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' => 'The Schedules forms part of this agreement and shall have effect as if set out in full in the body of this agreement. Any reference to this agreement includes the Schedules.',
    'marginBottom' => '14px',
])