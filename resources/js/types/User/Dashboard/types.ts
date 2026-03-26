export type DashboardStatus = 'draft' | 'pending_approval' | 'signature' | 'rejected' | 'completed';

export interface User {
    name: string;
    email: string;
}

export type SignatureRecipient = {
    name: string;
    email: string;
    role?: string | null;
    routing_order?: number | null;
    recipient_id?: string | null;
    status?: string | null;
    signed_at?: string | null;
    sign_url?: string | null;
};

export type DocumentItem = {
    id: number;
    batchUuid: string;
    title: string;
    price: string;
    internalStatus: string;
    dashboardStatus: 'draft' | 'pending_approval' | 'signature' | 'rejected' | 'completed';

    submittedAtLabel: string | null;
    createdAtLabel: string | null;
    updatedAtLabel: string | null;

    generatedPdfUrl: string | null;
    downloadUrl: string;
    questionnaireUrl: string;

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
        canSubmitForApproval: boolean;
        canReturnToQuestions: boolean;
        canDownload: boolean;
        canSign: boolean;
    };
};

export type DashboardProps = {
    user: {
        name: string;
        email: string;
    };
    documents: DocumentItem[];
};
