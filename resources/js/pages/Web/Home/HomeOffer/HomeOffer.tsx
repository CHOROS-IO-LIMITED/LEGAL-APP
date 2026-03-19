import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
    const [resetTimer, setResetTimer] = useState(0);

    const featured = offers[active];
    const others = offers.filter((_, i) => i !== active);

    /* AUTO SLIDER */
    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % offers.length);
            setResetTimer((prev) => prev + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, [resetTimer]);

    function changeSlide(index: number) {
        setActive(index);
        setResetTimer((prev) => prev + 1); // reset timer
    }

    return (
        <section className="bg-[#F2EDE4] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="max-w-3xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="font-serif text-3xl text-[#1A1614] md:text-4xl"
                    >
                        A Better Way to Create Legal Documents
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        className="mt-4 text-base leading-relaxed text-[#70665E]"
                    >
                        From document generation to identity verification, signing, and payments — everything you need to complete agreements securely
                        in one platform.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                    className="mt-16 grid gap-8 lg:grid-cols-2"
                >
                    {/* Featured Left */}
                    <div className="relative overflow-hidden bg-white shadow-sm">
                        {/* IMAGE */}
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={featured.image}
                                src={featured.image}
                                alt={featured.title}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="h-full w-full object-cover"
                            />
                        </AnimatePresence>

                        {/* PAGER */}
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            {offers.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => changeSlide(i)}
                                    className={`relative h-2 overflow-hidden transition-all duration-300 ${
                                        active === i ? 'w-10 bg-white/30' : 'w-2 bg-white/60 hover:bg-white'
                                    }`}
                                >
                                    {active === i && (
                                        <motion.span
                                            key={`${active}-${resetTimer}`}
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 5, ease: 'linear' }}
                                            className="absolute top-0 left-0 h-full bg-white"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Powered Badge */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 px-3 py-1.5 text-xs font-medium text-[#1A1614] shadow-sm backdrop-blur">
                            <span className="text-[#70665E]">Powered by</span>
                            <img src={featured.badge} className="h-3 w-auto" />
                        </div>

                        {/* TEXT CARD */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={featured.title}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute right-6 bottom-6 left-6 bg-white p-6 shadow-lg"
                            >
                                <h3 className="font-medium text-[#1A1614]">{featured.title}</h3>

                                <p className="mt-2 text-sm leading-relaxed text-[#70665E]">{featured.description}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Stack */}
                    <motion.div
                        className="flex flex-col gap-8"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.12,
                                },
                            },
                        }}
                    >
                        <AnimatePresence mode="popLayout">
                            {others.map((offer) => (
                                <motion.button
                                    layout="position"
                                    key={offer.title}
                                    onClick={() => changeSlide(offers.indexOf(offer))}
                                    variants={{
                                        hidden: { opacity: 0, y: 40 },
                                        show: { opacity: 1, y: 0 },
                                    }}
                                    initial="hidden"
                                    animate="show"
                                    exit={{ opacity: 0, y: -20 }} // 👈 THIS FIXES DISAPPEAR
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
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
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
