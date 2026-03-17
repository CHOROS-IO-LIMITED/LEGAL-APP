<?php

namespace App\Http\Requests\Admin;

use App\Models\Document;
use App\Concerns\File\DocumentFileValidationRules;
use App\Concerns\File\ImageFileValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Document::class);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'document_category' => ['nullable', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:5000'],
            'ai_prompt' => ['required', 'string', 'max:20000'],
            'image' => ImageFileValidationRules::make(false),
            'document' => DocumentFileValidationRules::make(true),
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'document title',
            'document_category' => 'document category',
            'price' => 'document price',
            'ai_prompt' => 'AI instructions',
            'image' => 'preview image',
            'document' => 'PDF template',
        ];
    }
}
