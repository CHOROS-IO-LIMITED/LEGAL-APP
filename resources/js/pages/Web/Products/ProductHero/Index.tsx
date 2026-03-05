import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="mx-auto max-w-6xl px-8 py-20 text-center">
            {/* Kicker Badge */}
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-[#F2EDE4] px-4 py-1 text-xs font-semibold tracking-widest text-[#3D2B1F] uppercase shadow-[0_0_8px_rgba(166,138,100,0.3)]">
                <span>Trusted</span>
                <span className="h-1 w-1 rounded-full bg-[#A68A64]" />
                <span>AI + Lawyer Approved</span>
            </div>

            {/* Hero Headline */}
            <h1 className="mb-6 font-serif text-5xl leading-tight font-medium text-[#1A1614] md:text-6xl">
                Legal Products, <br />
                <span className="text-[#A68A64]">Tailored for You.</span>
            </h1>

            {/* Hero Description */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-[#70665E] md:text-xl">
                Explore our range of ready-to-use legal documents. Each template is AI-assisted, lawyer-reviewed, and fully customizable—so you can
                create contracts, agreements, and forms in minutes.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                {/* Primary Button */}
                <button className="flex items-center gap-2 rounded-md border-2 border-[#3D2B1F] bg-[#3D2B1F] px-4 py-2 text-base font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md">
                    Browse All Products
                </button>

                {/* Secondary Button */}
                <button className="flex items-center gap-2 rounded-md border-2 border-[#E8E2D6] px-4 py-2 text-base font-semibold tracking-wide text-[#3D2B1F] transition-all duration-200 hover:bg-[#E8E2D6]/10 hover:shadow-sm">
                    Featured Templates
                </button>
            </div>

            <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-[#E8E2D6] bg-[#F2EDE4] p-8 shadow-sm">
                <p className="text-xs font-bold tracking-widest text-[#3D2B1F] uppercase opacity-60">
                    From NDAs to Employment Contracts, All Documents Are Secure, Compliant, and Ready to Use
                </p>
            </div>
        </section>
    );
};

export default Hero;
