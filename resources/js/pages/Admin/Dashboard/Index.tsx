import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, CheckCircle, ClipboardList, Clock, XCircleIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import CompletedDocumentView from './CompletedDocumentView';
import DocumentTable from './DocumentTable';
import ReviewDocumentView from './ReviewDocumentView';
import SignView from './SignView';
import SuccessView from './SuccessView';

interface User {
    name: string;
    email: string;
}

export type DocumentStatus = 'pending_review' | 'in_review' | 'awaiting_signature' | 'completed' | 'rejected';

export type AuditTrailItem = {
    id: string | number;
    label: string;
    timestamp: string;
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
    note?: string;

    recipientName?: string;
    recipientEmail?: string;

    lawyerSignedAt?: string;
    sentAt?: string;
    recipientSignedAt?: string;
    completedAt?: string;

    auditTrail?: AuditTrailItem[];
};

interface DashboardProps {
    user: User;
}

type ActiveView = 'review' | 'sign' | 'sent' | 'completed';

const INITIAL_DOCUMENTS: DocumentItem[] = [
    {
        id: 1,
        title: 'Residential Lease — J. Harrington',
        submittedBy: 'James Harrington',
        submittedAtLabel: 'Today 14:32',
        status: 'pending_review',
        isUrgent: true,
        clientEmail: 'james@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        note: '',
    },
    {
        id: 2,
        title: 'NDA — Acme Ltd.',
        submittedBy: 'Sarah Mitchell',
        submittedAtLabel: 'Today 11:15',
        status: 'pending_review',
        clientEmail: 'sarah@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        note: '',
    },
    {
        id: 3,
        title: 'Employment Contract — TechCorp',
        submittedBy: 'Robert Chen',
        submittedAtLabel: 'Yesterday',
        status: 'in_review',
        clientEmail: 'robert@example.com',
        kycStatus: 'Pending',
        paymentStatus: 'Pending',
        note: '',
    },
    {
        id: 4,
        title: 'Commercial Lease — Elm Square',
        submittedBy: 'Amanda Lopez',
        submittedAtLabel: 'Today 09:20',
        status: 'awaiting_signature',
        clientEmail: 'amanda@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        note: 'Approved for signing.',
        recipientName: 'Daniel Carter',
        recipientEmail: 'daniel@example.com',
        lawyerSignedAt: 'Mar 9, 2026 • 10:05 AM',
        sentAt: 'Mar 9, 2026 • 10:08 AM',
        auditTrail: [
            { id: 1, label: 'Document submitted', timestamp: 'Mar 9, 2026 • 9:20 AM' },
            { id: 2, label: 'Lawyer reviewed document', timestamp: 'Mar 9, 2026 • 9:52 AM' },
            { id: 3, label: 'Lawyer signed document', timestamp: 'Mar 9, 2026 • 10:05 AM' },
            { id: 4, label: 'Sent to recipient', timestamp: 'Mar 9, 2026 • 10:08 AM' },
        ],
    },
    {
        id: 5,
        title: 'Partnership Contract — Nova Group',
        submittedBy: 'Daniel Reed',
        submittedAtLabel: '1 Mar',
        status: 'rejected',
        clientEmail: 'daniel@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        note: '',
    },
    {
        id: 6,
        title: 'Consulting Agreement — Pixel Inc.',
        submittedBy: 'Amanda Lopez',
        submittedAtLabel: '28 Feb',
        status: 'pending_review',
        clientEmail: 'amanda@example.com',
        kycStatus: 'Pending',
        paymentStatus: 'Pending',
        note: '',
    },
    {
        id: 7,
        title: 'Service Agreement — Horizon Studio',
        submittedBy: 'Robert Chen',
        submittedAtLabel: '27 Feb',
        status: 'completed',
        clientEmail: 'robert@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        note: 'Reviewed and finalized.',
        recipientName: 'Sarah Mitchell',
        recipientEmail: 'sarah@example.com',
        lawyerSignedAt: 'Mar 9, 2026 • 2:42 PM',
        sentAt: 'Mar 9, 2026 • 2:44 PM',
        recipientSignedAt: 'Mar 9, 2026 • 3:10 PM',
        completedAt: 'Mar 9, 2026 • 3:10 PM',
        auditTrail: [
            { id: 1, label: 'Document submitted', timestamp: 'Mar 9, 2026 • 2:15 PM' },
            { id: 2, label: 'Lawyer reviewed document', timestamp: 'Mar 9, 2026 • 2:30 PM' },
            { id: 3, label: 'Lawyer signed document', timestamp: 'Mar 9, 2026 • 2:42 PM' },
            { id: 4, label: 'Sent to recipient', timestamp: 'Mar 9, 2026 • 2:44 PM' },
            { id: 5, label: 'Recipient signed document', timestamp: 'Mar 9, 2026 • 3:10 PM' },
            { id: 6, label: 'Document completed', timestamp: 'Mar 9, 2026 • 3:10 PM' },
        ],
    },
];

