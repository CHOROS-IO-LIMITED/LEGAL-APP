{!!
'<table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, sans-serif; background-color:#F2EDE4; padding:30px 0;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border:1px solid #E0DAD4; border-radius:8px; overflow:hidden;">

                <!-- LOGO -->
                <tr>
                    <td style="padding:20px 0; text-align:center; background-color:#FCF9F2;">
                        <img src="https://github.com/Siegenetics404/choros-signature-assets/blob/main/dd-logo.png?raw=true" alt="Logo" style="max-width:120px; height:auto; display:block; margin:auto;">
                    </td>
                </tr>

                <!-- TITLE -->
                <tr>
                    <td style="padding:15px 30px; text-align:center; font-size:22px; font-weight:bold; color:#2E2A26;">
                        New Contact Message
                    </td>
                </tr>

                <!-- INFO -->
                <tr>
                    <td style="padding:20px 30px; border-top:1px solid #E0DAD4; font-size:16px; color:#2E2A26;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="font-weight:bold; width:120px; vertical-align:top; padding-bottom:8px;">Name:</td>
                                <td style="padding-bottom:8px;">' . e($data['first_name']) . ' ' . e($data['last_name']) . '</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; vertical-align:top; padding-bottom:8px;">Email:</td>
                                <td style="padding-bottom:8px;">' . e($data['email']) . '</td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- MESSAGE -->
                <tr>
                    <td style="padding:20px 30px; border-top:1px solid #E0DAD4; font-size:16px; color:#2E2A26; line-height:1.5;">
                        <strong>Message:</strong><br>' . nl2br(e($data['message'])) . '
                    </td>
                </tr>

                <!-- FOOTER (optional, subtle spacing) -->
                <tr>
                    <td style="padding:15px 30px; text-align:center; font-size:12px; color:#999999;">
                        This is a message from your contact page at Daver & Daver.
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>'
!!}
