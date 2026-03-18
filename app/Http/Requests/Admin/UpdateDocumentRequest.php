<?php

namespace App\Http\Requests\Admin;

use App\Models\Document;
use App\Concerns\File\DocumentFileValidationRules;
use App\Concerns\File\ImageFileValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $document = $this->route('document');

        return $this->user()->can('update', $document);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:5000'],
            'image' => ImageFileValidationRules::make(false),
            'document' => DocumentFileValidationRules::make(false),
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'document title',
            'price' => 'document price',
            'description' => 'document description',
            'image' => 'preview image',
            'document' => 'PDF template',
        ];
    }
}
