<?php

namespace App\Http\Controllers\Web;

use App\Actions\UserDocuments\CompleteUserDocumentAnswersAction;
use App\Actions\UserDocuments\GenerateUserDocumentQuestionSchemaAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Web\UpdateUserDocumentAnswersRequest;
use App\Models\UserDocument;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UserDocumentQuestionController extends Controller
{
    public function show(UserDocument $userDocument, GenerateUserDocumentQuestionSchemaAction $generateSchema): Response
    {
        $this->authorize('answerQuestions', $userDocument);

        if (
            empty($userDocument->question_schema_json)
            && $userDocument->status === UserDocument::STATUS_QNA_PENDING
        ) {
            $generateSchema->handle($userDocument);
            $userDocument->refresh();
        }

        return Inertia::render('Web/Products/Explore/QnA/Index', [
            'userDocument' => [
                'id' => $userDocument->id,
                'batch_uuid' => $userDocument->batch_uuid,
                'status' => $userDocument->status,
                'price' => $userDocument->price,
                'answers_json' => $userDocument->answers_json,
                'question_schema_json' => $userDocument->question_schema_json,
                'document' => [
                    'id' => $userDocument->document?->id,
                    'title' => $userDocument->document?->title,
                    'description' => $userDocument->document?->description,
                ],
            ],
        ]);
    }

    public function update(
        UpdateUserDocumentAnswersRequest $request,
        UserDocument $userDocument,
        CompleteUserDocumentAnswersAction $action
    ): RedirectResponse {
        $this->authorize('answerQuestions', $userDocument);

        $action->handle($userDocument, $request->validated('answers'));

        return redirect()->route('user.dashboard')->with('success', 'Questions completed successfully.');
    }
}
