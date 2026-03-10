import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    Clock,
    CreditCard,
    FileText,
    Mail,
    MessageSquare,
    ShieldCheck,
    SquarePen,
    UserRound,
    XCircle,
} from 'lucide-react';
import { useEffect, useState, type ElementType } from 'react';
import type { DocumentItem, DocumentStatus } from './Index';

type Props = {
    document: DocumentItem;
    onBack: () => void;
    onApproveDocument: () => void;
    onApplyChanges: (note: string) => void;
};

const STATUS_META: Record<
    Exclude<DocumentStatus, 'awaiting_signatures' | 'partially_signed' | 'completed'>,
    {
        label: string;
        badgeClassName: string;
        Icon: ElementType;
    }
> = {
    draft: {
        label: 'Draft',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700',
        Icon: SquarePen,
    },
    pending_lawyer_review: {
        label: 'Waiting Approval',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700',
        Icon: Clock,
    },
    rejected: {
        label: 'Rejected',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700',
        Icon: XCircle,
    },
};

function ContractSection({ title, lines = ['w-full', 'w-11/12', 'w-10/12'] }: { title: string; lines?: string[] }) {
    return (
        <section className="space-y-3 rounded-2xl border border-[#F0E9DD] bg-[#FFFDFA] p-5">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-[12px] font-semibold tracking-[0.18em] text-[#5A4F46] uppercase">{title}</h3>
                <div className="h-px flex-1 bg-[#EFE7DB]" />
            </div>

            <div className="space-y-2.5">
                {lines.map((width, index) => (
                    <div key={`${title}-${index}`} className={`h-2.5 rounded-full bg-[#EDE4D7] ${width}`} />
                ))}
            </div>
        </section>
    );
}

function DocumentPreview({ document }: { document: DocumentItem }) {
    return (
        <Card className="overflow-hidden rounded-[28px] border-[#E9E1D4] bg-white shadow-[0_10px_40px_rgba(26,22,20,0.06)]">
            <CardContent className="p-0">
                <div className="border-b border-[#F1EADF] bg-gradient-to-r from-[#FBF8F2] via-white to-[#FBF8F2] px-6 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8B8178] uppercase">Document Preview</p>
                            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#1A1614]">{document.title}</h2>
                            <p className="mt-1 text-sm text-[#6B635B]">Prepared submission ready for client-side review before lawyer processing.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="rounded-2xl border border-[#EEE6DA] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#8A8178]">Type</p>
                                <p className="mt-1 text-sm font-semibold text-[#1A1614]">Lease</p>
                            </div>
                            <div className="rounded-2xl border border-[#EEE6DA] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#8A8178]">Recipients</p>
                                <p className="mt-1 text-sm font-semibold text-[#1A1614]">{document.recipients?.length ?? 0}</p>
                            </div>
                            <div className="rounded-2xl border border-[#EEE6DA] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#8A8178]">KYC</p>
                                <p className="mt-1 text-sm font-semibold text-[#1A1614]">{document.kycStatus ?? 'Pending'}</p>
                            </div>
                            <div className="rounded-2xl border border-[#EEE6DA] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#8A8178]">Payment</p>
                                <p className="mt-1 text-sm font-semibold text-[#1A1614]">{document.paymentStatus ?? 'Pending'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-h-[78vh] overflow-y-auto bg-[#F8F4ED] p-5 md:p-7">
                    <div className="mx-auto max-w-4xl rounded-[24px] border border-[#EAE2D7] bg-white px-7 py-8 shadow-[0_20px_50px_rgba(26,22,20,0.05)] md:px-9 md:py-10">
                        <div className="space-y-8">
                            <header className="space-y-3 border-b border-[#F1EBE1] pb-6 text-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#EDE4D6] bg-[#FAF7F1] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#776C62] uppercase">
                                    <FileText className="h-3.5 w-3.5" />
                                    AI Draft Document
                                </div>

                                <h3 className="font-serif text-[22px] font-bold tracking-tight text-[#221D19] md:text-[28px]">
                                    RESIDENTIAL LEASE AGREEMENT
                                </h3>

                                <p className="mx-auto max-w-2xl text-sm leading-6 text-[#7C7268]">
                                    This draft is prepared from the provided intake details and recipient information. Please confirm the terms before
                                    sending it to the lawyer for final review.
                                </p>
                            </header>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-[#F1EADF] bg-[#FCFAF6] px-4 py-4">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#8A8178] uppercase">Prepared By</p>
                                    <p className="mt-2 text-sm font-semibold text-[#1A1614]">{document.submittedBy}</p>
                                </div>

                                <div className="rounded-2xl border border-[#F1EADF] bg-[#FCFAF6] px-4 py-4">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#8A8178] uppercase">Created</p>
                                    <p className="mt-2 text-sm font-semibold text-[#1A1614]">{document.submittedAtLabel}</p>
                                </div>

                                <div className="rounded-2xl border border-[#F1EADF] bg-[#FCFAF6] px-4 py-4">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#8A8178] uppercase">Document Status</p>
                                    <p className="mt-2 text-sm font-semibold text-[#1A1614]">Client Review</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <ContractSection title="1. PARTIES TO AGREEMENT" lines={['w-full', 'w-[88%]', 'w-[74%]']} />
                                <ContractSection title="2. PROPERTY DETAILS" lines={['w-full', 'w-[91%]', 'w-[70%]']} />
                                <ContractSection title="3. LEASE TERM & EFFECTIVITY" lines={['w-full', 'w-[86%]', 'w-[66%]']} />
                                <ContractSection title="4. RENTAL RATE & PAYMENT TERMS" lines={['w-full', 'w-[90%]', 'w-[72%]']} />
                                <ContractSection title="5. SECURITY DEPOSIT" lines={['w-full', 'w-[83%]', 'w-[61%]']} />
                                <ContractSection title="6. TENANT COVENANTS" lines={['w-full', 'w-[87%]', 'w-[73%]']} />
                                <ContractSection title="7. LANDLORD RESPONSIBILITIES" lines={['w-full', 'w-[84%]', 'w-[68%]']} />
                                <ContractSection title="8. DEFAULT, REMEDIES & TERMINATION" lines={['w-full', 'w-[89%]', 'w-[75%]']} />
                                <ContractSection title="9. SIGNATURE & EXECUTION" lines={['w-full', 'w-[81%]', 'w-[64%]']} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ReviewDocumentView({ document, onBack, onApproveDocument, onApplyChanges }: Props) {
    const statusMeta = STATUS_META[document.status as keyof typeof STATUS_META] ?? STATUS_META.draft;
    const StatusIcon = statusMeta.Icon;

    const isDraft = document.status === 'draft';
    const isWaiting = document.status === 'pending_lawyer_review';
    const isRejected = document.status === 'rejected';

    const [showChangeCard, setShowChangeCard] = useState(false);
    const [changePrompt, setChangePrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                const next = prev + Math.random() * (prev > 70 ? 2 : 5);
                return next > 90 ? 90 : next;
            });
        }, 100);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            setProgress(100);

            setTimeout(() => {
                onApplyChanges(changePrompt.trim());
                setLoading(false);
                setShowChangeCard(false);
                setChangePrompt('');
                setProgress(0);
            }, 500);
        }, 3500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [loading, changePrompt, onApplyChanges]);

    return (
        <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-2 rounded-full border border-[#E8DED1] bg-white px-4 py-2 text-sm font-medium text-[#6B635B] shadow-sm transition-all hover:border-[#D8CCBC] hover:text-[#1A1614]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        User Dashboard
                    </button>

                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-semibold tracking-tight text-[#1A1614]">{document.title}</h1>

                            <span className={statusMeta.badgeClassName}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {statusMeta.label}
                            </span>
                        </div>

                        <p className="text-sm text-[#6B635B]">
                            Created {document.submittedAtLabel} by <span className="font-medium text-[#2F2A26]">{document.submittedBy}</span>
                        </p>
                    </div>

                    <DocumentPreview document={document} />
                </div>

                <div className="space-y-4">
                    <Card className="overflow-hidden rounded-[26px] border-[#E8E0D4] bg-white shadow-[0_12px_35px_rgba(26,22,20,0.06)]">
                        <CardHeader className="border-b border-[#F0E8DC] px-5 pt-5 pb-4">
                            <CardTitle className="text-[12px] font-semibold tracking-[0.16em] text-[#5C5147] uppercase">Next Step</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 px-5 pt-5 pb-5">
                            {isDraft && (
                                <div className="space-y-3">
                                    <div className="rounded-2xl border border-[#DDEBDD] bg-gradient-to-br from-[#FAFFFB] to-[#F3FBF5] p-5">
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-[#1A1614]">Ready for submission</p>
                                            <p className="text-sm leading-6 text-[#6B635B]">
                                                Once approved, this draft will be sent to the lawyer for final legal review and DocuSign preparation.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onApproveDocument}
                                        className="group flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#1F9D6A] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#18875A] hover:shadow-md focus:ring-2 focus:ring-[#1F9D6A]/20 focus:outline-none"
                                    >
                                        Approve Document
                                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowChangeCard(true)}
                                        className="group flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#E2DBD2] bg-white px-4 text-sm font-semibold text-[#2F2A26] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D3C5B4] hover:bg-[#FCFAF6] hover:shadow-md focus:ring-2 focus:ring-[#A68A64]/20 focus:outline-none"
                                    >
                                        <SquarePen className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-8deg]" />
                                        Request Changes
                                    </button>
                                </div>
                            )}

                            {isWaiting && (
                                <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-[#FFF8E8] p-5 shadow-sm">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-amber-100">
                                            <Clock className="h-7 w-7 text-amber-600" />
                                        </div>

                                        <div className="mt-4 space-y-1.5">
                                            <p className="text-sm font-semibold text-[#1A1614]">Waiting for Lawyer Approval</p>
                                            <p className="text-xs leading-6 text-[#6B635B]">
                                                Your document has been approved on your side and is now queued for lawyer review.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={onBack}
                                            className="group mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F241C] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#221A14] hover:shadow-md focus:ring-2 focus:ring-[#2F241C]/20 focus:outline-none"
                                        >
                                            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                            Back to Dashboard
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isRejected && (
                                <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-[#FFF5F5] p-5 shadow-sm">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-rose-100">
                                            <XCircle className="h-7 w-7 text-rose-600" />
                                        </div>

                                        <div className="mt-4 space-y-1.5">
                                            <p className="text-sm font-semibold text-[#1A1614]">Rejected by Lawyer</p>
                                            <p className="text-xs leading-6 text-[#6B635B]">
                                                Review the legal note below, update the draft, then resubmit it for approval.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowChangeCard(true)}
                                            className="group mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F241C] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#221A14] hover:shadow-md focus:ring-2 focus:ring-[#2F241C]/20 focus:outline-none"
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
                        <Card className="overflow-hidden rounded-[26px] border-[#E8E0D4] bg-white shadow-[0_12px_35px_rgba(26,22,20,0.06)]">
                            <CardHeader className="border-b border-[#F0E8DC] px-5 pt-5 pb-4">
                                <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-[#5C5147] uppercase">
                                    <MessageSquare className="h-3.5 w-3.5 text-[#7C7368]" />
                                    Lawyer Note
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="px-5 pt-5 pb-5">
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-7 text-rose-900">
                                    {document.lawyerNote}
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}

                    <Card className="overflow-hidden rounded-[26px] border-[#E8E0D4] bg-white shadow-[0_12px_35px_rgba(26,22,20,0.06)]">
                        <CardHeader className="border-b border-[#F0E8DC] px-5 pt-5 pb-4">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-[#5C5147] uppercase">
                                <FileText className="h-3.5 w-3.5 text-[#7C7368]" />
                                Document Info
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 px-5 pt-5 pb-5 text-sm">
                            <div className="rounded-2xl border border-[#EEE7DC] bg-[#FCFAF6] px-4 py-4">
                                <p className="text-[11px] text-[#8A8178]">Document Title</p>
                                <p className="mt-1 font-semibold text-[#1A1614]">{document.title}</p>
                            </div>

                            <div className="rounded-2xl border border-[#EEE7DC] bg-[#FCFAF6] px-4 py-4">
                                <p className="text-[11px] text-[#8A8178]">Created At</p>
                                <p className="mt-1 font-semibold text-[#1A1614]">{document.submittedAtLabel}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-[#D5ECDD] bg-gradient-to-br from-[#F7FFF9] to-[#F0FBF4] px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-[#1F9D6A]" />
                                        <p className="text-[11px] font-medium tracking-[0.12em] text-[#6A7C70] uppercase">KYC</p>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-[#1A1614]">{document.kycStatus ?? 'Pending'}</p>
                                </div>

                                <div className="rounded-2xl border border-[#DDE5F2] bg-gradient-to-br from-[#F8FBFF] to-[#F1F6FD] px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-[#3567B7]" />
                                        <p className="text-[11px] font-medium tracking-[0.12em] text-[#6A7687] uppercase">Payment</p>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-[#1A1614]">{document.paymentStatus ?? 'Pending'}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#8A8178] uppercase">Recipients</p>
                                    <span className="text-xs font-medium text-[#8A8178]">{document.recipients?.length ?? 0} total</span>
                                </div>

                                {document.recipients?.map((recipient) => (
                                    <div key={recipient.id} className="rounded-2xl border border-[#EEE7DC] bg-[#FCFAF6] px-4 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DED1] bg-white">
                                                <UserRound className="h-4 w-4 text-[#7C7368]" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold text-[#1A1614]">{recipient.name}</p>
                                                    <span className="rounded-full border border-[#E6DED1] bg-white px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-[#756B62] uppercase">
                                                        {recipient.role ?? 'Recipient'}
                                                    </span>
                                                </div>

                                                <div className="mt-2 flex items-center gap-1.5 text-sm text-[#6B635B]">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    <span className="truncate">{recipient.email}</span>
                                                </div>
                                            </div>

                                            <BadgeCheck className="mt-1 h-4 w-4 text-[#C0B4A6]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {showChangeCard && (
                        <Card className="overflow-hidden rounded-[26px] border-[#E8E0D4] bg-white shadow-[0_12px_35px_rgba(26,22,20,0.06)]">
                            <CardHeader className="border-b border-[#F0E8DC] px-5 pt-5 pb-4">
                                <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-[#5C5147] uppercase">
                                    <SquarePen className="h-3.5 w-3.5 text-[#7C7368]" />
                                    Update Document
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 px-5 pt-5 pb-5">
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-[#1A1614]">Describe your requested revisions</p>
                                    <p className="text-xs leading-6 text-[#6B635B]">
                                        Example: revise the lease term, update monthly rental amount, or add utility responsibility clauses.
                                    </p>
                                </div>

                                <textarea
                                    value={changePrompt}
                                    onChange={(e) => setChangePrompt(e.target.value)}
                                    placeholder="Describe the changes you want to apply..."
                                    className="min-h-[140px] w-full rounded-2xl border border-[#E2DBD2] bg-[#FCFAF6] px-4 py-3 text-sm text-[#1A1614] shadow-sm transition outline-none focus:border-[#CDBBA4] focus:ring-2 focus:ring-[#A68A64]/15"
                                />

                                <button
                                    type="button"
                                    onClick={() => changePrompt.trim() && setLoading(true)}
                                    disabled={!changePrompt.trim()}
                                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F241C] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#221A14] hover:shadow-md focus:ring-2 focus:ring-[#2F241C]/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#B8AEA4]"
                                >
                                    Apply Changes
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1614]/45 px-4 backdrop-blur-[3px]">
                    <Card className="w-full max-w-md rounded-[28px] border-[#E8DED1] bg-[#FCF9F2] shadow-[0_24px_70px_rgba(26,22,20,0.20)]">
                        <CardContent className="p-8 text-center">
                            <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-[#F2EBDF] ring-8 ring-[#FBF7F0]" />

                            <h2 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Updating your document</h2>
                            <p className="mt-2 text-sm leading-6 text-[#70665E]">Applying your requested revisions to generate a refreshed draft.</p>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#E8E2D6]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#2F241C] via-[#6E5A46] to-[#B29367] transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <span className="w-10 text-left text-sm font-semibold text-[#2F241C]">{Math.round(progress)}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
