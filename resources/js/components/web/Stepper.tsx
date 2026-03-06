import { Check } from 'lucide-react';
import React from 'react';

interface StepperProps {
    steps: string[];
    currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <ol className="flex w-full items-center">
            {steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;

                const textColor = isCompleted ? 'text-[#3D2B1F]' : isActive ? 'text-[#A68A64]' : 'text-[#70665E]';

                return (
                    <li key={idx} className="relative flex w-full items-center">
                        <div className="flex w-full flex-col items-center">
                            <span
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                                    isCompleted
                                        ? 'bg-[#3D2B1F] text-white'
                                        : isActive
                                          ? 'bg-[#A68A64] text-white'
                                          : 'border-2 border-[#E8E2D6] bg-white text-[#70665E]'
                                }`}
                            >
                                {isCompleted ? <Check size={16} /> : idx + 1}
                            </span>

                            <span className={`mt-2 text-center text-xs font-medium ${textColor}`}>{step}</span>
                        </div>

                        {idx !== steps.length - 1 && (
                            <div
                                className={`absolute top-5 right-[-50%] left-[calc(50%+20px)] h-1 flex-1 transition-all duration-300 ${
                                    idx < currentStep - 1
                                        ? 'bg-[#3D2B1F]'
                                        : idx === currentStep - 1
                                          ? 'bg-gradient-to-r from-[#3D2B1F] to-[#A68A64]'
                                          : 'bg-[#E8E2D6]'
                                }`}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
};

export default Stepper;
