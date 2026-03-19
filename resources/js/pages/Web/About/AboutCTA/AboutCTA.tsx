import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function AboutCTA() {
    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mx-auto max-w-3xl border border-[#E8E2D6] bg-white p-12 text-center shadow-sm"
                >
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
                    >
                        <motion.h2
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6 }}
                            className="font-serif text-3xl text-[#2E2A26] md:text-4xl"
                        >
                            Start Creating Legal Documents Today
                        </motion.h2>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#70665E]"
                        >
                            Generate professional legal documents in minutes using trusted templates and a simple workflow.
                        </motion.p>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.5 }}
                            className="mt-8 flex flex-wrap justify-center gap-4"
                        >
                            <Link href="/products/details">
                                <Button size="lg" className="cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]">
                                    Get Started
                                </Button>
                            </Link>

                            <Link href="/contacts">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="cursor-pointer rounded-none border-[#A68A64] text-[#3D2B1F] hover:bg-[#F2EDE4]"
                                >
                                    Contact Us
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
