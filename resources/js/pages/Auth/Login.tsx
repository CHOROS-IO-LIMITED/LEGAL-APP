import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, useForm } from '@inertiajs/react';
import { MoveLeft } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface LoginProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Login({ flash }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const [authError, setAuthError] = useState<string | null>(null);

    const [flashMessage, setFlashMessage] = useState<{
        type: 'success' | 'error' | null;
        message: string | null;
    }>({ type: null, message: null });

    useEffect(() => {
        if (flash?.success) {
            setFlashMessage({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setFlashMessage({ type: 'error', message: flash.error });
        } else {
            setFlashMessage({ type: null, message: null });
        }
    }, [flash]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setAuthError(null);
        setFlashMessage({ type: null, message: null });

        post(route('auth.login.store'), {
            onError: (errors) => {
                if (errors.auth) setAuthError(errors.auth);
            },
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="flex min-h-screen items-center justify-center p-6" style={{ background: '#FCF9F2' }}>
                <div className="flex w-full max-w-5xl overflow-hidden rounded-none bg-white shadow-xl">
                    {/* LEFT PANEL */}
                    <div
                        className="relative hidden flex-1 flex-col p-8 text-white md:flex"
                        style={{
                            background: 'linear-gradient(to bottom, #3D2B1F, #1A1614)',
                        }}
                    >
                        <div className="mb-6">
                            <a
                                href="/"
                                className="group inline-flex items-center gap-2 rounded-none bg-white/20 px-4 py-2 font-semibold text-white transition hover:bg-white/30"
                            >
                                <span className="transition-transform duration-200 group-hover:-translate-x-1">
                                    <MoveLeft size={18} />
                                </span>
                                <span>Back to Website</span>
                            </a>
                        </div>

                        <div className="mb-15 flex flex-1 items-center justify-center">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <img
                                    src="/images/logo/icon-logo.png"
                                    alt="Daver Logo"
                                    className="h-40 w-40 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
                                />

                                <p className="max-w-sm text-base leading-relaxed">
                                    Sign in to access your legal documents, manage purchases, and securely complete your verification process.
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto text-center text-sm tracking-wide">
                            <img
                                src="/images/logo/text-logo.png"
                                alt="Daver & Daver"
                                className="inline-block h-10 w-auto object-contain align-middle drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
                            />
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex flex-1 items-center justify-center p-8" style={{ background: '#F2EDE4' }}>
                        <div className="flex w-full max-w-md flex-col overflow-hidden rounded-none bg-white shadow-xl">
                            {/* HEADER */}
                            <div className="relative flex flex-col items-center border-b p-5" style={{ borderColor: '#E8E2D6' }}>
                                <a
                                    href="/"
                                    className="absolute top-5 left-5 flex items-center gap-1 text-sm text-[#3D2B1F] hover:underline md:hidden"
                                >
                                    <MoveLeft size={18} />
                                </a>

                                <h2 className="text-center text-2xl font-bold tracking-tight" style={{ color: '#1A1614' }}>
                                    Login
                                </h2>

                                <p className="mt-1 text-center text-sm text-[#6B5E55]">Enter your credentials to continue.</p>
                            </div>

                            {/* BODY */}
                            <div className="flex flex-col gap-4 p-5">
                                {flashMessage.message && (
                                    <Alert variant={flashMessage.type === 'error' ? 'destructive' : 'default'}>
                                        <AlertDescription>{flashMessage.message}</AlertDescription>
                                    </Alert>
                                )}

                                {authError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{authError}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    {/* EMAIL */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm font-medium text-[#1A1614]">Email</label>

                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter your email"
                                            className="rounded-none border-[#E8E2D6] focus:ring-2 focus:ring-[#A68A64]"
                                        />

                                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm font-medium text-[#1A1614]">Password</label>

                                        <Input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your password"
                                            className="rounded-none border-[#E8E2D6] focus:ring-2 focus:ring-[#A68A64]"
                                        />

                                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}

                                        <div className="mt-2 flex items-center justify-between text-sm">
                                            <label className="flex items-center gap-2 text-[#1A1614]">
                                                <input type="checkbox" className="h-4 w-4 rounded-none border-[#E8E2D6] accent-[#3D2B1F]" />
                                                Remember me
                                            </label>

                                            <a href="/forgot-password" className="hover:underline" style={{ color: '#A68A64' }}>
                                                Forgot Password?
                                            </a>
                                        </div>
                                    </div>

                                    {/* LOGIN BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full cursor-pointer rounded-none bg-[#3D2B1F] py-3 font-semibold tracking-wide text-white hover:bg-[#2f2117]"
                                    >
                                        {processing ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </form>

                                {/* DIVIDER */}
                                <div className="my-3 flex items-center">
                                    <hr className="flex-1" style={{ borderColor: '#E8E2D6' }} />
                                    <span className="px-3 text-sm text-[#A68A64]">or</span>
                                    <hr className="flex-1" style={{ borderColor: '#E8E2D6' }} />
                                </div>

                                {/* GOOGLE LOGIN */}
                                <Button
                                    type="button"
                                    onClick={() => (window.location.href = route('auth.google'))}
                                    variant="outline"
                                    className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-none border-[#E8E2D6] py-3 hover:bg-[#F2EDE4]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                                        <path
                                            fill="#EA4335"
                                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                        />
                                        <path
                                            fill="#4285F4"
                                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                        />
                                    </svg>
                                    Sign in with Google
                                </Button>
                            </div>

                            {/* FOOTER */}
                            <div className="border-t p-5 text-center" style={{ borderColor: '#E8E2D6' }}>
                                <p className="text-sm text-[#6B5E55]">
                                    Don't have an account?{' '}
                                    <a href={route('auth.register')} className="hover:underline" style={{ color: '#A68A64' }}>
                                        Register
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
