export type DashboardStatus = 'pending_approval' | 'signature' | 'rejected' | 'completed';

export type SignatureRecipient = {
    name: string | null;
    email: string | null;
    role?: string | null;
    recipient_id?: string | null;
    routing_order?: string | number | null;
    status?: string | null;
    signed_at?: string | null;
};

export type DocumentItem = {
    id: number;
    batchUuid: string;
    title: string;
    price: string;
    internalStatus: string;
    dashboardStatus: 'pending_approval' | 'signature' | 'rejected' | 'completed' | 'draft';

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
    signatureStatus: string | null;
    signatureRecipients: SignatureRecipient[];

    submittedForApprovalAt: string | null;
    approvedForSignatureAt: string | null;
    sentForSignatureAt: string | null;
    rejectedAt: string | null;
    completedAt: string | null;

    actions: {
        canApproveForSignature: boolean;
        canRejectAfterReview: boolean;
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
