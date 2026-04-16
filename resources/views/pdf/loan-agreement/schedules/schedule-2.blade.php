@if (($data['include_guarantors_schedule'] ?? false) && !empty($guarantors))
    <div class="page-break"></div>

    <div style="font-weight:700; margin-bottom:15px;">
        Schedule 2 &nbsp;&nbsp;&nbsp; GUARANTORS
    </div>

    @foreach ($guarantors as $index => $guarantor)
        <div style="margin-bottom: 28px;">
            <div>
                <strong>Guarantor {{ $index + 1 }}:</strong>
                {{ $guarantor['name'] ?: '[ENTER NAME]' }}@if (($guarantor['is_director_of_borrower'] ?? null) === 'yes')
                    , director of the Borrower
                @endif
            </div>
        </div>
    @endforeach
@endif
