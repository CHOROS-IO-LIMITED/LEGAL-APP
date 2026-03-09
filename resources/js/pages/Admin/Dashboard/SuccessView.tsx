import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ECF8F1] ring-4 ring-[#F5FBF7]">
                            <CheckCircle2 className="h-10 w-10 text-[#1F9D6A]" />
                        </div>

                        <div className="mt-5 space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Document Approved Successfully</h2>

                            <p className="text-sm leading-6 text-[#6B635B]">
                                The document for <span className="font-medium text-[#2F2A26]">{document.submittedBy}</span> has been approved and
                                completed.
                            </p>
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
