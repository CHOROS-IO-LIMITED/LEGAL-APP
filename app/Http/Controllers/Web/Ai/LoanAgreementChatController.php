<?php

namespace App\Http\Controllers\Web\AI;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use App\Services\Ai\LoanAgreementChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class LoanAgreementChatController extends Controller
{
    public function __invoke(
        Request $request,
        UserDocument $userDocument,
        LoanAgreementChatService $chatService
    ): JsonResponse {
        $this->authorize('answerQuestions', $userDocument);

        try {
            $answers = $request->input('answers', []);
            $message = $request->input('message');
            $currentQuestion = $request->input('current_question');

            $result = $chatService->chat(
                is_array($answers) ? $answers : [],
                is_array($userDocument->question_schema_json) ? $userDocument->question_schema_json : [],
                is_string($currentQuestion) ? $currentQuestion : null,
                is_string($message) ? $message : null,
            );

            return response()->json($result);
        } catch (Throwable $e) {
            Log::error('Loan agreement AI chat failed.', [
                'user_document_id' => $userDocument->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'The assistant is temporarily unavailable.',
                'next_question_key' => null,
                'follow_up_needed' => false,
                'warnings' => [$e->getMessage()],
            ], 500);
        }
    }
}
