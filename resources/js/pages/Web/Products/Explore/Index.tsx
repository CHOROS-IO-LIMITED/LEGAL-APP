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
];

const Explore: React.FC = () => {
    return (
        <section className="w-full bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-8">
                {/* Header */}
                <div className="mb-16 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">
                    <h2 className="flex-1 text-center font-serif text-4xl font-medium text-[#1A1614] md:text-left">
                        Explore Our <span className="text-[#3D2B1F]">Legal Documents</span>
                    </h2>
                    <div className="hidden h-12 w-px bg-[#E8E2D6] md:block" />
                    <p className="max-w-md flex-1 text-center text-lg text-[#70665E] md:text-left">
                        Ready-to-use legal templates—AI-assisted, lawyer-reviewed, and fully customizable.
                    </p>
                </div>

                {/* Product Cards */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, idx) => (
                        <Link
                            key={idx}
                            href={route('product.details', { index: idx })}
                            className="block overflow-hidden rounded-2xl bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                className="h-60 w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                            />
                            <div className="p-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-[#1A1614]">{product.title}</h3>
                                    <span className="text-lg font-bold text-[#3D2B1F]">{product.price}</span>
                                </div>
                                <p className="line-clamp-2 text-sm text-[#70665E]">{product.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-12 flex justify-center">
                    <Link
                        href={route('product.details')}
                        className="inline-block rounded-full bg-gradient-to-b from-[#FFB300] to-[#FF8C00] px-12 py-4 text-xl font-bold tracking-wider text-white shadow-[0_10px_25px_rgba(255,140,0,0.6)] transition-all duration-200 hover:scale-105"
                    >
                        PARTNERS
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Explore;
