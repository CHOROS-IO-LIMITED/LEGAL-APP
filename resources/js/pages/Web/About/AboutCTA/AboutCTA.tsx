import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function AboutCTA() {
    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-3xl border border-[#E8E2D6] bg-white p-12 text-center shadow-sm">
                    <h2 className="font-serif text-3xl text-[#2E2A26] md:text-4xl">Start Creating Legal Documents Today</h2>

                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#70665E]">
                        Generate professional legal documents in minutes using trusted templates and a simple workflow.
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link href="/documents">
                            <Button size="lg" className="rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]">
                                Get Started
                            </Button>
                        </Link>

                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="rounded-none border-[#A68A64] text-[#3D2B1F] hover:bg-[#F2EDE4]">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
