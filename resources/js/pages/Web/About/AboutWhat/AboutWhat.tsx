import { motion } from 'framer-motion';
import { ClipboardList, FileText, PenLine, ShieldCheck } from 'lucide-react';

export default function AboutWhat() {
    const features = [
        {
            title: 'Choose a Template',
            description: 'Select the legal document you want to create from professionally structured templates.',
            image: '/images/about/features/feature-1.webp',
            icon: FileText,
        },
        {
            title: 'Answer Simple Questions',
            description: 'Complete a short Q&A so the system can understand the details of your agreement.',
            image: '/images/about/features/feature-2.webp',
            icon: ClipboardList,
        },
        {
            title: 'Generate & Review',
            description: 'Your document is generated based on your answers and reviewed by a lawyer.',
            image: '/images/about/features/feature-3.webp',
            icon: ShieldCheck,
        },
        {
            title: 'Sign and Send',
            description: 'Once approved, the document can be signed and securely shared with the other parties.',
            image: '/images/about/features/feature-4.webp',
            icon: PenLine,
        },
    ];

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
                        What <span className="text-[#3D2B1F]">Daver & Daver</span> Does
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        className="mt-4 text-base leading-relaxed text-[#70665E]"
                    >
                        Daver & Daver helps you create professional legal documents quickly and easily, ready to be signed by both parties.
                    </motion.p>
                </div>

                {/* Feature Cards */}
                <motion.div
                    className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        show: {
                            transition: { staggerChildren: 0.15 },
                        },
                    }}
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                                }}
                                whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
                                className="group bg-white shadow-sm"
                            >
                                <div className="relative overflow-hidden">
                                    <motion.img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="h-40 w-full object-cover"
                                        whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: 'easeOut' } }}
                                    />

                                    <motion.div
                                        className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center bg-[#F2EDE4] text-[#A68A64] shadow-sm"
                                        whileHover={{ scale: 1.15, color: '#3D2B1F', transition: { duration: 0.3 } }}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </motion.div>
                                </div>

                                <div className="p-6">
                                    <h3 className="border-b border-[#E6DED2] pb-2 font-medium text-[#1A1614]">{feature.title}</h3>

                                    <p className="mt-2 text-sm leading-relaxed text-[#70665E]">{feature.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
