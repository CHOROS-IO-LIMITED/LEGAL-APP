import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    Mail,
    MessageSquare,
    PenLine,
    Settings,
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
            'inline-flex items-center gap-1.5 rounded-full border border-[#DDD6FE] bg-[#F4F1FF] px-3 py-1 text-xs font-medium text-[#6D5BD0]',
        Icon: SquarePen,
    },
    pending_lawyer_review: {
        label: 'Waiting Approval',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#F6E4B5] bg-[#FFF7E6] px-3 py-1 text-xs font-medium text-[#B7791F]',
        Icon: Clock,
    },
    rejected: {
        label: 'Rejected',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#FECACA] bg-[#FEF2F2] px-3 py-1 text-xs font-medium text-[#DC2626]',
        Icon: XCircle,
    },
};

function ContractSection({ title, lines = ['w-full', 'w-11/12', 'w-10/12'] }: { title: string; lines?: string[] }) {
    return (
        <section className="space-y-3">
            <h3 className="text-[13px] font-semibold tracking-[0.14em] text-[#3B332E] uppercase">{title}</h3>
            <div className="space-y-2">
                {lines.map((width, index) => (
                    <div key={`${title}-${index}`} className={`h-2 rounded-full bg-[#EFE9E0] ${width}`} />
                ))}
            </div>
        </section>
    );
}

