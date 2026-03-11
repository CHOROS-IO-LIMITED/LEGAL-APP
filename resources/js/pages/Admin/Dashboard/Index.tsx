import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, CheckCircle, ClipboardList, Clock, FileSignature, XCircleIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import CompletedDocumentView from './CompletedDocumentView';
import DocumentTable from './DocumentTable';
import ReviewDocumentView from './ReviewDocumentView';
import SignView from './SignView';

interface User {
    name: string;
    email: string;
}

export type DocumentStatus = 'pending_lawyer_review' | 'changes_requested' | 'rejected' | 'awaiting_signatures' | 'partially_signed' | 'completed';

export type AuditTrailItem = {
    id: string | number;
    label: string;
    timestamp: string;
};

export type RecipientItem = {
    id: string | number;
    name: string;
    email: string;
    role?: string;
    hasSigned?: boolean;
    signedAt?: string | null;
    signUrl?: string | null;
};

export type DocumentItem = {
    id: string | number;
    title: string;
    submittedBy: string;
    submittedAtLabel: string;
    status: DocumentStatus;
    isUrgent?: boolean;
    clientEmail?: string;
    kycStatus?: 'Verified' | 'Pending';
    paymentStatus?: 'Received' | 'Pending';
    clientNote?: string;
    lawyerNote?: string;
    recipients?: RecipientItem[];
    sentForSignatureAt?: string;
    completedAt?: string;
    auditTrail?: AuditTrailItem[];
};

interface DashboardProps {
    user: User;
}

type ActiveView = 'review' | 'sign' | 'completed';

