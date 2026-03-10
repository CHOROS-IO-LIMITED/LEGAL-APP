import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Clock3, Download } from 'lucide-react';
import type { DocumentItem } from './Index';

type Props = {
    document: DocumentItem;
    onBack: () => void;
    onDownload?: () => void;
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

export default function CompletedDocumentView({ document, onBack, onDownload }: Props) {
    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6B635B] transition-colors hover:text-[#1A1614]"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </button>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-semibold tracking-tight text-[#1A1614]">{document.title}</h1>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-medium text-[#059669]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Approved
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
                                            <p className="text-xs font-medium text-[#8B8178] md:text-sm">
                                                Final approved document with submitter and admin lawyer signatures
                                            </p>
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

                                        <div className="grid gap-4 border-t border-[#EEE7DC] pt-6 md:grid-cols-2">
                                            <div className="rounded-xl border border-[#EEE7DC] bg-[#FCFAF6] p-4">
                                                <p className="text-[11px] font-semibold tracking-[0.08em] text-[#8A8178] uppercase">
                                                    Client Signature
                                                </p>
                                                <p className="mt-3 font-serif text-xl text-[#231F1B] italic">{document.submittedBy}</p>
                                                <p className="mt-2 text-xs text-[#6B635B]">
                                                    Signed: {document.submitterSignedAt ?? document.submittedAtLabel ?? '—'}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-[#EEE7DC] bg-[#FCFAF6] p-4">
                                                <p className="text-[11px] font-semibold tracking-[0.08em] text-[#8A8178] uppercase">
                                                    Lawyer Signature
                                                </p>
                                                <p className="mt-3 font-serif text-xl text-[#231F1B] italic">admin lawyer</p>
                                                <p className="mt-2 text-xs text-[#6B635B]">Signed: {document.lawyerSignedAt ?? '—'}</p>
                                            </div>
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
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#1F9D6A]" />
                                Approval Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 px-4 pt-4 pb-4 text-sm">
                            <div>
                                <p className="text-[11px] text-[#8A8178]">Status</p>
                                <p className="font-medium text-[#1A1614]">Approved</p>
                            </div>

                            <div>
                                <p className="text-[11px] text-[#8A8178]">Client</p>
                                <p className="font-medium text-[#1A1614]">{document.submittedBy}</p>
                            </div>

                            <div>
                                <p className="text-[11px] text-[#8A8178]">Approved At</p>
                                <p className="font-medium text-[#1A1614]">{document.completedAt ?? document.lawyerSignedAt ?? '—'}</p>
                            </div>

                            <button
                                type="button"
                                onClick={onDownload}
                                className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none active:translate-y-0"
                            >
                                <Download className="h-4 w-4" />
                                Download PDF
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-[#E7E1D7] bg-white shadow-sm">
                        <CardHeader className="border-b border-[#EFE7DB] px-4 pt-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                                <Clock3 className="h-3.5 w-3.5 text-[#7C7368]" />
                                Document History
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 px-4 pt-4 pb-4">
                            {(document.auditTrail ?? []).map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#A68A64]" />
                                    <div>
                                        <p className="text-sm font-medium text-[#1A1614]">{item.label}</p>
                                        <p className="text-xs text-[#6B635B]">{item.timestamp}</p>
                                    </div>
                                </div>
                            ))}

                            {!(document.auditTrail ?? []).length && <div className="text-sm text-[#6B635B]">No audit trail available.</div>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
