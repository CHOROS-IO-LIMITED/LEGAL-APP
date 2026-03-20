<?php

// namespace App\Actions\UserDocuments;

// use App\Models\UserDocument;

// class CompleteUserDocumentAnswersAction
// {
//     public function handle(UserDocument $userDocument, array $answers): UserDocument
//     {
//         $userDocument->update([
//             'answers_json' => $answers,
//             'status' => UserDocument::STATUS_QNA_COMPLETED,
//             'qna_completed_at' => now(),
//         ]);

//         return $userDocument->refresh();
//     }
// }
