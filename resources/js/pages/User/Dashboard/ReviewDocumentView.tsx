import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Clock, FileText, MessageSquare, ScaleIcon, SquarePen } from 'lucide-react';
import { type ElementType } from 'react';
import type { DocumentItem, DocumentStatus } from './Index';

type Props = {
    document: DocumentItem;
    onBack: () => void;
    onChangeStatus: (status: DocumentStatus) => void;
    onSaveNote: (note: string) => void;
    onApproveAndSign: () => void;
};

const STATUS_META: Record<
    DocumentStatus,
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
        label: 'Waiting for Approval',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#F6E4B5] bg-[#FFF7E6] px-3 py-1 text-xs font-medium text-[#B7791F]',
        Icon: Clock,
    },
    approved: {
        label: 'Approved',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-medium text-[#059669]',
        Icon: CheckCircle2,
    },
    changes_requested: {
        label: 'Request Changes',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-3 py-1 text-xs font-medium text-[#B45309]',
        Icon: SquarePen,
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

export default function ReviewDocumentView({ document, onChangeStatus, onApproveAndSign }: Props) {
    const statusMeta = STATUS_META[document.status];
    const StatusIcon = statusMeta.Icon;

    const isWaiting = document.status === 'pending_lawyer_review';
    const isApproved = document.status === 'approved';
    const isChangesRequested = document.status === 'changes_requested';

    const handleRequestChanges = () => {
        onChangeStatus('changes_requested');
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
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
                        Created: {document.submittedAtLabel} · {document.submittedBy}
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
            </div>

            <div className="space-y-3">
                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                            <ScaleIcon className="h-3.5 w-3.5 text-[#7C7368]" />
                            Next Step
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4">
                        {!isWaiting && !isApproved && !isChangesRequested && (
                            <div className="space-y-2.5">
                                <button
                                    type="button"
                                    onClick={onApproveAndSign}
                                    className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#CFEAD9] bg-white px-4 text-sm font-semibold text-[#1F9D6A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A9D8BC] hover:bg-[#F8FFFB] hover:shadow-md focus:ring-2 focus:ring-[#1F9D6A]/15 focus:outline-none active:translate-y-0"
                                >
                                    Approve And Sign
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleRequestChanges}
                                    className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E2DBD2] bg-white px-4 text-sm font-semibold text-[#2F2A26] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CDBBA4] hover:bg-[#FCFAF6] hover:shadow-md focus:ring-2 focus:ring-[#A68A64]/20 focus:outline-none active:translate-y-0"
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
                                            Your signed document has been sent to the lawyer and is currently under review.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isApproved && (
                            <div className="rounded-2xl border border-[#E7E1D7] bg-[#FCFAF6] p-5 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-[#F6F1E8]">
                                        <CheckCircle2 className="h-7 w-7 text-[#1F9D6A]" />
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <p className="text-sm font-semibold text-[#1A1614]">Document Approved</p>
                                        <p className="text-xs leading-5 text-[#6B635B]">
                                            Your document has been reviewed and approved by the lawyer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isChangesRequested && (
                            <div className="rounded-2xl border border-[#E7D9BE] bg-gradient-to-b from-[#FFFCF6] to-[#FBF6EA] p-5 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F1E3] shadow-inner ring-4 ring-[#FCF8F0]">
                                        <SquarePen className="h-7 w-7 text-[#B7791F]" />
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <p className="text-sm font-semibold text-[#1A1614]">Changes Requested</p>
                                        <p className="text-xs leading-5 text-[#6B635B]">loading</p>
                                    </div>
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
                            <div className="rounded-xl border border-[#F3E4BF] bg-[#FFFBF2] px-4 py-3 text-sm leading-6 text-[#5F4B22]">
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
                            <p className="text-[11px] text-[#8A8178]">Type</p>
                            <p className="font-medium text-[#1A1614]">Residential Lease</p>
                        </div>

                        <div>
                            <p className="text-[11px] text-[#8A8178]">Created At</p>
                            <p className="font-medium text-[#1A1614]">{document.submittedAtLabel}</p>
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
            </div>
        </div>
    );
}
