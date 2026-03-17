import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, Settings } from 'lucide-react';
import React, { useState } from 'react';

const QuestionAndAnswer: React.FC = () => {
    const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const statusMessages = [
        { limit: 20, text: 'Analyzing your answers...' },
        { limit: 40, text: 'Drafting clauses...' },
        { limit: 60, text: 'Applying legal requirements...' },
        { limit: 80, text: 'Validating agreement structure...' },
        { limit: 99, text: 'Preparing final document...' },
        { limit: 100, text: 'Finalizing your document...' },
    ];

    const getStatusMessage = (progress: number) => {
        return statusMessages.find((s) => progress <= s.limit)?.text;
    };

    const handleGenerate = () => {
        setLoading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;

                const next = prev + Math.random() * (prev > 70 ? 2 : 5);
                return next > 90 ? 90 : next;
            });
        }, 100);

        setTimeout(() => {
            clearInterval(interval);

            setProgress(100);

            setTimeout(() => {
                router.visit(route('user.dashboard'));
            }, 600);
        }, 4000);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FCF9F2] text-center font-sans">
                <div className="relative mb-8 flex items-center justify-center">
                    <div className="absolute h-24 w-24 animate-pulse rounded-full bg-[#A68A64]/20 blur-xl" />

                    <div className="relative flex h-20 w-20 items-center justify-center">
                        {/* background ring */}
                        <svg className="absolute h-20 w-20">
                            <circle cx="40" cy="40" r="34" stroke="#E8E2D6" strokeWidth="4" fill="none" />
                        </svg>

                        {/* animated loader */}
                        <svg className="absolute h-20 w-20 animate-spin">
                            <defs>
                                <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3D2B1F" />
                                    <stop offset="50%" stopColor="#6E5A46" />
                                    <stop offset="100%" stopColor="#A68A64" />
                                </linearGradient>
                            </defs>

                            <circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="none"
                                stroke="url(#loaderGradient)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                style={{
                                    animation: 'loaderDash 1.6s ease-in-out infinite',
                                }}
                            />
                        </svg>

                        <Settings size={34} className="animate-[spin_3s_linear_infinite] text-[#3D2B1F]" />
                    </div>
                </div>

                <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Building your document</h2>

                <p className="mt-2 text-[#70665E]">{getStatusMessage(progress)}</p>

                {/* Progress */}
                <div className="mt-6 flex items-center gap-3">
                    <div className="relative h-1.5 w-64 overflow-hidden rounded-full bg-[#E8E2D6]">
                        <div
                            className="h-full bg-gradient-to-r from-[#3D2B1F] via-[#6E5A46] to-[#A68A64] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <span className="w-10 text-left text-sm font-medium text-[#3D2B1F]">{Math.round(progress)}%</span>
                </div>

                <p className="mt-4 max-w-xs text-sm text-[#8A8077]">
                    This usually takes around <span className="font-medium">30–60 seconds</span>. Please keep this tab open while we generate your
                    document.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-8 py-10">
                <div className="flex flex-col space-y-12">
                    {/* Stepper */}
                    <Stepper steps={steps} currentStep={4} />

                    {/* Title */}
                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={route('product.details.index')}
                            className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] hover:text-[#5A4638]"
                        >
                            <ArrowLeft size={18} className="mr-2 transition group-hover:-translate-x-1" />
                            Back
                        </Link>

                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Residential Lease Q&A</h2>

                        <p className="mt-2 text-base text-[#70665E]">Please answer the following questions to generate your lease agreement.</p>
                    </div>

                    {/* Questions */}
                    <div className="mx-auto w-full max-w-lg space-y-6">
                        {/* Question 1 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <span className="font-semibold text-[#3D2B1F]">1.</span> What is the full address of the rental property?
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <Input placeholder="e.g. 123 Main St, Los Angeles, CA 90001" />
                            </CardContent>
                        </Card>

                        {/* Question 2 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <span className="font-semibold text-[#3D2B1F]">2.</span> What is the monthly rent amount?
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <Input placeholder="e.g. £1,200" />
                            </CardContent>
                        </Card>

                        {/* Question 3 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <span className="font-semibold text-[#3D2B1F]">3.</span> What is the tenancy start date?
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="relative">
                                    <Input type="date" className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0" />

                                    <Calendar size={18} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Question 4 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <span className="font-semibold text-[#3D2B1F]">4.</span> What is the tenancy duration?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input placeholder="e.g. 12 months" />
                            </CardContent>
                        </Card>

                        {/* Question 5 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <span className="font-semibold text-[#3D2B1F]">5.</span> Who is responsible for utility bills?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input placeholder="e.g. Tenant / Landlord" />
                            </CardContent>
                        </Card>

                        {/* Generate Button */}
                        <Button onClick={handleGenerate} className="group w-full cursor-pointer bg-[#3D2B1F] text-white hover:bg-[#5A4638]">
                            Generate My Document
                            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default QuestionAndAnswer;
