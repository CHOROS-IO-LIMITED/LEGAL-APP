<div style="margin-top: 10px;">
    <div style="font-weight: 700; font-size: 14pt; margin-bottom: 18px; text-transform: uppercase;">
        Contents
    </div>

    <div style="border-bottom: 1px solid #000; margin-bottom: 24px;"></div>

    <div style="font-weight: 700; margin-bottom: 14px; text-transform: uppercase;">
        Clauses
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 26px;">
        @foreach ($contents as $item)
            <tr>
                <td style="width: 40px; vertical-align: top; padding: 6px 0;">
                    {{ $item['number'] }}
                </td>
                <td style="vertical-align: top; padding: 6px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="white-space: nowrap; padding-right: 8px;">
                                {{ $item['title'] }}
                            </td>
                            <td style="width: 100%; border-bottom: 1px dotted #000;"></td>
                            <td style="white-space: nowrap; padding-left: 8px; text-align: right;">
                                {{ $item['page'] }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        @endforeach
    </table>

    @if (!empty($schedules))
        <div style="font-weight: 700; margin-bottom: 14px; text-transform: uppercase;">
            Schedules
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            @foreach ($schedules as $item)
                <tr>
                    <td style="width: 40px; vertical-align: top; padding: 6px 0;">
                        {{ $item['number'] }}
                    </td>
                    <td style="vertical-align: top; padding: 6px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="white-space: nowrap; padding-right: 8px;">
                                    {{ $item['title'] }}
                                </td>
                                <td style="width: 100%; border-bottom: 1px dotted #000;"></td>
                                <td style="white-space: nowrap; padding-left: 8px; text-align: right;">
                                    {{ $item['page'] }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            @endforeach
        </table>
    @endif
</div>
