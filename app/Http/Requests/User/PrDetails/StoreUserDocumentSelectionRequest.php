<?php

namespace App\Http\Requests\User\PrDetails;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserDocumentSelectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'document_ids' => ['required', 'array', 'min:1', 'max:4'],
            'document_ids.*' => ['integer', 'distinct', 'exists:documents,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'document_ids.required' => 'Please select at least one document.',
            'document_ids.max' => 'You can only select up to 4 documents.',
            'document_ids.*.exists' => 'One of the selected documents is invalid.',
        ];
    }
}
