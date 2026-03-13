import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const KYC: React.FC = () => {
    const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-8 py-10">
                <div className="flex flex-col space-y-12">
                    <Stepper steps={steps} currentStep={1} />

                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={route('product.details')}
                            className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] hover:text-[#5A4638]"
                        >
                            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
                            Back
                        </Link>

                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Secure Identity Check</h2>

                        <p className="mt-2 text-base font-medium text-[#70665E]">Identity verification is required for legally binding documents.</p>
                    </div>

                    <div className="mx-auto w-full max-w-lg">
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>KYC Verification</CardTitle>
                            </CardHeader>

                            <CardContent className="flex flex-col items-center gap-6">
                                <p className="text-center text-sm text-[#70665E]">
                                    To continue, we need to verify your identity using our secure verification partner.
                                </p>

                                <Button className="w-full bg-[#3D2B1F] text-white hover:bg-[#5A4638]">Start Verification</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default KYC;
