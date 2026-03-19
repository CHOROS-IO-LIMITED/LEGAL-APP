import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const steps = [
    {
        title: 'Choose a Template',
        description:
            'Start by selecting a legal document template that fits your needs. Each template is professionally structured to help you create clear and reliable agreements without starting from scratch.',
        image: '/images/products/process/feature-1.webp',
    },
    {
        title: 'Answer Simple Questions',
        description: 'Follow a short guided questionnaire designed to collect the key details needed for your document.',
        image: '/images/products/process/feature-2.webp',
    },
    {
        title: 'Generate & Review',
        description: 'Based on your responses, LegalDocs generates a structured legal document ready for review.',
        image: '/images/products/process/feature-3.webp',
    },
    {
        title: 'Sign and Send',
        description: 'Once everything is ready, send the document for signing digitally.',
        image: '/images/products/process/feature-4.webp',
    },
];

export default function ProductProcess() {
    const [stepIndex, setStepIndex] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const step = steps[stepIndex];
    const isLast = stepIndex === steps.length - 1;

    function startAutoAdvance() {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
            setStepIndex((prev) => (prev + 1) % steps.length);
        }, 5000);
    }

    useEffect(() => {
        startAutoAdvance();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    function goToStep(index: number) {
        setStepIndex(index);
        startAutoAdvance();
    }

    function nextStep() {
        const nextIndex = (stepIndex + 1) % steps.length;
        setStepIndex(nextIndex);
        startAutoAdvance();
    }

    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <motion.div
                    className="mx-auto mb-16 max-w-3xl text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12 } },
                    }}
                >
                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                        }}
                        className="font-serif text-3xl text-[#2E2A26] md:text-4xl"
                    >
                        How It Works
                    </motion.h2>

                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                        }}
                        className="mt-4 text-base leading-relaxed text-[#70665E]"
                    >
                        Our process is designed to make creating legal documents simple and accessible, using structured templates and a guided
                        workflow.
                    </motion.p>
                </motion.div>

                {/* Slider Section */}
                <div className="relative flex min-h-[420px] items-center overflow-hidden py-12 md:min-h-[460px]">
                    {/* Image Container */}
                    <div className="absolute inset-0 overflow-hidden bg-white">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={step.image}
                                src={step.image}
                                alt={step.title}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </AnimatePresence>
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Content Grid */}
                    <div className="relative z-10 grid grid-cols-1 gap-6 px-6 md:grid-cols-2 md:px-12">
                        {/* Text Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                className="border border-[#E8E2D6] bg-white p-10 shadow-sm"
                            >
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
                                    className="mb-6 font-serif text-3xl text-[#2E2A26]"
                                >
                                    {step.title}
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease: 'easeOut' } }}
                                    className="text-lg leading-relaxed text-[#70665E]"
                                >
                                    {step.description}
                                </motion.p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Pager & Next */}
                        <div className="relative flex min-h-[260px] items-end justify-end drop-shadow-lg">
                            {/* Pager */}
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                {steps.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goToStep(i)}
                                        className={`relative h-2 cursor-pointer overflow-hidden transition-all duration-300 ${
                                            stepIndex === i ? 'w-10 bg-white/30' : 'w-2 bg-white/60 hover:bg-white'
                                        }`}
                                    >
                                        {stepIndex === i && (
                                            <motion.span
                                                key={`${stepIndex}-${Date.now()}`}
                                                initial={{ width: '0%' }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 5, ease: 'linear' }}
                                                className="absolute top-0 left-0 h-full bg-white"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Next/Repeat Button */}
                            <button
                                onClick={nextStep}
                                className="group absolute right-0 bottom-0 max-w-xs cursor-pointer text-right text-white drop-shadow-lg"
                            >
                                <p className="mb-2 text-sm tracking-wider uppercase opacity-80">{isLast ? 'Repeat' : 'Next'}</p>
                                <div className="flex items-center justify-end gap-2 text-lg font-medium transition-transform duration-300 group-hover:translate-x-1">
                                    <span>{isLast ? steps[0].title : steps[stepIndex + 1].title}</span>
                                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
