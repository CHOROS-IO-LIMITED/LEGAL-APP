<?php

namespace App\Http\Controllers\Web\QnA;

use App\Actions\User\QnA\CompleteUserDocumentAnswersAction;
use App\Actions\User\QnA\GenerateUserDocumentPdfAction;
use App\Actions\User\QnA\GenerateUserDocumentQuestionSchemaAction;
use App\Actions\User\QnA\NormalizeUserDocumentAnswersAction;
use App\Exceptions\GeminiException;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\Qna\UpdateUserDocumentAnswersRequest;
use App\Models\UserDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function show(
        Request $request,
        GenerateUserDocumentQuestionSchemaAction $generateSchema
    ): Response {
        $batchUuid = $request->string('batch_uuid')->toString();

        abort_if(blank($batchUuid), 404);

        $userDocument = UserDocument::query()
            ->with('document')
            ->ownedBy($request->user()->id)
            ->batch($batchUuid)
            ->first();

        abort_if(! $userDocument, 404);

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
                'generated_pdf_url' => $userDocument->generated_pdf_url,
                'document' => [
                    'id' => $userDocument->document?->id,
                    'title' => $userDocument->document?->title,
                    'description' => $userDocument->document?->description,
                    'document_type' => $userDocument->document?->document_type,
                ],
            ],
        ]);
    }

    // public function update(
    //     UpdateUserDocumentAnswersRequest $request,
    //     UserDocument $userDocument,
    //     NormalizeUserDocumentAnswersAction $normalizeAnswers,
    //     CompleteUserDocumentAnswersAction $completeAnswers,
    //     GenerateUserDocumentPdfAction $generatePdf
    // ): RedirectResponse {
    //     $this->authorize('answerQuestions', $userDocument);

    //     $validatedAnswers = $request->validated('answers');

    //     try {
    //         $normalization = $normalizeAnswers->handle($userDocument, $validatedAnswers);
    //         $answersToSave = $normalization['merged_answers'];
    //         $warnings = $normalization['warnings'];
    //     } catch (GeminiException $e) {
    //         Log::warning('Gemini normalization failed. Falling back to raw answers.', [
    //             'user_document_id' => $userDocument->id,
    //             'message' => $e->getMessage(),
    //         ]);

    //         $answersToSave = $validatedAnswers;
    //         $warnings = ['AI normalization could not be completed, so your original answers were used.'];
    //     }

    //     $completeAnswers->handle($userDocument, $answersToSave, $warnings);

    //     $userDocument->refresh();

    //     $generatePdf->handle($userDocument);

    //     return redirect()
    //         ->route('user.dashboard')
    //         ->with('success', 'Questions completed and document generated successfully.')
    //         ->with('ai_warnings', $warnings);
    // }

    public function update(
        UpdateUserDocumentAnswersRequest $request,
        UserDocument $userDocument,
        CompleteUserDocumentAnswersAction $completeAnswers,
        GenerateUserDocumentPdfAction $generatePdf
    ): RedirectResponse {
        $this->authorize('answerQuestions', $userDocument);

        $validatedAnswers = $request->validated('answers');

        $answersToSave = $validatedAnswers;
        $warnings = [];

        $completeAnswers->handle($userDocument, $answersToSave, $warnings);

        $userDocument->refresh();

        $generatePdf->handle($userDocument);

        return redirect()
            ->route('user.dashboard')
            ->with('success', 'Questions completed and document generated successfully.');
    }
}
