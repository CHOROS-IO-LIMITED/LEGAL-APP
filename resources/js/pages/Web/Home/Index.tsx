import Header from '@/components/web/Header';

export default function Index() {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <section className="mx-auto max-w-6xl px-8 py-20 text-center">
                {/* Kicker Badge */}
                <div className="mx-auto mb-4 inline-block rounded-full bg-[#F2EDE4] px-4 py-1 text-xs font-semibold tracking-widest text-[#3D2B1F] uppercase">
                    AI-Powered & Lawyer Reviewed
                </div>

                {/* Hero Headline */}
                <h1 className="mb-6 font-serif text-5xl leading-tight font-medium text-[#1A1614] md:text-6xl">
                    Legal Documents, <br />
                    <span className="text-[#A68A64]">Done Right.</span>
                </h1>

                {/* Hero Description */}
                <p className="mx-auto mb-10 max-w-2xl text-lg text-[#70665E] md:text-xl">
                    Answer a few simple questions. Our AI drafts your document, a licensed lawyer reviews it, and you can sign and send it all on one
                    trusted platform.
                </p>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    {/* Primary Button */}
                    <button className="flex items-center gap-2 rounded-md border-2 border-[#3D2B1F] bg-[#3D2B1F] px-4 py-2 text-base font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md">
                        Start Your Document
                    </button>

                    {/* Secondary Button */}
                    <button className="flex items-center gap-2 rounded-md border-2 border-[#E8E2D6] px-4 py-2 text-base font-semibold tracking-wide text-[#3D2B1F] transition-all duration-200 hover:bg-[#E8E2D6]/10 hover:shadow-sm">
                        View Templates
                    </button>
                </div>

                <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-[#E8E2D6] bg-[#F2EDE4] p-8 shadow-sm">
                    <p className="text-xs font-bold tracking-widest text-[#3D2B1F] uppercase opacity-60">
                        Secure & Compliant with Global Legal Standards
                    </p>
                </div>
            </section>
        </div>
    );
}
