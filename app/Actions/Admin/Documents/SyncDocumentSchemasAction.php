<?php

namespace App\Actions\Admin\Documents;

use App\Models\Document;
use App\Services\Admin\Documents\DocumentSchemaRegistry;

class SyncDocumentSchemasAction
{
    public function __construct(
        protected DocumentSchemaRegistry $registry
    ) {}

    public function handle(Document $document): void
    {
        $document->update([
            'default_question_schema_json' => $this->registry->questionSchema($document),
            'template_schema_json' => $this->registry->templateSchema($document),
        ]);
    }
}
