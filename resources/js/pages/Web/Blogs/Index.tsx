import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import { Link } from '@inertiajs/react';
import { Mail } from 'lucide-react';

export default function Index() {
    return (
        <div>
            <Header />
            <div className="flex min-h-screen items-center justify-center bg-[#FCF9F2] px-6">
                <div className="max-w-xl text-center">
                    {/* Logo */}
                    <div className="mb-5 flex justify-center">
                        <img src="/images/logo/dd-logo.png" alt="Daver & Daver" className="h-14 w-auto object-contain" />
                    </div>

                    {/* Title */}
                    <h1 className="font-serif text-4xl text-[#1A1614] md:text-5xl">Under Maintenance</h1>

                    {/* Description */}
                    <p className="mt-3 text-lg text-[#70665E]">
                        We're currently improving Daver & Daver to deliver a better experience. Our platform will be available again shortly.
                    </p>

                    {/* Spinner */}
                    <div className="mx-auto mt-8 h-10 w-10 animate-spin rounded-full border-4 border-[#E8E2D6] border-t-[#3D2B1F]" />

                    {/* Divider */}
                    <div className="mx-auto my-8 h-px w-24 bg-[#E8E2D6]" />

                    {/* Contact */}
                    <p className="text-sm text-[#70665E]">Need help or have questions?</p>

                    <div className="mt-2 flex items-center justify-center gap-2 text-[#3D2B1F]">
                        <Mail size={18} />
                        <span className="font-medium">phiroze@davercorp.com</span>
                    </div>

                    <div className="mt-8">
                        <Link
                            href={route('home')}
                            className="inline-flex items-center justify-center rounded-md bg-[#3D2B1F] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                        >
                            Go to Homepage
                        </Link>
                    </div>

                    {/* Address */}
                    <p className="mt-8 text-xs text-[#70665E]">Daver & Daver Ltd • 71–75 Shelton Street • London WC2H 9JQ • United Kingdom</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
