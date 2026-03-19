import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function AboutMission() {
    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl">
                <div
                    className="relative bg-cover bg-fixed bg-center py-12"
                    style={{
                        backgroundImage: "url('/images/about/mission/about-mission.webp')",
                    }}
                >
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/20" />

                    <div className="relative z-10 grid grid-cols-1 px-6 md:grid-cols-2 md:px-12 lg:px-12">
                        {/* Mission Text */}
                        <motion.div
                            className="bg-white p-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0, x: -40 },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: { duration: 0.8, ease: 'easeOut' },
                                },
                            }}
                        >
                            <motion.h2
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                                }}
                                className="mb-6 font-serif text-3xl text-[#2E2A26] md:text-4xl"
                            >
                                Our Mission
                            </motion.h2>

                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                                }}
                                className="text-lg leading-relaxed text-[#70665E]"
                            >
                                Our mission is to make legal documentation simple, accessible, and efficient for everyone. We believe creating
                                professional legal documents should not be complicated or expensive. Through smart templates and modern technology,
                                <span className="font-semibold text-[#3D2B1F]"> Daver & Daver</span> empowers individuals and businesses to generate
                                reliable legal documents with confidence.
                            </motion.p>
                        </motion.div>

                        {/* Quote */}
                        <motion.div
                            className="relative"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0, x: 40 },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' },
                                },
                            }}
                        >
                            <div className="mt-8 max-w-xs text-right text-white drop-shadow-lg md:absolute md:right-8 md:bottom-8 md:mt-0">
                                <Quote className="mb-3 ml-auto h-8 w-8 opacity-80" />

                                <p className="text-lg leading-relaxed italic">Legal documentation should be simple and accessible to everyone.</p>

                                <p className="mt-4 text-sm font-medium">— Phiroze Daver</p>

                                <p className="text-xs opacity-80">Founder of Daver & Daver</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
