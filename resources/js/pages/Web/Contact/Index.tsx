import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import { useForm } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

const fadeIn: (delay?: number) => Variants = (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } },
});

export default function ContactPage() {
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact/submit', {
            onSuccess: () => {
                reset();
                setSuccessDialogOpen(true); // only open after successful submission
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            {/* HERO */}
            <section className="relative bg-cover bg-fixed bg-center py-32" style={{ backgroundImage: "url('/images/contact/contact-banner.webp')" }}>
                <div className="absolute inset-0 bg-black/30" />

                <div className="relative mx-auto max-w-4xl px-8 text-center">
                    <motion.h1
                        className="signature mb-4 font-serif text-4xl text-white md:text-5xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        Contact Us.
                    </motion.h1>

                    <motion.p
                        className="text-lg text-white/90"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        Have questions about our legal templates or AI-generated documents? Our team is here to help.
                    </motion.p>
                </div>
            </section>

            {/* CONTACT FORM + INFO */}
            <section className="py-20">
                <motion.div
                    className="mx-auto grid max-w-6xl gap-12 px-8 md:grid-cols-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
                >
                    {/* INFO */}
                    <motion.div variants={fadeIn()}>
                        <div className="mb-10">
                            <h2 className="mb-4 font-serif text-3xl text-[#1A1614] md:text-4xl">
                                Get in <span className="text-[#3D2B1F]">Touch</span>
                            </h2>

                            <p className="mb-8 max-w-md text-[#70665E]">
                                Reach out to us for questions about legal documents, partnerships, or technical support.
                            </p>

                            <div className="space-y-6 text-[#70665E]">
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
                            </div>
                        </div>
                    </motion.div>

                    {/* FORM */}
                    <motion.form
                        onSubmit={submit}
                        variants={fadeIn(0.1)}
                        className="space-y-6 border border-[#E8E2D6] bg-white p-10 shadow-sm transition hover:shadow-md"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <Label className="text-sm text-[#3D2B1F]">First Name</Label>
                                <Input
                                    className="mt-2 h-10 rounded-none border-[#E6DED2] focus:ring-[#3D2B1F]"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                />
                                {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
                            </div>

                            <div>
                                <Label className="text-sm text-[#3D2B1F]">Last Name</Label>
                                <Input
                                    className="mt-2 h-10 rounded-none border-[#E6DED2] focus:ring-[#3D2B1F]"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                                {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm text-[#3D2B1F]">Email</Label>
                            <Input
                                type="email"
                                className="mt-2 h-10 rounded-none border-[#E6DED2] focus:ring-[#3D2B1F]"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <Label className="text-sm text-[#3D2B1F]">Message</Label>
                            <Textarea
                                rows={4}
                                className="mt-2 rounded-none border-[#E6DED2] focus:ring-[#3D2B1F]"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                            />
                            {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                        </div>

                        <Button disabled={processing} className="h-11 w-full rounded-none bg-[#3D2B1F] text-white transition hover:bg-[#2F2118]">
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </span>
                            ) : (
                                'Send Message'
                            )}
                        </Button>
                    </motion.form>
                </motion.div>
            </section>

            {/* MAP */}
            <motion.section
                className="bg-[#F2EDE4] py-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
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
            </motion.section>

            {/* SUCCESS MODAL */}
            <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <DialogContent className="rounded-none sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Message Sent</DialogTitle>
                        <DialogDescription>Your message has been sent successfully. We’ll get back to you soon.</DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            onClick={() => setSuccessDialogOpen(false)}
                            className="cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}
