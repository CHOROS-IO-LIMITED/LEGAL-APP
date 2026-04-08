import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, useForm } from '@inertiajs/react';
import { MoveLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('auth.register.store'));
    };

    return (
        <>
            <Head title="Register" />

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
                                    Register
                                </h2>

                                <p className="mt-1 text-center text-sm text-[#6B5E55]">Create your account to get started.</p>
                            </div>

                            {/* BODY */}
                            <div className="flex flex-col gap-4 p-5">
                                <form onSubmit={submit} className="flex flex-col gap-4">
                                    {/* NAME */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm font-medium text-[#1A1614]">Name</label>

                                        <Input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter your name"
                                            className="rounded-none border-[#E8E2D6] focus:ring-2 focus:ring-[#A68A64]"
                                        />

                                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                    </div>

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
                                    </div>

                                    {/* CONFIRM PASSWORD */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm font-medium text-[#1A1614]">Confirm Password</label>

                                        <Input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm your password"
                                            className="rounded-none border-[#E8E2D6] focus:ring-2 focus:ring-[#A68A64]"
                                        />
                                    </div>

                                    {/* REGISTER BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full cursor-pointer rounded-none bg-[#3D2B1F] py-3 font-semibold tracking-wide text-white hover:bg-[#2f2117]"
                                    >
                                        {processing ? 'Creating Account...' : 'Register'}
                                    </Button>
                                </form>
                            </div>

                            {/* FOOTER */}
                            <div className="border-t p-5 text-center" style={{ borderColor: '#E8E2D6' }}>
                                <p className="text-sm text-[#6B5E55]">
                                    Already have an account?{' '}
                                    <a href={route('auth.login')} className="hover:underline" style={{ color: '#A68A64' }}>
                                        Sign In
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
