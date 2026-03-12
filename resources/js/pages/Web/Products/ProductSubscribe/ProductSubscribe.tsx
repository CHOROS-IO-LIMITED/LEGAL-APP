import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProductSubscribe() {
    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-3xl border border-[#E8E2D6] bg-white p-12 text-center shadow-sm">
                    <h2 className="font-serif text-3xl text-[#2E2A26] md:text-4xl">Get Legal Document Tips</h2>

                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#70665E]">
                        Subscribe to receive updates about new legal templates, document tips, and platform improvements directly in your inbox.
                    </p>

                    <form className="mx-auto mt-8 flex max-w-xl flex-col gap-4 sm:flex-row">
                        <Input type="email" placeholder="Enter your email" className="h-12 rounded-none border-[#E6DED2]" />

                        <Button type="submit" className="h-12 rounded-none bg-[#3D2B1F] px-8 text-white hover:bg-[#2F2118]">
                            Subscribe
                        </Button>
                    </form>

                    <p className="mt-4 text-xs text-[#A68A64]">No spam. Only helpful updates about legal templates. Unsubscribe anytime.</p>
                </div>
            </div>
        </section>
    );
}
