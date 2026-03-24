<?php

namespace App\Http\Requests\Admin\Dashboard\Review;

use App\Models\UserDocument;
use Illuminate\Foundation\Http\FormRequest;

class RejectUserDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var UserDocument $userDocument */
        $userDocument = $this->route('userDocument');

        return $this->user()->can('rejectAfterReview', $userDocument);
    }

    public function rules(): array
    {
        return [
            'lawyer_note' => ['required', 'string', 'max:3000'],
        ];
    }
}
