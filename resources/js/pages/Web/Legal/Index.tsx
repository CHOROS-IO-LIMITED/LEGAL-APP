import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import { router, usePage } from '@inertiajs/react';
import { Cookie, FileText, ShieldCheck } from 'lucide-react';

export default function LegalCenterPage() {
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);
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
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            {/* Hero */}
            <section className="relative bg-cover bg-fixed bg-center py-32" style={{ backgroundImage: "url('/images/contact/contact-banner.webp')" }}>
                <div className="absolute inset-0 bg-black/30"></div>

                <div className="relative mx-auto max-w-4xl px-8 text-center">
                    <h1 className="mb-4 font-serif text-4xl text-white md:text-5xl">Legal Center</h1>

                    <p className="text-lg text-white/90">
                        Access our policies and understand how LegalDocs protects your data and governs platform usage.
                    </p>
                </div>
            </section>

            {/* Legal Tabs */}
            <section className="py-20">
                <div className="mx-auto w-full max-w-4xl px-8">
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        {/* Large Tabs */}
                        <TabsList className="grid min-h-[60px] w-full grid-cols-3 rounded-lg border border-[#E8E2D6] bg-white p-1 shadow-sm">
                            <TabsTrigger
                                value="terms"
                                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-[#3D2B1F] hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white"
                            >
                                <FileText className="h-4 w-4" />
                                Terms & Conditions
                            </TabsTrigger>

                            <TabsTrigger
                                value="privacy"
                                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-[#3D2B1F] hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Privacy Policy
                            </TabsTrigger>

                            <TabsTrigger
                                value="cookies"
                                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-[#3D2B1F] hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white"
                            >
                                <Cookie className="h-4 w-4" />
                                Cookie Preferences
                            </TabsTrigger>
                        </TabsList>

                        {/* Terms */}
                        <TabsContent value="terms" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Terms & Conditions</CardTitle>
                                    <p className="text-sm text-[#70665E]">
                                        These terms govern the use of the LegalDocs platform and outline the responsibilities of users when accessing
                                        our services.
                                    </p>
                                </CardHeader>

                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="overview">
                                            <AccordionTrigger>1. General Overview</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                LegalDocs provides automated legal document generation services. By using our platform, you
                                                acknowledge that the documents generated are templates and may require professional legal review
                                                depending on your jurisdiction.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="eligibility">
                                            <AccordionTrigger>2. User Eligibility</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                You must be at least 18 years old and legally capable of entering binding agreements to use this
                                                platform.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="services">
                                            <AccordionTrigger>3. Services Provided</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                LegalDocs offers AI-assisted document generation, customizable legal templates, and digital contract
                                                preparation tools.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="limitations">
                                            <AccordionTrigger>4. Limitation of Liability</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                LegalDocs is not a law firm and does not provide legal advice. Users are responsible for ensuring
                                                generated documents comply with applicable laws.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="updates">
                                            <AccordionTrigger>5. Updates to Terms</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                We may update these terms periodically to reflect legal or operational changes. Continued use of the
                                                platform constitutes acceptance of revised terms.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Privacy */}
                        <TabsContent value="privacy" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Privacy Policy</CardTitle>
                                    <p className="text-sm text-[#70665E]">
                                        This Privacy Policy explains how LegalDocs collects, uses, and protects personal information when you use our
                                        platform.
                                    </p>
                                </CardHeader>

                                <CardContent>
                                    <Accordion type="multiple" className="w-full">
                                        <AccordionItem value="information">
                                            <AccordionTrigger>1. Information We Collect</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                We may collect personal information such as your name, email address, account details, uploaded
                                                documents, and usage data when you interact with the LegalDocs platform.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="usage">
                                            <AccordionTrigger>2. How We Use Your Information</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                Your information is used to provide our services, generate legal documents, improve the platform,
                                                communicate updates, and ensure security.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="sharing">
                                            <AccordionTrigger>3. Data Sharing</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                LegalDocs does not sell your personal information. We may share data with trusted service providers
                                                required to operate the platform, such as payment processors or infrastructure providers.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="security">
                                            <AccordionTrigger>4. Data Security</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                We implement technical and organizational safeguards to protect your information from unauthorized
                                                access, misuse, or disclosure.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="rights">
                                            <AccordionTrigger>5. Your Rights</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                Depending on your jurisdiction, you may have the right to access, update, or delete your personal
                                                information. You may also request information about how your data is processed.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Cookies */}
                        <TabsContent value="cookies" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cookie Preferences</CardTitle>
                                    <p className="text-sm text-[#70665E]">
                                        This section explains how LegalDocs uses cookies and how you can manage your preferences when browsing our
                                        platform.
                                    </p>
                                </CardHeader>

                                <CardContent>
                                    <Accordion type="multiple" className="w-full">
                                        <AccordionItem value="what-are-cookies">
                                            <AccordionTrigger>1. What Are Cookies</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                Cookies are small text files stored on your device when you visit a website. They help improve
                                                functionality, remember preferences, and analyze site usage.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="essential">
                                            <AccordionTrigger>2. Essential Cookies</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                Essential cookies are required for the website to function properly. These include authentication,
                                                security, and session management cookies.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="analytics">
                                            <AccordionTrigger>3. Analytics Cookies</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                Analytics cookies help us understand how visitors interact with the platform. This information allows
                                                us to improve performance and user experience.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="management">
                                            <AccordionTrigger>4. Managing Cookie Preferences</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                You can control or delete cookies through your browser settings. Most browsers allow you to block or
                                                remove cookies at any time.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="updates">
                                            <AccordionTrigger>5. Updates to This Policy</AccordionTrigger>
                                            <AccordionContent className="text-sm leading-relaxed text-[#70665E]">
                                                We may update this Cookie Policy periodically to reflect changes in technology or regulations.
                                                Continued use of LegalDocs indicates acceptance of the updated policy.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            <Footer />
        </div>
    );
}
