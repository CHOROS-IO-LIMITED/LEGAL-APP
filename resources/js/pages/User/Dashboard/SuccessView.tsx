import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import type { DocumentItem } from './Index';

type Props = {
    document: DocumentItem;
    onBackToDashboard: () => void;
};

export default function SuccessView({ document, onBackToDashboard }: Props) {
    return (
        <div className="mx-auto flex max-w-md justify-center py-16">
            <Card className="w-full overflow-hidden rounded-3xl border border-[#E7E1D7] bg-white shadow-sm">
                <CardContent className="px-7 py-9">
                    <div className="flex flex-col items-center text-center">
                        {/* Success Icon */}
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ECF8F1] ring-4 ring-[#F5FBF7]">
                            <CheckCircle2 className="h-10 w-10 text-[#1F9D6A]" />
                        </div>

                        {/* Title */}
                        <div className="mt-5 space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Document Sent Successfully</h2>

                            <p className="text-sm leading-6 text-[#6B635B]">
                                The signed document for <span className="font-medium text-[#2F2A26]">{document.submittedBy}</span> has been delivered.
                            </p>
                        </div>

                        {/* Status Card */}
                        <div className="mt-6 w-full rounded-2xl border border-[#EEE7DC] bg-[#FCFAF6] p-5 text-left">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#EEE7DC]">
                                    <Mail className="h-4 w-4 text-[#7C7368]" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-semibold tracking-[0.08em] text-[#8A8178] uppercase">Delivery Status</p>

                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="rounded-full bg-[#FFF3D6] px-2.5 py-0.5 text-xs font-medium text-[#8A5A00]">
                                            Awaiting Signature
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs leading-5 text-[#6B635B]">
                                        A notification email has been prepared and sent. The recipient can now review and sign the agreement.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Next Step */}
                        <div className="mt-5 w-full rounded-2xl border border-[#E8E1D6] bg-gradient-to-b from-[#FFFCF7] to-[#FBF6EC] px-5 py-4">
                            <div className="flex items-start gap-3 text-left">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#EEE7DC]">
                                    <Sparkles className="h-4 w-4 text-[#B7791F]" />
                                </div>

                                <p className="text-xs leading-5 font-medium text-[#6B635B]">
                                    Next step: Monitor the document status in your dashboard once the recipient completes the signature.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onBackToDashboard}
                            className="group mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2B1F] px-5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none active:translate-y-0"
                        >
                            Back to Dashboard
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
