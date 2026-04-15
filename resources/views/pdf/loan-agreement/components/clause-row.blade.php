<table style="width: 100%; border-collapse: collapse; margin-bottom: {{ $marginBottom ?? '8px' }};">
    <tr>
        <td style="width: 30px; vertical-align: top;">
            {{ $number ?? '' }}
        </td>
        <td style="vertical-align: top;">
            @isset($title)
                <strong>{{ $title }}</strong>
                @if (!empty($text))
                    <br>
                @endif
            @endisset

            {!! $text ?? '' !!}
        </td>
    </tr>
</table>
