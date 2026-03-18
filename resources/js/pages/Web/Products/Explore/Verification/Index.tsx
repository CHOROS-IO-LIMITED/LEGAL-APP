import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type PageProps = {
    batchUuid?: string;
    email?: string;
} & Record<string, unknown>;

const EmailVerification: React.FC = () => {
    const { props } = usePage<PageProps>();

    const batchUuid = props.batchUuid ?? '';
    const email = props.email ?? 'john.smith@gmail.com';

    const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];

    const inputs = useRef<Array<HTMLInputElement | null>>([]);

    const [countdown, setCountdown] = useState(0);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!batchUuid || isSubmitting) return;

        setError(null);
        setIsSubmitting(true);

        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (!token) {
            setIsSubmitting(false);
            setError('Unable to continue right now. Please refresh and try again.');
            return;
        }

        const form = window.document.createElement('form');
        form.method = 'POST';
        form.action = route('email.verify.continue');
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

        const codeInput = window.document.createElement('input');
        codeInput.type = 'hidden';
        codeInput.name = 'otp';
        codeInput.value = code;
        form.appendChild(codeInput);

        window.document.body.appendChild(form);
        form.submit();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (countdown > 0) return;

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
                    <div>
                        <Stepper steps={steps} currentStep={3} />
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={route('product.checkout', { batch_uuid: batchUuid })}
                            className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] transition-colors duration-200 hover:text-[#5A4638]"
                        >
                            <ArrowLeft size={18} className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                            Back
                        </Link>

                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Verify Your Email</h2>

                        <p className="mt-2 text-base font-medium text-[#70665E]">
                            Enter the 6-digit code sent to <span className="text-[#3D2B1F]">{email}</span>.
                        </p>
                    </div>

                    <div className="mx-auto w-full max-w-lg">
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>Email Verification</CardTitle>
                            </CardHeader>

                            <CardContent className="flex flex-col items-center gap-6">
                                <div className="flex justify-center gap-3">
                                    {[...Array(6)].map((_, i) => (
                                        <Input
                                            key={i}
                                            maxLength={1}
                                            value={otp[i]}
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

                                <Button
                                    onClick={handleVerify}
                                    disabled={isSubmitting || !batchUuid}
                                    className="w-full cursor-pointer bg-[#3D2B1F] text-white hover:bg-[#5A4638] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                                </Button>

                                <p className="text-sm text-[#70665E]">
                                    Didn’t receive the code?{' '}
                                    <button
                                        type="button"
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
