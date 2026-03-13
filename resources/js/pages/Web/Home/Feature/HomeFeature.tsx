import { Bot, FileText, Scale } from 'lucide-react';
import React from 'react';

interface FeatureItem {
    title: string;
    description: string;
    fact: string;
    image: string;
    icon: React.ElementType;
}

const features: FeatureItem[] = [
    {
        title: 'Ready-to-Use Templates',
        description: 'Professional legal document templates ready to customize for contracts, agreements, and more.',
        fact: '50+ Templates',
        image: '/images/home/features/feature-1.webp',
        icon: FileText,
    },
    {
        title: 'AI-Powered Drafting',
        description: 'Answer a few guided questions and our AI instantly generates a tailored legal document.',
        fact: 'AI Assisted',
        image: '/images/home/features/feature-2.webp',
        icon: Bot,
    },
    {
        title: 'Lawyer-Reviewed',
        description: 'Every document follows legal best practices and can be reviewed by licensed professionals.',
        fact: 'Verified Legal',
        image: '/images/home/features/feature-3.webp',
        icon: Scale,
    },
];

const HomeFeature: React.FC = () => {
    return (
        <section className="bg-[#F2EDE4] py-24">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="font-serif text-3xl text-[#1A1614] md:text-4xl">
                        Why Choose <span className="text-[#3D2B1F]">Daver & Daver</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#70665E]">
                        Create legally structured documents faster with AI assistance and lawyer-reviewed templates.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;

                        return (
                            <div key={idx} className="group bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                                {/* Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />

                                    {/* Icon */}
                                    <div className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center bg-[#F2EDE4] text-[#A68A64] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:text-[#3D2B1F]">
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    {/* Fact Badge */}
                                    <div className="absolute top-3 right-3 border border-[#E6DED2] bg-white px-3 py-1 text-xs font-medium text-[#3D2B1F] shadow-sm">
                                        {feature.fact}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="border-b border-[#E6DED2] pb-2 font-medium text-[#1A1614]">{feature.title}</h3>

                                    <p className="mt-2 text-sm leading-relaxed text-[#70665E]">{feature.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HomeFeature;
