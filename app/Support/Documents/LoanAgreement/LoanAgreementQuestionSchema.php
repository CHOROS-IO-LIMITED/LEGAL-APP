<?php

namespace App\Support\Documents\LoanAgreement;

class LoanAgreementQuestionSchema
{
    public static function make(): array
    {
        return [
            'document_type' => 'loan_agreement',
            'questions' => [
                [
                    'key' => 'agreement_date',
                    'label' => 'What is the agreement date?',
                    'type' => 'date',
                    'required' => true,
                ],
                [
                    'key' => 'confirm_same_person',
                    'label' => 'Are you the same person previously identified for this matter?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                ],
                [
                    'key' => 'party_role',
                    'label' => 'Are you completing this as the lender or the borrower?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['lender', 'borrower'],
                ],
                [
                    'key' => 'acting_capacity',
                    'label' => 'Are you acting personally or on behalf of a company you own or are a director of?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['personally', 'company'],
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'acting_capacity',
                                'operator' => 'equals',
                                'value' => 'company',
                            ],
                            'questions' => [
                                [
                                    'key' => 'client_company_name',
                                    'label' => 'What is the full company name?',
                                    'type' => 'text',
                                    'required' => true,
                                    'help_text' => 'Please enter the exact company name manually.',
                                ],
                                [
                                    'key' => 'client_is_director',
                                    'label' => 'Are you a director of that company?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                    'follow_ups' => [
                                        [
                                            'when' => [
                                                'field' => 'client_is_director',
                                                'operator' => 'equals',
                                                'value' => 'yes',
                                            ],
                                            'questions' => [
                                                [
                                                    'key' => 'client_signatory_full_name',
                                                    'label' => 'What is your full legal name for the signatory section?',
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
                [
                    'key' => 'lender_entity_type',
                    'label' => 'Is the lender an individual or a company?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['individual', 'company'],
                    'follow_ups' => [
                        [
                            'when' => ['field' => 'lender_entity_type', 'operator' => 'equals', 'value' => 'individual'],
                            'questions' => [
                                [
                                    'key' => 'lender_full_name',
                                    'label' => 'What is the lender’s full legal name?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'lender_address',
                                    'label' => 'What is the lender’s full address?',
                                    'type' => 'textarea',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'lender_signatory_name',
                                    'label' => 'What is the lender signatory name?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                            ],
                        ],
                        [
                            'when' => ['field' => 'lender_entity_type', 'operator' => 'equals', 'value' => 'company'],
                            'questions' => [
                                [
                                    'key' => 'lender_company_name',
                                    'label' => 'What is the lender company’s full name?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'lender_company_number',
                                    'label' => 'What is the lender company number?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'lender_registered_office_address',
                                    'label' => 'What is the lender company’s registered office address?',
                                    'type' => 'textarea',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'lender_signatory_name',
                                    'label' => 'What is the full legal name of the lender’s signatory?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'borrower_entity_type',
                    'label' => 'Is the borrower an individual or a company?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['individual', 'company'],
                    'follow_ups' => [
                        [
                            'when' => ['field' => 'borrower_entity_type', 'operator' => 'equals', 'value' => 'individual'],
                            'questions' => [
                                [
                                    'key' => 'borrower_full_name',
                                    'label' => 'What is the borrower’s full legal name?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'borrower_address',
                                    'label' => 'What is the borrower’s full address?',
                                    'type' => 'textarea',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'borrower_signatory_name',
                                    'label' => 'What is the borrower signatory name?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'multiple_borrowers',
                                    'label' => 'Is there more than one borrower?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                    'follow_ups' => [
                                        [
                                            'when' => ['field' => 'multiple_borrowers', 'operator' => 'equals', 'value' => 'yes'],
                                            'questions' => [
                                                [
                                                    'key' => 'joint_and_several_acknowledgement',
                                                    'label' => 'Do you understand that the borrowers’ liabilities under the loan agreement will be joint and several?',
                                                    'type' => 'checkbox',
                                                    'required' => true,
                                                    'options' => ['I understand'],
                                                ],
                                                [
                                                    'key' => 'additional_borrower_details',
                                                    'label' => 'Please provide the full names and addresses of the additional borrower(s).',
                                                    'type' => 'textarea',
                                                    'required' => true,
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        [
                            'when' => ['field' => 'borrower_entity_type', 'operator' => 'equals', 'value' => 'company'],
                            'questions' => [
                                [
                                    'key' => 'borrower_company_name',
                                    'label' => 'What is the borrower company’s full name?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'borrower_company_number',
                                    'label' => 'What is the borrower company number?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'borrower_registered_office_address',
                                    'label' => 'What is the borrower company’s registered office address?',
                                    'type' => 'textarea',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'borrower_signatory_name',
                                    'label' => 'What is the full legal name of the borrower’s signatory?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'loan_amount_gbp',
                    'label' => 'How much is the loan for in pounds sterling?',
                    'type' => 'number',
                    'required' => true,
                    'min' => 1,
                ],
                [
                    'key' => 'secured_or_unsecured',
                    'label' => 'Is the loan secured or unsecured?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['secured', 'unsecured'],
                ],
                [
                    'key' => 'drawdown_method',
                    'label' => 'Will the loan be taken all at once or in stages?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['all_at_once', 'in_stages'],
                ],
                [
                    'key' => 'loan_term_months',
                    'label' => 'How many months is the loan term?',
                    'type' => 'number',
                    'required' => true,
                    'min' => 1,
                ],
                [
                    'key' => 'repayment_terms',
                    'label' => 'Can the loan be repaid early or paid off in stages?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['early_repayment_allowed', 'stage_repayments_allowed', 'both', 'neither'],
                ],
                [
                    'key' => 'repayment_bank_account_type',
                    'label' => 'Will repayments be made to a UK bank account or an overseas bank account?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['uk', 'overseas'],
                ],
                [
                    'key' => 'security_types',
                    'label' => 'What security is being offered for the loan?',
                    'type' => 'checkbox',
                    'required' => true,
                    'options' => ['first_charge_property', 'second_charge_property', 'debenture', 'personal_guarantee'],
                    'help_text' => 'You may choose more than one option.',
                ],
                [
                    'key' => 'first_charge_property_address',
                    'label' => 'What is the full address of the property for the first charge?',
                    'type' => 'textarea',
                    'required' => false,
                    'follow_ups' => [
                        [
                            'when' => ['field' => 'security_types', 'operator' => 'equals', 'value' => 'first_charge_property'],
                            'questions' => [
                                [
                                    'key' => 'first_charge_title_number',
                                    'label' => 'What is the title number for the first charge property?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'second_charge_property_address',
                    'label' => 'What is the full address of the property for the second charge?',
                    'type' => 'textarea',
                    'required' => false,
                ],
                [
                    'key' => 'second_charge_title_number',
                    'label' => 'What is the title number for the second charge property?',
                    'type' => 'text',
                    'required' => false,
                ],
                [
                    'key' => 'personal_guarantor_details',
                    'label' => 'Please provide the full details of the person giving the personal guarantee.',
                    'type' => 'textarea',
                    'required' => false,
                ],
                [
                    'key' => 'personal_guarantor_connection',
                    'label' => 'What is that person’s connection to the borrower?',
                    'type' => 'text',
                    'required' => false,
                ],
                [
                    'key' => 'upsell_pg_agreement',
                    'label' => 'Would you like to add a Personal Guarantee agreement for a discounted price after completing this agreement?',
                    'type' => 'select',
                    'required' => false,
                    'options' => ['yes', 'no'],
                    'is_upsell' => true,
                ],
                [
                    'key' => 'loan_purpose',
                    'label' => 'What is the purpose of the loan?',
                    'type' => 'textarea',
                    'required' => true,
                ],
                [
                    'key' => 'loan_purpose_property_related',
                    'label' => 'Is the loan purpose related to any kind of property development?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'follow_ups' => [
                        [
                            'when' => ['field' => 'loan_purpose_property_related', 'operator' => 'equals', 'value' => 'yes'],
                            'questions' => [
                                [
                                    'key' => 'property_project_type',
                                    'label' => 'Is the property being created or renovated to be sold, rented, or either?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['sold', 'rented', 'either'],
                                ],
                                [
                                    'key' => 'property_control_information_level',
                                    'label' => 'How much control information about the property should be included?',
                                    'type' => 'textarea',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'property_restriction_occupy',
                                    'label' => 'Should there be an occupation restriction?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'property_restriction_third_party_interest',
                                    'label' => 'Should there be a third-party interest restriction?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'property_restriction_renting',
                                    'label' => 'Should there be a renting restriction?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'interest_structure',
                    'label' => 'Is interest charged as a rate or as a fixed amount?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['rate', 'fixed_amount'],
                    'follow_ups' => [
                        [
                            'when' => ['field' => 'interest_structure', 'operator' => 'equals', 'value' => 'rate'],
                            'questions' => [
                                [
                                    'key' => 'interest_rate_value',
                                    'label' => 'What is the interest rate?',
                                    'type' => 'text',
                                    'required' => true,
                                    'placeholder' => 'Example: 10',
                                ],
                                [
                                    'key' => 'interest_payment_timing',
                                    'label' => 'Will interest be paid monthly, yearly, rolled up and compounded, or rolled up without compounding?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['monthly', 'yearly', 'rolled_up_compound', 'rolled_up_simple'],
                                ],
                            ],
                        ],
                        [
                            'when' => ['field' => 'interest_structure', 'operator' => 'equals', 'value' => 'fixed_amount'],
                            'questions' => [
                                [
                                    'key' => 'fixed_interest_amount',
                                    'label' => 'What is the fixed interest amount?',
                                    'type' => 'number',
                                    'required' => true,
                                    'min' => 0,
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'default_interest_rate',
                    'label' => 'What default interest rate above the Bank of England base rate should apply?',
                    'type' => 'number',
                    'required' => true,
                    'min' => 0,
                ],
                [
                    'key' => 'borrower_company_operations_info_required',
                    'label' => 'If the borrower is a company, does the lender want significant information about the borrower’s operations?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'follow_ups' => [
                        [
                            'when' => ['field' => 'borrower_company_operations_info_required', 'operator' => 'equals', 'value' => 'yes'],
                            'questions' => [
                                [
                                    'key' => 'company_info_audited_accounts',
                                    'label' => 'Require audited consolidated accounts?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'company_info_monthly_management_accounts',
                                    'label' => 'Require monthly management accounts?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'company_info_notices_to_shareholders_creditors',
                                    'label' => 'Require notices to shareholders/creditors?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'company_info_other_reasonable_requests',
                                    'label' => 'Require other reasonable information requests?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'lender_assignment_allowed',
                    'label' => 'Can the lender assign the agreement?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                ],
                [
                    'key' => 'borrower_assignment_allowed',
                    'label' => 'Can the borrower assign the agreement?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                ],
                [
                    'key' => 'upsell_execution_service',
                    'label' => 'Would you like to execute the completed document via an e-signature facility?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'is_upsell' => true,
                ],
                [
                    'key' => 'jurisdiction_exclusive',
                    'label' => 'Are you happy for the courts of England and Wales to have exclusive jurisdiction over disputes?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'follow_ups' => [
                        [
                            'when' => ['field' => 'jurisdiction_exclusive', 'operator' => 'equals', 'value' => 'no'],
                            'questions' => [
                                [
                                    'key' => 'jurisdiction_requested_location',
                                    'label' => 'If not, where would you want disputes to be dealt with?',
                                    'type' => 'text',
                                    'required' => true,
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'additional_company_info_required',
                    'label' => 'If the borrower is a company, what additional information does the lender want on the company, directors, or shareholders before giving the loan?',
                    'type' => 'textarea',
                    'required' => false,
                ],
                [
                    'key' => 'upsell_board_resolutions',
                    'label' => 'Would you like board resolutions approving entry into the agreement?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'is_upsell' => true,
                ],
                [
                    'key' => 'upsell_shareholder_resolution',
                    'label' => 'Would you like a shareholder resolution approving the loan and security documents?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'is_upsell' => true,
                ],
                [
                    'key' => 'bankruptcy_search_requested',
                    'label' => 'Would you like a clear bankruptcy search against the guarantor, borrower, and all directors/shareholders?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                ],
                [
                    'key' => 'anything_else',
                    'label' => 'Is there anything else not already covered that should be passed to the human creator?',
                    'type' => 'textarea',
                    'required' => false,
                ],
            ],
        ];
    }
}