function DocumentPreview() {
    return (
        <Card className="overflow-hidden rounded-2xl border-[#E7E1D7] bg-white shadow-sm">
            <CardContent className="p-0">
                <div className="h-[80vh] overflow-y-auto bg-[#FBF8F2] p-6 md:p-8">
                    <div className="mx-auto max-w-4xl rounded-xl border border-[#ECE5DA] bg-white px-7 py-8 shadow-[0_1px_2px_rgba(26,22,20,0.04)] md:px-8 md:py-9">
                        <div className="space-y-8">
                            <header className="space-y-2 text-center">
                                <h2 className="font-serif text-[20px] font-bold tracking-tight text-[#221D19] md:text-[24px]">
                                    RESIDENTIAL LEASE AGREEMENT
                                </h2>
                                <p className="text-xs font-medium text-[#8B8178] md:text-sm">AI-generated draft ready for your review</p>
                            </header>

                            <div className="space-y-3">
                                <ContractSection title="1. PARTIES TO AGREEMENT" lines={['w-full', 'w-[86%]', 'w-[78%]']} />
                                <ContractSection title="2. PROPERTY DETAILS" lines={['w-full', 'w-[88%]', 'w-[72%]']} />
                                <ContractSection title="3. TERM & COMMENCEMENT" lines={['w-full', 'w-[87%]', 'w-[72%]']} />
                                <ContractSection title="4. RENT & PAYMENT" lines={['w-full', 'w-[88%]', 'w-[72%]']} />
                                <ContractSection title="5. DEPOSITS" lines={['w-full', 'w-[86%]', 'w-[79%]']} />
                                <ContractSection title="6. TENANT OBLIGATIONS" lines={['w-full', 'w-[89%]', 'w-[76%]']} />
                                <ContractSection title="7. LANDLORD OBLIGATIONS" lines={['w-full', 'w-[85%]', 'w-[74%]']} />
                                <ContractSection title="8. TERMINATION" lines={['w-full', 'w-[83%]', 'w-[68%]']} />
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

    const statusMessages = [
        { limit: 20, text: 'Analyzing your requested changes...' },
        { limit: 40, text: 'Reviewing the current clauses...' },
        { limit: 60, text: 'Applying document changes...' },
        { limit: 80, text: 'Validating updated structure...' },
        { limit: 99, text: 'Preparing revised document...' },
        { limit: 100, text: 'Finalizing your updated draft...' },
    ];

    const getStatusMessage = (currentProgress: number) => {
        return statusMessages.find((s) => currentProgress <= s.limit)?.text ?? 'Updating document...';
    };

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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
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

                            <span className={statusMeta.badgeClassName}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {statusMeta.label}
                            </span>
                        </div>

                        <p className="text-sm text-[#6B635B]">
                            Created: {document.submittedAtLabel} · {document.submittedBy}
                        </p>
                    </div>

                    <DocumentPreview />
                </div>

                <div className="space-y-3">
                    <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                                <PenLine className="h-3.5 w-3.5 text-[#7C7368]" /> Next Step
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 px-4 pt-4 pb-4">
                            {isDraft && (
                                <div className="space-y-2.5">
                                    <button
                                        type="button"
                                        onClick={onApproveDocument}
                                        className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#CFEAD9] bg-white px-4 text-sm font-semibold text-[#1F9D6A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A9D8BC] hover:bg-[#F8FFFB] hover:shadow-md focus:ring-2 focus:ring-[#1F9D6A]/15 focus:outline-none"
                                    >
                                        Approve Document
                                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowChangeCard(true)}
                                        className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2DBD2] bg-white px-4 text-sm font-semibold text-[#2F2A26] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CDBBA4] hover:bg-[#FCFAF6] hover:shadow-md focus:ring-2 focus:ring-[#A68A64]/20 focus:outline-none"
                                    >
                                        <SquarePen className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-8deg]" />
                                        Request Changes
                                    </button>
                                </div>
                            )}

                            {isWaiting && (
                                <div className="rounded-2xl border border-[#E7D9BE] bg-gradient-to-b from-[#FFFCF6] to-[#FBF6EA] p-5 shadow-sm">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F1E3] shadow-inner ring-4 ring-[#FCF8F0]">
                                            <Clock className="h-7 w-7 text-[#B7791F]" />
                                        </div>

                                        <div className="mt-4 space-y-1.5">
                                            <p className="text-sm font-semibold text-[#1A1614]">Waiting for Lawyer Approval</p>
                                            <p className="text-xs leading-5 text-[#6B635B]">
                                                Your document has already been approved by you and sent to the lawyer for final review.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={onBack}
                                            className="group mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none"
                                        >
                                            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                            Back to Dashboard
                                        </button>
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
                                                Review the lawyer note below, revise the document, and submit it again for approval.
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

                    <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                                <FileText className="h-3.5 w-3.5 text-[#7C7368]" />
                                Document Info
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 px-4 pt-4 pb-4 text-sm">
                            <div>
                                <p className="text-[11px] text-[#8A8178]">Document Title</p>
                                <p className="font-medium text-[#1A1614]">{document.title}</p>
                            </div>

                            <div>
                                <p className="text-[11px] text-[#8A8178]">Created At</p>
                                <p className="font-medium text-[#1A1614]">{document.submittedAtLabel}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[11px] text-[#8A8178]">Recipients</p>

                                <div className="space-y-2">
                                    {document.recipients?.map((recipient) => (
                                        <div key={recipient.id} className="rounded-lg px-2 py-2">
                                            <div className="flex items-start gap-2">
                                                <UserRound className="mt-0.5 h-4 w-4 text-[#7C7368]" />

                                                <div className="min-w-0">
                                                    <p className="truncate text-[13px] font-medium text-[#1A1614]">{recipient.name}</p>

                                                    <p className="text-[10px] text-[#8A8178]">{recipient.role ?? 'Recipient'}</p>

                                                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#6B635B]">
                                                        <Mail className="h-3 w-3" />
                                                        <span className="truncate">{recipient.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-[#EEE7DC] bg-[#FCFAF6] px-3 py-3">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-[#7C7368]" />
                                        <p className="text-[11px] font-medium tracking-[0.08em] text-[#8A8178] uppercase">KYC</p>
                                    </div>
                                    <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A1614]">
                                        {document.kycStatus === 'Verified' ? (
                                            <CheckCircle2 className="h-4 w-4 text-[#1F9D6A]" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-[#B7791F]" />
                                        )}
                                        {document.kycStatus ?? 'Pending'}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-[#EEE7DC] bg-[#FCFAF6] px-3 py-3">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-[#7C7368]" />
                                        <p className="text-[11px] font-medium tracking-[0.08em] text-[#8A8178] uppercase">Payment</p>
                                    </div>
                                    <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A1614]">
                                        {document.paymentStatus === 'Received' ? (
                                            <CheckCircle2 className="h-4 w-4 text-[#1F9D6A]" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-[#B7791F]" />
                                        )}
                                        {document.paymentStatus ?? 'Pending'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {showChangeCard && (
                        <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                            <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                                <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                                    <SquarePen className="h-3.5 w-3.5 text-[#7C7368]" />
                                    Update Document
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 px-4 pt-4 pb-4">
                                <textarea
                                    value={changePrompt}
                                    onChange={(e) => setChangePrompt(e.target.value)}
                                    placeholder="Describe the changes you want to apply..."
                                    className="min-h-[130px] w-full rounded-xl border border-[#E2DBD2] bg-[#FCFAF6] px-4 py-3 text-sm text-[#1A1614] shadow-sm transition outline-none focus:border-[#CDBBA4] focus:ring-2 focus:ring-[#A68A64]/15"
                                />

                                <button
                                    type="button"
                                    onClick={() => changePrompt.trim() && setLoading(true)}
                                    disabled={!changePrompt.trim()}
                                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5A4638] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#B8AEA4]"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1614]/45 px-4 backdrop-blur-[2px]">
                    <Card className="w-full max-w-md border-[#E7E1D7] bg-[#FCF9F2] shadow-[0_20px_60px_rgba(26,22,20,0.18)]">
                        <CardContent className="p-8 text-center">
                            <div className="relative mb-8 flex items-center justify-center">
                                <div className="absolute h-24 w-24 animate-pulse rounded-full bg-[#A68A64]/20 blur-xl" />

                                <div className="relative flex h-20 w-20 items-center justify-center">
                                    <svg className="absolute h-20 w-20">
                                        <circle cx="40" cy="40" r="34" stroke="#E8E2D6" strokeWidth="4" fill="none" />
                                    </svg>

                                    <svg className="absolute h-20 w-20 animate-spin">
                                        <defs>
                                            <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3D2B1F" />
                                                <stop offset="50%" stopColor="#6E5A46" />
                                                <stop offset="100%" stopColor="#A68A64" />
                                            </linearGradient>
                                        </defs>

                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="34"
                                            fill="none"
                                            stroke="url(#loaderGradient)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            style={{
                                                animation: 'loaderDash 1.6s ease-in-out infinite',
                                            }}
                                        />
                                    </svg>

                                    <Settings size={34} className="animate-[spin_3s_linear_infinite] text-[#3D2B1F]" />
                                </div>
                            </div>

                            <h2 className="font-serif text-3xl font-bold text-[#1A1614]">Updating your document</h2>

                            <p className="mt-2 text-sm text-[#70665E]">{getStatusMessage(progress)}</p>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#E8E2D6]">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#3D2B1F] via-[#6E5A46] to-[#A68A64] transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <span className="w-10 text-left text-sm font-medium text-[#3D2B1F]">{Math.round(progress)}%</span>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-[#8A8077]">
                                We are applying your requested changes to the document. Please keep this page open while the document is being
                                updated.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
