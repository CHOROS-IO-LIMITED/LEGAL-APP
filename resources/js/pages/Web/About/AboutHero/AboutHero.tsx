export default function AboutHero() {
    return (
        <div className="bg-[#FCF9F2] font-sans">
            <section className="relative bg-cover bg-fixed bg-center py-24" style={{ backgroundImage: "url('/images/contact/contact-banner.webp')" }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Content */}
                <div className="relative mx-auto max-w-4xl px-8 text-center">
                    <h1 className="mb-4 font-serif text-4xl text-white md:text-5xl">About Us</h1>

                    <p className="text-lg text-white/90">
                        LegalDocs is a modern platform built to simplify the creation of legal documents through smart templates, automation, and
                        secure digital workflows.
                    </p>
                </div>
            </section>
        </div>
    );
}
