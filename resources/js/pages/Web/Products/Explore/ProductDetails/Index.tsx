import Header from '@/components/web/Header';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
    const [selectedIdx, setSelectedIdx] = useState(initialIndex);

    useEffect(() => {
        setSelectedIdx(initialIndex);
    }, [initialIndex]);

    const product = products[selectedIdx];

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto max-w-6xl px-8 py-20">
                <div className="mb-12 text-center md:text-left">
                    <Link
                        href={route('products')}
                        className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] transition-colors duration-200 hover:text-[#5A4638]"
                    >
                        <ArrowLeft size={18} className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                        Back
                    </Link>

                    <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Choose Your Document</h2>
                </div>

                <div className="grid gap-12 md:grid-cols-2">
                    {/* LEFT SIDE */}
                    <div className="space-y-4">
                        {products.map((p, idx) => (
                            <label
                                key={idx}
                                onClick={() => setSelectedIdx(idx)}
                                className={`flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4 transition-all duration-200 ${
                                    idx === selectedIdx ? 'border-[#3D2B1F] ring-2 ring-[#A68A64]' : 'border-[#E8E2D6]'
                                } hover:-translate-y-1 hover:shadow-md`}
                            >
                                <span className="font-medium text-[#1A1614]">{p.title}</span>
                                <input
                                    type="radio"
                                    name="product"
                                    checked={idx === selectedIdx}
                                    readOnly
                                    className="h-4 w-4 cursor-pointer rounded-full accent-[#3D2B1F]"
                                />
                            </label>
                        ))}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex justify-center">
                        <div key={selectedIdx} className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-sm">
                            <img src={product.image} alt={product.title} className="h-60 w-full object-cover" />
                            <div className="p-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-[#1A1614]">{product.title}</h3>
                                    <span className="text-lg font-bold text-[#3D2B1F]">{product.price}</span>
                                </div>
                                <p className="mb-6 line-clamp-2 text-sm text-[#70665E]">{product.description}</p>
                                <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#3D2B1F] px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#5A4638]">
                                    Checkout
                                    <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetails;
