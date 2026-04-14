<?php

// namespace App\Support\Documents\LoanAgreement;

// class LoanAgreementTemplateSchema
// {
//     public static function make(): array
//     {
//         return [
//             'document_type' => 'loan_agreement',
//             'renderer' => 'pdf_template',
//             'source_format' => 'pdf',

//             'preserve' => [
//                 'cover_page',
//                 'between_block',
//                 'contents_page',
//                 'clause_order',
//                 'clause_numbering',
//                 'schedule_order',
//                 'signature_structure',
//                 'defined_terms_structure',
//                 'headings_and_subheadings',
//             ],

//             'document_layout' => [
//                 'cover' => [
//                     'show_agreement_date' => true,
//                     'show_title' => true,
//                     'show_between_parties' => true,
//                 ],
//                 'contents' => [
//                     'title' => 'CONTENTS',
//                     'sections' => [
//                         'CLAUSES',
//                         'SCHEDULES',
//                     ],
//                 ],
//                 'clauses' => [
//                     ['number' => 1, 'title' => 'DEFINITIONS AND INTERPRETATION'],
//                     ['number' => 2, 'title' => 'THE FACILITY'],
//                     ['number' => 3, 'title' => 'PURPOSE'],
//                     ['number' => 4, 'title' => 'TERM'],
//                     ['number' => 5, 'title' => 'DEVELOPMENT OBLIGATIONS'],
//                     ['number' => 6, 'title' => 'CONDITIONS PRECEDENT'],
//                     ['number' => 7, 'title' => 'INTEREST'],
//                     ['number' => 8, 'title' => 'REPAYMENT'],
//                     ['number' => 9, 'title' => 'COST'],
//                     ['number' => 10, 'title' => 'PAYMENTS'],
//                     ['number' => 11, 'title' => 'SECURITY [IF APPLICABLE]'],
//                     ['number' => 12, 'title' => 'INSURANCE'],
//                     ['number' => 13, 'title' => 'LEASES AND LICENCES AFFECTING THE PROPERTY'],
//                     ['number' => 14, 'title' => 'REPRESENTATIONS AND WARRANTIES'],
//                     ['number' => 15, 'title' => 'REPETITION OF WARRANTIES'],
//                     ['number' => 16, 'title' => 'COVENANTS'],
//                     ['number' => 17, 'title' => 'EVENTS OF DEFAULT'],
//                     ['number' => 18, 'title' => 'SET-OFF'],
//                     ['number' => 19, 'title' => 'CALCULATIONS, ACCOUNTS, AND CERTIFICATES'],
//                     ['number' => 20, 'title' => 'AMENDMENTS, WAIVER AND CONSENTS AND REMEDIES'],
//                     ['number' => 21, 'title' => 'SEVERANCE'],
//                     ['number' => 22, 'title' => 'LIABILITY'],
//                     ['number' => 23, 'title' => 'ASSIGNMENT AND TRANSFER'],
//                     ['number' => 24, 'title' => 'CHANGE OF CONTROL'],
//                     ['number' => 25, 'title' => 'RAO EXEMPTION'],
//                     ['number' => 26, 'title' => 'COUNTERPARTS'],
//                     ['number' => 27, 'title' => 'EXECUTION'],
//                     ['number' => 28, 'title' => 'THIRD PARTY RIGHTS'],
//                     ['number' => 29, 'title' => 'NOTICES'],
//                     ['number' => 30, 'title' => 'ENTIRE AGREEMENT'],
//                     ['number' => 31, 'title' => 'GOVERNING LAW AND JURISDICTION'],
//                 ],
//                 'schedules' => [
//                     ['number' => 1, 'title' => 'CONDITIONS PRECEDENT'],
//                     ['number' => 2, 'title' => 'GUARANTORS'],
//                 ],
//             ],

//             'variables' => [
//                 'agreement_date',

//                 'lender_entity_type',
//                 'lender_full_name',
//                 'lender_address',
//                 'lender_company_name',
//                 'lender_company_number',
//                 'lender_registered_office_address',
//                 'lender_signatory_name',
//                 'lender_can_assign',

