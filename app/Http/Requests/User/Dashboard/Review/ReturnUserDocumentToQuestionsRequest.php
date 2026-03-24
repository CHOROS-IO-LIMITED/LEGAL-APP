<?php

namespace App\Http\Requests\User\Dashboard\Review;

use App\Models\UserDocument;
use Illuminate\Foundation\Http\FormRequest;

class ReturnUserDocumentToQuestionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var UserDocument $userDocument */
        $userDocument = $this->route('userDocument');

        return $this->user()->can('returnToQuestions', $userDocument);
    }

    public function rules(): array
    {
        return [
            'client_note' => ['required', 'string', 'max:2000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'client_note' => 'requested changes',
        ];
    }
}
