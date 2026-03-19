import { motion } from 'framer-motion';

export default function ProductHero() {
    return (
        <div className="bg-[#FCF9F2] font-sans">
            <section className="relative bg-cover bg-fixed bg-center py-24" style={{ backgroundImage: "url('/images/contact/contact-banner.webp')" }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Content */}
                <div className="relative mx-auto max-w-4xl px-8 text-center">
                    {/* Headline */}
                    <motion.h1
                        className="signature mb-4 font-serif text-4xl text-white md:text-5xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        Legal Document Templates.
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        className="text-base text-white/90"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    >
                        Browse professionally structured legal document templates. Answer a few guided questions and generate ready-to-use agreements
                        in minutes.
                    </motion.p>
                </div>
            </section>
        </div>
    );
}
