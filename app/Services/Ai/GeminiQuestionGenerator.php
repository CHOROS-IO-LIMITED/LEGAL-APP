<?php

namespace App\Services\Ai;

use App\Models\Document;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class GeminiQuestionGenerator
{
    public function __construct(
        protected DocumentTextExtractor $documentTextExtractor
    ) {}

    public function generateFromDocument(Document $document): array
    {
        if ($this->isLoanAgreementDocument($document)) {
            return $this->loanAgreementSchema();
        }

        $apiKey = config('services.gemini.api_key');
        $primaryModel = config('services.gemini.model', 'gemini-3-flash-preview');
        $fallbackModel = config('services.gemini.fallback_model', 'gemini-3-flash-preview');
        $timeout = (int) config('services.gemini.timeout', 60);
        $disk = config('services.gemini.template_disk', 'public_documents');

        if (! $apiKey) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        if (! $document->document_path) {
            throw new RuntimeException('Document template path is missing.');
        }

        $mainPath = Storage::disk($disk)->path($document->document_path);

        if (! is_file($mainPath)) {
            throw new RuntimeException("Main document not found: {$mainPath}");
        }

        $referencePath = $this->resolveReferencePath((string) $document->title);

        $mainText = $this->getCachedExtractedText(
            path: $mainPath,
            cacheKey: 'gemini_main_text_' . md5($mainPath . '|' . @filemtime($mainPath)),
            label: 'main_document',
            documentId: $document->id
        );

        $referenceText = null;

        if ($referencePath && is_file($referencePath)) {
            $referenceText = $this->getCachedExtractedText(
                path: $referencePath,
                cacheKey: 'gemini_reference_text_' . md5($referencePath . '|' . @filemtime($referencePath)),
                label: 'reference_document',
                documentId: $document->id
            );
        }

        $payload = $this->buildPayload(
            document: $document,
            mainText: $mainText,
            referenceText: $referenceText,
        );

        $cacheKey = 'gemini_questions_' . md5(json_encode([
            'document_id' => $document->id,
            'document_updated_at' => (string) $document->updated_at,
            'primary_model' => $primaryModel,
            'fallback_model' => $fallbackModel,
            'main_hash' => sha1($mainText),
            'reference_hash' => $referenceText ? sha1($referenceText) : null,
            'payload_version' => 3,
        ]));

        return Cache::remember($cacheKey, now()->addHours(12), function () use (
            $apiKey,
            $primaryModel,
            $fallbackModel,
            $timeout,
            $payload,
            $document
        ) {
            try {
                $json = $this->requestGemini(
                    apiKey: $apiKey,
                    model: $primaryModel,
                    timeout: $timeout,
                    payload: $payload,
                    documentId: $document->id
                );
            } catch (RuntimeException $e) {
                Log::warning('Primary Gemini model failed, trying fallback model.', [
                    'document_id' => $document->id,
                    'primary_model' => $primaryModel,
                    'fallback_model' => $fallbackModel,
                    'message' => $e->getMessage(),
                ]);

                $json = $this->requestGemini(
                    apiKey: $apiKey,
                    model: $fallbackModel,
                    timeout: $timeout,
                    payload: $payload,
                    documentId: $document->id
                );
            }

            $decoded = $this->decodeResponse($json, $document->id);

            return $this->normalizeSchema($decoded);
        });
    }

    protected function isLoanAgreementDocument(Document $document): bool
    {
        $title = $this->normalizeTitle((string) $document->title);

        return $title === 'loan agreement'
            || str_contains($title, 'loan agreement');
    }

    protected function loanAgreementSchema(): array
    {
        return [
            'document_type' => 'loan_agreement',
            'questions' => [
                [
                    'key' => 'confirm_same_person',
                    'label' => 'Are you the same person previously identified for this matter?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                ],
                [
                    'key' => 'party_role',
                    'label' => 'Are you the lender or the borrower?',
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
                                    'action_trigger' => 'company_lookup',
                                    'help_text' => 'We will retrieve the company name, company number, and registered office address for confirmation.',
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
                            'when' => [
                                'field' => 'lender_entity_type',
                                'operator' => 'equals',
                                'value' => 'individual',
                            ],
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
                                    'label' => 'What is the lender company’s full name?',
                                    'type' => 'text',
                                    'required' => true,
                                    'action_trigger' => 'company_lookup',
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
                            'when' => [
                                'field' => 'borrower_entity_type',
                                'operator' => 'equals',
                                'value' => 'individual',
                            ],
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
                                    'key' => 'multiple_borrowers',
                                    'label' => 'Is there more than one borrower?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                    'follow_ups' => [
                                        [
                                            'when' => [
                                                'field' => 'multiple_borrowers',
                                                'operator' => 'equals',
                                                'value' => 'yes',
                                            ],
                                            'questions' => [
                                                [
                                                    'key' => 'joint_and_several_acknowledgement',
                                                    'label' => 'Do you understand that the borrowers’ liabilities under the loan agreement will be joint and several?',
                                                    'type' => 'checkbox',
                                                    'required' => true,
                                                    'options' => ['I understand'],
                                                    'help_text' => 'This means each borrower can be liable for the full amount, not just a share.',
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
                            'when' => [
                                'field' => 'borrower_entity_type',
                                'operator' => 'equals',
                                'value' => 'company',
                            ],
                            'questions' => [
                                [
                                    'key' => 'borrower_company_name',
                                    'label' => 'What is the borrower company’s full name?',
                                    'type' => 'text',
                                    'required' => true,
                                    'action_trigger' => 'company_lookup',
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
                    'placeholder' => 'Example: 100000',
                ],
                [
                    'key' => 'drawdown_method',
                    'label' => 'Will the loan be taken all at once or in stages?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['all_at_once', 'in_stages'],
                ],
                [
                    'key' => 'loan_term',
                    'label' => 'How long is the loan for?',
                    'type' => 'text',
                    'required' => true,
                    'placeholder' => 'Example: 12 months',
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
                    'options' => [
                        'first_charge_property',
                        'second_charge_property',
                        'debenture',
                        'personal_guarantee',
                    ],
                    'help_text' => 'You may choose more than one option.',
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'security_types',
                                'operator' => 'truthy',
                            ],
                            'questions' => [
                                [
                                    'key' => 'security_additional_notes',
                                    'label' => 'Please provide any additional details about the security being offered.',
                                    'type' => 'textarea',
                                    'required' => false,
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'has_first_charge_property',
                    'label' => 'Is a first charge over a property being used as security?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'has_first_charge_property',
                                'operator' => 'equals',
                                'value' => 'yes',
                            ],
                            'questions' => [
                                [
                                    'key' => 'first_charge_property_address',
                                    'label' => 'What is the full address of the property for the first charge?',
                                    'type' => 'textarea',
                                    'required' => true,
                                    'action_trigger' => 'land_registry_title_lookup',
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'has_second_charge_property',
                    'label' => 'Is a second charge over a property being used as security?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'help_text' => 'Properties with a main mortgage will usually require the main lender to retain the first charge. The borrower may need consent from the first charge holder.',
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'has_second_charge_property',
                                'operator' => 'equals',
                                'value' => 'yes',
                            ],
                            'questions' => [
                                [
                                    'key' => 'second_charge_property_address',
                                    'label' => 'What is the full address of the property for the second charge?',
                                    'type' => 'textarea',
                                    'required' => true,
                                    'action_trigger' => 'land_registry_title_lookup',
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'has_debenture',
                    'label' => 'Is a debenture being provided as security?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'has_debenture',
                                'operator' => 'equals',
                                'value' => 'yes',
                            ],
                            'questions' => [
                                [
                                    'key' => 'debenture_acknowledgement',
                                    'label' => 'Please confirm that a debenture is only applicable where the borrower is a company.',
                                    'type' => 'checkbox',
                                    'required' => true,
                                    'options' => ['Confirmed'],
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key' => 'has_personal_guarantee',
                    'label' => 'Is a personal guarantee being provided?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'has_personal_guarantee',
                                'operator' => 'equals',
                                'value' => 'yes',
                            ],
                            'questions' => [
                                [
                                    'key' => 'personal_guarantor_details',
                                    'label' => 'Please provide the full details of the person giving the personal guarantee.',
                                    'type' => 'textarea',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'personal_guarantor_connection',
                                    'label' => 'What is that person’s connection to the borrower?',
                                    'type' => 'text',
                                    'required' => true,
                                    'placeholder' => 'Example: director, shareholder',
                                ],
                                [
                                    'key' => 'upsell_pg_agreement',
                                    'label' => 'Would you like to add a Personal Guarantee agreement for a discounted price after completing this agreement?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                    'is_upsell' => true,
                                    'help_text' => 'This process is similar but simpler because personal guarantees are quite standard.',
                                ],
                            ],
                        ],
                    ],
                ],

                [
                    'key' => 'loan_purpose',
                    'label' => 'What is the purpose of the loan?',
                    'type' => 'textarea',
                    'required' => true,
                    'help_text' => 'This purpose will be stated in the agreement. The borrower may only use the funds for that stated purpose.',
                ],
                [
                    'key' => 'loan_purpose_property_related',
                    'label' => 'Is the loan purpose related to any kind of property development?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'loan_purpose_property_related',
                                'operator' => 'equals',
                                'value' => 'yes',
                            ],
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
                                    'label' => 'How much control information is the borrower happy to give, or the lender wants, in relation to the property?',
                                    'type' => 'textarea',
                                    'required' => true,
                                ],
                                [
                                    'key' => 'property_restriction_occupy',
                                    'label' => 'Should there be a restriction preventing the borrower or connected persons from occupying the property without the lender’s prior written consent?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'property_restriction_third_party_interest',
                                    'label' => 'Should there be a restriction preventing the borrower from creating or granting any interest in the property to a third party without the lender’s prior written consent?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'property_restriction_renting',
                                    'label' => 'Should there be a restriction preventing the borrower from renting out the property without the lender’s prior written consent?',
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
                    'label' => 'Is interest being charged as a rate or as a fixed amount irrespective of time?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['rate', 'fixed_amount'],
                    'help_text' => 'A fixed amount means, for example, on a £100,000 loan for 1 year, agreeing to pay £10,000 interest even if repaid early.',
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'interest_structure',
                                'operator' => 'equals',
                                'value' => 'rate',
                            ],
                            'questions' => [
                                [
                                    'key' => 'interest_rate_value',
                                    'label' => 'What is the interest rate?',
                                    'type' => 'text',
                                    'required' => true,
                                    'placeholder' => 'Example: 10% per annum',
                                ],
                                [
                                    'key' => 'interest_payment_timing',
                                    'label' => 'Will interest be paid monthly, yearly, or rolled up and paid at the end?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['monthly', 'yearly', 'rolled_up'],
                                    'follow_ups' => [
                                        [
                                            'when' => [
                                                'field' => 'interest_payment_timing',
                                                'operator' => 'equals',
                                                'value' => 'rolled_up',
                                            ],
                                            'questions' => [
                                                [
                                                    'key' => 'interest_compounds',
                                                    'label' => 'Will the rolled-up interest compound?',
                                                    'type' => 'select',
                                                    'required' => true,
                                                    'options' => ['yes', 'no'],
                                                    'help_text' => 'For example, on a £100,000 loan at 10% for two years, does year two interest apply to £100,000 only, or to £110,000 including year one interest?',
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        [
                            'when' => [
                                'field' => 'interest_structure',
                                'operator' => 'equals',
                                'value' => 'fixed_amount',
                            ],
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
                    'key' => 'borrower_company_operations_info_required',
                    'label' => 'If the borrower is a company, does the lender want significant information about the borrower’s operations?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'borrower_company_operations_info_required',
                                'operator' => 'equals',
                                'value' => 'yes',
                            ],
                            'questions' => [
                                [
                                    'key' => 'company_info_audited_accounts',
                                    'label' => 'Should the borrower provide audited consolidated accounts within 180 days after the financial year ends?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'company_info_monthly_management_accounts',
                                    'label' => 'Should the borrower provide monthly management accounts within 30 days after month-end?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'company_info_notices_to_shareholders_creditors',
                                    'label' => 'Should the borrower promptly dispatch all notices and documents sent to shareholders or creditors?',
                                    'type' => 'select',
                                    'required' => true,
                                    'options' => ['yes', 'no'],
                                ],
                                [
                                    'key' => 'company_info_other_reasonable_requests',
                                    'label' => 'Should the borrower promptly provide financial or other information as reasonably requested by the lender?',
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
                    'label' => 'Can the lender assign or pass the agreement’s benefits and obligations to someone else?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                ],
                [
                    'key' => 'borrower_assignment_allowed',
                    'label' => 'Can the borrower assign or pass the agreement’s benefits and obligations to someone else?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                ],

                [
                    'key' => 'upsell_execution_service',
                    'label' => 'Would you like to execute the completed document via a DocuSign-type facility?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'is_upsell' => true,
                    'help_text' => 'This is an add-on service for a price.',
                ],

                [
                    'key' => 'jurisdiction_exclusive',
                    'label' => 'Are you happy for the courts of England and Wales to have exclusive jurisdiction over disputes?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'help_text' => 'This is usual. The agreement is drafted under the laws of England and Wales and that cannot be changed.',
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'jurisdiction_exclusive',
                                'operator' => 'equals',
                                'value' => 'no',
                            ],
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
                    'label' => 'Would you like board resolutions approving entry into the agreement, authorising execution and notices, confirming borrowing powers are not exceeded, and confirming entry is in the borrower’s commercial interests?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'is_upsell' => true,
                    'help_text' => 'This incurs an additional fee.',
                ],
                [
                    'key' => 'upsell_shareholder_resolution',
                    'label' => 'Would you like a shareholder resolution approving the loan and security documents?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'is_upsell' => true,
                    'help_text' => 'This incurs an additional fee.',
                ],
                [
                    'key' => 'bankruptcy_search_requested',
                    'label' => 'Would you like a clear bankruptcy search against the guarantor, borrower, and all directors/shareholders (including and excluding middle names)?',
                    'type' => 'select',
                    'required' => true,
                    'options' => ['yes', 'no'],
                    'follow_ups' => [
                        [
                            'when' => [
                                'field' => 'bankruptcy_search_requested',
                                'operator' => 'equals',
                                'value' => 'yes',
                            ],
                            'questions' => [
                                [
                                    'key' => 'bankruptcy_search_limitation_acknowledged',
                                    'label' => 'Do you understand that a full bankruptcy search requires a Land Registry D16 form sent by post, so the bot cannot do it, but an insolvency register search may still be offered?',
                                    'type' => 'checkbox',
                                    'required' => true,
                                    'options' => ['I understand'],
                                    'help_text' => 'The insolvency register only shows entities that have already gone into insolvency, not those currently going through it.',
                                ],
                            ],
                        ],
                    ],
                ],

                [
                    'key' => 'anything_else',
                    'label' => 'Is there anything else not already covered that should be passed to the human creator?',
                    'type' => 'textarea',
                    'required' => false,
                    'help_text' => 'If it is new information, it will be passed to the human creator to read and amend as needed.',
                ],
            ],
        ];
    }

    protected function buildPayload(Document $document, string $mainText, ?string $referenceText): array
    {
        return [
            'systemInstruction' => [
                'parts' => [
                    [
                        'text' => implode("\n", [
                            'You are a legal intake schema generator.',
                            'Return valid JSON only.',
                            'Strictly follow the response schema.',
                            'Generate a question tree with nested follow_ups.',
                            'One question per node.',
                            'No grouped fields.',
                            'No fields array.',
                            'Do not invent unsupported legal questions.',
                            'All keys must be globally unique.',
                            'Branching questions must use type "select".',
                            'Do not use type "checkbox" for questions with follow_ups.',
                            'Preserve the sequence and actions from any supplied reference intake text.',
                        ]),
                    ],
                ],
            ],
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        [
                            'text' => $this->buildPrompt(
                                documentTitle: (string) $document->title,
                                documentDescription: (string) ($document->description ?? ''),
                                mainText: $mainText,
                                referenceText: $referenceText,
                            ),
                        ],
                    ],
                ],
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'responseSchema' => $this->responseSchema(maxDepth: 5),
                'temperature' => 0.0,
                'topP' => 0.8,
                'topK' => 20,
                'maxOutputTokens' => 8192,
                'thinkingConfig' => [
                    'thinkingBudget' => 0,
                ],
            ],
        ];
    }

    protected function requestGemini(
        string $apiKey,
        string $model,
        int $timeout,
        array $payload,
        int|string|null $documentId = null
    ): array {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        try {
            $response = Http::timeout($timeout)
                ->connectTimeout(15)
                ->retry(1, 1000, throw: false)
                ->acceptJson()
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->withQueryParameters([
                    'key' => $apiKey,
                ])
                ->post($url, $payload);
        } catch (ConnectionException $e) {
            Log::error('Gemini timeout error', [
                'document_id' => $documentId,
                'model' => $model,
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException("Gemini request timed out on model {$model}.");
        }

        if (! $response->successful()) {
            Log::error('Gemini API failed', [
                'document_id' => $documentId,
                'model' => $model,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException("Gemini request failed on model {$model}.");
        }

        return $response->json();
    }

    protected function resolveReferencePath(string $title): ?string
    {
        $references = config('services.gemini.question_references', []);
        $normalizedTitle = $this->normalizeTitle($title);

        if (isset($references[$normalizedTitle])) {
            return $references[$normalizedTitle];
        }

        foreach ($references as $key => $path) {
            $normalizedKey = $this->normalizeTitle((string) $key);

            if (
                $normalizedTitle === $normalizedKey ||
                str_contains($normalizedTitle, $normalizedKey) ||
                str_contains($normalizedKey, $normalizedTitle)
            ) {
                return $path;
            }
        }

        return null;
    }

    protected function normalizeTitle(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/[^a-z0-9]+/i', ' ', $value) ?? $value;
        $value = preg_replace('/\s+/', ' ', $value) ?? $value;

        return trim($value);
    }

    protected function getCachedExtractedText(
        string $path,
        string $cacheKey,
        string $label,
        int|string|null $documentId = null,
    ): string {
        return Cache::remember($cacheKey, now()->addDays(7), function () use ($path, $label, $documentId) {
            try {
                $text = $this->documentTextExtractor->extract($path);
                $text = $this->cleanText($text);

                if ($text !== '') {
                    return match ($label) {
                        'reference_document' => $this->truncateText($text, 10000),
                        default => $this->truncateText($text, 15000),
                    };
                }
            } catch (\Throwable $e) {
                Log::warning('Document text extraction failed', [
                    'path' => $path,
                    'label' => $label,
                    'document_id' => $documentId,
                    'message' => $e->getMessage(),
                ]);
            }

            throw new RuntimeException("Unable to extract text from {$label}.");
        });
    }

    protected function buildPrompt(
        string $documentTitle,
        string $documentDescription,
        string $mainText,
        ?string $referenceText,
    ): string {
        $hasReference = $referenceText ? 'YES' : 'NO';

        return <<<PROMPT
You are generating a highly structured legal intake questionnaire schema.

OUTPUT RULES:
- Return valid JSON only.
- Strictly match the response schema.
- Build a decision tree, not a flat list.
- Ask one question at a time in the exact logical order.
- Use follow_ups for every conditional path.
- Deep nesting is allowed.
- Do not ask duplicate questions.
- Do not ask irrelevant questions.
- Every question must be grounded in the supplied text.
- If reference intake text is supplied, preserve its sequence as closely as possible.

FIELD RULES:
- key: snake_case
- type: text | textarea | number | select | checkbox | date
- required: true/false
- use options for select and checkbox
- use help_text when legal explanation is useful
- use placeholder where useful
- use "action_trigger" where the frontend must call an external process
- use "is_upsell" when offering additional paid services

DOCUMENT:
Title: {$documentTitle}
Description: {$documentDescription}

REFERENCE PROVIDED: {$hasReference}

MAIN TEMPLATE TEXT:
<<<MAIN_TEMPLATE
{$mainText}
MAIN_TEMPLATE

REFERENCE QUESTION TEXT:
<<<REFERENCE
{$referenceText}
REFERENCE

Now generate the JSON schema.
PROMPT;
    }

    protected function responseSchema(int $maxDepth = 4): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'document_type' => [
                    'type' => 'string',
                ],
                'questions' => [
                    'type' => 'array',
                    'items' => $this->questionSchema($maxDepth),
                ],
            ],
            'required' => ['document_type', 'questions'],
        ];
    }

    protected function questionSchema(int $depth): array
    {
        $schema = [
            'type' => 'object',
            'properties' => [
                'key' => ['type' => 'string'],
                'label' => ['type' => 'string'],
                'type' => [
                    'type' => 'string',
                    'enum' => ['text', 'textarea', 'number', 'select', 'checkbox', 'date'],
                ],
                'required' => ['type' => 'boolean'],
                'placeholder' => ['type' => 'string'],
                'help_text' => ['type' => 'string'],
                'action_trigger' => ['type' => 'string'],
                'is_upsell' => ['type' => 'boolean'],
                'min' => ['type' => 'number'],
                'max' => ['type' => 'number'],
                'options' => [
                    'type' => 'array',
                    'items' => ['type' => 'string'],
                ],
            ],
            'required' => ['key', 'label', 'type', 'required'],
        ];

        if ($depth > 0) {
            $schema['properties']['follow_ups'] = [
                'type' => 'array',
                'items' => [
                    'type' => 'object',
                    'properties' => [
                        'when' => [
                            'type' => 'object',
                            'properties' => [
                                'field' => ['type' => 'string'],
                                'operator' => [
                                    'type' => 'string',
                                    'enum' => ['equals', 'not_equals', 'truthy', 'falsy'],
                                ],
                                'value' => ['type' => 'string'],
                            ],
                            'required' => ['field', 'operator'],
                        ],
                        'questions' => [
                            'type' => 'array',
                            'items' => $this->questionSchema($depth - 1),
                        ],
                    ],
                    'required' => ['when', 'questions'],
                ],
            ];
        }

        return $schema;
    }

    protected function decodeResponse(array $json, int|string|null $documentId = null): array
    {
        $text = data_get($json, 'candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            Log::error('Gemini empty response', [
                'document_id' => $documentId,
                'response' => $json,
            ]);

            throw new RuntimeException('Gemini returned an empty response.');
        }

        $text = trim($text);

        if (str_starts_with($text, '```')) {
            $text = preg_replace('/^```(?:json)?\s*/', '', $text) ?? $text;
            $text = preg_replace('/\s*```$/', '', $text) ?? $text;
            $text = trim($text);
        }

        $decoded = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
            Log::error('Gemini invalid JSON', [
                'document_id' => $documentId,
                'error' => json_last_error_msg(),
                'raw_text' => $text,
            ]);

            throw new RuntimeException('Gemini returned invalid JSON: ' . json_last_error_msg());
        }

        if (
            ! isset($decoded['document_type']) ||
            ! isset($decoded['questions']) ||
            ! is_array($decoded['questions'])
        ) {
            Log::error('Gemini schema mismatch', [
                'document_id' => $documentId,
                'decoded' => $decoded,
            ]);

            throw new RuntimeException('Gemini JSON does not match the expected structure.');
        }

        return $decoded;
    }

    protected function normalizeSchema(array $decoded): array
    {
        $seen = [];

        return [
            'document_type' => (string) ($decoded['document_type'] ?? 'document'),
            'questions' => $this->normalizeQuestions($decoded['questions'] ?? [], $seen),
        ];
    }

    protected function normalizeQuestions(array $questions, array &$seen = []): array
    {
        $result = [];

        foreach ($questions as $question) {
            if (! is_array($question)) {
                continue;
            }

            $key = $this->normalizeKey((string) Arr::get($question, 'key', ''));

            if ($key === '') {
                continue;
            }

            $key = $this->ensureUniqueKey($key, $seen);
            $type = $this->normalizeType((string) Arr::get($question, 'type', 'text'));

            $normalized = [
                'key' => $key,
                'label' => trim((string) Arr::get($question, 'label', $key)),
                'type' => $type,
                'required' => (bool) Arr::get($question, 'required', false),
            ];

            foreach (['placeholder', 'help_text', 'action_trigger'] as $textField) {
                $value = trim((string) Arr::get($question, $textField, ''));

                if ($value !== '') {
                    $normalized[$textField] = $value;
                }
            }

            if (array_key_exists('is_upsell', $question)) {
                $normalized['is_upsell'] = (bool) Arr::get($question, 'is_upsell', false);
            }

            foreach (['min', 'max'] as $bound) {
                if (array_key_exists($bound, $question) && is_numeric($question[$bound])) {
                    $normalized[$bound] = $question[$bound] + 0;
                }
            }

            if (in_array($type, ['select', 'checkbox'], true)) {
                $options = array_values(array_unique(array_filter(array_map(
                    fn($value) => trim((string) $value),
                    Arr::get($question, 'options', [])
                ))));

                if ($type === 'select' && $options === []) {
                    $options = ['yes', 'no'];
                }

                if ($options !== []) {
                    $normalized['options'] = $options;
                }
            }

            $seen[$key] = true;

            $followUps = Arr::get($question, 'follow_ups', []);

            if (is_array($followUps) && $followUps !== []) {
                $normalizedFollowUps = [];

                foreach ($followUps as $followUp) {
                    if (! is_array($followUp)) {
                        continue;
                    }

                    $when = Arr::get($followUp, 'when', []);
                    $field = $this->normalizeKey((string) Arr::get($when, 'field', ''));
                    $operator = (string) Arr::get($when, 'operator', '');

                    if ($field === '' || ! in_array($operator, ['equals', 'not_equals', 'truthy', 'falsy'], true)) {
                        continue;
                    }

                    $item = [
                        'when' => [
                            'field' => $field,
                            'operator' => $operator,
                        ],
                    ];

                    if (in_array($operator, ['equals', 'not_equals'], true)) {
                        $value = Arr::get($when, 'value');

                        if (! is_scalar($value) || trim((string) $value) === '') {
                            continue;
                        }

                        $item['when']['value'] = trim((string) $value);
                    }

                    $nestedQuestions = $this->normalizeQuestions(
                        Arr::get($followUp, 'questions', []),
                        $seen
                    );

                    if ($nestedQuestions === []) {
                        continue;
                    }

                    $item['questions'] = $nestedQuestions;
                    $normalizedFollowUps[] = $item;
                }

                if ($normalizedFollowUps !== []) {
                    $normalized['follow_ups'] = $normalizedFollowUps;
                }
            }

            $normalized = $this->enforceQuestionRules($normalized);

            $result[] = $normalized;
        }

        return array_values($result);
    }

    protected function ensureUniqueKey(string $key, array &$seen): string
    {
        $base = $key;
        $counter = 2;

        while (isset($seen[$key])) {
            $key = "{$base}_{$counter}";
            $counter++;
        }

        return $key;
    }

    protected function enforceQuestionRules(array $question): array
    {
        $type = $question['type'] ?? 'text';
        $hasFollowUps = ! empty($question['follow_ups']);

        if ($hasFollowUps && $type === 'checkbox') {
            $question['type'] = 'select';
            $question['options'] = ['yes', 'no'];
        }

        if (($question['type'] ?? null) === 'select' && empty($question['options'])) {
            $question['options'] = ['yes', 'no'];
        }

        if (($question['type'] ?? null) !== 'select' && isset($question['options']) && $question['options'] === []) {
            unset($question['options']);
        }

        return $question;
    }

    protected function normalizeKey(string $key): string
    {
        $key = strtolower(trim($key));
        $key = preg_replace('/[^a-z0-9]+/', '_', $key) ?? $key;
        $key = preg_replace('/_+/', '_', $key) ?? $key;

        return trim($key, '_');
    }

    protected function normalizeType(string $type): string
    {
        $type = strtolower(trim($type));

        return match ($type) {
            'string', 'input' => 'text',
            'integer', 'float', 'decimal' => 'number',
            'radio', 'dropdown', 'bool', 'boolean' => 'select',
            default => in_array($type, ['text', 'textarea', 'number', 'select', 'checkbox', 'date'], true)
                ? $type
                : 'text',
        };
    }

    protected function cleanText(string $text): string
    {
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
        $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;

        return trim($text);
    }

    protected function truncateText(string $text, int $maxChars): string
    {
        if (mb_strlen($text) <= $maxChars) {
            return $text;
        }

        return mb_substr($text, 0, $maxChars);
    }
}
