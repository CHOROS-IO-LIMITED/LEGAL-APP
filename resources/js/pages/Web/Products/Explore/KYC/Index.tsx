import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import ProofOfAddress from './ProofAddress/Index';
import ProofOfIdentity from './ProofIdentity/Index';
import SelfieCheck from './SelfieCheck/Index';

const KYC: React.FC = () => {
    const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];
    const tabs = ['identity', 'address', 'selfie'] as const;
    const [activeTab, setActiveTab] = useState('identity');
    const [completedTabs, setCompletedTabs] = useState<string[]>([]);

    const [identityFile, setIdentityFile] = useState<File | null>(null);
    const [addressFile, setAddressFile] = useState<File | null>(null);
    const [addressLocation, setAddressLocation] = useState<string>('');
    const [selfieFile, setSelfieFile] = useState<File | null>(null);

    const handleNext = () => {
        if (!completedTabs.includes(activeTab)) setCompletedTabs([...completedTabs, activeTab]);

        const currentIndex = tabs.indexOf(activeTab as (typeof tabs)[number]);
        if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
    };

    const handlePrev = () => {
        const currentIndex = tabs.indexOf(activeTab as (typeof tabs)[number]);
        if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
    };

    const isTabEnabled = (tab: string) => {
        if (tab === 'identity') return true;
        const index = tabs.indexOf(tab as (typeof tabs)[number]);
        return completedTabs.includes(tabs[index - 1]);
    };

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col justify-between px-8 py-10">
                {/* Stepper */}
                <div className="mb-10">
                    <Stepper steps={steps} currentStep={1} />
                </div>

                {/* Back link + Centered Title/Sub */}
                <div className="mb-12 flex flex-col items-center">
                    <Link
                        href={route('product.details')}
                        className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] transition-colors duration-200 hover:text-[#5A4638]"
                    >
                        <ArrowLeft size={18} className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                        Back
                    </Link>

                    <h2 className="text-center font-serif text-4xl font-bold text-[#1A1614]">Secure Identity Check</h2>

                    <p className="mt-2 text-center text-base font-medium text-[#70665E]">
                        Required for all <span className="text-[#3D2B1F]">legally-binding</span> documents.
                    </p>
                </div>

                {/* KYC Tabs */}
                <Tabs value={activeTab} onValueChange={(tab) => isTabEnabled(tab) && setActiveTab(tab)} className="mx-auto w-full max-w-3xl">
                    <TabsList className="mb-6 grid min-h-[60px] w-full grid-cols-3 rounded-lg border border-[#E8E2D6] bg-white p-1 shadow-sm">
                        <TabsTrigger
                            value="identity"
                            className="px-6 py-3 text-sm font-medium text-[#3D2B1F] transition-colors duration-200 first:rounded-l-lg last:rounded-r-lg hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white data-[state=active]:shadow"
                        >
                            Proof of Identity
                        </TabsTrigger>
                        <TabsTrigger
                            value="address"
                            className={`px-6 py-3 text-sm font-medium text-[#3D2B1F] transition-colors duration-200 hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white data-[state=active]:shadow ${
                                !isTabEnabled('address') ? 'pointer-events-none opacity-50' : ''
                            }`}
                        >
                            Proof of Address
                        </TabsTrigger>
                        <TabsTrigger
                            value="selfie"
                            className={`px-6 py-3 text-sm font-medium text-[#3D2B1F] transition-colors duration-200 first:rounded-l-lg last:rounded-r-lg hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white data-[state=active]:shadow ${
                                !isTabEnabled('selfie') ? 'pointer-events-none opacity-50' : ''
                            }`}
                        >
                            Selfie Check
                        </TabsTrigger>
                    </TabsList>

                    {/* Identity */}
                    <TabsContent value="identity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Proof of Identity</CardTitle>
                                <CardDescription>
                                    Upload a government-issued ID (passport, driver's license, or national ID) for verification.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex flex-col gap-4">
                                <ProofOfIdentity onFileChange={setIdentityFile} />
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]"
                                        onClick={handleNext}
                                        disabled={!identityFile}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Address */}
                    <TabsContent value="address">
                        <Card>
                            <CardHeader>
                                <CardTitle>Proof of Address</CardTitle>
                                <CardDescription>
                                    Upload a recent utility bill, bank statement, or official document showing your address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <ProofOfAddress onFileChange={setAddressFile} onLocationChange={setAddressLocation} />
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={handlePrev}>
                                        Prev
                                    </Button>
                                    <Button
                                        type="button"
                                        className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]"
                                        onClick={handleNext}
                                        disabled={!addressFile || !addressLocation}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Selfie */}
                    <TabsContent value="selfie">
                        <Card>
                            <CardHeader>
                                <CardTitle>Selfie Check</CardTitle>
                                <CardDescription>Take a selfie to match your uploaded ID.</CardDescription>
                            </CardHeader>

                            <CardContent className="flex flex-col gap-4">
                                <SelfieCheck onFileChange={setSelfieFile} />
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={handlePrev}>
                                        Prev
                                    </Button>
                                    <Link href={route('product.checkout')}>
                                        <Button type="button" className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]" disabled={!selfieFile}>
                                            Finish
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    );
};

export default KYC;