export default function AdminDashboard({ user }: DashboardProps) {
    const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | number | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('review');

    const selectedDocument = useMemo(() => documents.find((doc) => doc.id === selectedDocumentId) ?? null, [documents, selectedDocumentId]);

    const stats = useMemo(() => {
        const total = documents.length;
        const pending = documents.filter(
            (doc) => doc.status === 'pending_review' || doc.status === 'in_review' || doc.status === 'awaiting_signature',
        ).length;

        const approved = documents.filter((doc) => doc.status === 'completed').length;
        const rejected = documents.filter((doc) => doc.status === 'rejected').length;

        return [
            { icon: ClipboardList, value: total, description: 'Total This Month' },
            { icon: Clock, value: pending, description: 'Pending' },
            { icon: CheckCircle, value: approved, description: 'Completed' },
            { icon: XCircleIcon, value: rejected, description: 'Rejected' },
        ];
    }, [documents]);

    function handleBackToReviewFromSign() {
        if (!selectedDocument) return;

        handleUpdateDocument(selectedDocument.id, { status: 'in_review' });
        setActiveView('review');
    }

    function handleOpenReview(doc: DocumentItem) {
        setSelectedDocumentId(doc.id);
        setActiveView('review');

        setDocuments((prev) =>
            prev.map((item) => (item.id === doc.id && item.status === 'pending_review' ? { ...item, status: 'in_review' } : item)),
        );
    }

    function handleUpdateDocument(id: string | number, updates: Partial<DocumentItem>) {
        setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)));
    }

    function handleCloseDocumentFlow() {
        setSelectedDocumentId(null);
        setActiveView('review');
    }

    function handleSign() {
        if (!selectedDocument) return;
        setActiveView('sign');
    }

    function handleSentDocument(payload: { recipientName: string; recipientEmail: string }) {
        if (!selectedDocument) return;

        const now = 'Mar 9, 2026 • 2:44 PM';

        handleUpdateDocument(selectedDocument.id, {
            status: 'awaiting_signature',
            recipientName: payload.recipientName,
            recipientEmail: payload.recipientEmail,
            sentAt: now,
            lawyerSignedAt: selectedDocument.lawyerSignedAt ?? 'Mar 9, 2026 • 2:42 PM',
            auditTrail: [
                ...(selectedDocument.auditTrail ?? [
                    { id: 1, label: 'Document submitted', timestamp: selectedDocument.submittedAtLabel },
                    { id: 2, label: 'Lawyer reviewed document', timestamp: 'Mar 9, 2026 • 2:30 PM' },
                    { id: 3, label: 'Lawyer signed document', timestamp: 'Mar 9, 2026 • 2:42 PM' },
                ]),
                { id: Date.now(), label: 'Sent to recipient', timestamp: now },
            ],
        });

        setActiveView('sent');
    }

    function handleViewCompleted(doc: DocumentItem) {
        setSelectedDocumentId(doc.id);
        setActiveView('completed');
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
                                    onSaveNote={(note) => handleUpdateDocument(selectedDocument.id, { note })}
                                    onApproveAndSign={handleSign}
                                />
                            )}

                            {activeView === 'sign' && (
                                <SignView document={selectedDocument} onBack={handleBackToReviewFromSign} onSend={handleSentDocument} />
                            )}
                            {activeView === 'sent' && <SuccessView document={selectedDocument} onBackToDashboard={handleCloseDocumentFlow} />}

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
                                    Welcome back, {user.name}! Here&apos;s what&apos;s happening with your business today.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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

                            <DocumentTable
                                items={documents}
                                pageSize={5}
                                onReview={handleOpenReview}
                                onViewCompleted={handleViewCompleted}
                                onDownload={handleDownloadDocument}
                            />
                        </>
                    )}
                </div>
            </main>
        </AdminLayout>
    );
}
