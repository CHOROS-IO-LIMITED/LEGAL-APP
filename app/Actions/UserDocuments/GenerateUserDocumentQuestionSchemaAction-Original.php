<?php

// namespace App\Actions\UserDocuments;

// use App\Models\UserDocument;
// use App\Services\Ai\GeminiQuestionGenerator;

// class GenerateUserDocumentQuestionSchemaAction
// {
//     public function __construct(
//         protected GeminiQuestionGenerator $generator
//     ) {}

//     public function handle(UserDocument $userDocument, bool $force = false): array
//     {
//         $userDocument->loadMissing('document');

//         if (! $userDocument->document) {
//             abort(404, 'Document template not found.');
//         }

//         if (
//             ! $force &&
//             is_array($userDocument->question_schema_json) &&
//             ! empty($userDocument->question_schema_json['questions'])
//         ) {
//             return $userDocument->question_schema_json;
//         }

//         $schema = $this->generator->generateFromDocument($userDocument->document);

//         $userDocument->update([
//             'question_schema_json' => $schema,
//         ]);

//         return $schema;
//     }
// }
