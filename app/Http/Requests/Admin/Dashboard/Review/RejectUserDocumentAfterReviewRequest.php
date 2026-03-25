<?php

namespace App\Http\Requests\Admin\Dashboard\Review;

use Illuminate\Foundation\Http\FormRequest;

class RejectUserDocumentAfterReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->user_role === 'admin';
    }

    public function rules(): array
    {
        return [
            'lawyer_note' => ['required', 'string', 'max:5000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'lawyer_note' => 'lawyer note',
        ];
    }
}
