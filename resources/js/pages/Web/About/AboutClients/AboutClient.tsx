import { Quote } from 'lucide-react';

const testimonials = [
    {
        quote: 'LegalDocs made creating our employment agreements incredibly simple. The templates are clear and professional.',
        name: 'Sarah Mitchell',
        role: 'Small Business Owner',
    },
    {
        quote: 'I was able to generate a freelance contract in minutes. The process was straightforward and easy to follow.',
        name: 'Daniel Carter',
        role: 'Freelance Consultant',
    },
    {
        quote: 'LegalDocs helped our startup prepare key documents quickly without the usual complexity.',
        name: 'Emily Rodriguez',
        role: 'Startup Founder',
    },
    {
        quote: 'The templates are well-structured and easy to customize. It saved us valuable time.',
        name: 'James Walker',
        role: 'Operations Manager',
    },
    {
        quote: 'A clean platform that makes legal documentation far less intimidating for small teams.',
        name: 'Olivia Bennett',
        role: 'Project Manager',
    },
    {
        quote: 'Creating agreements for our business used to take hours. LegalDocs simplified the entire process.',
        name: 'Michael Thompson',
        role: 'Business Owner',
    },
];

export default function AboutClient() {
    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="grid items-center gap-10 md:grid-cols-2">
                    <h2 className="font-serif text-3xl text-[#2E2A26] md:text-4xl">What Our Clients Say</h2>

                    <p className="border-l border-[#E8E2D6] pl-8 text-lg leading-relaxed text-[#70665E]">
                        Hear from individuals and businesses who use LegalDocs to simplify the way they create legal documents.
                    </p>
                </div>

                {/* Testimonials */}
                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="flex h-[320px] flex-col bg-white p-8 shadow-sm">
                            <Quote className="mb-4 h-8 w-8 text-[#D6CFC2]" />

                            <p className="text-lg leading-relaxed text-[#70665E] italic">{testimonial.quote}</p>

                            <div className="mt-auto border-t border-[#E8E2D6] pt-6">
                                <p className="font-medium text-[#2E2A26]">{testimonial.name}</p>

                                <p className="text-sm text-[#70665E]">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
