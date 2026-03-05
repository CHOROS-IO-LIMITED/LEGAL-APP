import { Bot, FileText, Scale } from 'lucide-react';
import React from 'react';

interface FeatureItem {
    title: string;
    description: string;
    fact: string;
    icon: React.ReactNode;
}

const features: FeatureItem[] = [
    {
        title: 'Ready-to-Use Templates',
        description: 'Professional legal document templates ready to customize for contracts, agreements, and more.',
        fact: '50+ Templates',
        icon: <FileText size={22} />,
    },
    {
        title: 'AI-Powered Drafting',
        description: 'Answer a few guided questions and our AI instantly generates a tailored legal document.',
        fact: 'AI Assisted',
        icon: <Bot size={22} />,
    },
    {
        title: 'Lawyer-Reviewed',
        description: 'Every document follows legal best practices and can be reviewed by licensed professionals.',
        fact: 'Verified Legal',
        icon: <Scale size={22} />,
    },
];

const Feature: React.FC = () => {
    return (
        <section className="w-full bg-[#F2EDE4] py-20">
            <div className="mx-auto max-w-6xl px-8">
                <h2 className="mb-12 text-center font-serif text-4xl font-medium text-[#1A1614] md:text-4xl">Why Choose Our Legal Products</h2>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-[#E8E2D6] bg-[#FFFFFF] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#F2EDE4] text-[#A68A64]">
                                    {feature.icon}
                                </div>

                                <span className="rounded-full border border-[#E8E2D6] bg-[#F2EDE4] px-3 py-1 text-xs font-medium text-[#3D2B1F]">
                                    {feature.fact}
                                </span>
                            </div>

                            <h3 className="mb-2 text-xl font-semibold text-[#1A1614]">{feature.title}</h3>

                            <p className="text-sm text-[#70665E]">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Feature;
