import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

type PageProps = {
    batchUuid?: string;
} & Record<string, unknown>;

const KYC: React.FC = () => {
    const { props } = usePage<PageProps>();

    const batchUuid = props.batchUuid ?? '';
    const [isStarting, setIsStarting] = useState(false);

    const steps = ['Products', 'KYC', 'Payment', 'Q&A'];

    const startVerification = () => {
        if (!batchUuid || isStarting) return;

        setIsStarting(true);

        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (!token) {
            console.error('CSRF token not found.');
            setIsStarting(false);
            return;
        }

        const form = window.document.createElement('form');
        form.method = 'GET';
        form.action = route('kyc.start');
        form.style.display = 'none';

        const csrfInput = window.document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = token;
        form.appendChild(csrfInput);

        const batchInput = window.document.createElement('input');
        batchInput.type = 'hidden';
        batchInput.name = 'batch_uuid';
        batchInput.value = batchUuid;
        form.appendChild(batchInput);

        window.document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-8 py-10">
                <div className="flex flex-col space-y-12">
                    <Stepper steps={steps} currentStep={1} />

                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={route('product.details.index')}
                            className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] hover:text-[#5A4638]"
                        >
                            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
                            Back
                        </Link>

                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Secure Identity Check</h2>

                        <p className="mt-2 text-base font-medium text-[#70665E]">Identity verification is required for legally binding documents.</p>
                    </div>

                    <div className="mx-auto w-full max-w-lg">
                        <Card className="rounded-none">
                            <CardHeader className="text-center">
                                <CardTitle>KYC Verification</CardTitle>
                            </CardHeader>

                            <CardContent className="flex flex-col items-center gap-6">
                                <p className="text-center text-sm text-[#70665E]">To continue, please verify your identity.</p>

                                <div className="w-full rounded-none border border-[#D9D9D9] bg-[#F9F7F2] p-4 text-sm text-[#70665E]">
                                    <strong>Before you start, please have ready:</strong>
                                    <ul className="mt-2 list-inside list-disc space-y-1">
                                        <li>A valid government-issued ID (passport, national ID, or driver’s license)</li>
                                        <li>A clear selfie or live camera for facial verification</li>
                                        <li>Your date of birth and personal information</li>
                                    </ul>
                                    <p className="mt-2">Make sure your documents are clear and readable. The process will take a few minutes.</p>
                                </div>

                                <div className="flex items-center justify-center space-x-2 text-xs text-[#70665E]">
                                    <span>Powered by</span>
                                    <img src="/images/home/offers/comply-cube-logo.png" alt="ComplyCube Logo" className="h-4 object-contain" />
                                </div>

                                <Button
                                    type="button"
                                    className="h-10 w-full cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]"
                                    onClick={startVerification}
                                    disabled={isStarting || !batchUuid}
                                >
                                    {isStarting ? 'Redirecting...' : 'Start Verification'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default KYC;
