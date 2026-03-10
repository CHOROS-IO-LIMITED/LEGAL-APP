import { Card, CardContent } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, ClipboardList, Clock, Plus, SquarePen } from 'lucide-react';
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

export type DocumentStatus = 'draft' | 'pending_lawyer_review' | 'approved' | 'changes_requested';

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
    clientEmail?: string;
    kycStatus?: 'Verified' | 'Pending';
    paymentStatus?: 'Received' | 'Pending';

    clientNote?: string;
    lawyerNote?: string;

    submitterSignedAt?: string;
    lawyerSignedAt?: string;
    completedAt?: string;

    auditTrail?: AuditTrailItem[];
};

interface DashboardProps {
    user: User;
}

type ActiveView = 'review' | 'sign' | 'success' | 'completed';

const INITIAL_DOCUMENTS: DocumentItem[] = [
    {
        id: 1,
        title: 'Residential Lease — J. Harrington',
        submittedBy: 'James Harrington',
        submittedAtLabel: 'Today 14:32',
        status: 'draft',
        clientEmail: 'james@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        clientNote: '',
    },
    {
        id: 2,
        title: 'NDA — Acme Ltd.',
        submittedBy: 'Sarah Mitchell',
        submittedAtLabel: 'Today 11:15',
        status: 'pending_lawyer_review',
        clientEmail: 'sarah@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        clientNote: '',
    },
    {
        id: 3,
        title: 'Employment Contract — TechCorp',
        submittedBy: 'Robert Chen',
        submittedAtLabel: 'Yesterday',
        status: 'changes_requested',
        clientEmail: 'robert@example.com',
        kycStatus: 'Pending',
        paymentStatus: 'Pending',
        lawyerNote: 'Please revise the compensation clause and update the probationary period.',
        clientNote: '',
    },
    {
        id: 4,
        title: 'Commercial Lease — Elm Square',
        submittedBy: 'Amanda Lopez',
        submittedAtLabel: 'Today 09:20',
        status: 'approved',
        clientEmail: 'amanda@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        clientNote: 'Final version submitted successfully.',
        submitterSignedAt: 'Mar 9, 2026 • 9:20 AM',
        lawyerSignedAt: 'Mar 9, 2026 • 10:05 AM',
        completedAt: 'Mar 9, 2026 • 10:05 AM',
        auditTrail: [
            { id: 1, label: 'Document submitted', timestamp: 'Mar 9, 2026 • 9:20 AM' },
            { id: 2, label: 'Lawyer reviewed document', timestamp: 'Mar 9, 2026 • 9:52 AM' },
            { id: 3, label: 'Lawyer approved document', timestamp: 'Mar 9, 2026 • 10:05 AM' },
            { id: 4, label: 'Lawyer signed document', timestamp: 'Mar 9, 2026 • 10:05 AM' },
            { id: 5, label: 'Document completed', timestamp: 'Mar 9, 2026 • 10:05 AM' },
        ],
    },
];

export default function UserDashboard({ user }: DashboardProps) {
    const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | number | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('review');

    const selectedDocument = useMemo(() => documents.find((doc) => doc.id === selectedDocumentId) ?? null, [documents, selectedDocumentId]);

    const stats = useMemo(() => {
        const total = documents.length;
        const draft = documents.filter((doc) => doc.status === 'draft').length;
        const pending = documents.filter((doc) => doc.status === 'pending_lawyer_review').length;
        const approved = documents.filter((doc) => doc.status === 'approved').length;
        const changesRequested = documents.filter((doc) => doc.status === 'changes_requested').length;

        return [
            { icon: ClipboardList, value: total, description: 'Total Documents' },
            { icon: SquarePen, value: draft, description: 'Drafts' },
            { icon: Clock, value: pending, description: 'Waiting for Approval' },
            { icon: CheckCircle, value: approved, description: 'Approved' },
        ];
    }, [documents]);

    function handleBackToReviewFromSign() {
        setActiveView('review');
    }

    function handleOpenReview(doc: DocumentItem) {
        setSelectedDocumentId(doc.id);
        setActiveView('review');
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

    function handleApproveDocument(payload: { fullName: string; date: string }) {
        if (!selectedDocument) return;

        const now = 'Mar 9, 2026 • 2:42 PM';

        handleUpdateDocument(selectedDocument.id, {
            status: 'pending_lawyer_review',
            submitterSignedAt: payload.date || now,
            auditTrail: [
                ...(selectedDocument.auditTrail ?? [{ id: 1, label: 'Document created', timestamp: selectedDocument.submittedAtLabel }]),
                { id: Date.now(), label: `Signed by ${payload.fullName}`, timestamp: payload.date || now },
                { id: Date.now() + 1, label: 'Submitted to lawyer for review', timestamp: now },
            ],
        });

        setActiveView('success');
    }

    function handleViewCompleted(doc: DocumentItem) {
        setSelectedDocumentId(doc.id);
        setActiveView('completed');
    }

    function handleDownloadDocument(doc: DocumentItem) {
        console.log('Download PDF for', doc.title);
    }

    return (
        <UserLayout user={user}>
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
                                    User Dashboard
                                </button>
                            )}

                            {activeView === 'review' && (
                                <ReviewDocumentView
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onChangeStatus={(status) => handleUpdateDocument(selectedDocument.id, { status })}
                                    onSaveNote={(note) => handleUpdateDocument(selectedDocument.id, { clientNote: note })}
                                    onApproveAndSign={handleSign}
                                />
                            )}

                            {activeView === 'sign' && (
                                <SignView document={selectedDocument} onBack={handleBackToReviewFromSign} onApprove={handleApproveDocument} />
                            )}

                            {activeView === 'success' && <SuccessView document={selectedDocument} onBackToDashboard={handleCloseDocumentFlow} />}

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
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/products/details"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6B635B] transition-colors hover:text-[#1A1614]"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Products
                                </Link>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Dashboard Overview</h1>
                                        <p className="text-sm text-[#6B635B]">
                                            Welcome back, {user.name}! Here&apos;s what&apos;s happening with your documents today.
                                        </p>
                                    </div>

                                    <Link
                                        href="/products/details"
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Document
                                    </Link>
                                </div>
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
        </UserLayout>
    );
}
