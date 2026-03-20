import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { useForm } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Primitive = string | number | boolean | null;
type FormValue = Primitive | File | Date | FormValue[] | { [key: string]: FormValue };

type FormData = {
    answers: Record<string, FormValue>;
};

type FollowUpCondition = {
    field: string;
    operator: 'equals' | 'not_equals' | 'truthy' | 'falsy';
    value?: string;
};

type FollowUp = {
    when: FollowUpCondition;
    questions: Question[];
};

type Question = {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'date';
    required: boolean;
    options?: string[];
    help_text?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    follow_ups?: FollowUp[];
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

    if (!schema) {
        return <div className="p-10 text-center text-gray-500">No question schema available.</div>;
    }

    const initialAnswers = useMemo(() => {
        return (userDocument.answers_json as Record<string, FormValue>) ?? {};
    }, [userDocument.answers_json]);

    const { put, processing, setData } = useForm<FormData>({
        answers: initialAnswers,
    });

    const [answers, setAnswers] = useState<Record<string, FormValue>>(initialAnswers);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [currentValue, setCurrentValue] = useState<FormValue>('');
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    const matchesCondition = (when: FollowUpCondition, allAnswers: Record<string, FormValue>) => {
        const actual = allAnswers[when.field];

        switch (when.operator) {
            case 'equals':
                return Array.isArray(actual) ? actual.includes(when.value ?? '') : String(actual ?? '') === String(when.value ?? '');

            case 'not_equals':
                return Array.isArray(actual) ? !actual.includes(when.value ?? '') : String(actual ?? '') !== String(when.value ?? '');

            case 'truthy':
                return Boolean(actual) === true;

            case 'falsy':
                return Boolean(actual) === false;

            default:
                return false;
        }
    };

    const isEmptyValue = (value: FormValue) => {
        if (value === null || value === '') return true;
        if (Array.isArray(value) && value.length === 0) return true;
        return false;
    };

    const isQuestionAnswered = (question: Question, value: FormValue) => {
        if (!question.required) {
            return true;
        }

        if (question.type === 'checkbox') {
            if ((question.options?.length ?? 0) <= 1) {
                return value === true;
            }

            return Array.isArray(value) && value.length > 0;
        }

        return !isEmptyValue(value);
    };

    const getNextQuestion = (questions: Question[], allAnswers: Record<string, FormValue>): Question | null => {
        for (const question of questions) {
            const value = allAnswers[question.key];

            if (value === undefined || !isQuestionAnswered({ ...question, required: true }, value)) {
                if (value === undefined || isEmptyValue(value)) {
                    return question;
                }

                if (question.type === 'checkbox' && question.required && question.options?.length === 1 && value !== true) {
                    return question;
                }
            }

            if (question.follow_ups?.length) {
                for (const followUp of question.follow_ups) {
                    if (matchesCondition(followUp.when, allAnswers)) {
                        const nested = getNextQuestion(followUp.questions, allAnswers);

                        if (nested) {
                            return nested;
                        }
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
            setTimeout(() => inputRef.current?.focus(), 0);
            return;
        }

        switch (currentQuestion.type) {
            case 'checkbox':
                setCurrentValue((currentQuestion.options?.length ?? 0) <= 1 ? false : []);
                break;

            case 'number':
            case 'date':
            case 'textarea':
            case 'text':
            case 'select':
            default:
                setCurrentValue('');
                break;
        }

        setTimeout(() => inputRef.current?.focus(), 0);
    }, [currentQuestion, answers]);

    const setAnswer = (key: string, value: FormValue) => {
        setAnswers((prev) => {
            const updated = { ...prev, [key]: value };
            setData('answers', updated);
            return updated;
        });

        setHistory((prev) => (prev[prev.length - 1] === key ? prev : [...prev, key]));
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
            preserveScroll: true,
            onSuccess: () => {
                clearInterval(interval);
                setProgress(100);
            },
            onError: (errors) => {
                console.error('Q&A update errors:', errors);
                clearInterval(interval);
            },
            onFinish: () => {
                clearInterval(interval);
                setLoading(false);
            },
        });
    };

    const handleNext = () => {
        if (!currentQuestion) return;
        if (!isQuestionAnswered(currentQuestion, currentValue)) return;

        const nextAnswers = {
            ...answers,
            [currentQuestion.key]: currentValue,
        };

        setAnswer(currentQuestion.key, currentValue);

        const next = getNextQuestion(schema.questions, nextAnswers);

        if (!next) {
            handleGenerate();
        }
    };

    const handleBack = () => {
        setHistory((prevHistory) => {
            if (prevHistory.length === 0) {
                return prevHistory;
            }

            const copy = [...prevHistory];
            const lastKey = copy.pop();

            if (!lastKey) {
                return prevHistory;
            }

            setAnswers((currentAnswers) => {
                const updated = { ...currentAnswers };
                delete updated[lastKey];
                setData('answers', updated);
                return updated;
            });

            return copy;
        });
    };

    const normalizeInputValue = (value: FormValue) => {
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }

        return '';
    };

    const normalizeSelectValue = (value: FormValue) => {
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }

        return '';
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentQuestion?.type !== 'textarea') {
            e.preventDefault();

            if (currentQuestion && isQuestionAnswered(currentQuestion, currentValue)) {
                handleNext();
            }
        }
    };

    const renderInput = (q: Question) => {
        const value = currentValue;
        const placeholder = q.placeholder ?? q.help_text ?? `Enter ${q.label.toLowerCase()}`;

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
                if ((q.options?.length ?? 0) <= 1) {
                    return (
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={Boolean(value)} onChange={(e) => setCurrentValue(e.target.checked)} />
                            {(q.options?.[0] ?? q.label).replaceAll('_', ' ')}
                        </label>
                    );
                }

                return (
                    <div className="space-y-2">
                        {q.options?.map((opt) => {
                            const arr = Array.isArray(value) ? (value as string[]) : [];

                            return (
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
                            );
                        })}
                    </div>
                );

            case 'number':
                return (
                    <Input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="number"
                        min={q.min}
                        max={q.max}
                        placeholder={placeholder}
                        value={typeof value === 'number' ? value : typeof value === 'string' ? value : ''}
                        onChange={(e) => {
                            const raw = e.target.value;
                            setCurrentValue(raw === '' ? '' : Number(raw));
                        }}
                        onKeyDown={handleKeyDown}
                    />
                );

            case 'date':
                return (
                    <Input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="date"
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={typeof value === 'string' ? value : ''}
                        placeholder={placeholder}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-gray-300 focus:ring-0"
                    />
                );

            case 'text':
            default:
                return (
                    <Input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        placeholder={placeholder}
                        value={normalizeInputValue(value)}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                );
        }
    };

    const isNextDisabled = processing || !currentQuestion || !isQuestionAnswered(currentQuestion, currentValue);

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
                    <Button
                        onClick={handleBack}
                        disabled={history.length === 0 || processing}
                        className="w-1/3 bg-gray-200 text-black hover:bg-gray-300"
                    >
                        Back
                    </Button>

                    <Button onClick={handleNext} disabled={isNextDisabled} className="w-2/3 bg-[#3D2B1F] text-white hover:bg-[#52382a]">
                        Next
                    </Button>
                </div>
            </section>
        </div>
    );
}
