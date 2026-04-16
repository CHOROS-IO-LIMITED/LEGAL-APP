@php
    $lenderAssignmentAllowed = $data['lender_assignment_allowed'] ?? null;
    $borrowerAssignmentAllowed = $data['borrower_assignment_allowed'] ?? null;

    $lenderAssignmentText = $lenderAssignmentAllowed === 'yes' ? 'may' : 'cannot';
    $borrowerAssignmentText = $borrowerAssignmentAllowed === 'yes' ? 'may' : 'cannot';
@endphp

@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '23.',
    'title' => 'ASSIGNMENT AND TRANSFER',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '23.1',
    'text' => 'ASSIGNMENT BY THE LENDER',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' =>
        'The Lender ' .
        $lenderAssignmentText .
        ' assign or transfer the whole or any part of the Lender\'s rights and/or obligations under this agreement to any person or enter into any transaction which would result in any of those rights or obligations passing to another person without the prior written permission of the Borrower.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '23.2',
    'text' => 'ASSIGNMENT BY THE BORROWERS',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' =>
        'The Borrower ' .
        $borrowerAssignmentText .
        ' assign any of their rights, or transfer any of their obligations, under this agreement or enter into any transaction which would result in any of those rights or obligations passing to another person without the prior written permission of the Lender.',
])
