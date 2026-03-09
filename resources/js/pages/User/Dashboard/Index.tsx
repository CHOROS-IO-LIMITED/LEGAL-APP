import { Card, CardContent } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { ArrowLeft, CheckCircle, ClipboardList, Clock, XCircleIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import DocumentTable from './DocumentTable';
import ReviewDocumentView from './ReviewDocumentView';

interface User {
    name: string;
    email: string;
}

export type DocumentStatus = 'pending_review' | 'in_review' | 'approved' | 'rejected';

export type DocumentItem = {
    id: string | number;
    title: string;
    submittedAtLabel: string;
    status: DocumentStatus;
    isUrgent?: boolean;
    clientEmail?: string;
    kycStatus?: 'Verified' | 'Pending';
    paymentStatus?: 'Received' | 'Pending';
    note?: string;
};

interface DashboardProps {
    user: User;
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
    {
        id: 1,
        title: 'Residential Lease — J. Harrington',
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
        submittedAtLabel: 'Yesterday',
        status: 'in_review',
        clientEmail: 'robert@example.com',
        kycStatus: 'Pending',
        paymentStatus: 'Pending',
        note: '',
    },
    {
        id: 4,
        title: 'Marketing Agreement — BlueWave',
        submittedAtLabel: '2 Mar',
        status: 'approved',
        clientEmail: 'lisa@example.com',
        kycStatus: 'Verified',
        paymentStatus: 'Received',
        note: '',
    },
    {
        id: 5,
        title: 'Partnership Contract — Nova Group',
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
        submittedAtLabel: '28 Feb',
        status: 'pending_review',
        clientEmail: 'amanda@example.com',
        kycStatus: 'Pending',
        paymentStatus: 'Pending',
        note: '',
    },
];

export default function UserDashboard({ user }: DashboardProps) {
    const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | number | null>(null);

    const selectedDocument = useMemo(() => documents.find((doc) => doc.id === selectedDocumentId) ?? null, [documents, selectedDocumentId]);

    const stats = useMemo(() => {
        const total = documents.length;
        const pending = documents.filter((doc) => doc.status === 'pending_review' || doc.status === 'in_review').length;
        const approved = documents.filter((doc) => doc.status === 'approved').length;
        const rejected = documents.filter((doc) => doc.status === 'rejected').length;

        return [
            { icon: ClipboardList, value: total, description: 'Total This Month' },
            { icon: Clock, value: pending, description: 'Pending' },
            { icon: CheckCircle, value: approved, description: 'Approved' },
            { icon: XCircleIcon, value: rejected, description: 'Rejected' },
        ];
    }, [documents]);

    function handleOpenReview(doc: DocumentItem) {
        setSelectedDocumentId(doc.id);

        setDocuments((prev) =>
            prev.map((item) => (item.id === doc.id && item.status === 'pending_review' ? { ...item, status: 'in_review' } : item)),
        );
    }

    function handleUpdateDocument(id: string | number, updates: Partial<DocumentItem>) {
        setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)));
    }

    return (
        <UserLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-[#FCF9F2] p-4 md:p-6">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    {/* Section: Document Review View */}
                    {selectedDocument ? (
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => setSelectedDocumentId(null)}
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#6B635B] transition-colors hover:text-[#1A1614]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Dashboard
                            </button>

                            {/* Review document component with callbacks */}
                            <ReviewDocumentView
                                document={selectedDocument}
                                onBack={() => setSelectedDocumentId(null)}
                                onChangeStatus={(status) => handleUpdateDocument(selectedDocument.id, { status })}
                                onSaveNote={(note) => handleUpdateDocument(selectedDocument.id, { note })}
                            />
                        </div>
                    ) : (
                        <>
                            {/* Section: Dashboard Header */}
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Dashboard Overview</h1>
                                <p className="text-sm text-[#6B635B]">
                                    Welcome back, {user.name}! Here&apos;s what&apos;s happening with your business today.
                                </p>
                            </div>

                            {/* Section: Stats Cards */}
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

                            {/* Section: Document Table */}
                            <DocumentTable items={documents} pageSize={5} onReview={handleOpenReview} />
                        </>
                    )}
                </div>
            </main>
        </UserLayout>
    );
}
