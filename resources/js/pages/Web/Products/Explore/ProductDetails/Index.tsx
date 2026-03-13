import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import React, { useMemo, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
};

type Product = {
    id: number;
    title: string;
    slug: string;
    price: string;
    description: string | null;
    short_description: string | null;
    image_url: string | null;
};

type PageProps = {
    auth: {
        user: User | null;
    };
    products: Product[];
    selectedProductId?: number;
} & Record<string, unknown>;

const ProductDetails: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { auth, products, selectedProductId } = props;

    const [selectedProducts, setSelectedProducts] = useState<number[]>(selectedProductId ? [selectedProductId] : []);
    const [errorProductId, setErrorProductId] = useState<number | null>(null);

    const toggleProduct = (productId: number) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts((prev) => prev.filter((id) => id !== productId));
            return;
        }

        if (selectedProducts.length >= 4) {
            setErrorProductId(productId);
            window.setTimeout(() => setErrorProductId(null), 400);
            return;
        }

        setSelectedProducts((prev) => [...prev, productId]);
    };

    const rotateLeft = () => {
        setSelectedProducts((prev) => {
            if (prev.length <= 1) return prev;
            const [first, ...rest] = prev;
            return [...rest, first];
        });
    };

    const rotateRight = () => {
        setSelectedProducts((prev) => {
            if (prev.length <= 1) return prev;
            const last = prev[prev.length - 1];
            return [last, ...prev.slice(0, -1)];
        });
    };

    const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];

    const selectedProductObjects = useMemo(() => {
        return selectedProducts.map((productId) => products.find((product) => product.id === productId)).filter(Boolean) as Product[];
    }, [selectedProducts, products]);

    const totalPrice = useMemo(() => {
        return selectedProductObjects.reduce((sum, product) => sum + Number(product.price), 0).toFixed(2);
    }, [selectedProductObjects]);

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-8 py-10">
                <div className="flex flex-col space-y-12">
                    <Stepper steps={steps} currentStep={0} />

                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={route('products')}
                            className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] hover:text-[#5A4638]"
                        >
                            <ArrowLeft size={18} className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                            Back
                        </Link>

                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Choose Your Document</h2>

                        <p className="mt-2 text-base font-medium text-[#70665E]">
                            You may select up to <span className="text-[#3D2B1F]">4 documents</span>.
                        </p>
                    </div>

                    <div className="grid gap-12 md:grid-cols-2">
                        {/* LEFT */}
                        <div className="space-y-3">
                            {products.map((product) => {
                                const checked = selectedProducts.includes(product.id);

                                return (
                                    <label
                                        key={product.id}
                                        className={`flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4 transition-all duration-200 ${
                                            errorProductId === product.id
                                                ? 'animate-shake border-red-500 ring-2 ring-red-300'
                                                : checked
                                                  ? 'border-[#3D2B1F] ring-2 ring-[#A68A64]'
                                                  : 'border-[#E8E2D6]'
                                        } hover:-translate-y-1 hover:shadow-md`}
                                    >
                                        <span className="font-medium text-[#1A1614]">{product.title}</span>

                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleProduct(product.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="h-4 w-4 cursor-pointer accent-[#3D2B1F]"
                                        />
                                    </label>
                                );
                            })}
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col items-center">
                            <div className="relative h-[400px] w-full max-w-sm">
                                {selectedProducts.length > 1 && (
                                    <>
                                        <button
                                            onClick={rotateLeft}
                                            className="absolute top-1/2 -left-12 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 shadow-md backdrop-blur hover:bg-white"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <button
                                            onClick={rotateRight}
                                            className="absolute top-1/2 -right-12 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 shadow-md backdrop-blur hover:bg-white"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {selectedProducts.length === 0 ? (
                                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[#E8E2D6] bg-white text-[#70665E]">
                                        Select documents to preview
                                    </div>
                                ) : (
                                    selectedProductObjects.map((product, stackIndex) => {
                                        const total = selectedProductObjects.length;
                                        const middle = (total - 1) / 2;

                                        const offset = stackIndex - middle;
                                        const rotateDeg = offset * 6;
                                        const translateX = offset * 28;

                                        return (
                                            <div
                                                key={product.id}
                                                className="absolute w-full max-w-sm rounded-2xl bg-white shadow-md transition-all duration-500"
                                                style={{
                                                    transform: `translateX(${translateX}px) rotate(${rotateDeg}deg)`,
                                                    zIndex: stackIndex + 1,
                                                    bottom: 0,
                                                }}
                                            >
                                                <img
                                                    src={product.image_url ?? '/images/products/placeholder.webp'}
                                                    alt={product.title}
                                                    className="h-60 w-full rounded-t-2xl object-cover"
                                                />

                                                <div className="flex flex-col p-6">
                                                    <h3 className="text-xl font-semibold text-[#1A1614]">{product.title}</h3>

                                                    <p className="mb-6 line-clamp-2 text-sm text-[#70665E]">
                                                        {product.short_description || product.description || 'No description available.'}
                                                    </p>

                                                    <div className="mb-4 flex items-center justify-between">
                                                        <span className="text-lg font-bold text-[#3D2B1F]">£{product.price}</span>

                                                        <span className="inline-flex items-center gap-1 rounded-full border border-green-600 bg-green-100/70 px-3 py-1 text-xs font-semibold text-green-600">
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

                            {/* CHECKOUT AREA */}

                            {selectedProducts.length > 0 && (
                                <>
                                    {/* LOGGED IN */}
                                    {auth.user && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="group mt-6 flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-md bg-[#3D2B1F] px-4 py-3 font-semibold text-white hover:bg-[#5A4638]">
                                                    Checkout ({selectedProducts.length})
                                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                                </button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Confirm Your Purchase</DialogTitle>
                                                    <DialogDescription>You're about to purchase the following documents.</DialogDescription>
                                                </DialogHeader>

                                                <div className="space-y-3">
                                                    {selectedProductObjects.map((product) => (
                                                        <div key={product.id} className="flex items-center justify-between rounded-md border p-3">
                                                            <span className="font-medium">{product.title}</span>
                                                            <span className="font-semibold">£{product.price}</span>
                                                        </div>
                                                    ))}

                                                    <div className="flex items-center justify-between border-t pt-3 font-semibold">
                                                        <span>Total</span>
                                                        <span>£{totalPrice}</span>
                                                    </div>

                                                    <div className="bg-muted flex items-start gap-2 rounded-md p-3 text-sm">
                                                        <ShieldCheck className="mt-0.5 h-4 w-4 text-green-600" />
                                                        <p className="text-muted-foreground">
                                                            We need to verify your identity before completing your purchase.
                                                        </p>
                                                    </div>
                                                </div>

                                                <DialogFooter>
                                                    <Link
                                                        href={route('kyc.index')}
                                                        className="rounded-md bg-[#3D2B1F] px-4 py-2 text-white hover:bg-[#5A4638]"
                                                    >
                                                        Continue to KYC
                                                    </Link>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}

                                    {/* GUEST */}
                                    {!auth.user && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="group mt-6 flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-md bg-[#3D2B1F] px-4 py-3 font-semibold text-white hover:bg-[#5A4638]">
                                                    Checkout ({selectedProducts.length})
                                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                                </button>
                                            </DialogTrigger>

                                            <DialogContent className="max-w-sm">
                                                <DialogHeader>
                                                    <DialogTitle>Login Required</DialogTitle>

                                                    <DialogDescription>You must sign in before continuing to checkout.</DialogDescription>
                                                </DialogHeader>

                                                <DialogFooter>
                                                    <Link
                                                        href={route('auth.login')}
                                                        className="w-full rounded-md bg-[#3D2B1F] px-4 py-2 text-center text-white hover:bg-[#5A4638]"
                                                    >
                                                        Sign In
                                                    </Link>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetails;