const INITIAL_DOCUMENTS: DocumentItem[] = [
    {
        id: 1,
        title: 'Residential Lease — J. Harrington',
        submittedBy: 'James Harrington',
        submittedAtLabel: 'Today 2:32 PM',
        status: 'pending_lawyer_review',
        isUrgent: true,
        clientEmail: 'james@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        clientNote: 'Please review this as soon as possible.',
        recipients: [
            { id: 1, name: 'James Harrington', email: 'james@example.com', role: 'Tenant', hasSigned: false, signedAt: null },
            { id: 2, name: 'Olivia Harrington', email: 'olivia@example.com', role: 'Co-Tenant', hasSigned: false, signedAt: null },
        ],
        auditTrail: [
            { id: 1, label: 'Document created', timestamp: 'Mar 10, 2026 • 2:20 PM' },
            { id: 2, label: 'Client approved document', timestamp: 'Mar 10, 2026 • 2:30 PM' },
            { id: 3, label: 'Submitted to lawyer for review', timestamp: 'Mar 10, 2026 • 2:32 PM' },
        ],
    },
    {
        id: 2,
        title: 'NDA — Acme Ltd.',
        submittedBy: 'Sarah Mitchell',
        submittedAtLabel: 'Today 11:15 AM',
        status: 'pending_lawyer_review',
        clientEmail: 'sarah@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        clientNote: 'Please prioritize this before our vendor onboarding deadline.',
        recipients: [{ id: 1, name: 'Sarah Mitchell', email: 'sarah@example.com', role: 'Disclosing Party', hasSigned: false, signedAt: null }],
        auditTrail: [
            { id: 1, label: 'Document created', timestamp: 'Mar 10, 2026 • 10:40 AM' },
            { id: 2, label: 'Client approved document', timestamp: 'Mar 10, 2026 • 11:12 AM' },
            { id: 3, label: 'Submitted to lawyer for review', timestamp: 'Mar 10, 2026 • 11:15 AM' },
        ],
    },
    {
        id: 3,
        title: 'Consulting Agreement — Pixel Inc.',
        submittedBy: 'Amanda Lopez',
        submittedAtLabel: 'Yesterday',
        status: 'changes_requested',
        clientEmail: 'amanda@example.com',
        kycStatus: 'Pending',
        paymentStatus: 'Pending',
        lawyerNote: 'Please revise the payment clause and clarify the contract term before resubmission.',
        recipients: [
            { id: 1, name: 'Amanda Lopez', email: 'amanda@example.com', role: 'Client', hasSigned: false, signedAt: null },
            { id: 2, name: 'Pixel Inc.', email: 'legal@pixel.com', role: 'Provider', hasSigned: false, signedAt: null },
        ],
    },
    {
        id: 4,
        title: 'Partnership Contract — Nova Group',
        submittedBy: 'Daniel Reed',
        submittedAtLabel: 'Mar 9, 2026',
        status: 'rejected',
        clientEmail: 'daniel@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        lawyerNote: 'The submitted draft is missing key liability and termination protections. Please regenerate and resubmit.',
        recipients: [
            { id: 1, name: 'Daniel Reed', email: 'daniel@example.com', role: 'Partner', hasSigned: false, signedAt: null },
            { id: 2, name: 'Nova Group', email: 'legal@novagroup.com', role: 'Company', hasSigned: false, signedAt: null },
        ],
    },
    {
        id: 5,
        title: 'Commercial Lease — Elm Square',
        submittedBy: 'Amanda Lopez',
        submittedAtLabel: 'Today 9:20 AM',
        status: 'awaiting_signatures',
        clientEmail: 'amanda@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        recipients: [
            { id: 1, name: 'Amanda Lopez', email: 'amanda@example.com', role: 'Tenant', hasSigned: false, signedAt: null },
            { id: 2, name: 'Elm Square Holdings', email: 'leasing@elmsquare.com', role: 'Landlord', hasSigned: false, signedAt: null },
        ],
        sentForSignatureAt: 'Mar 10, 2026 • 1:05 PM',
        auditTrail: [
            { id: 1, label: 'Client approved document', timestamp: 'Mar 10, 2026 • 12:42 PM' },
            { id: 2, label: 'Lawyer approved document', timestamp: 'Mar 10, 2026 • 12:58 PM' },
            { id: 3, label: 'Signature requests sent', timestamp: 'Mar 10, 2026 • 1:05 PM' },
        ],
    },
    {
        id: 6,
        title: 'Service Agreement — Northwind Co.',
        submittedBy: 'Daniel Cruz',
        submittedAtLabel: 'Mar 9, 2026',
        status: 'partially_signed',
        clientEmail: 'daniel@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        recipients: [
            { id: 1, name: 'Daniel Cruz', email: 'daniel@example.com', role: 'Client', hasSigned: true, signedAt: 'Mar 10, 2026 • 9:18 AM' },
            { id: 2, name: 'Northwind Co.', email: 'legal@northwind.com', role: 'Provider', hasSigned: false, signedAt: null },
        ],
        sentForSignatureAt: 'Mar 10, 2026 • 8:40 AM',
        auditTrail: [
            { id: 1, label: 'Lawyer approved document', timestamp: 'Mar 10, 2026 • 8:35 AM' },
            { id: 2, label: 'Signature requests sent', timestamp: 'Mar 10, 2026 • 8:40 AM' },
            { id: 3, label: 'Daniel Cruz signed document', timestamp: 'Mar 10, 2026 • 9:18 AM' },
        ],
    },
    {
        id: 7,
        title: 'Consultancy Agreement — Vertex Inc.',
        submittedBy: 'Maria Santos',
        submittedAtLabel: 'Mar 8, 2026',
        status: 'completed',
        clientEmail: 'maria@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        recipients: [
            { id: 1, name: 'Maria Santos', email: 'maria@example.com', role: 'Consultant', hasSigned: true, signedAt: 'Mar 9, 2026 • 10:05 AM' },
            { id: 2, name: 'Vertex Inc.', email: 'legal@vertex.com', role: 'Company', hasSigned: true, signedAt: 'Mar 9, 2026 • 10:18 AM' },
        ],
        sentForSignatureAt: 'Mar 9, 2026 • 9:40 AM',
        completedAt: 'Mar 9, 2026 • 10:18 AM',
        auditTrail: [
            { id: 1, label: 'Lawyer approved document', timestamp: 'Mar 9, 2026 • 9:36 AM' },
            { id: 2, label: 'Signature requests sent', timestamp: 'Mar 9, 2026 • 9:40 AM' },
            { id: 3, label: 'Maria Santos signed document', timestamp: 'Mar 9, 2026 • 10:05 AM' },
            { id: 4, label: 'Vertex Inc. signed document', timestamp: 'Mar 9, 2026 • 10:18 AM' },
            { id: 5, label: 'Document fully completed', timestamp: 'Mar 9, 2026 • 10:18 AM' },
        ],
    },
];

function deriveStatusFromRecipients(recipients: RecipientItem[] = []): DocumentStatus {
    if (!recipients.length) return 'awaiting_signatures';

    const signedCount = recipients.filter((recipient) => recipient.hasSigned).length;

    if (signedCount === 0) return 'awaiting_signatures';
    if (signedCount < recipients.length) return 'partially_signed';
    return 'completed';
}

