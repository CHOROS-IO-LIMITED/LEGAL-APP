<?php

namespace App\Actions\UserDocuments;

use App\Models\UserDocument;
use App\Services\Ai\GeminiQuestionGenerator;

class GenerateUserDocumentQuestionSchemaAction
{
    public function __construct(
        protected GeminiQuestionGenerator $generator
    ) {}

    public function handle(UserDocument $userDocument): array
    {
        if (! $userDocument->document) {
            abort(404, 'Document template not found.');
        }

        $schema = $this->generator->generateFromDocument($userDocument->document);

        $userDocument->update([
            'question_schema_json' => $schema,
        ]);

        return $schema;
    }
}
