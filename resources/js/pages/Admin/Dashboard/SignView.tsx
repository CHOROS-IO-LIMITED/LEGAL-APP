import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DocumentItem } from '@/types/Admin/Dashboard/types';
import { ArrowLeft, CheckCircle2, Clock3, Download, FileSignature, Mail, UserRound } from 'lucide-react';

type Props = {
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
                <iframe title="Document preview for signature" src={pdfUrl} className="h-[80vh] w-full bg-white" />
            </CardContent>
        </Card>
    );
}

export default function SignView({ document, onBack, onDownload }: Props) {
    const recipients = document.signatureRecipients ?? [];
    const signedCount = recipients.filter((recipient) => recipient.status === 'completed' || recipient.status === 'signed').length;
    const totalCount = recipients.length || 1;
    const progress = Math.round((signedCount / totalCount) * 100);

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6B635B] transition-colors hover:text-[#1A1614]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Admin Dashboard
                </button>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-[#1A1614]">{document.title}</h1>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#1D4ED8]">
                            <FileSignature className="h-3.5 w-3.5" />
                            Signature
                        </span>
                    </div>

                    <p className="text-sm text-[#6B635B]">
                        Approved by lawyer on {document.approvedForSignatureAt ?? 'N/A'}
                        {document.sentForSignatureAt
                            ? ` · Sent via DocuSign on ${document.sentForSignatureAt}`
                            : ' · Waiting for sender completion in DocuSign'}
                    </p>
                </div>

                <DocumentPreview pdfUrl={document.generatedPdfUrl} />
            </div>

            <div className="space-y-3">
                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                            <FileSignature className="h-3.5 w-3.5 text-[#7C7368]" />
                            Signature Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4">
                        <div className="rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] p-3">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5DED5] bg-white">
                                    <Clock3 className="h-4 w-4 text-[#3D2B1F]" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold text-[#1A1614]">DocuSign Workflow</p>
                                    <p className="mt-1 text-[11px] leading-5 text-[#6B635B]">
                                        This document is managed by DocuSign. Completion is updated automatically after all required recipients finish
                                        signing.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-medium text-[#7A726B]">
                                    <span>Completion</span>
                                    <span>
                                        {signedCount} / {totalCount} Signed
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-[#ECE5DA]">
                                    <div className="h-full rounded-full bg-[#3D2B1F] transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onDownload}
                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none"
                        >
                            <Download className="h-4 w-4" />
                            Download Current PDF
                        </button>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                            <UserRound className="h-3.5 w-3.5 text-[#7C7368]" />
                            Signature Recipients
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2 px-4 pt-4 pb-4">
                        {recipients.length > 0 ? (
                            recipients.map((recipient, index) => {
                                const isSigned = recipient.status === 'completed' || recipient.status === 'signed';

                                return (
                                    <div key={`${recipient.email}-${index}`} className="rounded-lg px-2 py-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[13px] font-medium text-[#1A1614]">{recipient.name}</p>
                                                <p className="text-[10px] text-[#8A8178]">{recipient.role ?? 'Recipient'}</p>

                                                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#6B635B]">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{recipient.email}</span>
                                                </div>

                                                {recipient.signed_at ? (
                                                    <div className="mt-1.5 text-[10px] text-[#6B635B]">Signed at {recipient.signed_at}</div>
                                                ) : null}
                                            </div>

                                            {isSigned ? (
                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#CFEAD9] bg-[#F4FCF7] px-2 py-0.5 text-[10px] font-medium text-[#1F9D6A]">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Signed
                                                </span>
                                            ) : (
                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#D8E5FF] bg-[#F7FAFF] px-2 py-0.5 text-[10px] font-medium text-[#2563EB]">
                                                    <Clock3 className="h-3 w-3" />
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-sm text-[#6B635B]">No signature recipients have been attached yet.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
