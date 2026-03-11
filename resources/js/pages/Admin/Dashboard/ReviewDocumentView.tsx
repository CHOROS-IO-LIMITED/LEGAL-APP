import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Mail, MessageSquare, ScaleIcon, SquarePen, UserRound, X, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState, type ElementType } from 'react';
import type { DocumentItem, DocumentStatus } from './Index';

type Props = {
    document: DocumentItem;
    onBack: () => void;
    onChangeStatus: (status: DocumentStatus) => void;
    onSaveNote: (note: string) => void;
    onApproveAndSend: () => void;
};

type DecisionState = 'rejected' | 'amendments' | null;

const STATUS_META: Record<
    Exclude<DocumentStatus, 'awaiting_signatures' | 'partially_signed' | 'completed'>,
    {
        label: string;
        badgeClassName: string;
        Icon: ElementType;
    }
> = {
    pending_lawyer_review: {
        label: 'Waiting Review',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#F6E4B5] bg-[#FFF7E6] px-3 py-1 text-xs font-medium text-[#B7791F]',
        Icon: Clock,
    },
    changes_requested: {
        label: 'Changes Requested',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#F6E4B5] bg-[#FFF7E6] px-3 py-1 text-xs font-medium text-[#B7791F]',
        Icon: SquarePen,
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

function getDecisionFromStatus(status: DocumentStatus): DecisionState {
    if (status === 'rejected') return 'rejected';
    if (status === 'changes_requested') return 'amendments';
    return null;
}

export default function ReviewDocumentView({ document, onBack, onChangeStatus, onSaveNote, onApproveAndSend }: Props) {
    const [note, setNote] = useState(document.lawyerNote ?? '');
    const [decision, setDecision] = useState<DecisionState>(getDecisionFromStatus(document.status));
    const [noteSaved, setNoteSaved] = useState(false);
    const [noteError, setNoteError] = useState('');

    useEffect(() => {
        setNote(document.lawyerNote ?? '');
        setDecision(getDecisionFromStatus(document.status));
        setNoteError('');
    }, [document.id, document.lawyerNote, document.status]);

    useEffect(() => {
        setNoteSaved(false);
    }, [document.id]);

    const statusMeta = STATUS_META[document.status as keyof typeof STATUS_META] ?? STATUS_META.pending_lawyer_review;
    const StatusIcon = statusMeta.Icon;

    const isNoteDirty = useMemo(() => note.trim() !== (document.lawyerNote ?? '').trim(), [note, document.lawyerNote]);

    const handleApprove = () => {
        setNoteError('');
        onApproveAndSend();
    };

    const handleReject = () => {
        if (!note.trim()) {
            setNoteError('Please add a note before rejecting this document.');
            setNoteSaved(false);
            return;
        }

        onSaveNote(note.trim());
        onChangeStatus('rejected');
        setDecision('rejected');
        setNoteError('');
        setNoteSaved(true);
    };

    const handleRequestAmendments = () => {
        if (!note.trim()) {
            setNoteError('Please add a note before requesting amendments.');
            setNoteSaved(false);
            return;
        }

        onSaveNote(note.trim());
        onChangeStatus('changes_requested');
        setDecision('amendments');
        setNoteError('');
        setNoteSaved(true);
    };

    const handleSaveNote = () => {
        if (!note.trim()) {
            setNoteError('Please enter a note before saving.');
            setNoteSaved(false);
            return;
        }

        onSaveNote(note.trim());
        setNoteSaved(true);
        setNoteError('');
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-[#1A1614]">{document.title}</h1>

                        <span className={statusMeta.badgeClassName}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusMeta.label}
                        </span>
                    </div>

                    <p className="text-sm text-[#6B635B]">
                        Submitted: {document.submittedAtLabel} · {document.submittedBy}
                    </p>
                </div>

                <Card className="overflow-hidden rounded-2xl border-[#E7E1D7] bg-white shadow-sm">
                    <CardContent className="p-0">
                        <div className="h-[80vh] overflow-y-auto bg-[#FBF8F2] p-6 md:p-8">
                            <div className="mx-auto max-w-4xl rounded-xl border border-[#ECE5DA] bg-white px-7 py-8 shadow-[0_1px_2px_rgba(26,22,20,0.04)] md:px-8 md:py-9">
                                <div className="space-y-8">
                                    <header className="space-y-2 text-center">
                                        <h2 className="font-serif text-[20px] font-bold tracking-tight text-[#221D19] md:text-[24px]">
                                            RESIDENTIAL LEASE AGREEMENT
                                        </h2>
                                        <p className="text-xs font-medium text-[#8B8178] md:text-sm">Generated by AI - Submitted for legal review</p>
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
            </div>

            <div className="space-y-3">
                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                            <ScaleIcon className="h-3.5 w-3.5 text-[#7C7368]" />
                            Lawyer Decision
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4">
                        {decision === null && (
                            <div className="space-y-2.5">
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#CFEAD9] bg-white px-4 text-sm font-semibold text-[#1F9D6A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A9D8BC] hover:bg-[#F8FFFB] hover:shadow-md focus:ring-2 focus:ring-[#1F9D6A]/15 focus:outline-none active:translate-y-0"
                                >
                                    Approve & Send Signatures
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleRequestAmendments}
                                    className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E2DBD2] bg-white px-4 text-sm font-semibold text-[#2F2A26] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CDBBA4] hover:bg-[#FCFAF6] hover:shadow-md focus:ring-2 focus:ring-[#A68A64]/20 focus:outline-none active:translate-y-0"
                                >
                                    <SquarePen className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-8deg]" />
                                    Request Amendments
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReject}
                                    className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#F1D3D3] bg-white px-4 text-sm font-semibold text-[#C45454] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E7B4B4] hover:bg-[#FFF7F7] hover:shadow-md focus:ring-2 focus:ring-[#DC2626]/15 focus:outline-none active:translate-y-0"
                                >
                                    <X className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                    Reject Document
                                </button>
                            </div>
                        )}

                        {decision === 'amendments' && (
                            <div className="rounded-2xl border border-[#E7D9BE] bg-gradient-to-b from-[#FFFCF6] to-[#FBF6EA] p-5 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F1E3] shadow-inner ring-4 ring-[#FCF8F0]">
                                        <SquarePen className="h-7 w-7 text-[#B7791F]" />
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <p className="text-sm font-semibold text-[#1A1614]">Amendments Requested</p>
                                        <p className="text-xs leading-5 text-[#6B635B]">
                                            The client has been notified and will review your note before resubmitting the document.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onBack}
                                        className="group mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none active:translate-y-0"
                                    >
                                        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                        Back to Dashboard
                                    </button>
                                </div>
                            </div>
                        )}

                        {decision === 'rejected' && (
                            <div className="rounded-2xl border border-[#F2D3D3] bg-gradient-to-b from-[#FFF9F9] to-[#FFF4F4] p-5 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDECEC] shadow-inner ring-4 ring-[#FFF7F7]">
                                        <XCircle className="h-7 w-7 text-[#DC2626]" />
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <p className="text-sm font-semibold text-[#1A1614]">Document Rejected</p>
                                        <p className="text-xs leading-5 text-[#6B635B]">
                                            The client has been notified and will receive your feedback for revision.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onBack}
                                        className="group mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none active:translate-y-0"
                                    >
                                        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                        Back to Dashboard
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#4E463F] uppercase">
                            <UserRound className="h-3.5 w-3.5 text-[#7C7368]" />
                            Client Info
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4 text-sm">
                        <div>
                            <p className="text-[11px] text-[#8A8178]">Name</p>
                            <p className="font-medium text-[#1A1614]">{document.submittedBy}</p>
                        </div>

                        <div>
                            <p className="text-[11px] text-[#8A8178]">Email</p>
                            <p className="font-medium text-[#1A1614]">{document.clientEmail ?? '—'}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[11px] text-[#8A8178]">Recipients</p>
                            {(document.recipients ?? []).map((recipient) => (
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

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-[#EEE7DC] bg-[#FCFAF6] px-3 py-3">
                                <p className="text-[11px] font-medium tracking-[0.08em] text-[#8A8178] uppercase">KYC</p>
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
                                <p className="text-[11px] font-medium tracking-[0.08em] text-[#8A8178] uppercase">Payment</p>
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

                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                            <MessageSquare className="h-3.5 w-3.5 text-[#7C7368]" />
                            Lawyer Note
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4">
                        <textarea
                            value={note}
                            onChange={(e) => {
                                setNote(e.target.value);
                                setNoteSaved(false);

                                if (noteError) setNoteError('');
                            }}
                            placeholder="Leave a note for the client..."
                            className={`min-h-[110px] w-full rounded-xl border px-3.5 py-3 text-sm leading-5 text-[#1A1614] transition-all duration-200 outline-none placeholder:text-[#9B938A] ${
                                noteError
                                    ? 'border-[#E7B4B4] bg-[#FFF7F7] focus:border-[#DC2626] focus:ring-4 focus:ring-[#DC2626]/10'
                                    : 'border-[#E7E1D7] bg-[#FCFAF6] focus:border-[#CDBBA4] focus:bg-white focus:ring-4 focus:ring-[#A68A64]/10'
                            }`}
                        />

                        <button
                            type="button"
                            onClick={handleSaveNote}
                            disabled={!isNoteDirty}
                            className="group flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E2DBD2] bg-white px-4 text-sm font-semibold text-[#2F2A26] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CDBBA4] hover:bg-[#FCFAF6] hover:shadow-md focus:ring-2 focus:ring-[#A68A64]/20 focus:outline-none active:translate-y-0 disabled:cursor-not-allowed disabled:border-[#E7E1D7] disabled:bg-[#F8F6F2] disabled:text-[#A39A90] disabled:shadow-none"
                        >
                            {noteSaved && !isNoteDirty ? (
                                <CheckCircle2 className="h-4 w-4 text-[#1F9D6A]" />
                            ) : (
                                <SquarePen className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-8deg]" />
                            )}
                            {noteSaved && !isNoteDirty ? 'Saved' : 'Save Note'}
                        </button>

                        {noteError ? <p className="text-xs font-medium text-[#C45454]">{noteError}</p> : null}
                        {!noteError && noteSaved ? <p className="text-xs font-medium text-[#1F9D6A]">Note saved successfully.</p> : null}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
