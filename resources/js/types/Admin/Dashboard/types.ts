export type DashboardStatus = 'pending_approval' | 'signature' | 'rejected' | 'completed';

export type SignatureRecipient = {
    name: string;
    email: string;
    role: string | null;
    routing_order: number | null;
    status: string | null;
    signed_at: string | null;
    sign_url: string | null;
};

export type DocumentItem = {
    id: number;
    batchUuid: string;
    title: string;
    price: string;
    internalStatus: string;
    dashboardStatus: DashboardStatus;

    createdAtLabel: string | null;
    updatedAtLabel: string | null;
    submittedAtLabel: string | null;

    generatedPdfUrl: string | null;
    downloadUrl: string;

    client: {
        name: string | null;
        email: string | null;
    };

    clientNote: string | null;
    lawyerNote: string | null;

    signatureProvider: string | null;
    signatureEnvelopeId: string | null;
    signatureRecipients: SignatureRecipient[];

    submittedForApprovalAt: string | null;
    approvedForSignatureAt: string | null;
    sentForSignatureAt: string | null;
    rejectedAt: string | null;
    completedAt: string | null;

    actions: {
        canApproveForSignature: boolean;
        canRejectAfterReview: boolean;
        canMarkCompleted: boolean;
        canDownload: boolean;
    };
};

export type DashboardProps = {
    user: {
        name: string;
        email: string;
    };
    documents: DocumentItem[];
};
