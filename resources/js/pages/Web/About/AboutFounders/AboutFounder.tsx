import { Quote } from 'lucide-react';

const founders = [
    {
        name: '(Name) Denver',
        role: 'Founder of LegalDocs',
        image: '/images/about/founders/founder-1.webp',
        quote: 'I started LegalDocs with the belief that creating legal documents should not be complicated or intimidating. My goal was to build a platform that helps people generate clear, reliable documents quickly.',
    },
    {
        name: '(Name) Denver',
        role: 'Co-Founder of LegalDocs',
        image: '/images/about/founders/founder-2.webp',
        quote: 'Our goal with LegalDocs was to remove the friction people often face when creating legal documents by providing structured templates and a simple workflow.',
    },
];

export default function AboutFounder() {
    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="font-serif text-3xl text-[#1A1614] md:text-4xl">Meet the Founders</h2>

                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#70665E]">
                        LegalDocs was founded with a simple idea — make legal documentation easier, clearer, and more accessible.
                    </p>
                </div>

                {founders.map((founder, index) => (
                    <div key={index} className="mb-20 grid items-center gap-12 md:grid-cols-2">
                        {/* Image */}
                        <div className={`relative w-full max-w-md ${index % 2 === 1 ? 'md:order-2 md:ml-auto' : ''}`}>
                            <img src={founder.image} alt={founder.name} className="h-full w-full object-cover" />

                            <div className="absolute top-4 left-4 bg-white px-4 py-2 text-xs font-medium text-[#1A1614] shadow-sm">
                                Not the real founder's image
                            </div>
                        </div>

                        {/* Content */}
                        <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                            <h3 className="font-serif text-2xl text-[#1A1614]">{founder.name}</h3>

                            <p className="mt-2 text-sm text-[#A68A64]">{founder.role}</p>

                            <div className="mt-6">
                                <Quote className="mb-4 h-8 w-8 text-[#D6CFC2]" />

                                <p className="text-lg leading-relaxed text-[#70665E] italic">{founder.quote}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
