<div style="margin-bottom: 30px;">
    This agreement has been entered into on the date stated at the beginning of it.
</div>

@if ($lenderIsCompany)
    <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 42px;">
        <tr>
            <td style="width: 54%; vertical-align: top; padding-right: 26px;">
                <p style="margin: 0; padding: 0;">
                    Signed by {{ $lender['signatory']['name'] ?? 'NAME OF DIRECTOR' }}, acting as
                    a {{ $lender['signatory']['title'] ?? 'director' }}, for and on behalf of
                    <strong>{{ $lender['company_name'] ?? '[COMPANY NAME]' }}</strong>
                </p>
            </td>
            <td style="width: 46%; vertical-align: top;">
                <div style="padding-top: 20px;">
                    <div style="width: 100%; border-top: 1px solid #000; height: 0; margin: 0 0 10px 0;"></div>
                    <p style="margin: 0 0 2px 0; padding: 0;">{{ $lender['signatory']['title'] ?? 'Director' }}</p>
                    <p style="margin: 0; padding: 0; font-weight: 700;">Lender</p>
                </div>
            </td>
        </tr>
    </table>
@else
    <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 42px;">
        <tr>
            <td style="width: 54%; vertical-align: top; padding-right: 26px;">
                <p style="margin: 0; padding: 0;">Signed by {{ $lender['full_name'] ?? '[ENTER NAME]' }}</p>
            </td>
            <td style="width: 46%; vertical-align: top;">
                <div style="padding-top: 20px;">
                    <div style="width: 100%; border-top: 1px solid #000; height: 0; margin: 0 0 10px 0;"></div>
                    <p style="margin: 0 0 2px 0; padding: 0;">
                        {{ $lender['full_name'] ?? '[ENTER LENDER’S NAME, IF LENDER IS AN INDIVIDUAL]' }}
                    </p>
                    <p style="margin: 0; padding: 0; font-weight: 700;">Lender</p>
                </div>
            </td>
        </tr>
    </table>
@endif

@if ($borrowerIsCompany)
    <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 42px;">
        <tr>
            <td style="width: 54%; vertical-align: top; padding-right: 26px;">
                <p style="margin: 0; padding: 0;">
                    Signed by {{ $borrower['signatory']['name'] ?? '[ENTER NAME]' }}, acting as a
                    {{ $borrower['signatory']['title'] ?? 'director' }}, for and on behalf of
                    <strong>{{ $borrower['company_name'] ?? '[ENTER BORROWER’S COMPANY NAME]' }}</strong>
                </p>
            </td>
            <td style="width: 46%; vertical-align: top;">
                <div style="padding-top: 20px;">
                    <div style="width: 100%; border-top: 1px solid #000; height: 0; margin: 0 0 10px 0;"></div>
                    <p style="margin: 0 0 2px 0; padding: 0;">{{ $borrower['signatory']['title'] ?? 'Director' }}</p>
                    <p style="margin: 0; padding: 0; font-weight: 700;">Borrower</p>
                </div>
            </td>
        </tr>
    </table>
@else
    <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
        <tr>
            <td style="width: 54%; vertical-align: top; padding-right: 26px;">
                <p style="margin: 0; padding: 0;">Signed by {{ $borrower['full_name'] ?? '[ENTER NAME]' }}</p>
            </td>
            <td style="width: 46%; vertical-align: top;">
                <div style="padding-top: 20px;">
                    <div style="width: 100%; border-top: 1px solid #000; height: 0; margin: 0 0 10px 0;"></div>
                    <p style="margin: 0 0 2px 0; padding: 0;">
                        {{ $borrower['full_name'] ?? '[ENTER BORROWER’S NAME, IF BORROWER IS AN INDIVIDUAL]' }}
                    </p>
                    <p style="margin: 0; padding: 0; font-weight: 700;">Borrower</p>
                </div>
            </td>
        </tr>
    </table>
@endif
