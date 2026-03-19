import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function HomeCTA() {
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
                            Create Your Legal Document in Minutes
                        </motion.h2>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6 }}
                            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#70665E]"
                        >
                            Choose a template, answer a few simple questions, and generate a professional legal document ready for signing.
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
                                    Create a Document
                                </Button>
                            </Link>

                            <Link href="/about">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="cursor-pointer rounded-none border-[#A68A64] text-[#3D2B1F] hover:bg-[#F2EDE4]"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
