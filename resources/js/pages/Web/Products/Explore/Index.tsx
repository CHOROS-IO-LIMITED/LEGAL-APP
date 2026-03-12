import { Link } from '@inertiajs/react';
import React from 'react';

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
    {
        image: '../../images/products/placeholder.webp',
        title: 'Partnership Agreement',
        price: '£15.99',
        description: 'Agreement template for business partnerships and collaborations.',
    },
    {
        image: '../../images/products/placeholder.webp',
        title: 'Consulting Contract',
        price: '£13.99',
        description: 'Professional consulting contract for independent consultants.',
    },
    {
        image: '../../images/products/placeholder.webp',
        title: 'Vendor Agreement',
        price: '£10.99',
        description: 'Vendor supply agreement suitable for product or service vendors.',
    },
];

const Explore: React.FC = () => {
    return (
        <section className="bg-[#F2EDE4] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="grid items-center gap-10 md:grid-cols-2">
                    <h2 className="font-serif text-3xl text-[#2E2A26] md:text-4xl">
                        Explore Our <span className="text-[#3D2B1F]">Legal Documents</span>
                    </h2>

                    <p className="border-l border-[#E6DED2] pl-8 text-lg leading-relaxed text-[#70665E]">
                        Ready-to-use legal templates—AI-assisted, lawyer-reviewed, and fully customizable.
                    </p>
                </div>

                {/* Product Cards */}
                <div className="relative mt-16 max-h-[1000px] overflow-hidden">
                    <div className="grid gap-8 md:grid-cols-3">
                        {products.map((product, idx) => (
                            <Link
                                key={idx}
                                href={route('product.details', { index: idx })}
                                className={`group block overflow-hidden bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                                    idx >= products.length - 3 ? 'pointer-events-none opacity-70 blur-[2px] grayscale' : ''
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="h-60 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-6">
                                    <div className="mb-3 flex items-center justify-between border-b border-[#E6DED2] pb-3">
                                        <h3 className="text-xl font-semibold text-[#1A1614]">{product.title}</h3>

                                        <span className="text-lg font-bold text-[#3D2B1F]">{product.price}</span>
                                    </div>

                                    <p className="line-clamp-2 text-sm text-[#70665E]">{product.description}</p>
                                </div>
                            </Link>
                        ))}

                        <div className="absolute inset-x-0 bottom-20 z-20 flex justify-center">
                            <Link
                                href={route('product.details')}
                                className="bg-[#3D2B1F] px-8 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-[#5A4638]"
                            >
                                More Products
                            </Link>
                        </div>
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F2EDE4] to-transparent"></div>
                </div>
            </div>
        </section>
    );
};

export default Explore;
