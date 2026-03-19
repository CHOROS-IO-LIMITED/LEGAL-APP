import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React, { useEffect } from 'react';

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

    const visibleProducts = products.slice(0, 6);
    const previewCards = Array.from({ length: 9 });

    useEffect(() => {
        if (window.location.hash) {
            const el = document.querySelector(window.location.hash);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, []);

    return (
        <section id="templates" className="bg-[#F2EDE4] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="grid items-center gap-10 md:grid-cols-2"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="font-serif text-3xl text-[#2E2A26] md:text-4xl"
                    >
                        Explore Our <span className="text-[#3D2B1F]">Legal Documents</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        className="border-l border-[#E6DED2] pl-8 text-base leading-relaxed text-[#70665E]"
                    >
                        Ready-to-use legal templates—AI-assisted, lawyer-reviewed, and fully customizable.
                    </motion.p>
                </motion.div>

                {/* Product Cards */}
                <div className="relative mt-16 max-h-[1000px] overflow-hidden">
                    <motion.div
                        className="grid gap-8 md:grid-cols-3"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.15 } },
                        }}
                    >
                        {visibleProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                                }}
                                whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
                            >
                                <Link
                                    href={route('product.details', { document: product.slug })}
                                    className="group block overflow-hidden bg-white shadow-sm transition-all duration-200"
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
                            </motion.div>
                        ))}

                        {previewCards.map((_, idx) => (
                            <div
                                key={`preview-${idx}`}
                                aria-hidden="true"
                                className="pointer-events-none overflow-hidden bg-white opacity-40 shadow-sm blur-[2px] grayscale select-none"
                            >
                                <div className="overflow-hidden">
                                    <img src="/images/products/placeholder.webp" alt="" className="h-60 w-full object-cover object-center" />
                                </div>

                                <div className="p-6">
                                    <div className="mb-3 flex items-center justify-between border-b border-[#E6DED2] pb-3">
                                        <div className="h-6 w-32 rounded bg-[#E6DED2]" />
                                        <div className="h-6 w-14 rounded bg-[#E6DED2]" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-4 w-full rounded bg-[#E6DED2]" />
                                        <div className="h-4 w-5/6 rounded bg-[#E6DED2]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <div className="absolute inset-x-0 bottom-20 z-20 flex justify-center">
                        <Link
                            href={route('product.details.index')}
                            className="group flex h-12 items-center justify-center gap-2 border border-[#3D2B1F] bg-[#3D2B1F] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#2F2118]"
                        >
                            <span>More Products</span>
                            <ArrowRight size={16} className="transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F2EDE4] to-transparent"></div>
                </div>
            </div>
        </section>
    );
};

export default Explore;
