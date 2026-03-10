import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Clock3, FileSignature, Mail, PenLine, UserRound } from 'lucide-react';
import { useMemo, type ElementType } from 'react';
import type { DocumentItem, DocumentStatus } from './Index';

type Props = {
    currentUserEmail: string;
    document: DocumentItem;
    onBack: () => void;
    onSign: (recipientEmail: string) => void;
};

const SIGN_STATUS_META: Record<
    Extract<DocumentStatus, 'awaiting_signatures' | 'partially_signed'>,
    {
        label: string;
        badgeClassName: string;
        Icon: ElementType;
    }
> = {
    awaiting_signatures: {
        label: 'Awaiting Signatures',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#1D4ED8]',
        Icon: FileSignature,
    },
    partially_signed: {
        label: 'Partially Signed',
        badgeClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#EEFDF3] px-3 py-1 text-xs font-medium text-[#15803D]',
        Icon: FileSignature,
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
                                <p className="text-xs font-medium text-[#8B8178] md:text-sm">Lawyer-approved draft ready for signing</p>
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

export default function SignView({ currentUserEmail, document, onBack, onSign }: Props) {
    const recipients = document.recipients ?? [];

    const currentRecipient = useMemo(
        () => recipients.find((recipient) => recipient.email.toLowerCase() === currentUserEmail.toLowerCase()) ?? null,
        [recipients, currentUserEmail],
    );

    const signedCount = recipients.filter((recipient) => recipient.hasSigned).length;
    const totalCount = recipients.length;
    const remainingCount = Math.max(totalCount - signedCount, 0);
    const canCurrentUserSign = !!currentRecipient && !currentRecipient.hasSigned;
    const progress = totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;
    const signStatus: Extract<DocumentStatus, 'awaiting_signatures' | 'partially_signed'> =
        signedCount === 0 ? 'awaiting_signatures' : 'partially_signed';

    const statusMeta = SIGN_STATUS_META[signStatus];
    const StatusIcon = statusMeta.Icon;

    return (
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
                        Signature progress: {signedCount} of {totalCount} recipient{totalCount !== 1 ? 's' : ''} signed
                    </p>
                </div>

                <DocumentPreview />
            </div>

            <div className="space-y-3">
                <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                            <FileSignature className="h-3.5 w-3.5 text-[#7C7368]" />
                            Signing Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pt-4 pb-4">
                        <div className="rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] p-3">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5DED5] bg-white">
                                    <Clock3 className="h-4 w-4 text-[#3D2B1F]" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold text-[#1A1614]">Signature in Progress</p>

                                    <p className="mt-1 text-[11px] leading-5 text-[#6B635B]">
                                        The lawyer already sent the signing request to the required recipients.
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

                        {currentRecipient ? (
                            canCurrentUserSign ? (
                                <div className="rounded-xl border border-[#D8E5FF] bg-[#F7FAFF] p-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9E8FF] bg-white">
                                            <PenLine className="h-4 w-4 text-[#2563EB]" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-semibold text-[#1A1614]">Signature Required</p>
                                            <p className="mt-1 text-[11px] leading-5 text-[#6B635B]">
                                                Your email matches one of the recipients. You can continue to sign this document now.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onSign(currentRecipient.email)}
                                        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-[13px] font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#1D4ED8] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none"
                                    >
                                        <PenLine className="h-4 w-4" />
                                        Sign Document
                                    </button>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-[#D9ECDD] bg-[#F7FCF8] p-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9ECDD] bg-white">
                                            <CheckCircle2 className="h-4 w-4 text-[#1F9D6A]" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-semibold text-[#1A1614]">You Already Signed</p>
                                            <p className="mt-1 text-[11px] leading-5 text-[#6B635B]">
                                                Your signature has already been recorded. Waiting for the remaining recipient
                                                {remainingCount !== 1 ? 's' : ''}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : null}
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
                        {recipients.map((recipient) => (
                            <div key={recipient.id} className="rounded-lg px-2 py-2">
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
                                            {recipient.signedAt ? `Signed at ${recipient.signedAt}` : null}
                                        </div>
                                    </div>

                                    {recipient.hasSigned ? (
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
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
