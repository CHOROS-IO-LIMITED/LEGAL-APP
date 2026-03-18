<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StartUserDocumentKycRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'batch_uuid' => [
                'required',
                'uuid',
                Rule::exists('user_documents', 'batch_uuid')->where(function ($query) {
                    $query->where('user_id', $this->user()->id);
                }),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'batch_uuid.required' => 'Batch reference is required.',
            'batch_uuid.uuid' => 'Invalid batch reference.',
            'batch_uuid.exists' => 'The selected document batch was not found.',
        ];
    }
}
