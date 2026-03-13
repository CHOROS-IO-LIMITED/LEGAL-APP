import { Link, usePage } from '@inertiajs/react';
import React from 'react';

type Product = {
    id: number;
    title: string;
    slug: string;
    price: string;
    description: string | null;
    short_description: string | null;
    image_url: string | null;
    document_url: string | null;
};

type PageProps = {
    products: Product[];
};

const Explore: React.FC = () => {
    const { props } = usePage<PageProps>();
    const products = props.products ?? [];
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
                                key={product.id}
                                href={route('product.details', product.slug)}
                                className={`group block overflow-hidden bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                                    idx >= products.length - 3 ? 'pointer-events-none opacity-70 blur-[2px] grayscale' : ''
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={product.image_url || '/images/products/placeholder.webp'}
                                        alt={product.title}
                                        className="h-60 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-6">
                                    <div className="mb-3 flex items-center justify-between border-b border-[#E6DED2] pb-3">
                                        <h3 className="text-xl font-semibold text-[#1A1614]">{product.title}</h3>
                                        <span className="text-lg font-bold text-[#3D2B1F]">£{product.price}</span>
                                    </div>

                                    <p className="line-clamp-2 text-sm text-[#70665E]">
                                        {product.short_description || product.description || 'No description available.'}
                                    </p>
                                </div>
                            </Link>
                        ))}

                        <div className="absolute inset-x-0 bottom-20 z-20 flex justify-center">
                            <Link
                                href={route('product.details.index')}
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
