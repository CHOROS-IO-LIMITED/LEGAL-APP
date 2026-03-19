import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: 'Are the documents legally binding?',
        answer: 'Yes. The documents generated are structured legal templates designed to produce clear agreements. However, laws may vary by jurisdiction, so you may wish to consult a qualified legal professional for specific advice.',
    },
    {
        question: 'How does identity verification work?',
        answer: 'Identity verification is performed using secure third-party technology that confirms a user’s identity through document verification and automated checks.',
    },
    {
        question: 'Can I edit the document after generating it?',
        answer: 'Yes. After generating your document, you can review and edit the content before sending it for signing.',
    },
    {
        question: 'Is digital signing legally valid?',
        answer: 'Yes. Digital signatures are widely recognized and legally valid in many jurisdictions when completed through trusted signing platforms.',
    },
    {
        question: 'How secure is my information?',
        answer: 'Your information is handled using secure infrastructure and trusted platforms to ensure your data remains protected throughout the document process.',
    },
];

export default function HomeFAQ() {
    return (
        <section className="bg-[#F2EDE4] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="font-serif text-3xl text-[#2E2A26] md:text-4xl"
                    >
                        Frequently Asked Questions
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="mt-4 text-base leading-relaxed text-[#70665E]"
                    >
                        Find answers to common questions about creating, verifying, and signing documents on our platform.
                    </motion.p>
                </div>

                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                            >
                                <AccordionItem
                                    value={`faq-${i}`}
                                    className="border border-[#E8E2D6] bg-white px-6 transition-all duration-300 hover:shadow-sm"
                                >
                                    <AccordionTrigger className="text-md cursor-pointer text-left font-medium text-[#2E2A26] no-underline hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-7 w-7 items-center justify-center bg-[#F2EDE4]">
                                                <HelpCircle className="h-4 w-4 text-[#3D2B1F]" />
                                            </span>

                                            {faq.question}
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="leading-relaxed text-[#70665E]"
                                        >
                                            {faq.answer}
                                        </motion.div>
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
