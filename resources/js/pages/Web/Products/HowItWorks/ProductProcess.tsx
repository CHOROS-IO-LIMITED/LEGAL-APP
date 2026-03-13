import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const steps = [
    {
        title: 'Choose a Template',
        description:
            'Start by selecting a legal document template that fits your needs. Each template is professionally structured to help you create clear and reliable agreements without starting from scratch.',
        image: '/images/products/process/feature-1.webp',
    },
    {
        title: 'Answer Simple Questions',
        description: 'Follow a short guided questionnaire designed to collect the key details needed for your document.',
        image: '/images/products/process/feature-2.webp',
    },
    {
        title: 'Generate & Review',
        description: 'Based on your responses, LegalDocs generates a structured legal document ready for review.',
        image: '/images/products/process/feature-3.webp',
    },
    {
        title: 'Sign and Send',
        description: 'Once everything is ready, send the document for signing digitally.',
        image: '/images/products/process/feature-4.webp',
    },
];

export default function ProductProcess() {
    const [stepIndex, setStepIndex] = useState(0);

    const step = steps[stepIndex];
    const isLast = stepIndex === steps.length - 1;

    function nextStep() {
        if (!isLast) setStepIndex(stepIndex + 1);
    }

    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <h2 className="font-serif text-3xl text-[#2E2A26] md:text-4xl">How It Works</h2>

                    <p className="mt-4 text-lg leading-relaxed text-[#70665E]">
                        Our process is designed to make creating legal documents simple and accessible, using structured templates and a guided
                        workflow.
                    </p>
                </div>

                <div
                    className="relative flex min-h-[420px] items-center bg-cover bg-fixed bg-center py-12 md:min-h-[460px]"
                    style={{ backgroundImage: `url('${step.image}')` }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 grid grid-cols-1 px-6 md:grid-cols-2 md:px-12">
                        <div className="border border-[#E8E2D6] bg-white p-10 shadow-sm">
                            <h3 className="mb-6 font-serif text-3xl text-[#2E2A26]">{step.title}</h3>

                            <p className="text-lg leading-relaxed text-[#70665E]">{step.description}</p>
                        </div>

                        <div className="relative flex min-h-[260px] items-end justify-end drop-shadow-lg">
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                {steps.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setStepIndex(i)}
                                        className={`h-2 cursor-pointer transition-all duration-300 ${
                                            stepIndex === i ? 'w-8 bg-white' : 'w-2 bg-white/60 hover:bg-white'
                                        }`}
                                    />
                                ))}
                            </div>
                            {!isLast ? (
                                <button
                                    onClick={nextStep}
                                    className="group absolute right-0 bottom-0 max-w-xs cursor-pointer text-right text-white drop-shadow-lg"
                                >
                                    <p className="mb-2 text-sm tracking-wider uppercase opacity-80">Next</p>

                                    <div className="flex items-center justify-end gap-2 text-lg font-medium transition-transform duration-300 group-hover:translate-x-1">
                                        <span>{steps[stepIndex + 1].title}</span>

                                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={() => setStepIndex(0)}
                                    className="group absolute right-0 bottom-0 max-w-xs cursor-pointer text-right text-white drop-shadow-lg"
                                >
                                    <p className="mb-2 text-sm tracking-wider uppercase opacity-80">Repeat</p>

                                    <div className="flex items-center justify-end gap-2 text-lg font-medium transition-transform duration-300 group-hover:translate-x-1">
                                        <span>Choose a Template</span>

                                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
