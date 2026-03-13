import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { DragEvent, useRef, useState } from 'react';

const KYC: React.FC = () => {
    const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];
    const tabs = ['identity', 'address', 'selfie'] as const;

    const [activeTab, setActiveTab] = useState('identity');
    const [completedTabs, setCompletedTabs] = useState<string[]>([]);

    const [identityFile, setIdentityFile] = useState<File | null>(null);
    const [identityPreview, setIdentityPreview] = useState<string | null>(null);
    const [identityDragging, setIdentityDragging] = useState(false);

    const [addressFile, setAddressFile] = useState<File | null>(null);
    const [addressPreview, setAddressPreview] = useState<string | null>(null);
    const [addressLocation, setAddressLocation] = useState('');
    const [addressDragging, setAddressDragging] = useState(false);

    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

    const identityInputRef = useRef<HTMLInputElement | null>(null);
    const addressInputRef = useRef<HTMLInputElement | null>(null);
    const selfieInputRef = useRef<HTMLInputElement | null>(null);

    const handlePreview = (file: File | null, setter: (v: string | null) => void) => {
        if (!file) {
            setter(null);
            return;
        }

        if (file.type.startsWith('image')) {
            const reader = new FileReader();
            reader.onloadend = () => setter(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setter(null);
        }
    };

    const handleNext = () => {
        if (!completedTabs.includes(activeTab)) {
            setCompletedTabs([...completedTabs, activeTab]);
        }

        const currentIndex = tabs.indexOf(activeTab as any);

        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    const handlePrev = () => {
        const currentIndex = tabs.indexOf(activeTab as any);

        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const isTabEnabled = (tab: string) => {
        if (tab === 'identity') return true;

        const index = tabs.indexOf(tab as any);
        return completedTabs.includes(tabs[index - 1]);
    };

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-8 py-10">
                <div className="flex flex-col space-y-12">
                    <Stepper steps={steps} currentStep={1} />

                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={route('product.details')}
                            className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] transition-colors duration-200 hover:text-[#5A4638]"
                        >
                            <ArrowLeft size={18} className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                            Back
                        </Link>

                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Secure Identity Check</h2>

                        <p className="mt-2 text-base font-medium text-[#70665E]">
                            Required for all <span className="text-[#3D2B1F]">legally-binding</span> documents.
                        </p>
                    </div>

                    <Tabs value={activeTab} onValueChange={(tab) => isTabEnabled(tab) && setActiveTab(tab)} className="mx-auto w-full max-w-3xl">
                        <TabsList className="grid min-h-[60px] w-full grid-cols-3 rounded-lg border border-[#E8E2D6] bg-white p-1 shadow-sm">
                            <TabsTrigger
                                value="identity"
                                className="px-6 py-3 text-sm font-medium text-[#3D2B1F] hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white"
                            >
                                Proof of Identity
                            </TabsTrigger>

                            <TabsTrigger
                                value="address"
                                className={`px-6 py-3 text-sm font-medium text-[#3D2B1F] hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white ${
                                    !isTabEnabled('address') ? 'pointer-events-none opacity-50' : ''
                                }`}
                            >
                                Proof of Address
                            </TabsTrigger>

                            <TabsTrigger
                                value="selfie"
                                className={`px-6 py-3 text-sm font-medium text-[#3D2B1F] hover:bg-[#F5F3EE] data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-white ${
                                    !isTabEnabled('selfie') ? 'pointer-events-none opacity-50' : ''
                                }`}
                            >
                                Selfie Check
                            </TabsTrigger>
                        </TabsList>

                        {/* Identity */}

                        <TabsContent value="identity" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Proof of Identity</CardTitle>
                                    <CardDescription>Upload a government-issued ID.</CardDescription>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-4">
                                    <div
                                        onDrop={(e: DragEvent<HTMLDivElement>) => {
                                            e.preventDefault();
                                            setIdentityDragging(false);
                                            const file = e.dataTransfer.files[0];
                                            setIdentityFile(file);
                                            handlePreview(file, setIdentityPreview);
                                        }}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIdentityDragging(true);
                                        }}
                                        onDragLeave={() => setIdentityDragging(false)}
                                        onClick={() => identityInputRef.current?.click()}
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                                            identityDragging ? 'border-[#3D2B1F] bg-[#FCF9F2]' : 'border-[#E8E2D6] bg-white hover:bg-[#F5F3EE]'
                                        }`}
                                    >
                                        {identityPreview ? (
                                            <img src={identityPreview} className="h-40 w-auto rounded border border-[#E8E2D6] object-cover" />
                                        ) : (
                                            <>
                                                <p className="text-sm text-[#70665E]">
                                                    Drag & drop your government-issued ID here, or click to select a file.
                                                </p>
                                                <p className="text-xs text-[#A68A64]">Accepted: JPG, PNG, PDF | Max size: 10MB</p>
                                            </>
                                        )}
                                    </div>

                                    {identityFile && identityPreview && (
                                        <div className="flex justify-end">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setIdentityFile(null);
                                                    setIdentityPreview(null);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}

                                    <input
                                        ref={identityInputRef}
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setIdentityFile(file);
                                            handlePreview(file, setIdentityPreview);
                                        }}
                                        className="hidden"
                                    />

                                    <div className="flex justify-end">
                                        <Button onClick={handleNext} disabled={!identityFile} className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]">
                                            Next
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Address */}

                        <TabsContent value="address" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Proof of Address</CardTitle>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#3D2B1F]">Full Location Address:</label>

                                        <input
                                            type="text"
                                            placeholder="221B Baker Street, London NW1 6XE, UK"
                                            className="rounded border border-[#E8E2D6] bg-white px-3 py-2 text-sm shadow-sm focus:border-[#3D2B1F] focus:ring focus:ring-[#3D2B1F]/20"
                                            value={addressLocation}
                                            onChange={(e) => setAddressLocation(e.target.value)}
                                        />
                                    </div>

                                    <div
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setAddressDragging(false);
                                            const file = e.dataTransfer.files[0];
                                            setAddressFile(file);
                                            handlePreview(file, setAddressPreview);
                                        }}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setAddressDragging(true);
                                        }}
                                        onDragLeave={() => setAddressDragging(false)}
                                        onClick={() => addressInputRef.current?.click()}
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                                            addressDragging ? 'border-[#3D2B1F] bg-[#FCF9F2]' : 'border-[#E8E2D6] bg-white hover:bg-[#F5F3EE]'
                                        }`}
                                    >
                                        {addressPreview ? (
                                            <img src={addressPreview} className="h-40 w-auto rounded border border-[#E8E2D6] object-cover" />
                                        ) : (
                                            <>
                                                <p className="text-sm text-[#70665E]">
                                                    Drag & drop a recent utility bill, bank statement, or official document showing your address.
                                                </p>
                                                <p className="text-xs text-[#A68A64]">Accepted: JPG, PNG, PDF | Max size: 10MB</p>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {!addressFile || !addressLocation ? (
                                            <p className="text-xs text-red-600">Please upload a document and enter your location to continue.</p>
                                        ) : (
                                            <div />
                                        )}

                                        {addressFile && addressPreview && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setAddressFile(null);
                                                    setAddressPreview(null);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <input
                                        ref={addressInputRef}
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setAddressFile(file);
                                            handlePreview(file, setAddressPreview);
                                        }}
                                        className="hidden"
                                    />

                                    <div className="flex justify-between">
                                        <Button variant="outline" onClick={handlePrev}>
                                            Prev
                                        </Button>

                                        <Button
                                            onClick={handleNext}
                                            disabled={!addressFile || !addressLocation}
                                            className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Selfie */}

                        <TabsContent value="selfie" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Selfie Check</CardTitle>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-4">
                                    <div
                                        onClick={() => selfieInputRef.current?.click()}
                                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-[#F5F3EE]"
                                    >
                                        {selfiePreview ? (
                                            <img src={selfiePreview} className="h-40 w-auto rounded border border-[#E8E2D6] object-cover" />
                                        ) : (
                                            <>
                                                <p className="text-sm text-[#70665E]">Take a selfie or upload an image for verification.</p>
                                                <p className="text-xs text-[#A68A64]">Accepted: JPG, PNG | Max size: 10MB</p>
                                            </>
                                        )}
                                    </div>

                                    {selfieFile && selfiePreview && (
                                        <div className="flex justify-end">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setSelfieFile(null);
                                                    setSelfiePreview(null);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}

                                    <input
                                        ref={selfieInputRef}
                                        type="file"
                                        accept="image/*"
                                        capture="user"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setSelfieFile(file);
                                            handlePreview(file, setSelfiePreview);
                                        }}
                                        className="hidden"
                                    />

                                    <div className="flex justify-between">
                                        <Button variant="outline" onClick={handlePrev}>
                                            Prev
                                        </Button>

                                        <Link href={route('product.checkout')}>
                                            <Button disabled={!selfieFile} className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]">
                                                Finish
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
};

export default KYC;
