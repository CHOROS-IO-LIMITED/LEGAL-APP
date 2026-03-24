<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $documents = UserDocument::query()
            ->with(['document:id,title', 'user:id,name,email'])
            ->ownedBy($user->id)
            ->forDashboard()
            ->latest('updated_at')
            ->get()
            ->map(fn(UserDocument $userDocument) => $this->transformDocument($userDocument));

        return Inertia::render('User/Dashboard/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'documents' => $documents,
        ]);
    }

    protected function transformDocument(UserDocument $userDocument): array
    {
        $questionnaireUrl = route('product.qna.show', [
            'batch_uuid' => $userDocument->batch_uuid,
        ]);

        $downloadUrl = route('user.documents.download', $userDocument);

        return [
            'id' => $userDocument->id,
            'batchUuid' => $userDocument->batch_uuid,
            'title' => $userDocument->document?->title ?? 'Untitled Document',
            'price' => (string) $userDocument->price,
            'internalStatus' => $userDocument->status,
            'dashboardStatus' => $userDocument->dashboard_status,
            'submittedAtLabel' => optional($userDocument->submitted_for_approval_at ?? $userDocument->pdf_generated_at ?? $userDocument->created_at)?->diffForHumans(),
            'createdAtLabel' => optional($userDocument->created_at)?->format('M d, Y • h:i A'),
            'updatedAtLabel' => optional($userDocument->updated_at)?->format('M d, Y • h:i A'),
            'generatedPdfUrl' => $userDocument->generated_pdf_url,
            'downloadUrl' => $downloadUrl,
            'questionnaireUrl' => $questionnaireUrl,

            'client' => [
                'name' => $userDocument->client_name,
                'email' => $userDocument->client_email,
            ],

            'clientNote' => $userDocument->client_note,
            'lawyerNote' => $userDocument->lawyer_note,

            'signatureProvider' => $userDocument->signature_provider,
            'signatureEnvelopeId' => $userDocument->signature_envelope_id,
            'signatureRecipients' => $userDocument->signature_recipients_json ?? [],

            'submittedForApprovalAt' => optional($userDocument->submitted_for_approval_at)?->format('M d, Y • h:i A'),
            'approvedForSignatureAt' => optional($userDocument->approved_for_signature_at)?->format('M d, Y • h:i A'),
            'sentForSignatureAt' => optional($userDocument->sent_for_signature_at)?->format('M d, Y • h:i A'),
            'rejectedAt' => optional($userDocument->rejected_at)?->format('M d, Y • h:i A'),
            'completedAt' => optional($userDocument->completed_at)?->format('M d, Y • h:i A'),

            'actions' => [
                'canSubmitForApproval' => Auth::user()->can('submitForApproval', $userDocument),
                'canReturnToQuestions' => Auth::user()->can('returnToQuestions', $userDocument),
                'canDownload' => Auth::user()->can('download', $userDocument),
            ],
        ];
    }
}
