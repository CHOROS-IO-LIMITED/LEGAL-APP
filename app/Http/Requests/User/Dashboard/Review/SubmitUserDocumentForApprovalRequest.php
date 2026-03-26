<?php

namespace App\Http\Requests\User\Dashboard\Review;

use App\Models\UserDocument;
use Illuminate\Foundation\Http\FormRequest;

class SubmitUserDocumentForApprovalRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var UserDocument $userDocument */
        $userDocument = $this->route('userDocument');

        return $this->user()->can('submitForApproval', $userDocument);
    }

    public function rules(): array
    {
        return [
            'client_note' => ['nullable', 'string', 'max:2000'],

            'signature_recipients' => ['required', 'array', 'min:1'],
            'signature_recipients.*.name' => ['required', 'string', 'max:255'],
            'signature_recipients.*.email' => ['required', 'email', 'max:255'],
            'signature_recipients.*.role' => ['required', 'string', 'max:255'],
            'signature_recipients.*.routing_order' => ['nullable', 'integer', 'min:1'],
            'signature_recipients.*.status' => ['nullable', 'string', 'max:50'],
            'signature_recipients.*.signed_at' => ['nullable'],
            'signature_recipients.*.recipient_id' => ['nullable', 'string', 'max:100'],
            'signature_recipients.*.sign_url' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
