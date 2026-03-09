import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Check, PenLine, Send } from 'lucide-react';
import { useState } from 'react';
import type { DocumentItem } from './Index';

type Props = {
    document: DocumentItem;
    onBack: () => void;
    onSend: (payload: { recipientName: string; recipientEmail: string }) => void;
};

export default function SignView({ document, onBack, onSend }: Props) {
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [showSignature, setShowSignature] = useState(false);
    const canSend = showSignature && recipientName.trim() && recipientEmail.trim();

    return (
        <div className="mx-auto max-w-2xl space-y-4">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6B635B] transition-colors hover:text-[#2F2A26]"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Review
            </button>

            <div className="space-y-0.5">
                <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Sign & Send</h1>
                <p className="text-sm text-[#6B635B]">Finalize the document and send it to the other party for signature.</p>
            </div>

            <Card className="overflow-hidden rounded-2xl border-[#E7E1D7] bg-white shadow-sm">
                <CardHeader className="border-b border-[#EFE7DB] px-6 pt-5 pb-4">
                    <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                        <PenLine className="h-3.5 w-3.5 text-[#7C7368]" />
                        E-Sign Document
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 px-5 pt-4 pb-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold tracking-[0.08em] text-[#7B736B] uppercase">Full Legal Name</label>
                            <input
                                value={document.submittedBy}
                                readOnly
                                className="h-10 w-full rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] px-4 text-sm text-[#1A1614] outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold tracking-[0.08em] text-[#7B736B] uppercase">Date</label>
                            <div className="relative">
                                <input
                                    value={document.submittedAtLabel}
                                    readOnly
                                    className="h-10 w-full rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] px-4 pr-10 text-sm text-[#1A1614] outline-none"
                                />
                                <Calendar className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#7C7368]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold tracking-[0.08em] text-[#7B736B] uppercase">Role / Title</label>
                            <input
                                value="Landlord"
                                readOnly
                                className="h-10 w-full rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] px-4 text-sm text-[#1A1614] outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold tracking-[0.08em] text-[#7B736B] uppercase">Email</label>
                            <input
                                value={document.clientEmail ?? 'james@example.com'}
                                readOnly
                                className="h-10 w-full rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] px-4 text-sm text-[#1A1614] outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold tracking-[0.08em] text-[#7B736B] uppercase">Signature</label>

                        <button
                            type="button"
                            onClick={() => setShowSignature(true)}
                            className="flex min-h-[90px] w-full items-center justify-center rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] px-4 py-6 text-center transition-all duration-200 hover:border-[#CDBBA4] hover:bg-white focus:ring-4 focus:ring-[#A68A64]/10 focus:outline-none"
                        >
                            {showSignature ? (
                                <span className="font-serif text-[20px] font-semibold tracking-tight text-[#231F1B] italic md:text-[22px]">
                                    {document.submittedBy}
                                </span>
                            ) : (
                                <span className="text-sm font-medium text-[#8B8178]">Click to sign</span>
                            )}
                        </button>

                        {showSignature && (
                            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#4FA27A]">
                                <Check className="h-3.5 w-3.5" />
                                Signature captured
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-[#E7E1D7] bg-white shadow-sm">
                <CardHeader className="border-b border-[#EFE7DB] px-6 pt-5 pb-4">
                    <CardTitle className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-[#4E463F] uppercase">
                        <Send className="h-3.5 w-3.5 text-[#7C7368]" />
                        Send To Other Party
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 px-5 pt-4 pb-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold tracking-[0.08em] text-[#7B736B] uppercase">Recipient Name</label>
                            <input
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                placeholder="e.g. Sarah Mitchell"
                                className="h-10 w-full rounded-xl border border-[#E7E1D7] bg-white px-4 text-sm text-[#1A1614] transition-all duration-200 outline-none placeholder:text-[#9B938A] focus:border-[#CDBBA4] focus:ring-4 focus:ring-[#A68A64]/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold tracking-[0.08em] text-[#7B736B] uppercase">Recipient Email</label>
                            <input
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                                placeholder="sarah@example.com"
                                className="h-10 w-full rounded-xl border border-[#E7E1D7] bg-white px-4 text-sm text-[#1A1614] transition-all duration-200 outline-none placeholder:text-[#9B938A] focus:border-[#CDBBA4] focus:ring-4 focus:ring-[#A68A64]/10"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onSend({
                                recipientName: recipientName.trim(),
                                recipientEmail: recipientEmail.trim(),
                            })
                        }
                        disabled={!canSend}
                        className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none active:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#A39A90] disabled:hover:translate-y-0"
                    >
                        <Send className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-6" />
                        Send Signed Document
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
