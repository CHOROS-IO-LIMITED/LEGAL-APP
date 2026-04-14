<?php

namespace App\Actions\Admin\Documents;

use App\Models\Document;
use App\Services\Admin\Documents\DocumentSchemaRegistry;
use App\Services\User\Documents\QuestionSchemaValidator;
use RuntimeException;

class SyncDocumentSchemasAction
{
    public function __construct(
        protected DocumentSchemaRegistry $registry,
        protected QuestionSchemaValidator $validator
    ) {}

    public function handle(Document $document): void
    {
        $schema = $this->registry->questionSchema($document);

        if ($schema === null) {
            throw new RuntimeException("No question schema is registered for document type [{$document->document_type}].");
        }

        $document->update([
            'default_question_schema_json' => $this->validator->validate($schema),
        ]);
    }
}
