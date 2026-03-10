import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            {/* Hero */}
            <section className="relative bg-cover bg-fixed bg-center py-32" style={{ backgroundImage: "url('/images/contact/contact-banner.webp')" }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Content */}
                <div className="relative mx-auto max-w-4xl px-8 text-center">
                    <h1 className="mb-4 font-serif text-4xl text-white md:text-5xl">Contact Us</h1>

                    <p className="text-lg text-white/90">
                        Have questions about our legal templates or AI-generated documents? Our team is here to help.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20">
                <div className="mx-auto grid max-w-6xl gap-12 px-8 md:grid-cols-2">
                    {/* Contact Info */}
                    <div className="flex h-full flex-col">
                        <div>
                            <h2 className="mb-6 font-serif text-3xl text-[#1A1614]">Get in Touch</h2>

                            <p className="mb-8 text-[#70665E]">
                                Reach out to us for questions about legal documents, partnerships, or technical support.
                            </p>

                            <div className="space-y-6 text-sm text-[#70665E]">
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-1 text-[#A68A64]" size={18} />
                                    <span>support@legaldocs.co.uk</span>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="mt-1 text-[#A68A64]" size={18} />
                                    <span>+44 20 7946 0958</span>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-1 text-[#A68A64]" size={18} />
                                    <span>71–75 Shelton Street, London WC2H 9JQ, United Kingdom</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="rounded-2xl border-[#E8E2D6] shadow-sm">
                        <CardContent className="p-8">
                            <form className="space-y-5">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <Label className="text-[#3D2B1F]">First Name</Label>
                                        <Input placeholder="John" className="mt-1 border-[#E8E2D6] focus-visible:ring-[#A68A64]" />
                                    </div>

                                    <div>
                                        <Label className="text-[#3D2B1F]">Last Name</Label>
                                        <Input placeholder="Doe" className="mt-1 border-[#E8E2D6] focus-visible:ring-[#A68A64]" />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-[#3D2B1F]">Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="john.doe@email.com"
                                        className="mt-1 border-[#E8E2D6] focus-visible:ring-[#A68A64]"
                                    />
                                </div>

                                <div>
                                    <Label className="text-[#3D2B1F]">Message</Label>
                                    <Textarea
                                        rows={4}
                                        placeholder="How can we help?"
                                        className="mt-1 border-[#E8E2D6] focus-visible:ring-[#A68A64]"
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-[#3D2B1F] hover:opacity-95">
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Map */}
            <section className="pb-20">
                <div className="mx-auto max-w-6xl px-8">
                    <div className="overflow-hidden rounded-2xl border border-[#E8E2D6] shadow-sm">
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
