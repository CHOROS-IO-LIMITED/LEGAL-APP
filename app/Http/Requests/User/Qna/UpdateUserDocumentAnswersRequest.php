<?php

namespace App\Http\Requests\User\Qna;

use App\Concerns\File\UserDocuments\UserDocumentAnswersValidation;
use App\Models\UserDocument;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserDocumentAnswersRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var UserDocument $userDocument */
        $userDocument = $this->route('userDocument');

        return $this->user()?->can('answerQuestions', $userDocument) ?? false;
    }

    public function rules(): array
    {
        /** @var UserDocument $userDocument */
        $userDocument = $this->route('userDocument');

        return [
            'answers' => ['required', 'array', new UserDocumentAnswersValidation($userDocument)],
        ];
    }
}
