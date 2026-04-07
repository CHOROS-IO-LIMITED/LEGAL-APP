import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import type { DashboardProps, DocumentItem } from '@/types/Admin/Dashboard/types';
import { router } from '@inertiajs/react';
import { CheckCircle, Clock, FileDown, FileSignature, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import CompletedDocumentView from './CompletedDocumentView';
import DocumentTable from './DocumentTable';
import ReviewDocumentView from './ReviewDocumentView';
import SignView from './SignView';

type ActiveView = 'review' | 'signature' | 'completed';

export default function AdminDashboard({ user, documents }: DashboardProps) {
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('review');

    const selectedDocument = useMemo(() => documents.find((doc) => doc.id === selectedDocumentId) ?? null, [documents, selectedDocumentId]);

    const stats = useMemo(() => {
        const pendingReview = documents.filter((doc) => doc.dashboardStatus === 'pending_approval').length;
        const forSignature = documents.filter((doc) => doc.dashboardStatus === 'signature').length;
        const needsAmendment = documents.filter((doc) => doc.dashboardStatus === 'rejected').length;
        const completed = documents.filter((doc) => doc.dashboardStatus === 'completed').length;

        return [
            { icon: Clock, value: pendingReview, description: 'Pending Review' },
            { icon: FileSignature, value: forSignature, description: 'Signature' },
            { icon: RotateCcw, value: needsAmendment, description: 'Needs Amendment' },
            { icon: CheckCircle, value: completed, description: 'Completed' },
        ];
    }, [documents]);

    function handleOpenDocument(doc: DocumentItem) {
        setSelectedDocumentId(doc.id);

        if (doc.dashboardStatus === 'signature') {
            setActiveView('signature');
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

    function handleApprove(document: DocumentItem) {
        router.post(route('admin.documents.approve', document.id), undefined, {
            preserveScroll: true,
        });
    }

    function handleReject(document: DocumentItem, lawyerNote: string) {
        router.post(route('admin.documents.reject', document.id), { lawyer_note: lawyerNote }, { preserveScroll: true });
    }

    function handleDownload(document: DocumentItem) {
        window.open(document.downloadUrl, '_blank', 'noopener,noreferrer');
    }

    return (
        <AdminLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-[#FCF9F2] p-4 md:p-6">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    {selectedDocument ? (
                        <div className="space-y-4">
                            {activeView === 'review' && (
                                <ReviewDocumentView
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onApprove={() => handleApprove(selectedDocument)}
                                    onReject={(lawyerNote) => handleReject(selectedDocument, lawyerNote)}
                                    onDownload={() => handleDownload(selectedDocument)}
                                />
                            )}

                            {activeView === 'signature' && (
                                <SignView
                                    document={selectedDocument}
                                    onBack={handleCloseDocumentFlow}
                                    onDownload={() => handleDownload(selectedDocument)}
                                />
                            )}

                            {activeView === 'completed' && (
                                <CompletedDocumentView
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
                                        <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Admin Dashboard Overview</h1>
                                        <p className="text-sm text-[#6B635B]">
                                            Welcome back, {user.name}! Review client-generated legal documents and manage approvals.
                                        </p>
                                    </div>

                                    <Button className="inline-flex cursor-pointer items-center gap-2 rounded-none bg-[#3D2B1F] px-4 text-sm text-white shadow-sm hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20">
                                        <FileDown className="h-4 w-4" />
                                        Export Documents
                                    </Button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;

                                    return (
                                        <Card key={index} className="rounded-none">
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <CardTitle className="text-sm font-medium text-[#6B635B]">{stat.description}</CardTitle>
                                                <div className="flex h-8 w-8 items-center justify-center border border-[#E7E1D7] bg-[#F2EDE4]">
                                                    <Icon className="h-4 w-4 text-[#A68A64]" />
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-[#1A1614]">{stat.value.toLocaleString()}</div>
                                                <p className="text-xs text-[#6B635B]">
                                                    {(() => {
                                                        switch (stat.description) {
                                                            case 'Pending Review':
                                                                return 'Documents awaiting review';
                                                            case 'Signature':
                                                                return 'Documents for signature';
                                                            case 'Needs Amendment':
                                                                return 'Rejected documents';
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

                            {/* Document Table */}
                            <DocumentTable items={documents} pageSize={8} onOpen={handleOpenDocument} />
                        </>
                    )}
                </div>
            </main>
        </AdminLayout>
    );
}
