import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DocumentItem } from '@/types/User/Dashboard/types';
import { ArrowLeft, CheckCircle2, Download, Mail, UserRound } from 'lucide-react';

type Props = {
    currentUserEmail: string;
    document: DocumentItem;
    onBack: () => void;
    onDownload: () => void;
};

function DocumentPreview({ pdfUrl }: { pdfUrl: string | null }) {
    if (!pdfUrl) {
        return (
            <Card className="overflow-hidden rounded-2xl border-[#E7E1D7] bg-white shadow-sm">
                <CardContent className="flex h-[80vh] items-center justify-center bg-[#FBF8F2] p-8 text-sm text-[#6B635B]">
                    Preview unavailable.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden rounded-2xl border-[#E7E1D7] bg-white shadow-sm">
            <CardContent className="p-0">
                <iframe title="Completed document preview" src={pdfUrl} className="h-[80vh] w-full bg-white" />
            </CardContent>
        </Card>
    );
}

export default function CompletedDocumentView({ document, onBack, onDownload }: Props) {
    const recipients = document.signatureRecipients ?? [];

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6B635B] transition-colors hover:text-[#1A1614]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    User Dashboard
                </button>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-[#1A1614]">{document.title}</h1>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#059669]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Completed
                        </span>
                    </div>

                    <p className="text-sm text-[#6B635B]">Fully executed document. Completed at {document.completedAt ?? 'N/A'}.</p>
                </div>

                <DocumentPreview pdfUrl={document.generatedPdfUrl} />
            </div>

            <div className="space-y-3">
                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#1F9D6A]" />
                            Completion Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="px-4 pt-4 pb-4">
                        <div className="rounded-2xl border border-[#CFEAD9] bg-gradient-to-b from-[#F8FFFB] to-[#F1FBF5] p-5 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F8EF] shadow-inner ring-4 ring-[#F4FCF7]">
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
                                    className="group mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                            <UserRound className="h-3.5 w-3.5 text-[#7C7368]" />
                            Recipients
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2 px-4 pt-4 pb-4">
                        {recipients.length > 0 ? (
                            recipients.map((recipient, index) => (
                                <div key={`${recipient.email}-${index}`} className="rounded-lg px-2 py-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="min-w-0">
                                                <p className="truncate text-[13px] font-medium text-[#1A1614]">{recipient.name}</p>
                                                <p className="text-[10px] text-[#8A8178]">{recipient.role ?? 'Recipient'}</p>
                                            </div>

                                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#6B635B]">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate">{recipient.email}</span>
                                            </div>

                                            <div className="mt-1.5 text-[10px] text-[#6B635B]">
                                                {recipient.signed_at ? `Signed at ${recipient.signed_at}` : 'Signature recorded'}
                                            </div>
                                        </div>

                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#CFEAD9] bg-[#F4FCF7] px-2 py-0.5 text-[10px] font-medium text-[#1F9D6A]">
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
