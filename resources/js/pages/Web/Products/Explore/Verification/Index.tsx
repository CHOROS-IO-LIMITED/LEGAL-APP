import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const EmailVerification: React.FC = () => {
    const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];

    const inputs = useRef<Array<HTMLInputElement | null>>([]);

    const [countdown, setCountdown] = useState(0);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState<string | null>(null);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleVerify = () => {
        const code = otp.join('');

        if (code.length < 6) {
            setError('Please enter the complete verification code.');
            return;
        }

        if (code === '111111') {
            setError('Invalid verification code. Please try again.');
            return;
        }

        setError(null);

        console.log('OTP Verified:', code);

        router.visit(route('product.QnA'));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (countdown > 0) return;

        // later this will trigger backend resend
        console.log('Resend OTP');

        setCountdown(30);
    };

    useEffect(() => {
        if (countdown === 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-8 py-10">
                <div className="flex flex-col space-y-12">
                    {/* Stepper */}
                    <div>
                        <Stepper steps={steps} currentStep={3} />
                    </div>

                    {/* Title Block */}
                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={route('product.details')}
                            className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] transition-colors duration-200 hover:text-[#5A4638]"
                        >
                            <ArrowLeft size={18} className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                            Back
                        </Link>

                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Verify Your Email</h2>

                        <p className="mt-2 text-base font-medium text-[#70665E]">
                            Enter the 6-digit code sent to <span className="text-[#3D2B1F]">john.smith@gmail.com</span>.
                        </p>
                    </div>

                    {/* Verification Card */}
                    <div className="mx-auto w-full max-w-lg">
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
                                            className={`h-12 w-12 text-center text-lg font-semibold ${
                                                error ? 'border-red-500 focus-visible:ring-red-500' : ''
                                            }`}
                                        />
                                    ))}
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}

                                <Button onClick={handleVerify} className="w-full cursor-pointer bg-[#3D2B1F] text-white hover:bg-[#5A4638]">
                                    Verify & Continue
                                </Button>

                                <p className="text-sm text-[#70665E]">
                                    Didn’t receive the code?{' '}
                                    <button
                                        onClick={handleResend}
                                        disabled={countdown > 0}
                                        className={`font-medium ${
                                            countdown > 0 ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-[#3D2B1F] hover:underline'
                                        }`}
                                    >
                                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
                                    </button>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EmailVerification;
