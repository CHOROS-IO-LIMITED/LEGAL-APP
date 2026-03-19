import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        quote: 'Phiroze made creating our employment agreements incredibly simple. The templates are clear and professional.',
        name: 'Sarah Mitchell',
        role: 'Small Business Owner',
    },
    {
        quote: 'I was able to generate a freelance contract in minutes. The process was straightforward and easy to follow.',
        name: 'Daniel Carter',
        role: 'Freelance Consultant',
    },
    {
        quote: 'Mr. Daver helped our startup prepare key documents quickly without the usual complexity.',
        name: 'Emily Rodriguez',
        role: 'Startup Founder',
    },
    {
        quote: 'The templates are well-structured and easy to customize. It saved us valuable time.',
        name: 'James Walker',
        role: 'Operations Manager',
    },
    {
        quote: 'A clean platform that makes legal documentation far less intimidating for small teams.',
        name: 'Olivia Bennett',
        role: 'Project Manager',
    },
    {
        quote: 'Creating agreements for our business used to take hours. Daver & Daver simplified the entire process.',
        name: 'Michael Thompson',
        role: 'Business Owner',
    },
];

export default function AboutClient() {
    return (
        <section className="bg-[#F2EDE4] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <motion.div
                    className="grid items-center gap-10 md:grid-cols-2"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <motion.h2
                        className="font-serif text-3xl text-[#2E2A26] md:text-4xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        What Our <span className="text-[#3D2B1F]">Clients</span> Say
                    </motion.h2>

                    <motion.p
                        className="border-l border-[#E6DED2] pl-8 text-base leading-relaxed text-[#70665E]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                    >
                        Hear from individuals and businesses who use Daver & Daver to simplify the way they create legal documents.
                    </motion.p>
                </motion.div>

                {/* Testimonials */}
                <motion.div
                    className="mt-16 grid gap-8 md:grid-cols-3"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.15 } },
                    }}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="flex h-[320px] flex-col bg-white p-8 shadow-sm"
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                            }}
                            whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
                        >
                            <Quote className="mb-4 h-8 w-8 text-[#D6CFC2]" />

                            <p className="text-lg leading-relaxed text-[#70665E] italic">{testimonial.quote}</p>

                            <div className="mt-auto border-t border-[#E6DED2] pt-6">
                                <p className="font-medium text-[#2E2A26]">{testimonial.name}</p>
                                <p className="text-sm text-[#70665E]">{testimonial.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
