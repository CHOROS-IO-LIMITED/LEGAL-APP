@if ($isPropertyDevelopment || $useLandDefinition)
    @include('pdf.loan-agreement.components.clause-heading', [
        'number' => '5.',
        'title' => 'DEVELOPMENT OBLIGATIONS',
    ])

    @if ($isPropertyDevelopment)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => '5.1',
            'text' =>
                'Where the Property (or any buildings thereon) are to be developed, the Borrower agrees with the Lender that it will:',
        ])

        <div style="margin-left: 30px; margin-bottom: 12px;">
            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(a)',
                'text' =>
                    'At all times comply with all local consents including planning permission and building regulation approval that are required in relation to any developments on the Property or any land forming part of the Property; and',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(b)',
                'text' =>
                    'provide such evidence as shall be required to prove that any new property erected on the Property, or any land forming part of the Property, has been properly registered with the National House Building Council or provide such other warranty or insurance as may be required to comply with this obligation.',
            ])
        </div>
    @endif

    @if ($useLandDefinition)
        @include('pdf.loan-agreement.components.clause-row', [
            'number' => $isPropertyDevelopment ? '5.2' : '5.1',
            'text' => 'In relation to the Property:',
        ])

        <div style="margin-left: 30px; margin-bottom: 12px;">
            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(a)',
                'text' =>
                    'the Borrower is the legal and beneficial owner of the Property and has good and marketable title to the Property;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(b)',
                'text' => $hasSecondCharge
                    ? 'save for the First Charge, the Property is free from any Security other than the Security created by this agreement;'
                    : ($hasFirstCharge
                        ? 'the Property is free from any Security other than the Security created by this agreement;'
                        : 'the Property is free from any Security;'),
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(c)',
                'text' =>
                    'the Borrowers have not received or acknowledged notice of any adverse claim by any person in respect of the Property or any interest in it;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(d)',
                'text' =>
                    'there are no covenants, agreements, reservations, conditions, interests, rights or other matters whatsoever, which materially adversely affect the Property;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(e)',
                'text' =>
                    'there is no breach of any law or regulation which materially adversely affects the Property;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(f)',
                'text' =>
                    'no facility necessary for the enjoyment and use of the Property is subject to terms entitling any person to terminate or curtail its use;',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(g)',
                'text' =>
                    'nothing has arisen, has been created or is subsisting which would be an overriding interest in the Property; and',
            ])

            @include('pdf.loan-agreement.components.list-row', [
                'marker' => '(h)',
                'text' =>
                    'there is no prohibition on the Borrower assigning its rights in the Property and the entry into this agreement by the Borrower does not and will not constitute a breach of any policy, agreement, document or instrument binding on the Borrower or its assets.',
            ])
        </div>
    @endif
@endif
