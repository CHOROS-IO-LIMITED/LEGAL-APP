<?php

namespace App\Support\Documents\LoanAgreement;

use App\Enums\DocumentType;

final class LoanAgreementQuestionSchema
{
    public static function make(): array
    {
        return [
            'document_type' => DocumentType::LOAN_AGREEMENT->value,
            'version' => 5,
            'title' => 'Loan Agreement',
            'steps' => [
                [
                    'key' => 'agreement_details',
                    'title' => 'Agreement Details',
                    'description' => 'Basic agreement information.',
                    'questions' => [
                        [
                            'key' => 'agreement_date',
                            'label' => 'What is the agreement date?',
                            'type' => 'date',
                            'required' => true,
                        ],
                        [
                            'key' => 'confirm_same_person',
                            'label' => 'Are you the same person who was previously identified (ID’d)?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['yes', 'no'],
                        ],
                    ],
                ],
                [
                    'key' => 'form_completion',
                    'title' => 'Who is Completing the Form',
                    'description' => 'Identify who is answering the questions.',
                    'questions' => [
                        [
                            'key' => 'answering_party_role',
                            'label' => 'Who is completing this form?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['lender', 'borrower'],
                        ],
                    ],
                ],
                [
                    'key' => 'lender_details',
                    'title' => 'Lender Details',
                    'description' => 'Provide the lender details.',
                    'questions' => [
                        [
                            'key' => 'lender_entity_type',
                            'label' => 'Is the lender an individual or a company?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['individual', 'company'],
                            'follow_ups' => [
                                [
                                    'when' => [
                                        'field' => 'lender_entity_type',
                                        'operator' => 'equals',
                                        'value' => 'individual',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'lender_first_name',
                                            'label' => 'Lender first name',
                                            'type' => 'text',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'lender_middle_name',
                                            'label' => 'Lender middle name',
                                            'type' => 'text',
                                            'required' => false,
                                        ],
                                        [
                                            'key' => 'lender_last_name',
                                            'label' => 'Lender last name',
                                            'type' => 'text',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'lender_home_address',
                                            'label' => 'Lender full home address',
                                            'type' => 'textarea',
                                            'required' => true,
                                        ],
                                    ],
                                ],
                                [
                                    'when' => [
                                        'field' => 'lender_entity_type',
                                        'operator' => 'equals',
                                        'value' => 'company',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'lender_company_name',
                                            'label' => 'Lender company full name',
                                            'type' => 'text',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'lender_company_number',
                                            'label' => 'Lender company number',
                                            'type' => 'text',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'lender_company_address',
                                            'label' => 'Lender registered office address',
                                            'type' => 'textarea',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'lender_is_director',
                                            'label' => 'Are you a director of the lender company?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['yes', 'no'],
                                        ],
                                        [
                                            'key' => 'lender_director_will_sign',
                                            'label' => 'Will you be signing the document for the lender company?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['yes', 'no'],
                                            'follow_ups' => [
                                                [
                                                    'when' => [
                                                        'field' => 'lender_is_director',
                                                        'operator' => 'equals',
                                                        'value' => 'no',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'lender_company_position',
                                                            'label' => 'What is your position in the lender company?',
                                                            'type' => 'text',
                                                            'required' => true,
                                                        ],
                                                    ],
                                                ],
                                                [
                                                    'when' => [
                                                        'field' => 'lender_director_will_sign',
                                                        'operator' => 'equals',
                                                        'value' => 'yes',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'lender_signatory_first_name',
                                                            'label' => 'Lender signatory first name',
                                                            'type' => 'text',
                                                            'required' => true,
                                                        ],
                                                        [
                                                            'key' => 'lender_signatory_middle_name',
                                                            'label' => 'Lender signatory middle name',
                                                            'type' => 'text',
                                                            'required' => false,
                                                        ],
                                                        [
                                                            'key' => 'lender_signatory_last_name',
                                                            'label' => 'Lender signatory last name',
                                                            'type' => 'text',
                                                            'required' => true,
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'borrower_details',
                    'title' => 'Borrower Details',
                    'description' => 'Provide the borrower details.',
                    'questions' => [
                        [
                            'key' => 'borrower_count',
                            'label' => 'How many borrowers are there?',
                            'type' => 'number',
                            'required' => true,
                            'min' => 1,
                        ],
                        [
                            'key' => 'borrower_entity_type',
                            'label' => 'Is the borrower an individual or a company?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['individual', 'company'],
                            'follow_ups' => [
                                [
                                    'when' => [
                                        'field' => 'borrower_entity_type',
                                        'operator' => 'equals',
                                        'value' => 'individual',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'borrower_first_name',
                                            'label' => 'Borrower first name',
                                            'type' => 'text',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'borrower_middle_name',
                                            'label' => 'Borrower middle name',
                                            'type' => 'text',
                                            'required' => false,
                                        ],
                                        [
                                            'key' => 'borrower_last_name',
                                            'label' => 'Borrower last name',
                                            'type' => 'text',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'borrower_home_address',
                                            'label' => 'Borrower full home address',
                                            'type' => 'textarea',
                                            'required' => true,
                                        ],
                                    ],
                                ],
                                [
                                    'when' => [
                                        'field' => 'borrower_entity_type',
                                        'operator' => 'equals',
                                        'value' => 'company',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'borrower_company_name',
                                            'label' => 'Borrower company full name',
                                            'type' => 'text',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'borrower_company_number',
                                            'label' => 'Borrower company number',
                                            'type' => 'text',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'borrower_company_address',
                                            'label' => 'Borrower registered office address',
                                            'type' => 'textarea',
                                            'required' => true,
                                        ],
                                        [
                                            'key' => 'borrower_is_director',
                                            'label' => 'Are you a director of the borrower company?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['yes', 'no'],
                                        ],
                                        [
                                            'key' => 'borrower_director_will_sign',
                                            'label' => 'Will you be signing the document for the borrower company?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['yes', 'no'],
                                            'follow_ups' => [
                                                [
                                                    'when' => [
                                                        'field' => 'borrower_is_director',
                                                        'operator' => 'equals',
                                                        'value' => 'no',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'borrower_company_position',
                                                            'label' => 'What is your position in the borrower company?',
                                                            'type' => 'text',
                                                            'required' => true,
                                                        ],
                                                    ],
                                                ],
                                                [
                                                    'when' => [
                                                        'field' => 'borrower_director_will_sign',
                                                        'operator' => 'equals',
                                                        'value' => 'yes',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'borrower_signatory_first_name',
                                                            'label' => 'Borrower signatory first name',
                                                            'type' => 'text',
                                                            'required' => true,
                                                        ],
                                                        [
                                                            'key' => 'borrower_signatory_middle_name',
                                                            'label' => 'Borrower signatory middle name',
                                                            'type' => 'text',
                                                            'required' => false,
                                                        ],
                                                        [
                                                            'key' => 'borrower_signatory_last_name',
                                                            'label' => 'Borrower signatory last name',
                                                            'type' => 'text',
                                                            'required' => true,
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                        [
                                            'key' => 'borrower_operational_information_required',
                                            'label' => 'Does the lender want the borrower to provide ongoing information about its operations?',
                                            'type' => 'radio',
                                            'required' => false,
                                            'options' => ['yes', 'no'],
                                            'follow_ups' => [
                                                [
                                                    'when' => [
                                                        'field' => 'borrower_operational_information_required',
                                                        'operator' => 'equals',
                                                        'value' => 'yes',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'borrower_operational_information_items',
                                                            'label' => 'What information should the borrower provide to the lender?',
                                                            'type' => 'checkbox',
                                                            'required' => true,
                                                            'options' => [
                                                                'audited_annual_accounts',
                                                                'monthly_management_accounts',
                                                                'shareholder_or_creditor_notices',
                                                                'other_reasonably_requested_information',
                                                            ],
                                                            'option_labels' => [
                                                                'audited_annual_accounts' => 'Within 180 days (or sooner if available) after each financial year, audited consolidated accounts',
                                                                'monthly_management_accounts' => 'Within 30 days after the end of each month, monthly management accounts',
                                                                'shareholder_or_creditor_notices' => 'Promptly, all notices or other documents sent to shareholders or creditors generally',
                                                                'other_reasonably_requested_information' => 'Promptly, such financial or other information as the lender may reasonably request from time to time',
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'loan_terms',
                    'title' => 'Loan Terms',
                    'description' => 'Provide the commercial terms of the loan.',
                    'questions' => [
                        [
                            'key' => 'loan_amount',
                            'label' => 'How much is the loan for?',
                            'type' => 'number',
                            'required' => true,
                            'min' => 1,
                            'placeholder' => '50000',
                        ],
                        [
                            'key' => 'loan_security_type',
                            'label' => 'Is the loan secured or unsecured?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['secured', 'unsecured'],
                            'follow_ups' => [
                                [
                                    'when' => [
                                        'field' => 'loan_security_type',
                                        'operator' => 'equals',
                                        'value' => 'secured',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'security_types',
                                            'label' => 'What security is being offered for the loan?',
                                            'type' => 'checkbox',
                                            'required' => true,
                                            'options' => [
                                                'first_charge',
                                                'second_charge',
                                                'debenture',
                                                'personal_guarantee',
                                            ],
                                            'option_labels' => [
                                                'first_charge' => 'First charge on a property',
                                                'second_charge' => 'Second charge on a property',
                                                'debenture' => 'Debenture',
                                                'personal_guarantee' => 'Personal guarantee',
                                            ],
                                            'option_visibility' => [
                                                'debenture' => [
                                                    'field' => 'borrower_entity_type',
                                                    'operator' => 'equals',
                                                    'value' => 'company',
                                                ],
                                            ],
                                        ],
                                        [
                                            'key' => 'security_type_explanation',
                                            'label' => 'Guidance',
                                            'type' => 'info',
                                            'required' => false,
                                            'content' => 'A first charge usually gives the lender first priority over the property. A second charge ranks behind an existing first charge. A debenture is generally used where the borrower is a company. A personal guarantee requires one or more guarantors to guarantee the borrower’s obligations.',
                                        ],
                                        [
                                            'key' => 'security_first_charge_group',
                                            'label' => 'First charge details',
                                            'type' => 'group',
                                            'required' => false,
                                            'follow_ups' => [
                                                [
                                                    'when' => [
                                                        'field' => 'security_types',
                                                        'operator' => 'contains',
                                                        'value' => 'first_charge',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'first_charge_property_address',
                                                            'label' => 'What is the property address for the first charge?',
                                                            'type' => 'textarea',
                                                            'required' => true,
                                                        ],
                                                        [
                                                            'key' => 'first_charge_title_number',
                                                            'label' => 'What is the Land Registry title number for the first charge property?',
                                                            'type' => 'text',
                                                            'required' => false,
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                        [
                                            'key' => 'security_second_charge_group',
                                            'label' => 'Second charge details',
                                            'type' => 'group',
                                            'required' => false,
                                            'follow_ups' => [
                                                [
                                                    'when' => [
                                                        'field' => 'security_types',
                                                        'operator' => 'contains',
                                                        'value' => 'second_charge',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'second_charge_property_address',
                                                            'label' => 'What is the property address for the second charge?',
                                                            'type' => 'textarea',
                                                            'required' => true,
                                                        ],
                                                        [
                                                            'key' => 'second_charge_title_number',
                                                            'label' => 'What is the Land Registry title number for the second charge property?',
                                                            'type' => 'text',
                                                            'required' => false,
                                                        ],
                                                        [
                                                            'key' => 'second_charge_consent_required',
                                                            'label' => 'Does the borrower need consent from the first charge holder for the second charge?',
                                                            'type' => 'radio',
                                                            'required' => true,
                                                            'options' => ['yes', 'no', 'unknown'],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                        [
                                            'key' => 'security_debenture_group',
                                            'label' => 'Debenture details',
                                            'type' => 'group',
                                            'required' => false,
                                            'follow_ups' => [
                                                [
                                                    'when' => [
                                                        'field' => 'security_types',
                                                        'operator' => 'contains',
                                                        'value' => 'debenture',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'debenture_secured_assets_description',
                                                            'label' => 'Describe the secured assets or business assets, if needed',
                                                            'type' => 'textarea',
                                                            'required' => false,
                                                            'placeholder' => 'Optional drafting detail',
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                        [
                                            'key' => 'security_personal_guarantee_group',
                                            'label' => 'Personal guarantee details',
                                            'type' => 'group',
                                            'required' => false,
                                            'follow_ups' => [
                                                [
                                                    'when' => [
                                                        'field' => 'security_types',
                                                        'operator' => 'contains',
                                                        'value' => 'personal_guarantee',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'guarantors',
                                                            'label' => 'Guarantors',
                                                            'type' => 'repeater',
                                                            'required' => true,
                                                            'min_items' => 1,
                                                            'item_label' => 'Guarantor',
                                                            'add_button_label' => 'Add guarantor',
                                                            'fields' => [
                                                                [
                                                                    'key' => 'name',
                                                                    'label' => 'What is the guarantor’s full name?',
                                                                    'type' => 'text',
                                                                    'required' => true,
                                                                ],
                                                                [
                                                                    'key' => 'connection',
                                                                    'label' => 'What is the guarantor’s connection to the borrower?',
                                                                    'type' => 'text',
                                                                    'required' => false,
                                                                    'placeholder' => 'Director, shareholder, spouse, friend, etc.',
                                                                ],
                                                                [
                                                                    'key' => 'is_director_of_borrower',
                                                                    'label' => 'Is this guarantor a director of the borrower?',
                                                                    'type' => 'radio',
                                                                    'required' => false,
                                                                    'options' => ['yes', 'no'],
                                                                ],
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        [
                            'key' => 'loan_drawdown_type',
                            'label' => 'Will the loan be taken all at once or in stages?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['all_at_once', 'in_stages'],
                        ],
                        [
                            'key' => 'loan_term_months',
                            'label' => 'How long is the loan for (in months)?',
                            'type' => 'number',
                            'required' => true,
                            'min' => 1,
                            'placeholder' => '12',
                        ],
                        [
                            'key' => 'loan_purpose_guidance',
                            'label' => 'Purpose guidance',
                            'type' => 'info',
                            'required' => false,
                            'content' => 'The agreement will state the Purpose of the loan. That means the Borrower may only use the funds for that stated Purpose. The Purpose should therefore be as specific and clear as possible.',
                        ],
                        [
                            'key' => 'loan_purpose',
                            'label' => 'What is the purpose of the loan?',
                            'type' => 'textarea',
                            'required' => true,
                            'placeholder' => 'For example: to fund the deposit and acquisition costs for the purchase of 10 High Street, London',
                        ],
                        [
                            'key' => 'purpose_is_property_development',
                            'label' => 'Is the purpose related to any kind of property development?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['yes', 'no'],
                            'follow_ups' => [
                                [
                                    'when' => [
                                        'field' => 'purpose_is_property_development',
                                        'operator' => 'equals',
                                        'value' => 'yes',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'development_property_address',
                                            'label' => 'What is the address of the development property?',
                                            'type' => 'textarea',
                                            'required' => false,
                                        ],
                                        [
                                            'key' => 'development_type',
                                            'label' => 'Is the loan for the creation of a property, renovation of a property, or both?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['creation', 'renovation', 'both'],
                                        ],
                                        [
                                            'key' => 'development_exit_strategy',
                                            'label' => 'Once completed, is the property intended to be sold, rented, or either?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['sold', 'rented', 'either'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        [
                            'key' => 'property_control_required',
                            'label' => 'If the loan relates to a property, should the borrower need the lender’s prior written consent before dealing with that property?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['yes', 'no'],
                            'follow_ups' => [
                                [
                                    'when' => [
                                        'field' => 'property_control_required',
                                        'operator' => 'equals',
                                        'value' => 'yes',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'property_control_occupy_restriction',
                                            'label' => 'Should there be a restriction on occupying the property without the lender’s prior written consent?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['yes', 'no'],
                                        ],
                                        [
                                            'key' => 'property_control_create_interest_restriction',
                                            'label' => 'Should there be a restriction on creating or granting any interest in the property in favour of a third party without the lender’s prior written consent?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['yes', 'no'],
                                        ],
                                        [
                                            'key' => 'property_control_rent_restriction',
                                            'label' => 'Should there be a restriction on renting out the property without the lender’s prior written consent?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['yes', 'no'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        [
                            'key' => 'interest_structure',
                            'label' => 'Is the interest a fixed amount irrespective of time, or a rate of interest?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['fixed_amount', 'rate'],
                            'option_labels' => [
                                'fixed_amount' => 'Fixed amount irrespective of time',
                                'rate' => 'Rate of interest',
                            ],
                            'follow_ups' => [
                                [
                                    'when' => [
                                        'field' => 'interest_structure',
                                        'operator' => 'equals',
                                        'value' => 'fixed_amount',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'fixed_interest_amount',
                                            'label' => 'What fixed amount of interest will be charged for the loan term?',
                                            'type' => 'number',
                                            'required' => true,
                                            'min' => 0,
                                            'placeholder' => '10000',
                                        ],
                                        [
                                            'key' => 'fixed_interest_irrespective_of_duration',
                                            'label' => 'Should that fixed interest still be payable even if the borrower repays earlier during the term?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['yes', 'no'],
                                        ],
                                    ],
                                ],
                                [
                                    'when' => [
                                        'field' => 'interest_structure',
                                        'operator' => 'equals',
                                        'value' => 'rate',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'interest_rate_percent',
                                            'label' => 'What is the interest rate (%)?',
                                            'type' => 'number',
                                            'required' => true,
                                            'min' => 0,
                                            'placeholder' => '10',
                                        ],
                                        [
                                            'key' => 'interest_payment_timing',
                                            'label' => 'How will the interest be paid?',
                                            'type' => 'radio',
                                            'required' => true,
                                            'options' => ['monthly', 'yearly', 'rolled_up'],
                                            'option_labels' => [
                                                'monthly' => 'Monthly',
                                                'yearly' => 'Yearly',
                                                'rolled_up' => 'Rolled up and paid at the end',
                                            ],
                                            'follow_ups' => [
                                                [
                                                    'when' => [
                                                        'field' => 'interest_payment_timing',
                                                        'operator' => 'equals',
                                                        'value' => 'rolled_up',
                                                    ],
                                                    'questions' => [
                                                        [
                                                            'key' => 'rolled_up_interest_compounds',
                                                            'label' => 'If interest is rolled up, should it compound (interest on interest)?',
                                                            'type' => 'radio',
                                                            'required' => true,
                                                            'options' => ['yes', 'no'],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        [
                            'key' => 'default_interest_rate_percent',
                            'label' => 'What default interest rate should apply on late payment above the Bank of England base rate (%)?',
                            'type' => 'number',
                            'required' => false,
                            'min' => 0,
                            'placeholder' => '4',
                        ],
                        [
                            'key' => 'repayment_account_location',
                            'label' => 'Will repayments be made to a UK bank account or an overseas bank account?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['uk', 'overseas'],
                            'option_labels' => [
                                'uk' => 'UK bank account',
                                'overseas' => 'Overseas bank account',
                            ],
                            'follow_ups' => [
                                [
                                    'when' => [
                                        'field' => 'repayment_account_location',
                                        'operator' => 'equals',
                                        'value' => 'overseas',
                                    ],
                                    'questions' => [
                                        [
                                            'key' => 'repayment_overseas_bank_country',
                                            'label' => 'Which country is the repayment bank account located in?',
                                            'type' => 'text',
                                            'required' => false,
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        [
                            'key' => 'lender_assignment_allowed',
                            'label' => 'Can the lender assign or transfer its rights and/or obligations under the agreement?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['yes', 'no'],
                        ],
                        [
                            'key' => 'borrower_assignment_allowed',
                            'label' => 'Can the borrower assign or transfer its rights and/or obligations under the agreement?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['yes', 'no'],
                        ],
                        [
                            'key' => 'execution_method',
                            'label' => 'How should the completed document be executed?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['wet_ink_or_electronic', 'electronic_only'],
                            'option_labels' => [
                                'wet_ink_or_electronic' => 'Wet-ink or electronic signature',
                                'electronic_only' => 'Electronic signature only (including DocuSign-style signing)',
                            ],
                        ],
                        [
                            'key' => 'use_docusign_execution',
                            'label' => 'Does the person answering want to execute the completed document via a DocuSign-type facility?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['yes', 'no'],
                        ],
                        [
                            'key' => 'exclusive_jurisdiction',
                            'label' => 'Are you happy for the courts of England and Wales to have exclusive jurisdiction over any dispute or claim connected with the agreement?',
                            'type' => 'radio',
                            'required' => true,
                            'options' => ['yes', 'no'],
                        ],
                        [
                            'key' => 'jurisdiction_guidance',
                            'label' => 'Jurisdiction guidance',
                            'type' => 'info',
                            'required' => false,
                            'content' => 'This agreement is drafted under the laws of England and Wales and that cannot be changed. It is usual for the courts of England and Wales to have exclusive jurisdiction. If you choose no, the clause will instead state that the courts of England and Wales have non-exclusive jurisdiction.',
                        ],
                    ],
                ],
                [
                    'key' => 'conditions_precedent',
                    'title' => 'Conditions Precedent',
                    'description' => 'Additional lender requirements before the loan is advanced.',
                    'questions' => [
                        [
                            'key' => 'include_board_resolutions',
                            'label' => 'Should board resolutions from the borrower company be required?',
                            'type' => 'radio',
                            'options' => ['yes', 'no'],
                            'required' => false,
                        ],
                        [
                            'key' => 'include_shareholder_resolutions',
                            'label' => 'Should shareholder resolutions be required?',
                            'type' => 'radio',
                            'options' => ['yes', 'no'],
                            'required' => false,
                        ],
                        [
                            'key' => 'require_bankruptcy_search',
                            'label' => 'Should bankruptcy searches be required?',
                            'type' => 'radio',
                            'options' => ['yes', 'no'],
                            'required' => false,
                        ],
                    ],
                ],
            ],
        ];
    }
}
