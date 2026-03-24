<?php

namespace App\Http\Requests\User\Dashboard\Approved;

use Illuminate\Foundation\Http\FormRequest;

class ApproveUserDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $userDocument = $this->route('userDocument');

        return $userDocument && $this->user()->can('approve', $userDocument);
    }

    public function rules(): array
    {
        return [
            'recipients' => ['required', 'array', 'min:1'],
            'recipients.*.name' => ['required', 'string', 'max:255'],
            'recipients.*.email' => ['required', 'email', 'max:255'],
            'recipients.*.address' => ['required', 'string', 'max:1000'],
            'recipients.*.role' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'recipients' => 'recipients',
            'recipients.*.name' => 'recipient name',
            'recipients.*.email' => 'recipient email',
            'recipients.*.address' => 'recipient address',
            'recipients.*.role' => 'recipient role',
        ];
    }
}
