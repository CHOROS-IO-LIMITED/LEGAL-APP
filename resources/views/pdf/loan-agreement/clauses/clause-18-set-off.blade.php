@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '18.',
    'title' => 'SET-OFF',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '18.1',
    'text' =>
        'The Lender may at any time set off any liability of the Lender to the Borrower against any liability of the Borrower to the Lender, whether either liability is present or future, liquidated or unliquidated, and whether or not either liability arises under any Finance Document or otherwise. If the liabilities to be set off are expressed in different currencies, the Lender may convert either liability at a market rate of exchange for the purpose of set-off. Any exercise by the Lender of its rights under this clause 18.1 shall not limit or affect any other rights or remedies available to it under this agreement or any of the Finance Documents or otherwise.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '18.2',
    'text' =>
        'The Lender is not obliged to exercise any of its rights under clause 18.1, but if the rights are exercised, the Lender shall promptly notify the Borrower of the set-off that has been made.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '18.3',
    'text' =>
        'The Borrower may not set off any liability it has to the Lender against any liability the Lender has to the Borrower whether either liability is present or future, liquidated or unliquidated, and whether or not either liability arises under any Finance Document or otherwise.',
])
