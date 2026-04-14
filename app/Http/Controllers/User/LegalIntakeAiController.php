<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use App\Services\Ai\GeminiLegalIntakeAssistant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class LegalIntakeAiController extends Controller
{
    public function assist(
        Request $request,
        UserDocument $userDocument,
        GeminiLegalIntakeAssistant $assistant
    ): JsonResponse {
        $this->authorize('view', $userDocument);

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
            'answers' => ['nullable', 'array'],
        ]);

        $schema = $userDocument->question_schema_json ?? [];

        $result = $assistant->assist([
            'schema' => $schema,
            'answers' => $validated['answers'] ?? ($userDocument->answers_json ?? []),
            'user_message' => $validated['message'],
        ]);

        return response()->json([
            'data' => $result,
        ]);
    }
}
