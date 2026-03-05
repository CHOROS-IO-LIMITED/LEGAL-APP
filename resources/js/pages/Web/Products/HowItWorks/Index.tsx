import { ArrowRight } from 'lucide-react';
import React from 'react';

interface StepItem {
    title: string;
}

const steps: StepItem[] = [
    { title: 'Choose a Template' },
    { title: 'Answer Simple Questions' },
    { title: 'AI Drafts Your Document' },
    { title: 'Lawyer Review' },
    { title: 'Sign & Download' },
];

const HowItWorks: React.FC = () => {
    return (
        <section className="mx-auto max-w-6xl px-8 py-24">
            <h2 className="mb-16 text-center font-serif text-4xl font-medium text-[#1A1614] md:text-4xl">How It Works</h2>

            <div className="flex flex-wrap items-center justify-center gap-10">
                {steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex flex-col items-center text-center">
                            {/* Number Circle */}
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#E8E2D6] bg-[#FFFFFF] text-lg font-semibold text-[#3D2B1F] shadow-sm">
                                {idx + 1}
                            </div>

                            <h3 className="text-sm font-medium text-[#1A1614]">{step.title}</h3>
                        </div>

                        {/* Arrow (not after last step) */}
                        {idx !== steps.length - 1 && <ArrowRight className="hidden text-[#A68A64] md:block" size={22} />}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
