import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import { Dialog } from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

declare global {
    interface Window {
        grecaptcha: any;
        RECAPTCHA_SITE_KEY: string;
    }
}

export default function ContactPage() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const form = e.currentTarget as HTMLFormElement; // explicitly cast

        try {
            // Execute reCAPTCHA v3
            const token = await window.grecaptcha.execute(window.RECAPTCHA_SITE_KEY, {
                action: 'contact_form',
            });

            // Attach token to hidden input
            const tokenInput = form.querySelector<HTMLInputElement>('#recaptcha_token');
            if (tokenInput) tokenInput.value = token;

            // Send form data
            const formData = new FormData(form);
            const response = await fetch('/contact/submit', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to send message');

            setOpen(true);
            form.reset();
        } catch (err) {
            console.error(err);
            alert('There was an error sending your message.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            {/* Hero */}
            <section className="relative bg-cover bg-fixed bg-center py-32" style={{ backgroundImage: "url('/images/contact/contact-banner.webp')" }}>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative mx-auto max-w-4xl px-8 text-center">
                    <motion.h1
                        className="signature mb-4 font-serif text-4xl text-white md:text-5xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        Contact Us.
                    </motion.h1>
                    <motion.p
                        className="text-lg text-white/90"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    >
                        Have questions about our legal templates or AI-generated documents? Our team is here to help.
                    </motion.p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20">
                <motion.div
                    className="mx-auto grid max-w-6xl gap-12 px-8 md:grid-cols-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
                >
                    {/* Contact Info */}
                    <motion.div
                        className="flex h-full flex-col"
                        variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                    >
                        <div className="mb-16 text-center md:text-left">
                            <motion.h2
                                className="mb-4 font-serif text-3xl text-[#1A1614] md:text-4xl"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                Get in <span className="text-[#3D2B1F]">Touch</span>
                            </motion.h2>
                            <motion.p
                                className="md:text-md mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[#70665E] md:mx-0"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                            >
                                Reach out to us for questions about legal documents, partnerships, or technical support.
                            </motion.p>

                            <motion.div
                                className="mx-auto max-w-md space-y-6 text-sm text-[#70665E] md:mx-0 md:text-base"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-1 text-[#A68A64]" size={20} />
                                    <span>phiroze@davercorp.com</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-1 text-[#A68A64]" size={20} />
                                    <span>+44 12 3456 7890</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-1 text-[#A68A64]" size={20} />
                                    <span>71–75 Shelton Street, London WC2H 9JQ, United Kingdom</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        className="border border-[#E8E2D6] bg-white p-10"
                        variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                    >
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <Label className="text-sm text-[#3D2B1F]">First Name</Label>
                                    <Input name="first_name" placeholder="John" className="mt-2 h-10 rounded-none border-[#E6DED2]" required />
                                </div>
                                <div>
                                    <Label className="text-sm text-[#3D2B1F]">Last Name</Label>
                                    <Input name="last_name" placeholder="Doe" className="mt-2 h-10 rounded-none border-[#E6DED2]" required />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm text-[#3D2B1F]">Email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="john.doe@email.com"
                                    className="mt-2 h-10 rounded-none border-[#E6DED2]"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="text-sm text-[#3D2B1F]">Message</Label>
                                <Textarea
                                    name="message"
                                    rows={4}
                                    placeholder="How can we help?"
                                    className="mt-2 rounded-none border-[#E6DED2]"
                                    required
                                />
                            </div>

                            <input type="hidden" name="recaptcha_token" id="recaptcha_token" />

                            <Button
                                type="submit"
                                className="h-10 w-full cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Message'
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </motion.div>
            </section>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-none sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Message Sent</DialogTitle>
                        <DialogDescription>Thank you! Your message has been sent. We will get back to you shortly.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} className="cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Map */}
            <section className="bg-[#F2EDE4] py-20">
                <div className="mx-auto max-w-6xl px-8">
                    <div className="overflow-hidden border border-[#E8E2D6] shadow-sm">
                        <iframe
                            src="https://www.google.com/maps?q=71-75+Shelton+Street+London+WC2H+9JQ&output=embed"
                            width="100%"
                            height="400"
                            loading="lazy"
                            className="border-0"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
