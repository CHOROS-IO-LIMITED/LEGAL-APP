import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import type { DashboardProps, DocumentItem } from '@/types/Admin/Dashboard/types';
import { router } from '@inertiajs/react';
import { CheckCircle, Clock, FileSignature, RotateCcw } from 'lucide-react';
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
        router.post(
            route('admin.documents.reject', document.id),
            {
                lawyer_note: lawyerNote,
            },
            {
                preserveScroll: true,
            },
        );
    }

    function handleMarkCompleted(document: DocumentItem) {
        router.post(route('admin.documents.complete', document.id), undefined, {
            preserveScroll: true,
        });
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
                                    onMarkCompleted={() => handleMarkCompleted(selectedDocument)}
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
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Admin Dashboard Overview</h1>
                                    <p className="text-sm text-[#6B635B]">
                                        Welcome back, {user.name}! Review client-generated legal documents and manage approval workflow.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

                            <DocumentTable items={documents} pageSize={8} onOpen={handleOpenDocument} />
                        </>
                    )}
                </div>
            </main>
        </AdminLayout>
    );
}
