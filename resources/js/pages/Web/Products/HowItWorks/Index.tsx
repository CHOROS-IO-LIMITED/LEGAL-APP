import { ArrowRight, Bot, CheckCircle, CreditCard, FileText, Scale } from 'lucide-react';
import React from 'react';

interface StepItem {
    title: string;
    icon: React.ReactNode;
}

const steps: StepItem[] = [
    { title: 'Choose a Template', icon: <FileText size={28} /> },
    { title: 'Answer Simple Questions', icon: <Bot size={28} /> },
    { title: 'AI Drafts Your Document', icon: <Scale size={28} /> },
    { title: 'Lawyer Review', icon: <CheckCircle size={28} /> },
    { title: 'Sign & Download', icon: <CreditCard size={28} /> },
];

const HowItWorks: React.FC = () => {
    return (
        <section className="w-full bg-[#F2EDE4] py-24">
            <h2 className="mb-16 text-center font-serif text-4xl font-medium text-[#1A1614] md:text-4xl">How It Works</h2>

            <div className="flex flex-wrap items-center justify-center gap-10">
                {steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                        {/* Icon Circle */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#E8E2D6] bg-white text-[#A68A64] shadow-sm">
                                {step.icon}
                            </div>

                            <h3 className="text-sm font-medium text-[#1A1614]">{step.title}</h3>
                        </div>

                        {/* Arrow (not after last step) */}
                        {idx !== steps.length - 1 && <ArrowRight className="hidden text-[#3D2B1F] md:block" size={28} />}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
