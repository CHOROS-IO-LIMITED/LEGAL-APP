import { Card, CardContent } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, ClipboardList, Clock, FileSignature, Plus, SquarePen } from 'lucide-react';
import { useMemo, useState } from 'react';
import CompletedDocumentView from './CompletedDocumentView';
import DocumentTable from './DocumentTable';
import ReviewDocumentView from './ReviewDocumentView';
import SignView from './SignView';

interface User {
    name: string;
    email: string;
}

export type DocumentStatus = 'draft' | 'pending_lawyer_review' | 'rejected' | 'awaiting_signatures' | 'partially_signed' | 'completed';

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
        status: 'draft',
        clientEmail: 'james@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        clientNote: '',
        recipients: [
            {
                id: 1,
                name: 'James Harrington',
                email: 'james@example.com',
                role: 'Tenant',
                hasSigned: false,
                signedAt: null,
                signUrl: '/sign/mock/1',
            },
            {
                id: 2,
                name: 'Olivia Harrington',
                email: 'olivia@example.com',
                role: 'Co-Tenant',
                hasSigned: false,
                signedAt: null,
                signUrl: '/sign/mock/2',
            },
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
        recipients: [
            {
                id: 1,
                name: 'Sarah Mitchell',
                email: 'sarah@example.com',
                role: 'Disclosing Party',
                hasSigned: false,
                signedAt: null,
                signUrl: '/sign/mock/3',
            },
        ],
        auditTrail: [
            { id: 1, label: 'Document created', timestamp: 'Mar 10, 2026 • 10:40 AM' },
            { id: 2, label: 'Client approved document', timestamp: 'Mar 10, 2026 • 11:12 AM' },
            { id: 3, label: 'Submitted to lawyer for review', timestamp: 'Mar 10, 2026 • 11:15 AM' },
        ],
    },
    {
        id: 3,
        title: 'Employment Contract — TechCorp',
        submittedBy: 'Robert Chen',
        submittedAtLabel: 'Yesterday',
        status: 'rejected',
        clientEmail: 'robert@example.com',
        kycStatus: 'Pending',
        paymentStatus: 'Pending',
        lawyerNote: 'Please correct the compensation section and add the probation period details before resubmission.',
        clientNote: '',
        recipients: [
            {
                id: 1,
                name: 'Robert Chen',
                email: 'robert@example.com',
                role: 'Employee',
                hasSigned: false,
                signedAt: null,
                signUrl: '/sign/mock/4',
            },
            {
                id: 2,
                name: 'TechCorp HR',
                email: 'hr@techcorp.com',
                role: 'Employer',
                hasSigned: false,
                signedAt: null,
                signUrl: '/sign/mock/5',
            },
        ],
    },
    {
        id: 4,
        title: 'Commercial Lease — Elm Square',
        submittedBy: 'Amanda Lopez',
        submittedAtLabel: 'Today 9:20 AM',
        status: 'awaiting_signatures',
        clientEmail: 'amanda@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        recipients: [
            {
                id: 1,
                name: 'Amanda Lopez',
                email: 'amanda@example.com',
                role: 'Tenant',
                hasSigned: false,
                signedAt: null,
                signUrl: '/sign/mock/6',
            },
            {
                id: 2,
                name: 'Elm Square Holdings',
                email: 'leasing@elmsquare.com',
                role: 'Landlord',
                hasSigned: false,
                signedAt: null,
                signUrl: '/sign/mock/7',
            },
        ],
        sentForSignatureAt: 'Mar 10, 2026 • 1:05 PM',
        auditTrail: [
            { id: 1, label: 'Document submitted', timestamp: 'Mar 10, 2026 • 8:50 AM' },
            { id: 2, label: 'Lawyer approved document', timestamp: 'Mar 10, 2026 • 12:58 PM' },
            { id: 3, label: 'Signature requests sent', timestamp: 'Mar 10, 2026 • 1:05 PM' },
        ],
    },
    {
        id: 5,
        title: 'Service Agreement — Northwind Co.',
        submittedBy: 'Daniel Cruz',
        submittedAtLabel: 'Mar 9, 2026',
        status: 'partially_signed',
        clientEmail: 'daniel@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        recipients: [
            {
                id: 1,
                name: 'Daniel Cruz',
                email: 'daniel@example.com',
                role: 'Client',
                hasSigned: true,
                signedAt: 'Mar 10, 2026 • 9:18 AM',
                signUrl: '/sign/mock/8',
            },
            {
                id: 2,
                name: 'Northwind Co.',
                email: 'legal@northwind.com',
                role: 'Provider',
                hasSigned: false,
                signedAt: null,
                signUrl: '/sign/mock/9',
            },
        ],
        sentForSignatureAt: 'Mar 10, 2026 • 8:40 AM',
        auditTrail: [
            { id: 1, label: 'Lawyer approved document', timestamp: 'Mar 10, 2026 • 8:35 AM' },
            { id: 2, label: 'Signature requests sent', timestamp: 'Mar 10, 2026 • 8:40 AM' },
            { id: 3, label: 'Daniel Cruz signed document', timestamp: 'Mar 10, 2026 • 9:18 AM' },
        ],
    },
    {
        id: 6,
        title: 'Consultancy Agreement — Vertex Inc.',
        submittedBy: 'Maria Santos',
        submittedAtLabel: 'Mar 8, 2026',
        status: 'completed',
        clientEmail: 'maria@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        recipients: [
            {
                id: 1,
                name: 'Maria Santos',
                email: 'maria@example.com',
                role: 'Consultant',
                hasSigned: true,
                signedAt: 'Mar 9, 2026 • 10:05 AM',
                signUrl: '/sign/mock/10',
            },
            {
                id: 2,
                name: 'Vertex Inc.',
                email: 'legal@vertex.com',
                role: 'Company',
                hasSigned: true,
                signedAt: 'Mar 9, 2026 • 10:18 AM',
                signUrl: '/sign/mock/11',
            },
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

export default function UserDashboard({ user }: DashboardProps) {
    const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | number | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('review');

    const selectedDocument = useMemo(() => documents.find((doc) => doc.id === selectedDocumentId) ?? null, [documents, selectedDocumentId]);

    const stats = useMemo(() => {
        const total = documents.length;
        const drafts = documents.filter((doc) => doc.status === 'draft').length;
        const waitingApproval = documents.filter((doc) => doc.status === 'pending_lawyer_review').length;
        const forSigning = documents.filter((doc) => ['awaiting_signatures', 'partially_signed'].includes(doc.status)).length;
        const completed = documents.filter((doc) => doc.status === 'completed').length;

        return [
            { icon: ClipboardList, value: total, description: 'Total Documents' },
            { icon: SquarePen, value: drafts, description: 'Drafts' },
            { icon: Clock, value: waitingApproval, description: 'Waiting Approval' },
            { icon: FileSignature, value: forSigning, description: 'For Signature' },
            { icon: CheckCircle, value: completed, description: 'Completed' },
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

    function handleApproveDocument() {
        if (!selectedDocument) return;

        const now = 'Mar 10, 2026 • 2:42 PM';

        handleUpdateDocument(selectedDocument.id, {
            status: 'pending_lawyer_review',
            auditTrail: [
                ...(selectedDocument.auditTrail ?? [{ id: 1, label: 'Document created', timestamp: selectedDocument.submittedAtLabel }]),
                { id: Date.now(), label: 'Client approved document', timestamp: now },
                { id: Date.now() + 1, label: 'Submitted to lawyer for review', timestamp: now },
            ],
        });
    }

    function handleApplyClientChanges(note: string) {
        if (!selectedDocument) return;

        handleUpdateDocument(selectedDocument.id, {
            clientNote: note,
            status: 'draft',
        });
    }

    function handleRecipientSign(documentId: string | number, recipientEmail: string) {
        const now = 'Mar 10, 2026 • 3:08 PM';

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
                        ...(nextStatus === 'completed'
                            ? [
                                  {
                                      id: Date.now() + 1,
                                      label: 'Document fully completed',
                                      timestamp: now,
                                  },
                              ]
                            : []),
                    ],
                };
            }),
        );

        const updatedDoc = documents.find((doc) => doc.id === documentId);
        if (updatedDoc) {
            const updatedRecipients =
                updatedDoc.recipients?.map((recipient) =>
                    recipient.email.toLowerCase() === recipientEmail.toLowerCase()
                        ? {
                              ...recipient,
                              hasSigned: true,
                              signedAt: now,
                          }
                        : recipient,
                ) ?? [];

            const nextStatus = deriveStatusFromRecipients(updatedRecipients);
            setActiveView(nextStatus === 'completed' ? 'completed' : 'sign');
        }
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
                                <ReviewDocumentView
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onApproveDocument={handleApproveDocument}
                                    onApplyChanges={handleApplyClientChanges}
                                />
                            )}

                            {activeView === 'sign' && (
                                <SignView
                                    currentUserEmail={user.email}
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onSign={(recipientEmail) => handleRecipientSign(selectedDocument.id, recipientEmail)}
                                />
                            )}

                            {activeView === 'completed' && (
                                <CompletedDocumentView
                                    currentUserEmail={user.email}
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

                            <DocumentTable
                                items={documents}
                                pageSize={6}
                                currentUserEmail={user.email}
                                onReview={handleOpenReview}
                                onViewCompleted={handleViewCompleted}
                            />
                        </>
                    )}
                </div>
            </main>
        </UserLayout>
    );
}
