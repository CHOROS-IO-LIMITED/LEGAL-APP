<div style="margin-bottom: 14px;">
    This agreement is dated {{ $displayDateLine }}
</div>

<div style="font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">
    BETWEEN
</div>

<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
    <tr>
        <td style="width: 30px; vertical-align: top;">
            (1)
        </td>
        <td style="vertical-align: top;">
            @if ($lenderIsCompany)
                <strong>{{ $lender['company_name'] ?? '[Company Name]' }}</strong>, a company incorporated in
                England and Wales with company number {{ $lender['company_number'] ?? '[ENTER COMPANY NUMBER]' }}
                whose registered offices is at
                {{ $lender['company_address'] ?? '[ENTER REGISTERED OFFICE ADDRESS]' }}
                (the <strong>“Lender”</strong>).
            @else
                <strong>{{ $lender['full_name'] ?? '[Individual’s Name]' }}</strong> of
                {{ $lender['address'] ?? '[ENTER HOME ADDRESS OF INDIVIDUAL]' }}
                (the <strong>“Lender”</strong>); and
            @endif
        </td>
    </tr>
</table>

<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
    <tr>
        <td style="width: 30px; vertical-align: top;">
            (2)
        </td>
        <td style="vertical-align: top;">
            @if ($borrowerIsCompany)
                <strong>{{ $borrower['company_name'] ?? '[Company Name]' }}</strong>, a company incorporated in
                England and Wales with company number {{ $borrower['company_number'] ?? '[ENTER COMPANY NUMBER]' }}
                whose registered offices is at
                {{ $borrower['company_address'] ?? '[ENTER REGISTERED OFFICE ADDRESS]' }}
                (the <strong>“Borrower”</strong>).
            @else
                <strong>{{ $borrower['full_name'] ?? '[Individual’s Name]' }}</strong> of
                {{ $borrower['address'] ?? '[ENTER HOME ADDRESS OF INDIVIDUAL]' }}
                (the <strong>“Borrower”</strong>).
            @endif
        </td>
    </tr>
</table>
