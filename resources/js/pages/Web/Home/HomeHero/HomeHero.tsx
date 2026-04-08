import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#FCF9F2] font-sans">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-12 px-8 py-24 md:flex-row md:gap-16">
                {/* Left Content */}
                <motion.div
                    className="flex w-full flex-col items-start text-left md:w-1/2"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.15 } },
                    }}
                >
                    {/* Kicker Badge */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F2EDE4] px-4 py-1 text-xs font-semibold tracking-widest text-[#3D2B1F] uppercase shadow-[0_0_8px_rgba(166,138,100,0.3)]"
                    >
                        <span>AI-Powered</span>
                        <span className="h-1 w-1 rounded-full bg-[#A68A64]" />
                        <span>Lawyer Reviewed</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="signature mb-6 font-serif text-5xl leading-tight font-medium text-[#1A1614] md:text-6xl"
                    >
                        Legal Documents, <br />
                        <span className="text-[#A68A64]">Done Right.</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="mb-10 max-w-xl text-sm leading-relaxed text-[#70665E] md:text-lg"
                    >
                        Answer a few simple questions. Our AI drafts your document, a licensed lawyer reviews it, and you can sign and send it all on
                        one trusted platform.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        {/* Primary Button */}
                        <Link href="/products/details">
                            <Button size="lg" className="cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]">
                                Start Your Document
                            </Button>
                        </Link>

                        {/* Secondary Button */}
                        <Link href="/products#templates">
                            <Button
                                size="lg"
                                variant="outline"
                                className="cursor-pointer rounded-none border-[#A68A64] bg-[#FCF9F2] text-[#3D2B1F] hover:bg-[#F2EDE4]"
                            >
                                View Templates
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Placeholder / Demo */}
                <motion.div
                    className="flex w-full items-center justify-center md:w-1/2"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                >
                    <div className="flex h-[400px] w-full max-w-md items-center justify-center border-2 border-dashed border-[#E8E2D6] bg-white/20 text-lg font-semibold text-[#70665E]">
                        Demo video will be placed here...
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
