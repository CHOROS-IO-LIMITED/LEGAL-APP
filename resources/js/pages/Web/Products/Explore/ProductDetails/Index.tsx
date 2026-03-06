import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import React, { useState } from 'react';

interface Product {
    image: string;
    title: string;
    price: string;
    description: string;
}

const products: Product[] = [
    {
        image: '../../images/products/placeholder.webp',
        title: 'NDA Agreement',
        price: '£9.99',
        description: 'Non-Disclosure Agreement, ready to customize for your business or project.',
    },
    {
        image: '../../images/products/placeholder.webp',
        title: 'Employment Contract',
        price: '£14.99',
        description: 'Standard employment contract, fully editable and lawyer-reviewed for compliance.',
    },
    {
        image: '../../images/products/placeholder.webp',
        title: 'Service Agreement',
        price: '£12.99',
        description: 'Professional service agreement, perfect for freelancers and agencies.',
    },
    {
        image: '../../images/products/placeholder.webp',
        title: 'Residential Lease',
        price: '£19.99',
        description: 'Customizable residential lease agreement for landlords and tenants.',
    },
    {
        image: '../../images/products/placeholder.webp',
        title: 'Marketing Partner',
        price: '£11.99',
        description: 'Agreement for marketing partnerships and collaborations.',
    },
    {
        image: '../../images/products/placeholder.webp',
        title: 'Business Sale',
        price: '£24.99',
        description: 'Comprehensive business sale contract, ready to use for transactions.',
    },
];

const ProductDetails: React.FC = () => {
    const { props } = usePage();
    const initialIndex = Number(props.selectedIndex ?? 0);

    const [selectedProducts, setSelectedProducts] = useState<number[]>(props.selectedIndex !== undefined ? [initialIndex] : []);
    const [errorIdx, setErrorIdx] = useState<number | null>(null);

    const toggleProduct = (idx: number) => {
        if (selectedProducts.includes(idx)) {
            setSelectedProducts(selectedProducts.filter((i) => i !== idx));
            return;
        }

        if (selectedProducts.length >= 4) {
            setErrorIdx(idx);
            setTimeout(() => setErrorIdx(null), 400);
            return;
        }

        setSelectedProducts([...selectedProducts, idx]);
    };

    const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col justify-between px-8 py-10">
                <div className="mb-10">
                    <Stepper steps={steps} currentStep={0} />
                </div>

                <div className="mb-12 text-center md:text-left">
                    <Link
                        href={route('products')}
                        className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] transition-colors duration-200 hover:text-[#5A4638]"
                    >
                        <ArrowLeft size={18} className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                        Back
                    </Link>

                    <div>
                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Choose Your Document</h2>
                        <p className="mt-2 text-base font-medium text-[#70665E]">
                            You may select up to <span className="text-[#3D2B1F]">4 documents</span>.
                        </p>
                    </div>
                </div>

                <div className="grid gap-12 md:grid-cols-2">
                    {/* LEFT SIDE */}
                    <div className="space-y-4">
                        {products.map((p, idx) => {
                            const checked = selectedProducts.includes(idx);
                            return (
                                <label
                                    key={idx}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4 transition-all duration-200 ${
                                        errorIdx === idx
                                            ? 'animate-shake border-red-500 ring-2 ring-red-300'
                                            : checked
                                              ? 'border-[#3D2B1F] ring-2 ring-[#A68A64]'
                                              : 'border-[#E8E2D6]'
                                    } hover:-translate-y-1 hover:shadow-md`}
                                >
                                    <span className="font-medium text-[#1A1614]">{p.title}</span>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleProduct(idx)}
                                        className="h-4 w-4 cursor-pointer accent-[#3D2B1F]"
                                    />
                                </label>
                            );
                        })}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col items-center">
                        <div className="relative h-[400px] w-full max-w-sm">
                            {selectedProducts.length === 0 ? (
                                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[#E8E2D6] bg-white text-[#70665E]">
                                    Select documents to preview
                                </div>
                            ) : (
                                selectedProducts.map((idx, stackIndex) => {
                                    const product = products[idx];
                                    const total = selectedProducts.length;
                                    const middle = (total - 1) / 2;
                                    const offset = stackIndex - middle;
                                    const rotateDeg = offset * 6;
                                    const translateX = offset * 28;

                                    return (
                                        <div
                                            key={idx}
                                            className="absolute w-full max-w-sm rounded-2xl bg-white shadow-md transition-all duration-300"
                                            style={{
                                                transform: `translateX(${translateX}px) rotate(${rotateDeg}deg)`,
                                                zIndex: stackIndex + 1,
                                                bottom: 0,
                                            }}
                                        >
                                            <img src={product.image} alt={product.title} className="h-60 w-full rounded-t-2xl object-cover" />
                                            <div className="flex flex-col p-6">
                                                <h3 className="text-xl font-semibold text-[#1A1614]">{product.title}</h3>
                                                <p className="mb-6 line-clamp-2 text-sm text-[#70665E]">{product.description}</p>
                                                <div className="mb-4 flex items-center justify-between">
                                                    <span className="text-lg font-bold text-[#3D2B1F]">{product.price}</span>
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-green-600 bg-green-100/70 px-3 py-1 text-xs font-semibold text-green-600 shadow-sm">
                                                        <Check size={14} />
                                                        Lawyer Included
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {selectedProducts.length > 0 && (
                            <Link
                                href={route('product.kyc')}
                                className="group mt-6 flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-md bg-[#3D2B1F] px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#5A4638]"
                            >
                                Checkout ({selectedProducts.length})
                                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetails;
