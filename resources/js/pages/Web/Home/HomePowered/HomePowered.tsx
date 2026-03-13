import { useEffect, useRef, useState } from 'react';

interface Platform {
    badge: string;
    logo: string;
    description: string;
}

const platforms: Platform[] = [
    {
        badge: 'AI CAPABILITY',
        logo: '/images/home/trust/google.png',
        description: 'Advanced AI technology helps generate structured legal documents faster while maintaining clarity and professional formatting.',
    },
    {
        badge: 'PAYMENT INFRASTRUCTURE',
        logo: '/images/home/trust/stripe.png',
        description: 'Secure payment infrastructure allows businesses to purchase and manage legal documents seamlessly.',
    },
    {
        badge: 'DIGITAL SIGNING',
        logo: '/images/home/trust/docusign.png',
        description: 'Industry-leading electronic signature technology enables legally binding agreements to be signed online.',
    },
    {
        badge: 'IDENTITY VERIFICATION',
        logo: '/images/home/trust/comply-cube.png',
        description: 'KYC and identity verification technology ensures secure onboarding and regulatory compliance for every user.',
    },
];

export default function HomePowered() {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % platforms.length);
        }, 3000);
    };

    useEffect(() => {
        startAutoSlide();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handlePagerClick = (index: number) => {
        setCurrent(index);
        startAutoSlide(); // reset timer
    };

    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid overflow-hidden shadow-sm md:grid-cols-2">
                    {/* Left Content */}
                    <div className="flex items-center bg-white p-12">
                        <div>
                            <span className="mb-4 inline-block border border-[#E6DED2] bg-[#F2EDE4] px-3 py-1 text-xs font-medium tracking-wide text-[#3D2B1F]">
                                TRUSTED TECHNOLOGY
                            </span>

                            <h2 className="font-serif text-3xl text-[#2E2A26] md:text-4xl">Powered by industry-leading platforms</h2>

                            <p className="mt-4 text-lg leading-relaxed text-[#70665E]">
                                Daver & Daver integrates trusted modern platforms to ensure secure document creation, reliable identity verification,
                                and seamless digital signing for every agreement.
                            </p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div
                        className="relative min-h-[320px] bg-cover bg-fixed bg-center"
                        style={{
                            backgroundImage: "url('/images/home/trust/trust-2.webp')",
                        }}
                    >
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                            {/* Badge */}
                            <span className="border border-white/30 bg-white px-3 py-1 text-xs font-medium tracking-wide text-[#2E2A26] shadow-sm">
                                {platforms[current].badge}
                            </span>

                            {/* Logo */}
                            <div className="flex items-center justify-center p-6">
                                <img src={platforms[current].logo} alt="Platform logo" className="h-10 object-contain" />
                            </div>

                            {/* Description */}
                            <p className="max-w-xs text-sm leading-relaxed text-white drop-shadow-md">{platforms[current].description}</p>

                            {/* Pager */}
                            <div className="mt-3 flex gap-2">
                                {platforms.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePagerClick(index)}
                                        className={`h-2 cursor-pointer transition-all duration-300 ${current === index ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
