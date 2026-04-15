<div style="font-weight: 700; text-transform: uppercase; margin-top: 16px; margin-bottom: 8px;">
    BACKGROUND
</div>

<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
    <tr>
        <td style="width: 30px; vertical-align: top;">
            (A)
        </td>
        <td style="vertical-align: top;">
            The Lender has agreed to provide the Borrower with a
            {{ $loanSecurityType === 'secured' ? 'secured' : 'unsecured' }}
            term loan of
            £{{ $loanAmount ?: '[ENTER AMOUNT HERE]' }}
            ({{ $loanAmountWords ?: '[amount in words] Sterling' }})
            under the terms of the agreement below.
        </td>
    </tr>
</table>

@if ($loanSecurityType === 'secured' && !empty($securityItems))
    <table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
        <tr>
            <td style="width: 30px; vertical-align: top;">
                (B)
            </td>
            <td style="vertical-align: top;">
                As security of its obligations under this agreement, the Borrower wishes to offer the
                Lender the following securities:
            </td>
        </tr>
    </table>

    <div style="margin-left: 30px; margin-bottom: 14px;">
        @foreach ($securityItems as $index => $item)
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 30px;"></td>
                    <td style="width: 30px; vertical-align: top;">
                        {{ $index === 0 ? 'i.' : ($index === 1 ? 'ii.' : ($index === 2 ? 'iii.' : $index + 1 . '.')) }}
                    </td>
                    <td style="vertical-align: top;">
                        {{ $item }}
                    </td>
                </tr>
            </table>
        @endforeach
    </div>
@endif
