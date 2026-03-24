import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DASHBOARD_STATUS_META } from '@/types/User/Dashboard/status';
import type { DocumentItem, SignatureRecipient } from '@/types/User/Dashboard/types';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
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

function normalizeRecipients(document: DocumentItem): SignatureRecipient[] {
    if (document.signatureRecipients?.length) {
        return document.signatureRecipients.map((recipient, index) => ({
            ...recipient,
            routing_order: recipient.routing_order ?? index + 1,
            role: recipient.role ?? 'Client',
        }));
    }

    return [
        {
            name: document.client.name ?? '',
            email: document.client.email ?? '',
            role: 'Client',
            routing_order: 1,
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

                        <span className={statusMeta.pillClassName}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusMeta.label}
                        </span>
                    </div>

                    <p className="text-sm text-[#6B635B]">
                        Created: {document.createdAtLabel ?? 'N/A'} · Last updated: {document.updatedAtLabel ?? 'N/A'}
                    </p>
                </div>

                <DocumentPreview pdfUrl={document.generatedPdfUrl} />
            </div>

            <div className="space-y-3">
                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                            <PenLine className="h-3.5 w-3.5 text-[#7C7368]" />
                            Next Step
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4">
                        {isDraft && (
                            <div className="space-y-2.5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSubmitForApproval({
                                            clientNote: clientNote.trim() || undefined,
                                            signatureRecipients: signatureRecipients.map((recipient, index) => ({
                                                ...recipient,
                                                name: recipient.name?.trim() ?? '',
                                                email: recipient.email?.trim() ?? '',
                                                role: recipient.role?.trim() ?? '',
                                                routing_order: index + 1,
                                                status: recipient.status ?? 'pending',
                                                signed_at: recipient.signed_at ?? null,
                                                sign_url: recipient.sign_url ?? null,
                                            })),
                                        })
                                    }
                                    disabled={submitDisabled}
                                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#CFEAD9] bg-white px-4 text-sm font-semibold text-[#1F9D6A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A9D8BC] hover:bg-[#F8FFFB] hover:shadow-md focus:ring-2 focus:ring-[#1F9D6A]/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Approve Document
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>

                                <Link
                                    href={document.questionnaireUrl}
                                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2DBD2] bg-white px-4 text-sm font-semibold text-[#2F2A26] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CDBBA4] hover:bg-[#FCFAF6] hover:shadow-md focus:ring-2 focus:ring-[#A68A64]/20 focus:outline-none"
                                >
                                    <SquarePen className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-8deg]" />
                                    Edit Answers
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setShowChangeCard((prev) => !prev)}
                                    className="w-full rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] px-4 py-3 text-left text-sm text-[#6B635B] transition hover:bg-[#F8F2E8]"
                                >
                                    Add note for lawyer
                                </button>

                                {!hasValidRecipients && (
                                    <p className="text-xs text-[#B42318]">
                                        Please complete all signature recipient name, email, and role fields before approval.
                                    </p>
                                )}
                            </div>
                        )}

                        {isPendingApproval && (
                            <div className="rounded-2xl border border-[#E7D9BE] bg-gradient-to-b from-[#FFFCF6] to-[#FBF6EA] p-5 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F1E3] shadow-inner ring-4 ring-[#FCF8F0]">
                                        <Clock className="h-7 w-7 text-[#B7791F]" />
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <p className="text-sm font-semibold text-[#1A1614]">Pending Lawyer Approval</p>
                                        <p className="text-xs leading-5 text-[#6B635B]">
                                            Your generated document has been submitted for lawyer review.
                                        </p>
                                    </div>

                                    <div className="mt-4 w-full rounded-xl border border-[#EEE7DC] bg-white px-4 py-3 text-left">
                                        <p className="text-[11px] text-[#8A8178]">Submitted</p>
                                        <p className="text-sm font-medium text-[#1A1614]">{document.submittedForApprovalAt ?? 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isRejected && (
                            <div className="rounded-2xl border border-[#F3C9C9] bg-gradient-to-b from-[#FFF8F8] to-[#FEF1F1] p-5 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDECEC] shadow-inner ring-4 ring-[#FFF5F5]">
                                        <XCircle className="h-7 w-7 text-[#DC2626]" />
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <p className="text-sm font-semibold text-[#1A1614]">Rejected by Lawyer</p>
                                        <p className="text-xs leading-5 text-[#6B635B]">
                                            Review the lawyer note, update your answers, and regenerate the document.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowChangeCard(true)}
                                        className="group mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none"
                                    >
                                        <SquarePen className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-8deg]" />
                                        Revise Document
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {document.lawyerNote ? (
                    <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                                <MessageSquare className="h-3.5 w-3.5 text-[#7C7368]" />
                                Lawyer Note
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 pt-4 pb-4">
                            <div className="rounded-xl border border-[#F5C2C2] bg-[#FFF5F5] px-4 py-3 text-sm leading-6 text-[#7F1D1D]">
                                {document.lawyerNote}
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                {isPendingApproval && document.clientNote ? (
                    <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                                <MessageSquare className="h-3.5 w-3.5 text-[#7C7368]" />
                                Your Note for Lawyer
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 pt-4 pb-4">
                            <div className="rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] px-4 py-3 text-sm leading-6 text-[#3B332E]">
                                {document.clientNote}
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center justify-between gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                            <span className="flex items-center gap-2">
                                <UserRound className="h-3.5 w-3.5 text-[#7C7368]" />
                                Client for Signature
                            </span>

                            {isDraft && (
                                <button
                                    type="button"
                                    onClick={addRecipient}
                                    className="inline-flex items-center gap-1 rounded-lg border border-[#E7E1D7] bg-white px-2.5 py-1 text-[11px] font-medium tracking-normal text-[#3D2B1F] normal-case hover:bg-[#F8F2E8]"
                                >
                                    <FilePlus2 className="h-3.5 w-3.5" />
                                    Add Client
                                </button>
                            )}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4 text-sm">
                        {signatureRecipients.map((recipient, index) => (
                            <div
                                key={`recipient-${recipient.routing_order ?? index}`}
                                className="rounded-xl border border-[#EEE7DC] bg-[#FCFAF6] p-3"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs font-semibold text-[#4E463F]">Recipient {index + 1}</p>

                                    {isDraft && signatureRecipients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRecipient(index)}
                                            className="inline-flex items-center gap-1 text-xs font-medium text-[#B42318] hover:text-[#912018]"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
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
                                            className="w-full rounded-xl border border-[#E2DBD2] bg-white px-3 py-2 text-sm text-[#1A1614] outline-none focus:border-[#CDBBA4] focus:ring-2 focus:ring-[#A68A64]/15 disabled:bg-[#F7F3EB]"
                                            placeholder="Enter client full name"
                                        />
                                    </div>

                                    <div>
                                        <p className="mb-1 text-[11px] text-[#8A8178]">Client Email Address</p>
                                        <div className="flex items-center gap-2 rounded-xl border border-[#E2DBD2] bg-white px-3 py-2">
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
                                            className="w-full rounded-xl border border-[#E2DBD2] bg-white px-3 py-2 text-sm text-[#1A1614] outline-none focus:border-[#CDBBA4] focus:ring-2 focus:ring-[#A68A64]/15 disabled:bg-[#F7F3EB]"
                                            placeholder="Example: Borrower, Lender, Tenant, Witness"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isDraft && (
                            <div className="rounded-xl border border-[#EEE7DC] bg-[#FCFAF6] px-3 py-3">
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

                {showChangeCard && isDraft && (
                    <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                                <SquarePen className="h-3.5 w-3.5 text-[#7C7368]" />
                                Note for Lawyer
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 px-4 pt-4 pb-4">
                            <textarea
                                value={clientNote}
                                onChange={(e) => setClientNote(e.target.value)}
                                placeholder="Add a note for the lawyer..."
                                className="min-h-[130px] w-full rounded-xl border border-[#E2DBD2] bg-[#FCFAF6] px-4 py-3 text-sm text-[#1A1614] shadow-sm transition outline-none focus:border-[#CDBBA4] focus:ring-2 focus:ring-[#A68A64]/15"
                            />

                            <p className="text-xs text-[#6B635B]">
                                This note is temporary on this page. It will only be saved when you click Approve Document.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
