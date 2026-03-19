import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { useForm } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type FormValue = string | number | boolean | null | File | Date | FormValue[] | { [key: string]: FormValue };

type FormData = {
    answers: Record<string, FormValue>;
};

type Question = {
    key: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    help_text?: string;
    follow_ups?: any[];
};

type UserDocument = {
    id: number;
    answers_json: Record<string, unknown> | null;
    question_schema_json: {
        document_type: string;
        questions: Question[];
    } | null;
    document: {
        title: string | null;
        description: string | null;
    };
};

type Props = {
    userDocument: UserDocument | null;
};

const steps = ['Products', 'KYC', 'Checkout', 'Verification', 'Q&A'];

export default function QuestionAndAnswer({ userDocument }: Props) {
    if (!userDocument) {
        return <div className="p-10 text-center text-gray-500">User document not found.</div>;
    }

    const schema = userDocument.question_schema_json;
    if (!schema) return <div>No schema</div>;

    const { put, processing, setData } = useForm<FormData>({
        answers: (userDocument.answers_json as Record<string, FormValue>) || {},
    });

    const [answers, setAnswers] = useState<Record<string, FormValue>>((userDocument.answers_json as Record<string, FormValue>) ?? {});
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [currentValue, setCurrentValue] = useState<FormValue>('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    const getNextQuestion = (questions: Question[], answers: any): Question | null => {
        for (const q of questions) {
            const val = answers[q.key];
            if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
                return q;
            }

            if (q.follow_ups) {
                for (const f of q.follow_ups) {
                    const actual = answers[f.when.field];
                    const matchEquals = f.when.operator === 'equals' && actual == f.when.value;
                    const matchIn = f.when.operator === 'in' && Array.isArray(actual) && actual.some((v: any) => f.when.value.includes(v));
                    if (matchEquals || matchIn) {
                        const next = getNextQuestion(f.questions, answers);
                        if (next) return next;
                    }
                }
            }
        }
        return null;
    };

    const currentQuestion = getNextQuestion(schema.questions, answers);

    useEffect(() => {
        if (!currentQuestion) return;

        const existing = answers[currentQuestion.key];

        if (existing !== undefined) {
            setCurrentValue(existing);
        } else {
            if (currentQuestion.type === 'checkbox') {
                if (currentQuestion.options?.length === 1) {
                    setCurrentValue(false);
                } else {
                    setCurrentValue([]);
                }
            } else {
                setCurrentValue('');
            }
        }

        setTimeout(() => inputRef.current?.focus(), 0);
    }, [currentQuestion]);

    const setAnswer = (key: string, value: FormValue) => {
        setAnswers((prev) => {
            const updated = { ...prev, [key]: value };
            setData('answers', updated);
            setHistory((h) => (h[h.length - 1] !== key ? [...h, key] : h));
            return updated;
        });
    };

    const isEmptyValue = (val: FormValue) => {
        if (val === null || val === '') return true;
        if (Array.isArray(val) && val.length === 0) return true;
        return false;
    };

    const handleGenerate = () => {
        setLoading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                const next = prev + Math.random() * (prev > 70 ? 2 : 5);
                return next > 90 ? 90 : next;
            });
        }, 100);

        put(route('product.qna.update', userDocument.id), {
            onSuccess: () => {
                clearInterval(interval);
                setProgress(100);
            },
            onError: (errors) => {
                console.log('ERRORS:', errors);
                clearInterval(interval);
                setLoading(false);
            },
        });
    };

    const handleNext = () => {
        if (!currentQuestion) return;

        setAnswer(currentQuestion.key, currentValue);

        const tempAnswers = { ...answers, [currentQuestion.key]: currentValue };
        const next = getNextQuestion(schema.questions, tempAnswers);

        if (!next) {
            handleGenerate();
        }
    };

    const handleBack = () => {
        setHistory((prev) => {
            if (prev.length === 0) return prev;
            const copy = [...prev];
            const lastKey = copy.pop();
            if (lastKey) {
                setAnswers((answers) => {
                    const updated = { ...answers };
                    delete updated[lastKey];
                    setData('answers', updated);
                    return updated;
                });
            }
            return copy;
        });
    };

    const normalizeInputValue = (value: FormValue) => (typeof value === 'string' || typeof value === 'number' ? value : '');
    const normalizeSelectValue = (value: FormValue) => (typeof value === 'string' || typeof value === 'number' ? value : '');
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentQuestion && currentValue !== '' && currentValue !== null && !(Array.isArray(currentValue) && currentValue.length === 0)) {
                handleNext();
            }
        }
    };

    const renderInput = (q: Question) => {
        const value = currentValue;
        switch (q.type) {
            case 'select':
                return (
                    <select
                        value={normalizeSelectValue(value)}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white p-2 outline-none focus:border-gray-300 focus:ring-0"
                    >
                        <option value="">Select...</option>
                        {q.options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt.replaceAll('_', ' ')}
                            </option>
                        ))}
                    </select>
                );

            case 'checkbox':
                if (q.options?.length === 1) {
                    return (
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={Boolean(value)} onChange={(e) => setCurrentValue(e.target.checked)} />
                            {q.options[0].replaceAll('_', ' ')}
                        </label>
                    );
                }

                const arr = (value as string[]) || [];

                return (
                    <div className="space-y-2">
                        {q.options?.map((opt) => (
                            <label key={opt} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={arr.includes(opt)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCurrentValue([...arr, opt]);
                                        } else {
                                            setCurrentValue(arr.filter((v) => v !== opt));
                                        }
                                    }}
                                />
                                {opt.replaceAll('_', ' ')}
                            </label>
                        ))}
                    </div>
                );

            case 'number':
                return (
                    <Input
                        ref={inputRef}
                        type="number"
                        value={typeof value === 'number' ? value : ''}
                        onChange={(e) => setCurrentValue(Number(e.target.value))}
                        onKeyDown={handleKeyDown}
                    />
                );

            default:
                return (
                    <Input
                        ref={inputRef}
                        type="text"
                        value={normalizeInputValue(value)}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FCF9F2] text-center font-sans">
                <div className="relative mb-8 flex items-center justify-center">
                    <div className="absolute h-24 w-24 animate-pulse rounded-full bg-[#A68A64]/20 blur-xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center">
                        <svg className="absolute h-20 w-20">
                            <circle cx="40" cy="40" r="34" stroke="#E8E2D6" strokeWidth="4" fill="none" />
                        </svg>
                        <Settings size={34} className="animate-spin text-[#3D2B1F]" />
                    </div>
                </div>
                <h2 className="text-4xl font-bold text-[#1A1614]">Building your document</h2>
                <p className="mt-2 text-[#70665E]">Submitting your answers...</p>
                <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-[#3D2B1F] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-sm text-[#70665E]">{Math.floor(progress)}%</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <section className="mx-auto max-w-4xl space-y-10 px-8 py-10">
                <Stepper steps={steps} currentStep={4} />
                <div className="text-center">
                    <h2 className="text-3xl font-bold">{userDocument.document.title}</h2>
                    <p className="mt-2 text-gray-500">{userDocument.document.description}</p>
                </div>

                {currentQuestion ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{currentQuestion.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderInput(currentQuestion)}
                            {currentQuestion.help_text && <p className="mt-2 text-sm text-gray-500">{currentQuestion.help_text}</p>}
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="py-10 text-center">All questions completed.</CardContent>
                    </Card>
                )}

                <div className="flex gap-3">
                    <Button onClick={handleBack} disabled={history.length === 0} className="w-1/3 bg-gray-200 text-black">
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={processing || !currentQuestion || isEmptyValue(currentValue)}
                        className="w-2/3 bg-[#3D2B1F] text-white"
                    >
                        Next
                    </Button>
                </div>
            </section>
        </div>
    );
}