//                 'borrower_entity_type',
//                 'borrower_full_name',
//                 'borrower_address',
//                 'borrower_company_name',
//                 'borrower_company_number',
//                 'borrower_registered_office_address',
//                 'borrower_signatory_name',
//                 'borrower_can_assign',

//                 'loan_amount_gbp',
//                 'loan_amount_words',
//                 'secured_or_unsecured',
//                 'drawdown_method',
//                 'loan_term_months',
//                 'repayment_date',
//                 'repayment_terms',
//                 'repayment_bank_account_type',
//                 'loan_purpose',
//                 'loan_purpose_property_related',
//                 'property_project_type',
//                 'property_address',
//                 'property_title_number',

//                 'interest_structure',
//                 'interest_rate_value',
//                 'interest_payment_timing',
//                 'fixed_interest_amount',
//                 'default_interest_rate',

//                 'jurisdiction_exclusive',
//                 'jurisdiction_requested_location',

//                 'security_types',
//                 'first_charge_property_address',
//                 'first_charge_title_number',
//                 'second_charge_property_address',
//                 'second_charge_title_number',
//                 'debenture_required',

//                 'personal_guarantor_details',
//                 'personal_guarantor_connection',

//                 'multiple_borrowers',
//                 'additional_borrower_details',

//                 'borrower_company_operations_info_required',
//                 'company_info_audited_accounts',
//                 'company_info_monthly_management_accounts',
//                 'company_info_notices_to_shareholders_creditors',
//                 'company_info_other_reasonable_requests',

//                 'bankruptcy_search_requested',
//                 'additional_company_info_required',
//                 'anything_else',
//             ],

//             'derived_flags' => [
//                 'borrower_is_company',
//                 'lender_is_company',
//                 'has_multiple_borrowers',
//                 'is_staged_drawdown',
//                 'is_property_related',
//                 'is_property_development',
//                 'has_property_security',
//                 'has_first_charge',
//                 'has_second_charge',
//                 'has_debenture',
//                 'has_personal_guarantee',
//                 'is_overseas_repayment',
//                 'interest_is_fixed_sum',
//                 'interest_is_yearly',
//                 'interest_is_compounded',
//                 'interest_is_simple_end',
//                 'jurisdiction_is_exclusive',
//             ],

//             'assembly_rules' => [
//                 [
//                     'key' => 'cover_page_block',
//                     'description' => 'Render the cover page exactly as Loan Agreement / Between / Lender / Borrower before the contents page.',
//                 ],
//                 [
//                     'key' => 'contents_block',
//                     'description' => 'Render CONTENTS with CLAUSES and SCHEDULES using the exact clause and schedule order from the template.',
//                 ],
//                 [
//                     'key' => 'party_block',
//                     'description' => 'Choose individual or company party wording for lender and borrower in the BETWEEN section.',
//                 ],
//                 [
//                     'key' => 'background_block',
//                     'description' => 'Insert the loan background wording and list only the selected securities.',
//                 ],
//                 [
//                     'key' => 'definitions_block',
//                     'description' => 'Only include definitions that are relevant to the chosen security, interest, property, and guarantor setup.',
//                 ],
//                 [
//                     'key' => 'drawdown_block',
//                     'description' => 'Include staged drawdown provisions in clause 2.2 to 2.6 only when drawdown is in stages.',
//                 ],
//                 [
//                     'key' => 'development_block',
//                     'description' => 'Include clause 5 only when the loan purpose is property related or development related.',
//                 ],
//                 [
//                     'key' => 'security_block',
//                     'description' => 'Include clause 11 only when any security applies, and only include first charge, second charge, debenture, and guarantee wording that matches selected security.',
//                 ],
//                 [
//                     'key' => 'insurance_block',
//                     'description' => 'Include property insurance wording only where a property-backed or property-related loan applies.',
//                 ],
//                 [
//                     'key' => 'leases_block',
//                     'description' => 'Include clause 13 only where the transaction affects property or land security.',
//                 ],
//                 [
//                     'key' => 'company_borrower_block',
//                     'description' => 'Include company-specific constitutional, authority, accounts, and operational covenants only if the borrower is a company.',
//                 ],
//                 [
//                     'key' => 'liability_block',
//                     'description' => 'Clause 22 must apply only if there is more than one borrower.',
//                 ],
//                 [
//                     'key' => 'assignment_block',
//                     'description' => 'Render lender assignment and borrower assignment wording using the selected yes or no permissions.',
//                 ],
//                 [
//                     'key' => 'jurisdiction_block',
//                     'description' => 'Render exclusive or non-exclusive England and Wales jurisdiction wording based on the selected option.',
//                 ],
//                 [
//                     'key' => 'schedule_1_block',
//                     'description' => 'Include constitutional documents, finance, financial information, bankruptcy searches, and other evidence in Schedule 1 using company and security conditions.',
//                 ],
//                 [
//                     'key' => 'schedule_2_block',
//                     'description' => 'Include Schedule 2 only where a personal guarantee is selected and list all guarantors in order.',
//                 ],
//                 [
//                     'key' => 'execution_block',
//                     'description' => 'Render signature blocks for company or individual lender and borrower exactly in the template structure.',
//                 ],
//             ],

