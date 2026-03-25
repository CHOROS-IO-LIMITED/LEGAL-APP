<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        abort_unless($user && $user->user_role === 'admin', 403);

        $documents = UserDocument::query()
            ->with(['document:id,title', 'user:id,name,email'])
            ->forAdminDashboard()
            ->latest('updated_at')
            ->get()
            ->map(fn(UserDocument $userDocument) => $this->transformDocument($userDocument));

        return Inertia::render('Admin/Dashboard/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'documents' => $documents,
        ]);
    }

    protected function transformDocument(UserDocument $userDocument): array
    {
        return [
            'id' => $userDocument->id,
            'batchUuid' => $userDocument->batch_uuid,
            'title' => $userDocument->document?->title ?? 'Untitled Document',
            'price' => (string) $userDocument->price,
            'internalStatus' => $userDocument->status,
            'dashboardStatus' => $userDocument->dashboard_status,

            'createdAtLabel' => optional($userDocument->created_at)?->format('M d, Y • h:i A'),
            'updatedAtLabel' => optional($userDocument->updated_at)?->format('M d, Y • h:i A'),
            'submittedAtLabel' => optional($userDocument->submitted_for_approval_at)?->format('M d, Y • h:i A'),

            'generatedPdfUrl' => $userDocument->generated_pdf_url,
            'downloadUrl' => route('user.documents.download', $userDocument),

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
                'canApproveForSignature' => Auth::user()->can('approveForSignature', $userDocument),
                'canRejectAfterReview' => Auth::user()->can('rejectAfterReview', $userDocument),
                'canMarkCompleted' => Auth::user()->can('markCompleted', $userDocument),
                'canDownload' => Auth::user()->can('download', $userDocument),
            ],
        ];
    }
}
