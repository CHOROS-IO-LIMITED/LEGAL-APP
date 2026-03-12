export default function ProductHero() {
    return (
        <div className="bg-[#FCF9F2] font-sans">
            <section className="relative bg-cover bg-fixed bg-center py-24" style={{ backgroundImage: "url('/images/contact/contact-banner.webp')" }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Content */}
                <div className="relative mx-auto max-w-4xl px-8 text-center">
                    <h1 className="mb-4 font-serif text-4xl text-white md:text-5xl">Legal Document Templates</h1>

                    <p className="text-lg text-white/90">
                        Browse professionally structured legal document templates. Answer a few guided questions and generate ready-to-use agreements
                        in minutes.
                    </p>
                </div>
            </section>
        </div>
    );
}