//             'sections' => [
//                 'cover_page' => [
//                     'title' => 'Loan Agreement',
//                     'fields' => [
//                         'agreement_date',
//                         'lender_full_name',
//                         'borrower_full_name',
//                     ],
//                 ],

//                 'between_section' => [
//                     'fields' => [
//                         'lender_entity_type',
//                         'lender_full_name',
//                         'lender_address',
//                         'lender_company_name',
//                         'lender_company_number',
//                         'lender_registered_office_address',
//                         'borrower_entity_type',
//                         'borrower_full_name',
//                         'borrower_address',
//                         'borrower_company_name',
//                         'borrower_company_number',
//                         'borrower_registered_office_address',
//                     ],
//                 ],

//                 'background_section' => [
//                     'fields' => [
//                         'loan_amount_gbp',
//                         'loan_amount_words',
//                         'secured_or_unsecured',
//                         'security_types',
//                         'personal_guarantor_details',
//                     ],
//                 ],

//                 'clauses' => [
//                     '1_definitions_and_interpretation' => true,
//                     '2_the_facility' => true,
//                     '3_purpose' => true,
//                     '4_term' => true,
//                     '5_development_obligations' => true,
//                     '6_conditions_precedent' => true,
//                     '7_interest' => true,
//                     '8_repayment' => true,
//                     '9_cost' => true,
//                     '10_payments' => true,
//                     '11_security' => true,
//                     '12_insurance' => true,
//                     '13_leases_and_licences_affecting_the_property' => true,
//                     '14_representations_and_warranties' => true,
//                     '15_repetition_of_warranties' => true,
//                     '16_covenants' => true,
//                     '17_events_of_default' => true,
//                     '18_set_off' => true,
//                     '19_calculations_accounts_and_certificates' => true,
//                     '20_amendments_waiver_and_consents_and_remedies' => true,
//                     '21_severance' => true,
//                     '22_liability' => true,
//                     '23_assignment_and_transfer' => true,
//                     '24_change_of_control' => true,
//                     '25_rao_exemption' => true,
//                     '26_counterparts' => true,
//                     '27_execution' => true,
//                     '28_third_party_rights' => true,
//                     '29_notices' => true,
//                     '30_entire_agreement' => true,
//                     '31_governing_law_and_jurisdiction' => true,
//                 ],

//                 'schedules' => [
//                     'schedule_1_conditions_precedent' => true,
//                     'schedule_2_guarantors' => true,
//                 ],

//                 'signature_blocks' => [
//                     'lender_signature',
//                     'borrower_signature',
//                 ],
//             ],

//             'output_contract' => [
//                 'format' => 'pdf',
//                 'must_preserve_heading_numbers' => true,
//                 'must_preserve_legal_sequence' => true,
//                 'must_preserve_clause_titles' => true,
//                 'must_preserve_schedule_titles' => true,
//                 'must_not_leave_placeholders' => true,
//                 'must_resolve_or_options' => true,
//                 'must_remove_drafting_notes' => true,
//                 'must_use_pdf_template_structure' => true,
//                 'must_keep_contents_structure' => true,
//                 'must_keep_signature_layout' => true,
//             ],
//         ];
//     }
// }
