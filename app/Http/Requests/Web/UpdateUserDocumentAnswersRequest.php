<?php

namespace App\Http\Requests\Web;

use App\Concerns\File\UserDocumentAnswersValidation;
use App\Models\UserDocument;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserDocumentAnswersRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var UserDocument|null $userDocument */
        $userDocument = $this->route('userDocument');

        return $this->user() !== null
            && $userDocument !== null
            && $this->user()->can('answerQuestions', $userDocument);
    }

    public function rules(): array
    {
        /** @var UserDocument $userDocument */
        $userDocument = $this->route('userDocument');

        return [
            'answers' => ['required', 'array', new UserDocumentAnswersValidation($userDocument)],
        ];
    }

    public function messages(): array
    {
        return [
            'answers.required' => 'Please answer the required questions.',
            'answers.array' => 'Answers must be a valid object.',
        ];
    }
}
