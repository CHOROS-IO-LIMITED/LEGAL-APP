import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Download, FileCheck2, Mail, ShieldCheck, UserRound } from 'lucide-react';
import type { DocumentItem } from './Index';

type Props = {
    currentUserEmail: string;
    document: DocumentItem;
    onBack: () => void;
    onDownload?: () => void;
};

function ContractSection({ title, lines = ['w-full', 'w-11/12', 'w-10/12'] }: { title: string; lines?: string[] }) {
    return (
        <section className="space-y-3 rounded-2xl border border-[#E7F1EA] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-[12px] font-semibold tracking-[0.18em] text-[#4F6A58] uppercase">{title}</h3>
                <div className="h-px flex-1 bg-[#E4EEE7]" />
            </div>

            <div className="space-y-2.5">
                {lines.map((width, index) => (
                    <div key={`${title}-${index}`} className={`h-2.5 rounded-full bg-[#E5F1E8] ${width}`} />
                ))}
            </div>
        </section>
    );
}

function DocumentPreview({ document }: { document: DocumentItem }) {
    return (
        <Card className="overflow-hidden rounded-[28px] border-[#DDECE2] bg-white shadow-[0_12px_40px_rgba(21,128,61,0.06)]">
            <CardContent className="p-0">
                <div className="border-b border-[#E5EFE8] bg-gradient-to-r from-[#F8FFFA] via-white to-[#F8FFFA] px-6 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4EAD9] bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#4B6A55] uppercase">
                                <FileCheck2 className="h-3.5 w-3.5" />
                                Completed Copy
                            </div>
                            <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#0F172A]">{document.title}</h2>
                            <p className="mt-1 text-sm text-[#617169]">This execution copy has been fully signed and completed.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="rounded-2xl border border-[#E3ECE5] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#7A8A82]">Status</p>
                                <p className="mt-1 text-sm font-semibold text-[#0F172A]">Completed</p>
                            </div>
                            <div className="rounded-2xl border border-[#E3ECE5] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#7A8A82]">Completed At</p>
                                <p className="mt-1 text-sm font-semibold text-[#0F172A]">{document.completedAt ?? 'Not available'}</p>
                            </div>
                            <div className="rounded-2xl border border-[#E3ECE5] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#7A8A82]">Recipients</p>
                                <p className="mt-1 text-sm font-semibold text-[#0F172A]">{document.recipients?.length ?? 0}</p>
                            </div>
                            <div className="rounded-2xl border border-[#E3ECE5] bg-white px-4 py-3 shadow-sm">
                                <p className="text-[11px] text-[#7A8A82]">Execution</p>
                                <p className="mt-1 text-sm font-semibold text-[#0F172A]">Final</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-h-[78vh] overflow-y-auto bg-[#F4FBF6] p-5 md:p-7">
                    <div className="mx-auto max-w-4xl rounded-[24px] border border-[#DFECE3] bg-white px-7 py-8 shadow-[0_18px_50px_rgba(21,128,61,0.06)] md:px-9 md:py-10">
                        <div className="space-y-8">
                            <header className="space-y-3 border-b border-[#E8F1EA] pb-6 text-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#D8EBDD] bg-[#F7FFF9] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#4B6854] uppercase">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Fully Executed
                                </div>

                                <h3 className="font-serif text-[22px] font-bold tracking-tight text-[#111827] md:text-[28px]">
                                    FINAL SIGNED DOCUMENT
                                </h3>

                                <p className="mx-auto max-w-2xl text-sm leading-6 text-[#617169]">
                                    This document has completed the review, DocuSign, and execution cycle. All required recipients have signed.
                                </p>
                            </header>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-[#E7F0E9] bg-[#FBFFFC] px-4 py-4">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#7A8A82] uppercase">Completed</p>
                                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">{document.completedAt ?? 'Not available'}</p>
                                </div>

                                <div className="rounded-2xl border border-[#E7F0E9] bg-[#FBFFFC] px-4 py-4">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#7A8A82] uppercase">Requests Sent</p>
                                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">{document.sentForSignatureAt ?? 'Not available'}</p>
                                </div>

                                <div className="rounded-2xl border border-[#E7F0E9] bg-[#FBFFFC] px-4 py-4">
                                    <p className="text-[11px] font-medium tracking-[0.12em] text-[#7A8A82] uppercase">Execution Status</p>
                                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">Completed</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <ContractSection title="1. EXECUTED PARTIES" lines={['w-full', 'w-[87%]', 'w-[73%]']} />
                                <ContractSection title="2. APPROVED TERMS" lines={['w-full', 'w-[85%]', 'w-[66%]']} />
                                <ContractSection title="3. FINAL SIGNATURE ROUTING" lines={['w-full', 'w-[90%]', 'w-[70%]']} />
                                <ContractSection title="4. BINDING EXECUTION" lines={['w-full', 'w-[82%]', 'w-[60%]']} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CompletedDocumentView({ document, onBack, onDownload }: Props) {
    const recipients = document.recipients ?? [];

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-full border border-[#DCEBDF] bg-white px-4 py-2 text-sm font-medium text-[#617169] shadow-sm transition-all hover:border-[#C7DDCD] hover:text-[#0F172A]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    User Dashboard
                </button>

                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">{document.title}</h1>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BBE7C8] bg-[#ECFDF3] px-3 py-1 text-xs font-semibold text-[#15803D]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Completed
                        </span>
                    </div>

                    <p className="text-sm text-[#617169]">All required signatures have been completed and the final document is ready.</p>
                </div>

                <DocumentPreview document={document} />
            </div>

            <div className="space-y-4">
                <Card className="overflow-hidden rounded-[26px] border-[#D7EADC] bg-white shadow-[0_14px_35px_rgba(34,197,94,0.08)]">
                    <CardHeader className="border-b border-[#E5F0E8] bg-gradient-to-r from-[#F7FFF9] to-white px-5 pt-5 pb-4">
                        <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-[#4D6655] uppercase">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#169B62]" />
                            Completion Stage
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 px-5 pt-5 pb-5">
                        <div className="rounded-2xl border border-[#CDE9D7] bg-gradient-to-br from-[#F8FFFB] to-[#EFFAF3] p-5 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-[#EFFAF4]">
                                    <CheckCircle2 className="h-7 w-7 text-[#17925F]" />
                                </div>

                                <div className="mt-4 space-y-1.5">
                                    <p className="text-sm font-semibold text-[#0F172A]">Document Completed</p>
                                    <p className="text-xs leading-6 text-[#617169]">
                                        The document has been approved, sent through DocuSign, and fully executed by all required recipients.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-[#E3ECE5] bg-[#FBFFFC] px-4 py-4">
                                <p className="text-[11px] text-[#7A8A82]">Recipients</p>
                                <p className="mt-1 text-xl font-semibold text-[#0F172A]">{recipients.length}</p>
                            </div>

                            <div className="rounded-2xl border border-[#E3ECE5] bg-[#FBFFFC] px-4 py-4">
                                <p className="text-[11px] text-[#7A8A82]">Completed At</p>
                                <p className="mt-1 text-sm font-semibold text-[#0F172A]">{document.completedAt ?? 'Not available'}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onDownload}
                            className="group flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#15803D] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#166534] hover:shadow-md focus:ring-2 focus:ring-[#15803D]/20 focus:outline-none"
                        >
                            <Download className="h-4 w-4" />
                            Download Final Document
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="flex h-11 w-full items-center justify-center rounded-2xl border border-[#E3E8E1] bg-white px-4 text-sm font-semibold text-[#2F3B33] shadow-sm transition-all duration-200 hover:bg-[#FAFCFA] focus:ring-2 focus:ring-[#15803D]/10 focus:outline-none"
                        >
                            Back to Dashboard
                        </button>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-[26px] border-[#E1EADF] bg-white shadow-[0_12px_30px_rgba(21,128,61,0.05)]">
                    <CardHeader className="border-b border-[#E6EEE6] px-5 pt-5 pb-4">
                        <CardTitle className="text-[12px] font-semibold tracking-[0.16em] text-[#617169] uppercase">Signed Recipients</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-5 pt-5 pb-5">
                        {recipients.map((recipient) => (
                            <div key={recipient.id} className="rounded-2xl border border-[#E7EFE8] bg-[#FBFFFC] p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DDE8E0] bg-white">
                                                <UserRound className="h-4 w-4 text-[#68776F]" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-[#0F172A]">{recipient.name}</p>
                                                <p className="text-xs text-[#7A8A82]">{recipient.role ?? 'Recipient'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-1.5 text-sm text-[#617169]">
                                            <Mail className="h-3.5 w-3.5" />
                                            <span className="truncate">{recipient.email}</span>
                                        </div>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#BBE7C8] bg-[#ECFDF3] px-3 py-1 text-xs font-semibold text-[#15803D]">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        {recipient.signedAt ? `Signed • ${recipient.signedAt}` : 'Signed'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-[26px] border-[#E1EADF] bg-white shadow-[0_12px_30px_rgba(21,128,61,0.05)]">
                    <CardHeader className="border-b border-[#E6EEE6] px-5 pt-5 pb-4">
                        <CardTitle className="text-[12px] font-semibold tracking-[0.16em] text-[#617169] uppercase">Audit Trail</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-5 pt-5 pb-5">
                        {(document.auditTrail ?? []).map((item) => (
                            <div key={item.id} className="rounded-2xl border border-[#E7EFE8] bg-[#FBFFFC] px-4 py-4">
                                <p className="text-sm font-semibold text-[#0F172A]">{item.label}</p>
                                <p className="mt-1 text-xs text-[#7A8A82]">{item.timestamp}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
