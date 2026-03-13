import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function HomeCTA() {
    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-3xl border border-[#E8E2D6] bg-white p-12 text-center shadow-sm">
                    <h2 className="font-serif text-3xl text-[#2E2A26] md:text-4xl">Create Your Legal Document in Minutes</h2>

                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#70665E]">
                        Choose a template, answer a few simple questions, and generate a professional legal document ready for signing.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link href="/products/details">
                            <Button size="lg" className="cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]">
                                Create a Document
                            </Button>
                        </Link>

                        <Link href="/about">
                            <Button
                                size="lg"
                                variant="outline"
                                className="cursor-pointer rounded-none border-[#A68A64] text-[#3D2B1F] hover:bg-[#F2EDE4]"
                            >
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
