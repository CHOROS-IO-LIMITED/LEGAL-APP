import { useState } from 'react';

export default function HomeOffer() {
    const offers = [
        {
            title: 'AI-Powered Legal Document Creation',
            description:
                'Generate professional legal documents using AI-assisted guidance and a growing library of structured templates designed for common agreements.',
            image: '/images/home/offers/offer-1.webp',
            badge: '/images/home/offers/google-logo.png',
        },
        {
            title: 'Secure Identity Verification',
            description: 'Integrated KYC verification confirms the identity of signing parties to improve trust and reduce fraud in agreements.',
            image: '/images/home/offers/offer-2.webp',
            badge: '/images/home/offers/comply-cube-logo.png',
        },
        {
            title: 'Secure Payments for Agreements',
            description:
                'Collect and manage payments directly within agreements, allowing transactions to be completed securely alongside signed documents.',
            image: '/images/home/offers/offer-3.webp',
            badge: '/images/home/offers/stripe-logo.png',
        },
        {
            title: 'Digital Document Signing',
            description: 'Send documents for secure digital signing and complete agreements online without printing or manual paperwork.',
            image: '/images/home/offers/offer-4.webp',
            badge: '/images/home/offers/docusign-logo.png',
        },
    ];

    const [active, setActive] = useState(0);
    const featured = offers[active];
    const others = offers.filter((_, i) => i !== active);

    return (
        <section className="bg-[#F2EDE4] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="max-w-3xl">
                    <h2 className="font-serif text-3xl text-[#1A1614] md:text-4xl">A Better Way to Create Legal Documents</h2>

                    <p className="mt-4 text-lg leading-relaxed text-[#70665E]">
                        From document generation to identity verification, signing, and payments — everything you need to complete agreements securely
                        in one platform.
                    </p>
                </div>

                {/* Layout */}
                <div className="mt-16 grid gap-8 lg:grid-cols-2">
                    {/* Featured Left */}
                    <div className="group relative overflow-hidden bg-white shadow-sm">
                        <img
                            src={featured.image}
                            alt={featured.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Powered Badge */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 px-3 py-1.5 text-xs font-medium text-[#1A1614] shadow-sm backdrop-blur">
                            <span className="text-[#70665E]">Powered by</span>
                            <img src={featured.badge} alt="provider" className="h-3 w-auto" />
                        </div>

                        {/* Text Card */}
                        <div className="absolute right-6 bottom-6 left-6 bg-white p-6 shadow-lg">
                            <h3 className="font-medium text-[#1A1614]">{featured.title}</h3>

                            <p className="mt-2 text-sm leading-relaxed text-[#70665E]">{featured.description}</p>
                        </div>
                    </div>

                    {/* Right Stack */}
                    <div className="flex flex-col gap-8">
                        {others.map((offer, index) => (
                            <button
                                key={index}
                                onClick={() => setActive(offers.indexOf(offer))}
                                className="group relative cursor-pointer overflow-hidden bg-white text-left shadow-sm"
                            >
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                <div className="absolute right-4 bottom-4 left-4 bg-white p-4 shadow-md">
                                    <h3 className="text-sm font-medium text-[#1A1614]">{offer.title}</h3>

                                    <p className="mt-1 text-xs leading-relaxed text-[#70665E]">{offer.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
