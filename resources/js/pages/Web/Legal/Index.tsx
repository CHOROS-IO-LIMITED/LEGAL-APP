import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import { router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Cookie, FileText, ShieldCheck } from 'lucide-react';

const termsItems = [
    {
        title: 'General Overview',
        content:
            'Daver & Daver provides automated legal document generation services. By using our platform, you acknowledge that the documents generated are templates and may require professional legal review depending on your jurisdiction.',
    },
    {
        title: 'User Eligibility',
        content: 'You must be at least 18 years old and legally capable of entering binding agreements to use this platform.',
    },
    {
        title: 'Services Provided',
        content: 'Daver & Daver offers AI-assisted document generation, customizable legal templates, and digital contract preparation tools.',
    },
    {
        title: 'Limitation of Liability',
        content:
            'Daver & Daver is not a law firm and does not provide legal advice. Users are responsible for ensuring generated documents comply with applicable laws.',
    },
    {
        title: 'Updates to Terms',
        content:
            'We may update these terms periodically to reflect legal or operational changes. Continued use of the platform constitutes acceptance of revised terms.',
    },
];

const privacyItems = [
    {
        title: 'Information We Collect',
        content:
            'We may collect personal information such as your name, email address, account details, uploaded documents, and usage data when you interact with the Daver & Daver platform.',
    },
    {
        title: 'How We Use Your Information',
        content:
            'Your information is used to provide our services, generate legal documents, improve the platform, communicate updates, and ensure security.',
    },
    {
        title: 'Data Sharing',
        content:
            'Daver & Daver does not sell your personal information. We may share data with trusted service providers required to operate the platform, such as payment processors or infrastructure providers.',
    },
    {
        title: 'Data Security',
        content: 'We implement technical and organizational safeguards to protect your information from unauthorized access, misuse, or disclosure.',
    },
    {
        title: 'Your Rights',
        content:
            'Depending on your jurisdiction, you may have the right to access, update, or delete your personal information. You may also request information about how your data is processed.',
    },
];

const cookiesItems = [
    {
        title: 'What Are Cookies',
        content:
            'Cookies are small text files stored on your device when you visit a website. They help improve functionality, remember preferences, and analyze site usage.',
    },
    {
        title: 'Essential Cookies',
        content:
            'Essential cookies are required for the website to function properly. These include authentication, security, and session management cookies.',
    },
    {
        title: 'Analytics Cookies',
        content:
            'Analytics cookies help us understand how visitors interact with the platform. This information allows us to improve performance and user experience.',
    },
    {
        title: 'Managing Cookie Preferences',
        content: 'You can control or delete cookies through your browser settings. Most browsers allow you to block or remove cookies at any time.',
    },
    {
        title: 'Updates to This Policy',
        content:
            'We may update this Cookie Policy periodically to reflect changes in technology or regulations. Continued use of Daver & Daver indicates acceptance of the updated policy.',
    },
];

export default function LegalCenterPage() {
    const { url } = usePage();
    // const params = new URLSearchParams(url.split('?')[1]);
    // const activeTab = params.get('tab') ?? 'terms';

    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const activeTab = params.get('tab') ?? 'terms';

    const handleTabChange = (value: string) => {
        router.get(
            route('legal'),
            { tab: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const renderAccordion = (items: typeof termsItems, type: 'single' | 'multiple' = 'single') => (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: 0.1 },
                },
            }}
        >
            <Accordion type={type} {...(type === 'single' ? { collapsible: true } : {})} className="w-full">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger className="flex cursor-pointer gap-3 text-left font-medium text-[#2E2A26] no-underline hover:no-underline">
                                <span className="flex h-6 w-6 flex-none items-center justify-center bg-[#F2EDE4] text-sm font-semibold text-[#3D2B1F]">
                                    {index + 1}
                                </span>
                                <span className="flex-1">{item.title}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">{item.content}</AccordionContent>
                        </AccordionItem>
                    </motion.div>
                ))}
            </Accordion>
        </motion.div>
    );

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
                        Legal Center.
                    </motion.h1>
                    <motion.p
                        className="text-lg text-white/90"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    >
                        Access our policies and understand how Daver & Daver protects your data and governs platform usage.
                    </motion.p>
                </div>
            </section>

            {/* Legal Tabs */}
            <section className="py-20">
                <div className="mx-auto w-full max-w-4xl px-8">
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="grid min-h-[60px] w-full grid-cols-3 rounded-none border border-[#E8E2D6] bg-white p-1 shadow-sm">
                            <TabsTrigger
                                value="terms"
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-none px-6 py-3 text-sm font-medium text-[#3D2B1F] hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white"
                            >
                                <FileText className="h-4 w-4" />
                                Terms & Conditions
                            </TabsTrigger>
                            <TabsTrigger
                                value="privacy"
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-none px-6 py-3 text-sm font-medium text-[#3D2B1F] hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Privacy Policy
                            </TabsTrigger>
                            <TabsTrigger
                                value="cookies"
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-none px-6 py-3 text-sm font-medium text-[#3D2B1F] hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white"
                            >
                                <Cookie className="h-4 w-4" />
                                Cookie Preferences
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="terms" className="mt-6">
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Terms & Conditions</CardTitle>
                                    <p className="text-sm text-[#70665E]">
                                        These terms govern the use of the Daver & Daver platform and outline the responsibilities of users when
                                        accessing our services.
                                    </p>
                                </CardHeader>
                                <CardContent>{renderAccordion(termsItems, 'single')}</CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="privacy" className="mt-6">
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Privacy Policy</CardTitle>
                                    <p className="text-sm text-[#70665E]">
                                        This Privacy Policy explains how Daver & Daver collects, uses, and protects personal information when you use
                                        our platform.
                                    </p>
                                </CardHeader>
                                <CardContent>{renderAccordion(privacyItems, 'multiple')}</CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="cookies" className="mt-6">
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Cookie Preferences</CardTitle>
                                    <p className="text-sm text-[#70665E]">
                                        This section explains how Daver & Daver uses cookies and how you can manage your preferences when browsing our
                                        platform.
                                    </p>
                                </CardHeader>
                                <CardContent>{renderAccordion(cookiesItems, 'multiple')}</CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            <Footer />
        </div>
    );
}
