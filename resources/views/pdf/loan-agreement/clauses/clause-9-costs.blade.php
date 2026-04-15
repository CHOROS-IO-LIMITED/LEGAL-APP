@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '9.',
    'title' => 'COSTS',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '9.1',
    'text' =>
        'Each party shall pay for their own costs associated with the negotiation and preparation, execution, amendment, extension, alteration and preservation of this agreement and/or any of the Finance Documents.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '9.2',
    'text' =>
        'The Borrower shall pay, on demand, all costs and expenses (together with any value added tax on them) that the Lender incurs in connection the enforcement of this agreement and/or any of the Finance Documents.',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '9.3',
    'text' =>
        'The Borrower shall pay any stamp, documentary and other similar duties and taxes to which the Finance Documents may be subject, or give rise and shall indemnify the Lender against any losses or liabilities that it may incur as a result of any delay or omission by the Borrower in paying any such duties or taxes.',
    'marginBottom' => '14px',
])
