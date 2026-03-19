import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const founder = {
    name: 'Phiroze Daver',
    role: 'Founder of Daver & Daver',
    image: '/images/about/founders/founder-1.webp',
    quote: 'I started Daver & Daver with the belief that creating legal documents should not be complicated or intimidating. My goal was to build a platform that helps people generate clear, reliable documents quickly.',
};

export default function AboutFounder() {
    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="font-serif text-3xl text-[#1A1614] md:text-4xl"
                    >
                        Meet the <span className="text-[#3D2B1F]">Founder</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#70665E]"
                    >
                        Daver & Daver was founded with a simple idea — make legal documentation easier, clearer, and more accessible.
                    </motion.p>
                </motion.div>

                {/* Founder Content */}
                <motion.div
                    className="grid items-center gap-12 md:grid-cols-2"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.15 } },
                    }}
                >
                    {/* Image */}
                    <motion.div
                        className="relative w-full max-w-md overflow-hidden border border-[#E8E2D6]"
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                        }}
                        whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
                    >
                        <img src={founder.image} alt={founder.name} className="h-full w-full object-cover" />

                        <div className="absolute top-4 left-4 bg-white px-4 py-2 text-xs font-medium text-[#1A1614] shadow-sm">
                            Not the real founder's image
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                        }}
                    >
                        <h3 className="font-serif text-2xl text-[#1A1614]">{founder.name}</h3>

                        <p className="mt-2 text-sm text-[#A68A64]">{founder.role}</p>

                        <motion.div
                            className="mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        >
                            <Quote className="mb-4 h-8 w-8 text-[#D6CFC2]" />

                            <p className="text-lg leading-relaxed text-[#70665E] italic">{founder.quote}</p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
