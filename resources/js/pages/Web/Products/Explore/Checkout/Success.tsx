import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link, usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import React, { useMemo } from 'react';

type CheckoutDocument = {
    id: number;
    price: string | number;
    document: {
        title: string;
    } | null;
};

type PageProps = {
    batchUuid?: string;
    documents?: CheckoutDocument[];
} & Record<string, unknown>;

const PaymentSuccess: React.FC = () => {
    const { props } = usePage<PageProps>();

    const batchUuid = props.batchUuid ?? '';
    const documents = useMemo(() => (Array.isArray(props.documents) ? props.documents : []), [props.documents]);

    const steps = ['Products', 'KYC', 'Payment', 'Q&A'];

    const total = useMemo(() => {
        return documents.reduce((sum, item) => sum + Number(item.price ?? 0), 0).toFixed(2);
    }, [documents]);

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-8 py-10">
                <div className="flex flex-col space-y-12">
                    <div>
                        <Stepper steps={steps} currentStep={2} />
                    </div>

                    <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle size={48} className="text-green-600" />
                        </div>

                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Payment Successful</h2>

                        <p className="mt-3 text-base font-medium text-[#70665E]">
                            Your payment of <span className="font-semibold text-[#3D2B1F]">£{total}</span> has been confirmed. You can now proceed to complete your document questionnaire.
                        </p>

                        <Card className="mt-8 w-full">
                            <CardContent className="flex flex-col gap-3 p-6">
                                <h3 className="text-sm font-semibold text-[#1A1614]">Order Summary</h3>

                                {documents.map((item) => (
                                    <div key={item.id} className="flex justify-between rounded-lg bg-[#FCF9F2] px-4 py-3">
                                        <span className="text-sm font-medium text-[#1A1614]">{item.document?.title ?? 'Untitled Document'}</span>
                                        <span className="text-sm font-semibold text-[#3D2B1F]">£{Number(item.price).toFixed(2)}</span>
                                    </div>
                                ))}

                                <div className="flex justify-between border-t border-[#E8E2D6] pt-3 text-sm font-semibold">
                                    <span>Total Paid</span>
                                    <span>£{total}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Link
                            href={route('product.qna.show', { batch_uuid: batchUuid })}
                            className="mt-8 flex w-full items-center justify-center rounded bg-[#3D2B1F] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5A4638]"
                        >
                            Continue to Q&A
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PaymentSuccess;
