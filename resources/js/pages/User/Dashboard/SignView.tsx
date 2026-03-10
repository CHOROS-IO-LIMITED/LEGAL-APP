import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Clock3, ExternalLink, FileSignature, Mail, PenLine, ShieldCheck, UserRound } from 'lucide-react';
import { useMemo } from 'react';
import type { DocumentItem } from './Index';

type Props = {
    currentUserEmail: string;
    document: DocumentItem;
    onBack: () => void;
    onSign: (recipientEmail: string) => void;
};

function ContractSection({ title, lines = ['w-full', 'w-11/12', 'w-10/12'] }: { title: string; lines?: string[] }) {
    return (
        <section className="space-y-3 rounded-2xl border border-[#EEF1F4] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-[12px] font-semibold tracking-[0.18em] text-[#5E6772] uppercase">{title}</h3>
                <div className="h-px flex-1 bg-[#E8EDF3]" />
            </div>

            <div className="space-y-2.5">
                {lines.map((width, index) => (
                    <div key={`${title}-${index}`} className={`h-2.5 rounded-full bg-[#E9EEF5] ${width}`} />
                ))}
            </div>
        </section>
    );
}

function DocumentPreview({ document }: { document: DocumentItem }) {
    return (
        <Card className="overflow-hidden rounded-[28px] border-[#E5EBF2] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <CardContent className="p-0">
                <div className="border-b border-[#E8EDF3] bg-gradient-to-r from-[#F8FBFF] via-white to-[#F8FBFF] px-6 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE7F5] bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#4F6783] uppercase">
                                <FileSignature className="h-3.5 w-3.5" />
                                DocuSign Ready
                            </div>
                            <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#0F172A]">{document.title}</h2>
                            <p className="mt-1 text-sm text-[#5E6772]">Review the document before proceeding to the signature stage.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="rounded-2xl border border-[#E6ECF3] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#7C8794]">Recipients</p>
                                <p className="mt-1 text-sm font-semibold text-[#0F172A]">{document.recipients?.length ?? 0}</p>
                            </div>
                            <div className="rounded-2xl border border-[#E6ECF3] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#7C8794]">Sent</p>
                                <p className="mt-1 text-sm font-semibold text-[#0F172A]">{document.sentForSignatureAt ? 'Yes' : 'Pending'}</p>
                            </div>
                            <div className="rounded-2xl border border-[#E6ECF3] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#7C8794]">KYC</p>
                                <p className="mt-1 text-sm font-semibold text-[#0F172A]">{document.kycStatus ?? 'Pending'}</p>
                            </div>
                            <div className="rounded-2xl border border-[#E6ECF3] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#7C8794]">Payment</p>
                                <p className="mt-1 text-sm font-semibold text-[#0F172A]">{document.paymentStatus ?? 'Pending'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-h-[78vh] overflow-y-auto bg-[#F5F8FC] p-5 md:p-7">
                    <div className="mx-auto max-w-4xl rounded-[24px] border border-[#E5EBF2] bg-white px-7 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:px-9 md:py-10">
                        <div className="space-y-8">
                            <header className="space-y-3 border-b border-[#E9EEF5] pb-6 text-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE7F5] bg-[#F8FBFF] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#4E6480] uppercase">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Signature Package
                                </div>

                                <h3 className="font-serif text-[22px] font-bold tracking-tight text-[#111827] md:text-[28px]">EXECUTION COPY</h3>

                                <p className="mx-auto max-w-2xl text-sm leading-6 text-[#5E6772]">
                                    This is the lawyer-approved version routed through DocuSign for recipient execution and completion tracking.
                                </p>
                            </header>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-[#E8EDF4] bg-[#FAFCFF] px-4 py-4">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#7C8794] uppercase">Approved For</p>
                                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">Digital Signature</p>
                                </div>

                                <div className="rounded-2xl border border-[#E8EDF4] bg-[#FAFCFF] px-4 py-4">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#7C8794] uppercase">Requests Sent</p>
                                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">{document.sentForSignatureAt ?? 'Pending'}</p>
                                </div>

                                <div className="rounded-2xl border border-[#E8EDF4] bg-[#FAFCFF] px-4 py-4">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#7C8794] uppercase">Status</p>
                                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">Awaiting Execution</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <ContractSection title="1. CONTRACTING PARTIES" lines={['w-full', 'w-[89%]', 'w-[70%]']} />
                                <ContractSection title="2. DEFINITIONS & COVERAGE" lines={['w-full', 'w-[84%]', 'w-[66%]']} />
                                <ContractSection title="3. CORE TERMS & CONSIDERATION" lines={['w-full', 'w-[90%]', 'w-[72%]']} />
                                <ContractSection title="4. REPRESENTATIONS & WARRANTIES" lines={['w-full', 'w-[88%]', 'w-[69%]']} />
                                <ContractSection title="5. COMPLIANCE & UNDERTAKINGS" lines={['w-full', 'w-[85%]', 'w-[68%]']} />
                                <ContractSection title="6. EXECUTION BLOCK" lines={['w-full', 'w-[79%]', 'w-[56%]']} />
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
    const remainingCount = totalCount - signedCount;
    const canCurrentUserSign = !!currentRecipient && !currentRecipient.hasSigned;

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-full border border-[#DDE6F0] bg-white px-4 py-2 text-sm font-medium text-[#5E6772] shadow-sm transition-all hover:border-[#CBD8E7] hover:text-[#0F172A]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    User Dashboard
                </button>

                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">{document.title}</h1>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1D4ED8]">
                            <FileSignature className="h-3.5 w-3.5" />
                            Signature Stage
                        </span>
                    </div>

                    <p className="text-sm text-[#5E6772]">
                        Signature progress: <span className="font-semibold text-[#0F172A]">{signedCount}</span> of{' '}
                        <span className="font-semibold text-[#0F172A]">{totalCount}</span> recipient{totalCount !== 1 ? 's' : ''} signed
                    </p>
                </div>

                <DocumentPreview document={document} />
            </div>

            <div className="space-y-4">
                <Card className="overflow-hidden rounded-[26px] border-[#DCE7F5] bg-white shadow-[0_14px_35px_rgba(37,99,235,0.08)]">
                    <CardHeader className="border-b border-[#E6EEF8] bg-gradient-to-r from-[#F8FBFF] to-white px-5 pt-5 pb-4">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-[#47607E] uppercase">
                            <FileSignature className="h-3.5 w-3.5 text-[#2563EB]" />
                            DocuSign Stage
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 px-5 pt-5 pb-5">
                        {currentRecipient ? (
                            canCurrentUserSign ? (
                                <div className="rounded-2xl border border-[#CFE0FB] bg-gradient-to-br from-[#F8FBFF] to-[#EEF5FF] p-5 shadow-sm">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-[#EEF4FF]">
                                            <PenLine className="h-7 w-7 text-[#2563EB]" />
                                        </div>

                                        <div className="mt-4 space-y-1.5">
                                            <p className="text-sm font-semibold text-[#0F172A]">Signature Required</p>
                                            <p className="text-xs leading-6 text-[#5E6772]">
                                                Your account matches an active recipient in this envelope. Continue to DocuSign to sign your copy.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => onSign(currentRecipient.email)}
                                            className="group mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-md focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none"
                                        >
                                            <PenLine className="h-4 w-4" />
                                            Sign with DocuSign
                                            <ExternalLink className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-[#CDE9D7] bg-gradient-to-br from-[#F8FFFB] to-[#F0FBF5] p-5 shadow-sm">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-[#EFFAF4]">
                                            <CheckCircle2 className="h-7 w-7 text-[#17925F]" />
                                        </div>

                                        <div className="mt-4 space-y-1.5">
                                            <p className="text-sm font-semibold text-[#0F172A]">You Already Signed</p>
                                            <p className="text-xs leading-6 text-[#5E6772]">
                                                Your signature has already been captured. Waiting for the remaining recipient
                                                {remainingCount !== 1 ? 's' : ''}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="rounded-2xl border border-[#EADFBF] bg-gradient-to-br from-[#FFFDF7] to-[#FBF7EA] p-5 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-[#FDF8EC]">
                                        <Clock3 className="h-7 w-7 text-[#B7791F]" />
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <p className="text-sm font-semibold text-[#0F172A]">No Signature Action Needed</p>
                                        <p className="text-xs leading-6 text-[#5E6772]">
                                            Your current account is not listed as one of the required signing recipients for this document.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-[#E6ECF3] bg-[#FAFCFF] px-4 py-4">
                                <p className="text-[11px] text-[#7C8794]">Signed</p>
                                <p className="mt-1 text-xl font-semibold text-[#0F172A]">{signedCount}</p>
                            </div>

                            <div className="rounded-2xl border border-[#E6ECF3] bg-[#FAFCFF] px-4 py-4">
                                <p className="text-[11px] text-[#7C8794]">Remaining</p>
                                <p className="mt-1 text-xl font-semibold text-[#0F172A]">{remainingCount}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#E6ECF3] bg-[#FAFCFF] px-4 py-4">
                            <p className="text-[11px] text-[#7C8794]">Requests Sent</p>
                            <p className="mt-1 text-sm font-semibold text-[#0F172A]">{document.sentForSignatureAt ?? 'Not available'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-[26px] border-[#E4EAF1] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                    <CardHeader className="border-b border-[#E8EDF3] px-5 pt-5 pb-4">
                        <CardTitle className="text-[12px] font-semibold tracking-[0.16em] text-[#5E6772] uppercase">Recipient Status</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-5 pt-5 pb-5">
                        {recipients.map((recipient) => (
                            <div key={recipient.id} className="rounded-2xl border border-[#E8EDF3] bg-[#FAFCFF] p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DDE6F0] bg-white">
                                                <UserRound className="h-4 w-4 text-[#687382]" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-[#0F172A]">{recipient.name}</p>
                                                <p className="text-xs text-[#7C8794]">{recipient.role ?? 'Recipient'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-1.5 text-sm text-[#5E6772]">
                                            <Mail className="h-3.5 w-3.5" />
                                            <span className="truncate">{recipient.email}</span>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        {recipient.hasSigned ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BEE7CC] bg-[#ECFDF3] px-3 py-1 text-xs font-semibold text-[#15803D]">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Signed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E7FB] bg-[#F3F8FE] px-3 py-1 text-xs font-semibold text-[#2563EB]">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {recipient.hasSigned && recipient.signedAt ? (
                                    <p className="mt-3 text-xs text-[#7C8794]">Signed at {recipient.signedAt}</p>
                                ) : null}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
