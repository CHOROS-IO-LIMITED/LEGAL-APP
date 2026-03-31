import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { router, useForm } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Primitive = string | number | boolean | null;
type FormValue = Primitive | string[] | File | Date | { [key: string]: FormValue };

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
    is_upsell?: boolean;
    min?: number;
    max?: number;
    follow_ups?: FollowUp[];
};

type UserDocument = {
    id: number;
    batch_uuid?: string;
    answers_json: Record<string, unknown> | null;
    question_schema_json: {
        document_type: string;
        questions: Question[];
    } | null;
    generated_pdf_url?: string | null;
    document: {
        title: string | null;
        description: string | null;
    };
};

type Props = {
    userDocument: UserDocument | null;
};

const steps = ['Products', 'KYC', 'Payment', 'Q&A'];

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

    const { data, processing, setData } = useForm<FormData>({
        answers: initialAnswers,
    });

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentValue, setCurrentValue] = useState<FormValue>('');
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    const answers = data.answers;

    const isTruthy = (value: FormValue | undefined) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return value !== 0;
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            return ['1', 'true', 'yes', 'on', 'checked'].includes(normalized);
        }

        return Boolean(value);
    };

    const matchesCondition = (when: FollowUpCondition, allAnswers: Record<string, FormValue>) => {
        const actual = allAnswers[when.field];

        switch (when.operator) {
            case 'equals':
                return Array.isArray(actual)
                    ? actual.map(String).includes(String(when.value ?? ''))
                    : String(actual ?? '') === String(when.value ?? '');

            case 'not_equals':
                return Array.isArray(actual)
                    ? !actual.map(String).includes(String(when.value ?? ''))
                    : String(actual ?? '') !== String(when.value ?? '');

            case 'truthy':
                return isTruthy(actual);

            case 'falsy':
                return !isTruthy(actual);

            default:
                return false;
        }
    };

    const isEmptyValue = (value: FormValue | undefined) => {
        if (value === null || value === undefined || value === '') return true;
        if (Array.isArray(value) && value.length === 0) return true;
        return false;
    };

    const isQuestionAnswered = (question: Question, value: FormValue | undefined) => {
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

    const getVisibleQuestions = (questions: Question[], allAnswers: Record<string, FormValue>): Question[] => {
        const result: Question[] = [];

        for (const question of questions) {
            result.push(question);

            if (question.follow_ups?.length) {
                for (const followUp of question.follow_ups) {
                    if (matchesCondition(followUp.when, allAnswers)) {
                        result.push(...getVisibleQuestions(followUp.questions, allAnswers));
                    }
                }
            }
        }

        return result;
    };

    const visibleQuestions = useMemo(() => getVisibleQuestions(schema.questions, answers), [schema.questions, answers]);

    useEffect(() => {
        if (visibleQuestions.length === 0) return;

        if (currentIndex > visibleQuestions.length - 1) {
            setCurrentIndex(Math.max(visibleQuestions.length - 1, 0));
        }
    }, [visibleQuestions, currentIndex]);

    const currentQuestion = visibleQuestions[currentIndex] ?? null;

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

    const persistAnswers = (updated: Record<string, FormValue>) => {
        setData('answers', updated);
    };

    const saveCurrentAnswer = () => {
        if (!currentQuestion) return answers;

        const updatedAnswers = {
            ...answers,
            [currentQuestion.key]: currentValue,
        };

        persistAnswers(updatedAnswers);

        return updatedAnswers;
    };

    const handleGenerate = (finalAnswers: Record<string, FormValue>) => {
        setLoading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                const next = prev + Math.random() * (prev > 70 ? 2 : 5);
                return next > 90 ? 90 : next;
            });
        }, 100);

        router.put(
            route('product.qna.update', userDocument.id),
            { answers: finalAnswers },
            {
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
            },
        );
    };

    const handleNext = () => {
        if (!currentQuestion) return;
        if (!isQuestionAnswered(currentQuestion, currentValue)) return;

        const nextAnswers = saveCurrentAnswer();
        const nextVisibleQuestions = getVisibleQuestions(schema.questions, nextAnswers);

        if (currentIndex >= nextVisibleQuestions.length - 1) {
            handleGenerate(nextAnswers);
            return;
        }

        setCurrentIndex((prev) => prev + 1);
    };

    const handleBack = () => {
        if (!currentQuestion || currentIndex === 0) {
            return;
        }

        saveCurrentAnswer();
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
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
                            <input type="checkbox" checked={value === true} onChange={(e) => setCurrentValue(e.target.checked)} />
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

    const progressLabel =
        visibleQuestions.length > 0 ? `${Math.min(currentIndex + 1, visibleQuestions.length)} of ${visibleQuestions.length}` : 'Completed';

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
                <p className="mt-2 text-[#70665E]">Submitting your answers and generating the latest PDF document...</p>

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
                <Stepper steps={steps} currentStep={3} />

                <div className="text-center">
                    <h2 className="text-3xl font-bold">{userDocument.document.title}</h2>
                    <p className="mt-2 text-gray-500">{userDocument.document.description}</p>
                    <p className="mt-4 text-sm font-medium text-[#6B635B]">Question {progressLabel}</p>
                </div>

                {currentQuestion ? (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CardTitle>{currentQuestion.label}</CardTitle>

                                {currentQuestion.is_upsell && (
                                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Add-on</span>
                                )}
                            </div>
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
                        disabled={currentIndex === 0 || processing}
                        className="w-1/3 bg-gray-200 text-black hover:bg-gray-300"
                    >
                        Back
                    </Button>

                    <Button onClick={handleNext} disabled={isNextDisabled} className="w-2/3 bg-[#3D2B1F] text-white hover:bg-[#52382a]">
                        {currentIndex >= visibleQuestions.length - 1 ? 'Generate Document' : 'Next'}
                    </Button>
                </div>
            </section>
        </div>
    );
}
