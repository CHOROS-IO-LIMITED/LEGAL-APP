<?php

namespace App\Actions\UserDocuments;

use App\Models\UserDocument;
use RuntimeException;

class GenerateUserDocumentQuestionSchemaAction
{
    public function handle(UserDocument $userDocument, bool $force = false): array
    {
        $userDocument->loadMissing('document');

        if (! $userDocument->document) {
            throw new RuntimeException('Document template not found.');
        }

        if (
            ! $force &&
            is_array($userDocument->question_schema_json) &&
            ! empty($userDocument->question_schema_json['questions'])
        ) {
            return $userDocument->question_schema_json;
        }

        $schema = $userDocument->document->default_question_schema_json;

        if (! is_array($schema) || empty($schema['questions'])) {
            throw new RuntimeException('No default question schema is configured for this document.');
        }

        $userDocument->update([
            'question_schema_json' => $schema,
        ]);

        return $schema;
    }
}
