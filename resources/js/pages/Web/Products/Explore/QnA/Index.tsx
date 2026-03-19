import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import React from 'react';

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

    if (!schema) {
        return <div>No schema</div>;
    }

    const { put, processing, data, setData } = useForm<FormData>({
        answers: (userDocument.answers_json as Record<string, FormValue>) || {},
    });

    const [answers, setAnswers] = React.useState<Record<string, FormValue>>((userDocument.answers_json as Record<string, FormValue>) ?? {});

    const [currentQuestion, setCurrentQuestion] = React.useState<Question | null>(null);

    // FLOW ENGINE
    const getNextQuestion = (questions: Question[], answers: any): Question | null => {
        for (const q of questions) {
            if (!(q.key in answers)) return q;

            if (q.follow_ups) {
                for (const f of q.follow_ups) {
                    const actual = answers[f.when.field];

                    if (f.when.operator === 'equals' && actual == f.when.value) {
                        const nested = getNextQuestion(f.questions, answers);
                        if (nested) return nested;
                    }

                    if (f.when.operator === 'in' && Array.isArray(actual) && actual.some((v: any) => f.when.value.includes(v))) {
                        const nested = getNextQuestion(f.questions, answers);
                        if (nested) return nested;
                    }
                }
            }
        }

        return null;
    };

    React.useEffect(() => {
        const next = getNextQuestion(schema.questions, answers);
        setCurrentQuestion(next);
    }, [answers]);

    // INPUT HANDLER
    const setAnswer = (key: string, value: FormValue) => {
        setAnswers((prev) => {
            const updated = { ...prev, [key]: value };
            setData('answers', updated);
            return updated;
        });
    };

    // NEXT BUTTON
    const handleNext = () => {
        const next = getNextQuestion(schema.questions, answers);

        if (!next) {
            put(route('product.qna.update', userDocument.id));
        } else {
            setAnswers({ ...answers });
        }
    };

    const normalizeInputValue = (value: FormValue) => {
        if (typeof value === 'string' || typeof value === 'number') return value;
        return '';
    };

    const normalizeSelectValue = (value: FormValue) => {
        if (typeof value === 'string' || typeof value === 'number') return value;
        return '';
    };

    // INPUT RENDERER
    const renderInput = (q: Question) => {
        const value = answers[q.key];

        switch (q.type) {
            case 'select':
                return (
                    <select
                        value={normalizeSelectValue(value)}
                        onChange={(e) => setAnswer(q.key, e.target.value)}
                        className="w-full rounded border p-2"
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
                return (
                    <div className="space-y-2">
                        {q.options?.map((opt) => {
                            const arr = (value as string[]) || [];

                            return (
                                <label key={opt} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={arr.includes(opt)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setAnswer(q.key, [...arr, opt]);
                                            } else {
                                                setAnswer(
                                                    q.key,
                                                    arr.filter((v) => v !== opt),
                                                );
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
                    <Input type="number" value={typeof value === 'number' ? value : ''} onChange={(e) => setAnswer(q.key, Number(e.target.value))} />
                );

            default:
                return <Input type="text" value={normalizeInputValue(value)} onChange={(e) => setAnswer(q.key, e.target.value)} />;
        }
    };

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

                <Button onClick={handleNext} disabled={processing} className="w-full bg-[#3D2B1F] text-white">
                    {currentQuestion ? 'Next' : 'Submit'}
                    <ArrowRight className="ml-2" size={18} />
                </Button>
            </section>
        </div>
    );
}
