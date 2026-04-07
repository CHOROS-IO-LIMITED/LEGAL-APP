import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DocumentItem } from '@/types/Admin/Dashboard/types';
import { CheckCircle2, Download, Mail, UserRound } from 'lucide-react';

type Props = {
    document: DocumentItem;
    onBack: () => void;
    onDownload: () => void;
};

function DocumentPreview({ pdfUrl }: { pdfUrl: string | null }) {
    if (!pdfUrl) {
        return (
            <Card className="overflow-hidden rounded-none border-[#E7E1D7] bg-white shadow-sm">
                <CardContent className="flex h-[80vh] items-center justify-center bg-[#FBF8F2] p-8 text-sm text-[#6B635B]">
                    Preview unavailable.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden rounded-none border-[#E7E1D7] bg-white shadow-sm">
            <CardContent className="p-0">
                <iframe title="Completed document preview" src={pdfUrl} className="h-[80vh] w-full bg-white" />
            </CardContent>
        </Card>
    );
}

export default function CompletedDocumentView({ document, onBack, onDownload }: Props) {
    const recipients = document.signatureRecipients ?? [];

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* Main Document Column */}
            <div className="space-y-4">
                {/* Header / Breadcrumb */}
                <div className="border border-[#E7E1D7] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-[#6B635B]">
                            <button type="button" onClick={onBack} className="cursor-pointer hover:text-[#1A1614]">
                                Admin Dashboard
                            </button>
                            <span>/</span>
                            <span className="max-w-[240px] truncate font-medium text-[#1A1614]">{document.title}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="truncate text-2xl font-semibold tracking-tight text-[#1A1614]">{document.title}</h1>

                            <span className="inline-flex items-center gap-1.5 border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#059669]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Completed
                            </span>
                        </div>

                        <p className="text-sm text-[#6B635B]">Fully executed document. Completed at {document.completedAt ?? 'N/A'}.</p>
                    </div>
                </div>

                {/* Preview */}
                <DocumentPreview pdfUrl={document.generatedPdfUrl} />
            </div>

            {/* Sidebar Column */}
            <div className="space-y-3">
                {/* Completion Status Card */}
                <Card className="rounded-none border border-[#E7E1D7] bg-white">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 py-3">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#4E463F] uppercase">
                            <CheckCircle2 className="h-4 w-4 text-[#1F9D6A]" />
                            Completion Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="px-4 py-4">
                        <div className="border border-[#CFEAD9] bg-[#F8FFFB] p-5 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center bg-[#E8F8EF] shadow-inner ring-4 ring-[#F4FCF7]">
                                    <CheckCircle2 className="h-7 w-7 text-[#1F9D6A]" />
                                </div>

                                <div className="mt-4 space-y-1.5">
                                    <p className="text-sm font-semibold text-[#1A1614]">Document Completed</p>
                                    <p className="text-xs leading-5 text-[#6B635B]">
                                        This document has passed review, completed signature workflow, and is ready for download.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onDownload}
                                    className="group mt-5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#2E2017] focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recipients Card */}
                <Card className="rounded-none border border-[#E7E1D7] bg-white">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 py-3">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#4E463F] uppercase">
                            <UserRound className="h-4 w-4 text-[#7C7368]" />
                            Recipients
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2 px-4 py-4 text-sm">
                        {recipients.length > 0 ? (
                            recipients.map((recipient, index) => (
                                <div key={`${recipient.email}-${index}`} className="border-b border-[#EEE7DC] px-2 py-2 last:border-b-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-[#1A1614]">{recipient.name}</p>
                                            <p className="text-xs font-medium text-[#8A8178]">{recipient.role ?? 'Recipient'}</p>

                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6B635B]">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate">{recipient.email}</span>
                                            </div>

                                            <div className="mt-1 text-xs text-[#6B635B]">
                                                {recipient.signed_at ? `Signed at ${recipient.signed_at}` : 'Signature recorded'}
                                            </div>
                                        </div>

                                        <span className="inline-flex shrink-0 items-center gap-1 border border-[#CFEAD9] bg-[#F4FCF7] px-2 py-0.5 text-[10px] font-medium text-[#1F9D6A]">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Signed
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-[#6B635B]">No recipient data available.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
