import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { useForm } from '@inertiajs/react';
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

export default function QuestionAndAnswer(props: Props) {
    const userDocument = props.userDocument;

    if (!userDocument) {
        return <div className="p-10 text-center text-gray-500">User document not found.</div>;
    }

    const schema = userDocument.question_schema_json;

    if (!schema) {
        return (
            <div className="min-h-screen bg-[#FCF9F2]">
                <Header />

                <section className="mx-auto max-w-4xl py-10">
                    <Stepper steps={steps} currentStep={4} />

                    <Card>
                        <CardContent className="py-10 text-center text-gray-500">
                            No question schema available for this document.
                            <br />
                            <span className="text-sm text-gray-400">(AI generation may not have been triggered)</span>
                        </CardContent>
                    </Card>
                </section>
            </div>
        );
    }

    const { data, setData, put, processing } = useForm<FormData>({
        answers: (userDocument.answers_json ?? {}) as Record<string, FormValue>,
    });

    const setAnswer = (key: string, value: FormValue) => {
        setData('answers', {
            ...data.answers,
            [key]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('product.qna.update', userDocument.id));
    };

    return (
        <div className="min-h-screen bg-[#FCF9F2]">
            <Header />

            <section className="mx-auto max-w-4xl py-10">
                <Stepper steps={steps} currentStep={4} />

                <h1 className="text-2xl font-bold">{userDocument.document.title ?? 'Q&A'}</h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    {schema.questions.map((q, i) => (
                        <Card key={q.key}>
                            <CardContent className="space-y-2 p-4">
                                <label className="font-medium">
                                    {i + 1}. {q.label}
                                </label>

                                <input
                                    type="text"
                                    value={String(data.answers[q.key] ?? '')}
                                    onChange={(e) => setAnswer(q.key, e.target.value)}
                                    className="w-full rounded border p-2"
                                />
                            </CardContent>
                        </Card>
                    ))}

                    <Button type="submit" disabled={processing}>
                        Submit
                    </Button>
                </form>
            </section>
        </div>
    );
}
