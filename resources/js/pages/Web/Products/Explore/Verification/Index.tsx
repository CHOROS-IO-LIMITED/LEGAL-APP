import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useRef } from 'react';

const EmailVerification: React.FC = () => {
    const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];

    const inputs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return; // allow only numbers

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col justify-between px-8 py-10">
                {/* Stepper */}
                <div className="mb-10">
                    <Stepper steps={steps} currentStep={3} />
                </div>

                <div className="mb-12 flex flex-col items-center">
                    <Link
                        href={route('product.details')}
                        className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] transition-colors duration-200 hover:text-[#5A4638]"
                    >
                        <ArrowLeft size={18} className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                        Back
                    </Link>

                    <h2 className="text-center font-serif text-4xl font-bold text-[#1A1614]">Verify Your Email</h2>

                    <p className="mt-2 text-center text-base font-medium text-[#70665E]">
                        Enter the 6-digit code sent to <span className="text-[#3D2B1F]">john.smith@gmail.com</span>.
                    </p>
                </div>

                <div className="mx-auto w-full max-w-md">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle>Email Verification</CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col items-center gap-6">
                            {/* OTP Inputs */}
                            <div className="flex justify-center gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <Input
                                        key={i}
                                        maxLength={1}
                                        ref={(el) => {
                                            inputs.current[i] = el;
                                        }}
                                        onChange={(e) => handleChange(e.target.value, i)}
                                        onKeyDown={(e) => handleKeyDown(e, i)}
                                        className="h-12 w-12 text-center text-lg font-semibold"
                                    />
                                ))}
                            </div>

                            {/* Verify Button */}
                            <Button className="w-full bg-[#3D2B1F] text-white hover:bg-[#5A4638]">Verify Email</Button>

                            {/* Resend */}
                            <p className="text-sm text-[#70665E]">
                                Didn’t receive the code? <button className="font-medium text-[#3D2B1F] hover:underline">Resend</button>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default EmailVerification;
