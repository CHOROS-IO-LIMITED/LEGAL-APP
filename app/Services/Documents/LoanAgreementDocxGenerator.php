<?php

namespace App\Services\Documents;

use App\Models\UserDocument;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class LoanAgreementDocxGenerator
{
    public function __construct(
        protected LoanAgreementTemplateResolver $resolver,
        protected WordTemplateEditor $editor,
    ) {}

    public function generate(UserDocument $userDocument): array
    {
        $userDocument->loadMissing('document');

        if (! $userDocument->document) {
            throw new RuntimeException('Document template not found.');
        }

        if (! $userDocument->document->document_path) {
            throw new RuntimeException('Document template path is missing.');
        }

        $templateDisk = config('services.gemini.template_disk', 'public_documents');
        $outputDisk = config('filesystems.default', 'public');

        $templatePath = Storage::disk($templateDisk)->path($userDocument->document->document_path);

        if (! is_file($templatePath)) {
            throw new RuntimeException("Template file not found: {$templatePath}");
        }

        $answers = is_array($userDocument->answers_json) ? $userDocument->answers_json : [];

        $resolved = $this->resolver->resolve($answers);

        $outputRelativePath = 'generated-documents/user-document-' . $userDocument->id . '-loan-agreement.docx';
        $outputAbsolutePath = Storage::disk($outputDisk)->path($outputRelativePath);

        $this->editor->generate(
            templatePath: $templatePath,
            outputPath: $outputAbsolutePath,
            resolved: $resolved,
        );

        $originalName = 'loan-agreement-' . $userDocument->id . '.docx';
        $mime = File::mimeType($outputAbsolutePath);
        $size = File::size($outputAbsolutePath);

        $userDocument->update([
            'generated_docx_path' => $outputRelativePath,
            'generated_docx_original_name' => $originalName,
            'generated_docx_mime' => $mime,
            'generated_docx_size' => $size,
            'docx_generated_at' => now(),
            'status' => UserDocument::STATUS_COMPLETED,
        ]);

        return [
            'generated_docx_path' => $outputRelativePath,
            'generated_docx_url' => Storage::disk($outputDisk)->url($outputRelativePath),
        ];
    }
}
