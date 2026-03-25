import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DASHBOARD_STATUS_META } from '@/types/Admin/Dashboard/status';
import type { DocumentItem } from '@/types/Admin/Dashboard/types';
import { ArrowLeft, CheckCircle2, Download, FileSignature, Mail, MessageSquare, RotateCcw, UserRound } from 'lucide-react';
import { useState } from 'react';

type Props = {
    document: DocumentItem;
    onBack: () => void;
    onApprove: () => void;
    onReject: (lawyerNote: string) => void;
    onDownload: () => void;
};

function DocumentPreview({ pdfUrl }: { pdfUrl: string | null }) {
    if (!pdfUrl) {
        return (
            <Card className="overflow-hidden rounded-2xl border-[#E7E1D7] bg-white shadow-sm">
                <CardContent className="flex h-[80vh] items-center justify-center bg-[#FBF8F2] p-8 text-sm text-[#6B635B]">
                    Preview unavailable. Please regenerate the PDF if needed.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden rounded-2xl border-[#E7E1D7] bg-white shadow-sm">
            <CardContent className="p-0">
                <iframe title="Generated document preview" src={pdfUrl} className="h-[80vh] w-full bg-white" />
            </CardContent>
        </Card>
    );
}

export default function ReviewDocumentView({ document, onBack, onApprove, onReject, onDownload }: Props) {
    const statusMeta = DASHBOARD_STATUS_META[document.dashboardStatus];
    const StatusIcon = statusMeta.Icon;
    const isPendingApproval = document.dashboardStatus === 'pending_approval';
    const isRejected = document.dashboardStatus === 'rejected';
    const [lawyerNote, setLawyerNote] = useState(document.lawyerNote ?? '');

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
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

                        <span className={statusMeta.pillClassName}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusMeta.label}
                        </span>
                    </div>

                    <p className="text-sm text-[#6B635B]">
                        Submitted: {document.submittedForApprovalAt ?? 'N/A'} · Last updated: {document.updatedAtLabel ?? 'N/A'}
                    </p>
                </div>

                <DocumentPreview pdfUrl={document.generatedPdfUrl} />
            </div>

            <div className="space-y-3">
                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                            <FileSignature className="h-3.5 w-3.5 text-[#7C7368]" />
                            Review Action
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4">
                        {isPendingApproval && (
                            <>
                                <button
                                    type="button"
                                    onClick={onApprove}
                                    disabled={!document.actions.canApproveForSignature}
                                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#CFEAD9] bg-white px-4 text-sm font-semibold text-[#1F9D6A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A9D8BC] hover:bg-[#F8FFFB] hover:shadow-md focus:ring-2 focus:ring-[#1F9D6A]/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve for Signature
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onReject(lawyerNote)}
                                    disabled={!document.actions.canRejectAfterReview || !lawyerNote.trim()}
                                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#F3C9C9] bg-white px-4 text-sm font-semibold text-[#B42318] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E9A8A8] hover:bg-[#FFF8F8] hover:shadow-md focus:ring-2 focus:ring-[#B42318]/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Request Amendment
                                </button>
                            </>
                        )}

                        {isRejected && (
                            <div className="rounded-2xl border border-[#F3C9C9] bg-gradient-to-b from-[#FFF8F8] to-[#FEF1F1] p-5 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDECEC] shadow-inner ring-4 ring-[#FFF5F5]">
                                        <RotateCcw className="h-7 w-7 text-[#DC2626]" />
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <p className="text-sm font-semibold text-[#1A1614]">Returned to Client</p>
                                        <p className="text-xs leading-5 text-[#6B635B]">
                                            This document has been sent back to the client for revision with your lawyer note.
                                        </p>
                                    </div>

                                    <div className="mt-4 w-full rounded-xl border border-[#EEE7DC] bg-white px-4 py-3 text-left">
                                        <p className="text-[11px] text-[#8A8178]">Returned</p>
                                        <p className="text-sm font-medium text-[#1A1614]">{document.rejectedAt ?? 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={onDownload}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none"
                        >
                            <Download className="h-4 w-4" />
                            Download Current PDF
                        </button>
                    </CardContent>
                </Card>

                {isPendingApproval && (
                    <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                                <MessageSquare className="h-3.5 w-3.5 text-[#7C7368]" />
                                Lawyer Note
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 px-4 pt-4 pb-4">
                            <textarea
                                value={lawyerNote}
                                onChange={(e) => setLawyerNote(e.target.value)}
                                placeholder="Explain what needs to be changed before approval..."
                                className="min-h-[130px] w-full rounded-xl border border-[#E2DBD2] bg-[#FCFAF6] px-4 py-3 text-sm text-[#1A1614] shadow-sm transition outline-none focus:border-[#CDBBA4] focus:ring-2 focus:ring-[#A68A64]/15"
                            />

                            <p className="text-xs text-[#6B635B]">This note will be visible to the client when you request amendment.</p>
                        </CardContent>
                    </Card>
                )}

                {document.clientNote ? (
                    <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                                <MessageSquare className="h-3.5 w-3.5 text-[#7C7368]" />
                                Client Note
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 pt-4 pb-4">
                            <div className="rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] px-4 py-3 text-sm leading-6 text-[#3B332E]">
                                {document.clientNote}
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                {document.lawyerNote ? (
                    <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                                <MessageSquare className="h-3.5 w-3.5 text-[#7C7368]" />
                                Saved Lawyer Note
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 pt-4 pb-4">
                            <div className="rounded-xl border border-[#F5C2C2] bg-[#FFF5F5] px-4 py-3 text-sm leading-6 text-[#7F1D1D]">
                                {document.lawyerNote}
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                            <UserRound className="h-3.5 w-3.5 text-[#7C7368]" />
                            Signature Recipients
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4 text-sm">
                        {document.signatureRecipients.length > 0 ? (
                            document.signatureRecipients.map((recipient, index) => (
                                <div key={`${recipient.email}-${index}`} className="rounded-xl border border-[#EEE7DC] bg-[#FCFAF6] p-3">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-[13px] font-medium text-[#1A1614]">{recipient.name}</p>
                                            <p className="text-[10px] text-[#8A8178]">{recipient.role ?? 'Recipient'}</p>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[11px] text-[#6B635B]">
                                            <Mail className="h-3 w-3" />
                                            <span className="truncate">{recipient.email}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-[#6B635B]">No signature recipients have been attached yet.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
