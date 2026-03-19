import { AnimatePresence, motion } from 'framer-motion';
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
        description: 'Secure payment infrastructure allows businesses to easily purchase and manage legal documents seamlessly.',
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
    const [progressKey, setProgressKey] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const startAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = window.setInterval(() => {
            setCurrent((prev) => (prev + 1) % platforms.length);
            setProgressKey((prev) => prev + 1);
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
        setProgressKey((prev) => prev + 1);
        startAutoSlide();
    };

    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid overflow-hidden shadow-sm md:grid-cols-2">
                    {/* Left Content */}
                    <motion.div
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
                        className="flex items-center bg-white p-12"
                    >
                        <div>
                            <motion.span
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                transition={{ duration: 0.5 }}
                                className="mb-4 inline-block border border-[#E6DED2] bg-[#F2EDE4] px-3 py-1 text-xs font-medium tracking-wide text-[#3D2B1F]"
                            >
                                TRUSTED TECHNOLOGY
                            </motion.span>

                            <motion.h2
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="font-serif text-3xl text-[#2E2A26] md:text-4xl"
                            >
                                Powered by industry-leading platforms
                            </motion.h2>

                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                                className="mt-4 text-base leading-relaxed text-[#70665E]"
                            >
                                Daver & Daver integrates trusted modern platforms to ensure secure document creation, reliable identity verification,
                                and seamless digital signing for every agreement.
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Right Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                        className="relative min-h-[320px] bg-cover bg-fixed bg-center"
                        style={{ backgroundImage: "url('/images/home/trust/trust-2.webp')" }}
                    >
                        <div className="absolute inset-0 bg-black/10"></div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col items-center gap-4"
                                >
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
                                </motion.div>
                            </AnimatePresence>

                            {/* Pager */}
                            <div className="mt-3 flex gap-2">
                                {platforms.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePagerClick(index)}
                                        className={`relative h-2 cursor-pointer overflow-hidden transition-all duration-300 ${
                                            current === index ? 'w-8 bg-white/30' : 'w-2 bg-white/40'
                                        }`}
                                    >
                                        {current === index && (
                                            <motion.span
                                                key={progressKey}
                                                initial={{ width: '0%' }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 3, ease: 'linear' }}
                                                className="absolute top-0 left-0 h-full bg-white"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
