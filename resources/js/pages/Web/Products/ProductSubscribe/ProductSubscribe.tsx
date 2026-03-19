import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ProductSubscribe() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function validateEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email.trim()) {
            setError('Email is required.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');
        setLoading(true);

        // simulate request (replace with API call later)
        await new Promise((resolve) => setTimeout(resolve, 1200));

        setLoading(false);
        setOpen(true);
        setEmail('');
    }

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
                            Get Legal Document Tips
                        </motion.h2>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#70665E]"
                        >
                            Subscribe to receive updates about new legal templates, document tips, and platform improvements directly in your inbox.
                        </motion.p>

                        <motion.form
                            onSubmit={handleSubmit}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.5 }}
                            className="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row"
                        >
                            <div className="flex w-full flex-col">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    disabled={loading}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    className={`h-12 rounded-none border-[#E6DED2] ${error ? 'border-red-500' : ''}`}
                                />

                                {error && <p className="mt-2 text-left text-sm text-red-600">{error}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-12 cursor-pointer rounded-none bg-[#3D2B1F] px-8 text-white hover:bg-[#2F2118] disabled:opacity-70"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Subscribing...
                                    </span>
                                ) : (
                                    'Subscribe'
                                )}
                            </Button>
                        </motion.form>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mt-4 text-xs text-[#A68A64]"
                        >
                            No spam. Only helpful updates about legal templates. Unsubscribe anytime.
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-none sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Subscription Successful</DialogTitle>

                        <DialogDescription>
                            Thank you for subscribing. You will now receive updates about new legal templates and helpful document tips.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} className="cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
