import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import type { DashboardProps, DocumentItem, SignatureRecipient } from '@/types/User/Dashboard/types';
import { router } from '@inertiajs/react';
import { CheckCircle, ClipboardList, Clock, FileDown, FileSignature, SquarePen } from 'lucide-react';
import { useMemo, useState } from 'react';
import CompletedDocumentView from './CompletedDocumentView';
import DocumentTable from './DocumentTable';
import ReviewDocumentView from './ReviewDocumentView';
import SignView from './SignView';

type ActiveView = 'review' | 'sign' | 'completed';

type SignatureRecipientPayload = {
    name: string;
    email: string;
    role: string | null;
    routing_order: number | null;
    recipient_id: string | null;
    status: string | null;
    signed_at: string | null;
    sign_url: string | null;
};

export default function UserDashboard({ user, documents }: DashboardProps) {
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('review');

    const selectedDocument = useMemo(() => documents.find((doc) => doc.id === selectedDocumentId) ?? null, [documents, selectedDocumentId]);

    const stats = useMemo(() => {
        const total = documents.length;
        const drafts = documents.filter((doc) => doc.dashboardStatus === 'draft').length;
        const pendingApproval = documents.filter((doc) => doc.dashboardStatus === 'pending_approval').length;
        const forSignature = documents.filter((doc) => doc.dashboardStatus === 'signature').length;
        const completed = documents.filter((doc) => doc.dashboardStatus === 'completed').length;

        return [
            { icon: ClipboardList, value: total, description: 'Total Documents' },
            { icon: SquarePen, value: drafts, description: 'Drafts' },
            { icon: Clock, value: pendingApproval, description: 'Pending Approval' },
            { icon: FileSignature, value: forSignature, description: 'Signature' },
            { icon: CheckCircle, value: completed, description: 'Completed' },
        ];
    }, [documents]);

    function handleOpenDocument(doc: DocumentItem) {
        setSelectedDocumentId(doc.id);

        if (doc.dashboardStatus === 'signature') {
            setActiveView('sign');
            return;
        }

        if (doc.dashboardStatus === 'completed') {
            setActiveView('completed');
            return;
        }

        setActiveView('review');
    }

    function handleCloseDocumentFlow() {
        setSelectedDocumentId(null);
        setActiveView('review');
    }

    function mapRecipientsForRequest(recipients: SignatureRecipient[]): SignatureRecipientPayload[] {
        return recipients.map((recipient) => ({
            name: recipient.name,
            email: recipient.email,
            role: recipient.role ?? null,
            routing_order: recipient.routing_order ?? null,
            recipient_id: recipient.recipient_id ?? null,
            status: recipient.status ?? null,
            signed_at: recipient.signed_at ?? null,
            sign_url: recipient.sign_url ?? null,
        }));
    }

    function handleSubmitForApproval(document: DocumentItem, payload: { clientNote?: string; signatureRecipients: SignatureRecipient[] }) {
        router.post(
            route('user.documents.submit-for-approval', document.id),
            {
                client_note: payload.clientNote ?? null,
                signature_recipients: mapRecipientsForRequest(payload.signatureRecipients),
            },
            {
                preserveScroll: true,
            },
        );
    }

    function handleReturnToQuestions(document: DocumentItem, clientNote: string) {
        router.post(
            route('user.documents.return-to-questions', document.id),
            {
                client_note: clientNote,
            },
            {
                preserveScroll: true,
            },
        );
    }

    function handleDownload(document: DocumentItem) {
        window.open(document.downloadUrl, '_blank', 'noopener,noreferrer');
    }

    function handleStartSigning(document: DocumentItem) {
        router.post(route('user.documents.sign', document.id), undefined, {
            preserveScroll: true,
        });
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
                                    onSubmitForApproval={(payload) => handleSubmitForApproval(selectedDocument, payload)}
                                    onReturnToQuestions={(note) => handleReturnToQuestions(selectedDocument, note)}
                                />
                            )}

                            {activeView === 'sign' && (
                                <SignView
                                    currentUserEmail={user.email}
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onDownload={() => handleDownload(selectedDocument)}
                                    onSign={() => handleStartSigning(selectedDocument)}
                                />
                            )}

                            {activeView === 'completed' && (
                                <CompletedDocumentView
                                    currentUserEmail={user.email}
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onDownload={() => handleDownload(selectedDocument)}
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="border border-[#E7E1D7] bg-white p-6 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">My Documents</h1>
                                        <p className="text-sm text-[#6B635B]">
                                            Welcome back, {user.name}! View and manage all your legal documents, approvals, and signatures.
                                        </p>
                                    </div>

                                    <Button className="inline-flex cursor-pointer items-center gap-2 rounded-none bg-[#3D2B1F] px-4 text-sm text-white shadow-sm hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20">
                                        <FileDown className="h-4 w-4" />
                                        Export Documents
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;

                                    return (
                                        <Card key={index} className="rounded-none">
                                            {/* Card Header */}
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <CardTitle className="text-sm font-medium text-[#6B635B]">{stat.description}</CardTitle>

                                                <div className="flex h-8 w-8 items-center justify-center border border-[#E7E1D7] bg-[#F2EDE4]">
                                                    <Icon className="h-4 w-4 text-[#A68A64]" />
                                                </div>
                                            </CardHeader>

                                            {/* Card Content */}
                                            <CardContent>
                                                <div className="text-2xl font-bold text-[#1A1614]">{stat.value.toLocaleString()}</div>
                                                <p className="text-xs text-[#6B635B]">
                                                    {(() => {
                                                        switch (stat.description) {
                                                            case 'Total Documents':
                                                                return 'Documents created';
                                                            case 'Drafts':
                                                                return 'Documents in draft';
                                                            case 'Pending Approval':
                                                                return 'Awaiting approval';
                                                            case 'Signature':
                                                                return 'Documents for signature';
                                                            case 'Completed':
                                                                return 'Completed documents';
                                                            default:
                                                                return '';
                                                        }
                                                    })()}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                            <DocumentTable items={documents} pageSize={6} onOpen={handleOpenDocument} />
                        </>
                    )}
                </div>
            </main>
        </UserLayout>
    );
}