export default function AdminDashboard({ user }: DashboardProps) {
    const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | number | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('review');

    const selectedDocument = useMemo(() => documents.find((doc) => doc.id === selectedDocumentId) ?? null, [documents, selectedDocumentId]);

    const stats = useMemo(() => {
        const total = documents.length;
        const pending = documents.filter((doc) => doc.status === 'pending_lawyer_review').length;
        const forSigning = documents.filter((doc) => ['awaiting_signatures', 'partially_signed'].includes(doc.status)).length;
        const completed = documents.filter((doc) => doc.status === 'completed').length;
        const rejected = documents.filter((doc) => ['rejected', 'changes_requested'].includes(doc.status)).length;

        return [
            { icon: ClipboardList, value: total, description: 'Total Documents' },
            { icon: Clock, value: pending, description: 'Waiting Review' },
            { icon: FileSignature, value: forSigning, description: 'For Signature' },
            { icon: CheckCircle, value: completed, description: 'Completed' },
            { icon: XCircleIcon, value: rejected, description: 'Issues Found' },
        ];
    }, [documents]);

    function handleOpenReview(doc: DocumentItem) {
        setSelectedDocumentId(doc.id);

        if (doc.status === 'awaiting_signatures' || doc.status === 'partially_signed') {
            setActiveView('sign');
            return;
        }

        if (doc.status === 'completed') {
            setActiveView('completed');
            return;
        }

        setActiveView('review');
    }

    function handleViewCompleted(doc: DocumentItem) {
        setSelectedDocumentId(doc.id);
        setActiveView('completed');
    }

    function handleUpdateDocument(id: string | number, updates: Partial<DocumentItem>) {
        setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)));
    }

    function handleCloseDocumentFlow() {
        setSelectedDocumentId(null);
        setActiveView('review');
    }

    function handleApproveAndContinueToSend() {
        if (!selectedDocument) return;
        setActiveView('sign');
    }

    function handleSendSignatureRequests(documentId: string | number) {
        const now = 'Mar 10, 2026 • 3:15 PM';

        setDocuments((prev) =>
            prev.map((doc) => {
                if (doc.id !== documentId) return doc;

                return {
                    ...doc,
                    status: 'awaiting_signatures',
                    sentForSignatureAt: now,
                    auditTrail: [
                        ...(doc.auditTrail ?? []),
                        { id: Date.now(), label: 'Lawyer approved document', timestamp: now },
                        { id: Date.now() + 1, label: 'Signature requests sent', timestamp: now },
                    ],
                };
            }),
        );

        setActiveView('sign');
    }

    function handleMockRecipientSigned(documentId: string | number, recipientEmail: string) {
        const now = 'Mar 10, 2026 • 4:02 PM';

        setDocuments((prev) =>
            prev.map((doc) => {
                if (doc.id !== documentId) return doc;

                const updatedRecipients =
                    doc.recipients?.map((recipient) =>
                        recipient.email.toLowerCase() === recipientEmail.toLowerCase()
                            ? {
                                  ...recipient,
                                  hasSigned: true,
                                  signedAt: now,
                              }
                            : recipient,
                    ) ?? [];

                const nextStatus = deriveStatusFromRecipients(updatedRecipients);

                return {
                    ...doc,
                    recipients: updatedRecipients,
                    status: nextStatus,
                    completedAt: nextStatus === 'completed' ? now : doc.completedAt,
                    auditTrail: [
                        ...(doc.auditTrail ?? []),
                        {
                            id: Date.now(),
                            label: `${recipientEmail} signed document`,
                            timestamp: now,
                        },
                        ...(nextStatus === 'completed' ? [{ id: Date.now() + 1, label: 'Document fully completed', timestamp: now }] : []),
                    ],
                };
            }),
        );
    }

    function handleDownloadDocument(doc: DocumentItem) {
        console.log('Download PDF for', doc.title);
    }

    return (
        <AdminLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-[#FCF9F2] p-4 md:p-6">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    {selectedDocument ? (
                        <div className="space-y-4">
                            {activeView === 'review' && (
                                <button
                                    type="button"
                                    onClick={handleCloseDocumentFlow}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6B635B] transition-colors hover:text-[#1A1614]"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Admin Dashboard
                                </button>
                            )}

                            {activeView === 'review' && (
                                <ReviewDocumentView
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onChangeStatus={(status) => handleUpdateDocument(selectedDocument.id, { status })}
                                    onSaveNote={(note) => handleUpdateDocument(selectedDocument.id, { lawyerNote: note })}
                                    onApproveAndSend={handleApproveAndContinueToSend}
                                />
                            )}

                            {activeView === 'sign' && (
                                <SignView
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onSendSignatureRequests={() => handleSendSignatureRequests(selectedDocument.id)}
                                    onMarkRecipientSigned={(recipientEmail) => handleMockRecipientSigned(selectedDocument.id, recipientEmail)}
                                />
                            )}

                            {activeView === 'completed' && (
                                <CompletedDocumentView
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onDownload={() => handleDownloadDocument(selectedDocument)}
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Dashboard Overview</h1>
                                <p className="text-sm text-[#6B635B]">
                                    Welcome back, {user.name}! Here&apos;s what&apos;s happening with legal reviews and signature requests today.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;

                                    return (
                                        <Card key={index} className="border-[#E7E1D7] bg-white transition-all hover:shadow-sm">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <p className="text-sm text-[#6B635B]">{stat.description}</p>
                                                        <div className="mt-1 text-2xl font-semibold tracking-tight text-[#1A1614]">
                                                            {stat.value.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7E1D7] bg-[#F2EDE4]">
                                                        <Icon className="h-5 w-5 text-[#A68A64]" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            <DocumentTable items={documents} pageSize={6} onReview={handleOpenReview} onViewCompleted={handleViewCompleted} />
                        </>
                    )}
                </div>
            </main>
        </AdminLayout>
    );
}
