import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DASHBOARD_STATUS_META } from '@/types/User/Dashboard/status';
import type { DocumentItem, SignatureRecipient } from '@/types/User/Dashboard/types';
import { Link } from '@inertiajs/react';
import {
    CheckCheck,
    ChevronDown,
    Clock,
    FilePlus2,
    Mail,
    MessageSquare,
    PenLine,
    ShieldCheck,
    SquarePen,
    Trash2,
    UserRound,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
    document: DocumentItem;
    onBack: () => void;
    onSubmitForApproval: (payload: { clientNote?: string; signatureRecipients: SignatureRecipient[] }) => void;
    onReturnToQuestions: (clientNote: string) => void;
};

function DocumentPreview({ pdfUrl }: { pdfUrl: string | null }) {
    if (!pdfUrl) {
        return (
            <Card className="overflow-hidden rounded-none border-[#E7E1D7] bg-white shadow-sm">
                <CardContent className="flex h-[80vh] items-center justify-center bg-[#FBF8F2] p-8 text-sm text-[#6B635B]">
                    Preview unavailable. Please regenerate the PDF if needed.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden rounded-none border-[#E7E1D7] bg-white shadow-sm">
            <CardContent className="p-0">
                <iframe title="Generated document preview" src={pdfUrl} className="h-[80vh] w-full bg-white" />
            </CardContent>
        </Card>
    );
}

function normalizeRecipients(document: DocumentItem): SignatureRecipient[] {
    if (document.signatureRecipients?.length) {
        return document.signatureRecipients.map((recipient, index) => ({
            ...recipient,
            routing_order: recipient.routing_order ?? index + 1,
            recipient_id: recipient.recipient_id ?? null,
            role: recipient.role ?? 'Client',
        }));
    }

    return [
        {
            name: document.client.name ?? '',
            email: document.client.email ?? '',
            role: 'Client',
            routing_order: 1,
            recipient_id: null,
            status: 'pending',
            signed_at: null,
            sign_url: null,
        },
    ];
}

export default function ReviewDocumentView({ document, onBack, onSubmitForApproval, onReturnToQuestions }: Props) {
    const statusMeta = DASHBOARD_STATUS_META[document.dashboardStatus];
    const StatusIcon = statusMeta.Icon;
    const isDraft = document.dashboardStatus === 'draft';
    const isPendingApproval = document.dashboardStatus === 'pending_approval';
    const isRejected = document.dashboardStatus === 'rejected';
    const [showChangeCard, setShowChangeCard] = useState(false);
    const [clientNote, setClientNote] = useState(document.clientNote ?? '');
    const [signatureRecipients, setSignatureRecipients] = useState<SignatureRecipient[]>(() => normalizeRecipients(document));

    const hasValidRecipients = useMemo(() => {
        if (!signatureRecipients.length) return false;

        return signatureRecipients.every(
            (recipient) => recipient.name?.trim() && recipient.email?.trim() && /\S+@\S+\.\S+/.test(recipient.email.trim()) && recipient.role?.trim(),
        );
    }, [signatureRecipients]);

    const submitDisabled = !document.actions.canSubmitForApproval || !hasValidRecipients;

    function updateRecipient(index: number, field: keyof SignatureRecipient, value: string | number | null) {
        setSignatureRecipients((prev) =>
            prev.map((recipient, currentIndex) =>
                currentIndex === index
                    ? {
                          ...recipient,
                          [field]: value,
                      }
                    : recipient,
            ),
        );
    }

    function addRecipient() {
        setSignatureRecipients((prev) => [
            ...prev,
            {
                name: '',
                email: '',
                role: '',
                routing_order: prev.length + 1,
                status: 'pending',
                signed_at: null,
                sign_url: null,
            },
        ]);
    }

    function removeRecipient(index: number) {
        setSignatureRecipients((prev) =>
            prev
                .filter((_, currentIndex) => currentIndex !== index)
                .map((recipient, currentIndex) => ({
                    ...recipient,
                    routing_order: currentIndex + 1,
                })),
        );
    }

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
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">{document.title}</h1>

                            <span className={statusMeta.pillClassName}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {statusMeta.label}
                            </span>
                        </div>

                        <p className="text-sm text-[#6B635B]">
                            Created: {document.createdAtLabel ?? 'N/A'} · Last updated: {document.updatedAtLabel ?? 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Preview */}
                <DocumentPreview pdfUrl={document.generatedPdfUrl} />
            </div>

            <div className="space-y-3">
                <Card className="rounded-none border border-[#E7E1D7] bg-white">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 py-3">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#4E463F] uppercase">
                            <PenLine className="h-4 w-4 text-[#7C7368]" />
                            Next Step
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 py-4">
                        {/* Draft Actions */}
                        {isDraft && (
                            <div className="space-y-2.5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSubmitForApproval({
                                            clientNote: clientNote.trim() || undefined,
                                            signatureRecipients: signatureRecipients.map((r, i) => ({
                                                ...r,
                                                name: r.name?.trim() ?? '',
                                                email: r.email?.trim() ?? '',
                                                role: r.role?.trim() ?? '',
                                                routing_order: i + 1,
                                                status: r.status ?? 'pending',
                                            })),
                                        })
                                    }
                                    disabled={submitDisabled}
                                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 border border-[#CFEAD9] bg-white text-sm font-semibold text-[#1F9D6A] hover:bg-[#F8FFFB] disabled:opacity-60"
                                >
                                    Approve Document
                                    <CheckCheck className="h-4 w-4" />
                                </button>

                                <Link
                                    href={document.questionnaireUrl}
                                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 border border-[#E2DBD2] bg-white text-sm font-semibold text-[#2F2A26] hover:bg-[#FCFAF6]"
                                >
                                    <SquarePen className="h-4 w-4" />
                                    Edit Answers
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setShowChangeCard((prev) => !prev)}
                                    className="flex w-full cursor-pointer items-center justify-between gap-2 border border-[#E7E1D7] bg-[#FCFAF6] px-4 py-3 text-left text-sm text-[#6B635B] transition-all hover:bg-[#F8F2E8] hover:shadow-sm"
                                >
                                    <span className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-[#7C7368]" />
                                        Add note for lawyer
                                    </span>

                                    <ChevronDown
                                        className={`h-4 w-4 text-[#7C7368] transition-transform duration-200 ${
                                            showChangeCard ? 'rotate-180' : 'rotate-0'
                                        }`}
                                    />
                                </button>

                                {!hasValidRecipients && (
                                    <p className="text-xs text-[#B42318]">
                                        Please complete all signature recipient name, email, and role fields before approval.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Pending Approval */}
                        {isPendingApproval && (
                            <div className="border border-[#E7D9BE] bg-[#FFFCF6] p-4 text-center">
                                <Clock className="mx-auto h-6 w-6 text-[#B7791F]" />
                                <p className="mt-3 text-sm font-semibold text-[#1A1614]">Pending Lawyer Approval</p>
                                <p className="mt-1 text-xs text-[#6B635B]">Your document has been submitted for lawyer review.</p>
                                <div className="mt-3 border border-[#EEE7DC] bg-white px-3 py-2 text-left text-sm text-[#1A1614]">
                                    Submitted: {document.submittedForApprovalAt ?? 'N/A'}
                                </div>
                            </div>
                        )}

                        {/* Rejected */}
                        {isRejected && (
                            <div className="border border-[#F3C9C9] bg-[#FFF8F8] p-4 text-center">
                                <XCircle className="mx-auto h-6 w-6 text-[#DC2626]" />
                                <p className="mt-3 text-sm font-semibold text-[#1A1614]">Rejected by Lawyer</p>
                                <p className="mt-1 text-xs text-[#6B635B]">
                                    Review the lawyer note, update your answers, and regenerate the document.
                                </p>
                                <Link
                                    href={document.questionnaireUrl}
                                    className="mt-3 flex h-10 w-full items-center justify-center gap-2 bg-[#3D2B1F] text-sm font-medium text-white hover:bg-[#2E2017]"
                                >
                                    <SquarePen className="h-4 w-4" />
                                    Revise Document
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {document.lawyerNote && (
                    <Card className="rounded-none border border-[#E7E1D7] bg-white">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 py-3">
                            <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#4E463F] uppercase">
                                <MessageSquare className="h-4 w-4 text-[#7C7368]" />
                                Lawyer Note
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 py-4">
                            <div className="border border-[#F5C2C2] bg-[#FFF5F5] px-4 py-3 text-sm leading-6 text-[#7F1D1D]">
                                {document.lawyerNote}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {isPendingApproval && document.clientNote && (
                    <Card className="rounded-none border border-[#E7E1D7] bg-white">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 py-3">
                            <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#4E463F] uppercase">
                                <MessageSquare className="h-4 w-4 text-[#7C7368]" />
                                Your Note for Lawyer
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 py-4">
                            <div className="border border-[#E7E1D7] bg-[#FCFAF6] px-4 py-3 text-sm leading-6 text-[#3B332E]">
                                {document.clientNote}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {showChangeCard && isDraft && (
                    <Card className="rounded-none border border-[#E7E1D7] bg-white">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 py-3">
                            <CardTitle className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#4E463F] uppercase">
                                <SquarePen className="h-4 w-4 text-[#7C7368]" />
                                Note for Lawyer
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 px-4 py-4">
                            <textarea
                                value={clientNote}
                                onChange={(e) => setClientNote(e.target.value)}
                                placeholder="Add a note for the lawyer..."
                                className="min-h-[130px] w-full border border-[#E2DBD2] bg-[#FCFAF6] px-3 py-3 text-sm text-[#1A1614] outline-none focus:border-[#CDBBA4] focus:ring-2 focus:ring-[#A68A64]/15"
                            />

                            <p className="text-xs text-[#6B635B]">
                                This note is temporary on this page. It will only be saved when you click Approve Document.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card className="rounded-none border border-[#E7E1D7] bg-white">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 py-3">
                        <CardTitle className="flex items-center justify-between gap-2 text-xs font-semibold tracking-wide text-[#4E463F] uppercase">
                            <span className="flex items-center gap-2">
                                <UserRound className="h-4 w-4 text-[#7C7368]" />
                                Client for Signature
                            </span>

                            {isDraft && (
                                <button
                                    type="button"
                                    onClick={addRecipient}
                                    className="inline-flex items-center gap-1 border border-[#E7E1D7] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3D2B1F] hover:bg-[#F8F2E8]"
                                >
                                    <FilePlus2 className="h-4 w-4" />
                                    Add Client
                                </button>
                            )}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 py-4 text-sm">
                        {signatureRecipients.map((recipient, index) => (
                            <div key={`recipient-${recipient.routing_order ?? index}`} className="border border-[#EEE7DC] bg-[#FCFAF6] px-3 py-3">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs font-semibold text-[#4E463F]">Recipient {index + 1}</p>

                                    {isDraft && signatureRecipients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRecipient(index)}
                                            className="inline-flex items-center gap-1 text-xs font-medium text-[#B42318] hover:text-[#912018]"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="mb-1 text-[11px] text-[#8A8178]">Client Name</p>
                                        <input
                                            type="text"
                                            value={recipient.name ?? ''}
                                            disabled={!isDraft}
                                            onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                                            className="w-full border border-[#E2DBD2] bg-white px-3 py-2 text-sm text-[#1A1614] outline-none focus:border-[#CDBBA4] focus:ring-2 focus:ring-[#A68A64]/15 disabled:bg-[#F7F3EB]"
                                            placeholder="Enter client full name"
                                        />
                                    </div>

                                    <div>
                                        <p className="mb-1 text-[11px] text-[#8A8178]">Client Email Address</p>
                                        <div className="flex items-center gap-2 border border-[#E2DBD2] bg-white px-3 py-2">
                                            <Mail className="h-4 w-4 text-[#7C7368]" />
                                            <input
                                                type="email"
                                                value={recipient.email ?? ''}
                                                disabled={!isDraft}
                                                onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                                                className="w-full bg-transparent text-sm text-[#1A1614] outline-none disabled:bg-transparent"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-1 text-[11px] text-[#8A8178]">Role</p>
                                        <input
                                            type="text"
                                            value={recipient.role ?? ''}
                                            disabled={!isDraft}
                                            onChange={(e) => updateRecipient(index, 'role', e.target.value)}
                                            className="w-full border border-[#E2DBD2] bg-white px-3 py-2 text-sm text-[#1A1614] outline-none focus:border-[#CDBBA4] focus:ring-2 focus:ring-[#A68A64]/15 disabled:bg-[#F7F3EB]"
                                            placeholder="Example: Borrower, Lender, Tenant, Witness"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isDraft && (
                            <div className="border border-[#EEE7DC] bg-[#FCFAF6] px-3 py-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-[#7C7368]" />
                                    <p className="text-[11px] font-medium tracking-[0.08em] text-[#8A8178] uppercase">DocuSign Ready</p>
                                </div>

                                <p className="mt-2 text-sm text-[#1A1614]">
                                    These recipients stay temporary on this page. They will only be saved when you click Approve Document.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
