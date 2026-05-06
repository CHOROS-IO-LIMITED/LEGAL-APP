import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DocumentItem } from '@/types/User/Dashboard/types';
import { CheckCircle2, Clock3, Download, FileSignature, Mail, PenLine, UserRound } from 'lucide-react';

type Props = {
    currentUserEmail: string;
    document: DocumentItem;
    onBack: () => void;
    onDownload: () => void;
    onSign: () => void;
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
                <iframe
                    title="Document preview for signature"
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="h-[80vh] w-full bg-white"
                />
            </CardContent>
        </Card>
    );
}

export default function SignView({ currentUserEmail, document, onBack, onDownload, onSign }: Props) {
    const recipients = document.signatureRecipients ?? [];
    const normalizedCurrentUserEmail = currentUserEmail.trim().toLowerCase();

    const currentUserRecipient = recipients.find((recipient) => (recipient.email ?? '').trim().toLowerCase() === normalizedCurrentUserEmail);

    const currentUserAlreadySigned = currentUserRecipient?.status === 'signed' || currentUserRecipient?.status === 'completed';

    const canCurrentUserSign = document.actions.canSign && !currentUserAlreadySigned;

    const signedCount = recipients.filter((recipient) => recipient.status === 'signed' || recipient.status === 'completed').length;

    const totalCount = recipients.length || 1;
    const progress = Math.round((signedCount / totalCount) * 100);

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
                {/* Header */}
                <div className="border border-[#E7E1D7] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-[#6B635B]">
                            <button type="button" onClick={onBack} className="cursor-pointer hover:text-[#1A1614]">
                                My Documents
                            </button>
                            <span>/</span>
                            <span className="max-w-[240px] truncate font-medium text-[#1A1614]">{document.title}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="truncate text-2xl font-semibold tracking-tight text-[#1A1614]">{document.title}</h1>

                            <span className="inline-flex items-center gap-1.5 border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#1D4ED8]">
                                <FileSignature className="h-3.5 w-3.5" />
                                Signature
                            </span>
                        </div>

                        <p className="text-sm text-[#6B635B]">
                            Approved by lawyer on {document.approvedForSignatureAt ?? 'N/A'}
                            {document.sentForSignatureAt ? ` · Sent for signature on ${document.sentForSignatureAt}` : ''}
                        </p>
                    </div>
                </div>

                {/* Preview */}
                <DocumentPreview pdfUrl={document.generatedPdfUrl} />
            </div>

            <div className="space-y-3">
                <Card className="rounded-none border border-[#E7E1D7] bg-white">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 py-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                            <FileSignature className="h-4 w-4 text-[#7C7368]" />
                            Signature Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 py-4">
                        <div className="border border-[#E7E1D7] bg-[#FCFAF6] p-3">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5DED5] bg-white">
                                    <Clock3 className="h-4 w-4 text-[#3D2B1F]" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold text-[#1A1614]">Waiting for Signatures</p>
                                    <p className="mt-1 text-[11px] leading-5 text-[#6B635B]">
                                        The document owner can sign here in the dashboard or through the DocuSign email. Other selected recipients
                                        will sign via their email invitation only.
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

                        {canCurrentUserSign ? (
                            <button
                                type="button"
                                onClick={onSign}
                                className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 border border-[#CFEAD9] bg-white text-sm font-semibold text-[#1F9D6A] transition-all hover:bg-[#F8FFFB] disabled:opacity-60"
                            >
                                <PenLine className="h-4 w-4" />
                                Sign Document
                            </button>
                        ) : currentUserAlreadySigned ? (
                            <div className="border border-[#CFEAD9] bg-[#F4FCF7] px-4 py-3 text-sm text-[#1F7A52]">
                                You have already signed this document.
                            </div>
                        ) : (
                            <div className="border border-[#E7E1D7] bg-[#FCFAF6] px-4 py-3 text-sm text-[#6B635B]">
                                You can monitor the signing progress here. Non-owner recipients must use the DocuSign email invitation sent to their
                                address.
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={onDownload}
                            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 bg-[#3D2B1F] px-4 text-sm font-medium text-white transition-all hover:bg-[#2E2017]"
                        >
                            <Download className="h-4 w-4" />
                            Download Current PDF
                        </button>
                    </CardContent>
                </Card>

                <Card className="rounded-none border border-[#E7E1D7] bg-white">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 py-3">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#4E463F] uppercase">
                            <UserRound className="h-4 w-4 text-[#7C7368]" />
                            Signature Recipients
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2 px-4 py-4 text-sm">
                        {recipients.length > 0 ? (
                            recipients.map((recipient, index) => {
                                const isCurrentUser = (recipient.email ?? '').trim().toLowerCase() === normalizedCurrentUserEmail;
                                const isSigned = recipient.status === 'signed' || recipient.status === 'completed';

                                return (
                                    <div key={`${recipient.email}-${index}`} className="border-b border-[#EEE7DC] px-2 py-2 last:border-b-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                {/* Recipient Name */}
                                                <p className="truncate text-sm font-semibold text-[#1A1614]">
                                                    {recipient.name}
                                                    {isCurrentUser && (
                                                        <span className="ml-1 bg-[#F2EDE4] px-1.5 py-0.5 text-[10px] font-medium text-[#6B635B]">
                                                            You
                                                        </span>
                                                    )}
                                                </p>

                                                <p className="text-xs font-medium text-[#8A8178]">{recipient.role ?? 'Recipient'}</p>

                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6B635B]">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{recipient.email}</span>
                                                </div>

                                                {recipient.signed_at && (
                                                    <div className="mt-1 text-xs text-[#6B635B]">Signed at {recipient.signed_at}</div>
                                                )}
                                            </div>

                                            {isSigned ? (
                                                <span className="inline-flex shrink-0 items-center gap-1 border border-[#CFEAD9] bg-[#F4FCF7] px-2 py-0.5 text-[10px] font-medium text-[#1F9D6A]">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Signed
                                                </span>
                                            ) : (
                                                <span className="inline-flex shrink-0 items-center gap-1 border border-[#D8E5FF] bg-[#F7FAFF] px-2 py-0.5 text-[10px] font-medium text-[#2563EB]">
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
