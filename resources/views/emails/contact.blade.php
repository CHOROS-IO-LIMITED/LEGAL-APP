<x-mail::message>
    {!!
    '<table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif; background-color:#FCF9F2; padding:20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border:1px solid #E0DAD4;">
                    <tr>
                        <td style="padding:20px; text-align:center; font-size:20px; font-weight:bold; color:#2E2A26;">
                            New Contact Message
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px; border-top:1px solid #E0DAD4;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-weight:bold; width:120px;">Name:</td>
                                    <td>' . $data['first_name'] . ' ' . $data['last_name'] . '</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:bold; padding-top:8px;">Email:</td>
                                    <td style="padding-top:8px;">' . $data['email'] . '</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px; border-top:1px solid #E0DAD4;">
                            <strong>Message:</strong><br>' . nl2br(e($data['message'])) . '
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>'
    !!}
</x-mail::message>
