import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

type Primitive = string | number | boolean | null;
type RepeaterItemValue = { [key: string]: FormValue };
type FormValue = Primitive | string[] | File | Date | RepeaterItemValue | RepeaterItemValue[];

type FormData = {
    answers: Record<string, FormValue>;
};

type ConditionOperator = 'equals' | 'not_equals' | 'truthy' | 'falsy' | 'contains' | 'not_contains';

type FollowUpCondition = {
    field: string;
    operator: ConditionOperator;
    value?: string | number | boolean;
};

type VisibilityCondition = FollowUpCondition;

type FollowUp = {
    when: FollowUpCondition;
    questions: Question[];
};

type QuestionType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'date' | 'radio' | 'info' | 'group' | 'repeater';

type Question = {
    key: string;
    label: string;
    type: QuestionType;
    required: boolean;
    options?: string[];
    option_labels?: Record<string, string>;
    option_visibility?: Record<string, VisibilityCondition>;
    help_text?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    content?: string;
    visibility?: VisibilityCondition;
    follow_ups?: FollowUp[];

    // repeater-only
    add_button_label?: string;
    item_label?: string;
    min_items?: number;
    max_items?: number;
    fields?: Question[];
};

type SchemaStep = {
    key: string;
    title: string;
    description?: string;
    questions: Question[];
};

type QuestionSchema = {
    document_type: string;
    title?: string;
    version?: number;
    steps: SchemaStep[];
};

type UserDocument = {
    id: number;
    answers_json: Record<string, unknown> | null;
    question_schema_json: QuestionSchema | null;
    document: {
        title: string | null;
        description: string | null;
        document_type?: string | null;
    };
};

type Props = {
    userDocument: UserDocument | null;
};

type FlattenedQuestion = Question;
type AnswerRecord = Record<string, FormValue>;

const checkoutSteps = ['Products', 'KYC', 'Payment', 'Q&A'];

export default function QuestionAndAnswer({ userDocument }: Props) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [attemptedNext, setAttemptedNext] = useState(false);
    const [attemptedGenerate, setAttemptedGenerate] = useState(false);

    if (!userDocument) {
        return <div className="p-10 text-center text-gray-500">User document not found.</div>;
    }

    const schema = userDocument.question_schema_json;

    if (!schema || !Array.isArray(schema.steps) || schema.steps.length === 0) {
        return <div className="p-10 text-center text-gray-500">No question schema available.</div>;
    }

    const initialAnswers = useMemo<Record<string, FormValue>>(() => {
        return (userDocument.answers_json as Record<string, FormValue>) ?? {};
    }, [userDocument.answers_json]);

    const { data, processing, setData } = useForm<FormData>({
        answers: initialAnswers,
    });

    const answers = data.answers;

    const setAnswer = (key: string, value: FormValue) => {
        setData('answers', {
            ...answers,
            [key]: value,
        });
    };

    const getDisplayLabel = (question: Question, option: string) => {
        return question.option_labels?.[option] ?? option.replaceAll('_', ' ');
    };

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

    const normalizeComparableValue = (value: FormValue | undefined): string => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }

        return '';
    };

    const matchesCondition = (when: FollowUpCondition | VisibilityCondition, allAnswers: AnswerRecord) => {
        const actual = allAnswers[when.field];
        const expected = String(when.value ?? '');

        switch (when.operator) {
            case 'equals':
                return Array.isArray(actual) ? actual.map(String).includes(expected) : normalizeComparableValue(actual) === expected;

            case 'not_equals':
                return Array.isArray(actual) ? !actual.map(String).includes(expected) : normalizeComparableValue(actual) !== expected;

            case 'contains':
                if (Array.isArray(actual)) {
                    return actual.map(String).includes(expected);
                }

                if (typeof actual === 'string') {
                    return actual.includes(expected);
                }

                return false;

            case 'not_contains':
                if (Array.isArray(actual)) {
                    return !actual.map(String).includes(expected);
                }

                if (typeof actual === 'string') {
                    return !actual.includes(expected);
                }

                return true;

            case 'truthy':
                return isTruthy(actual);

            case 'falsy':
                return !isTruthy(actual);

            default:
                return false;
        }
    };

    const isVisibleQuestion = (question: Question, allAnswers: AnswerRecord) => {
        if (!question.visibility) {
            return true;
        }

        return matchesCondition(question.visibility, allAnswers);
    };

    const isEmptyValue = (value: FormValue | undefined) => {
        if (value === null || value === undefined || value === '') return true;
        if (Array.isArray(value) && value.length === 0) return true;
        return false;
    };

    const mergeAnswerScopes = (rootAnswers: AnswerRecord, localAnswers?: AnswerRecord): AnswerRecord => {
        return {
            ...rootAnswers,
            ...(localAnswers ?? {}),
        };
    };

    const getVisibleOptions = (question: Question, allAnswers: AnswerRecord) => {
        return (question.options ?? []).filter((option) => {
            const condition = question.option_visibility?.[option];

            if (!condition) {
                return true;
            }

            return matchesCondition(condition, allAnswers);
        });
    };

    const isQuestionAnswered = (question: Question, value: FormValue | undefined, rootAnswers?: AnswerRecord): boolean => {
        if (!question.required) {
            return true;
        }

        if (question.type === 'info' || question.type === 'group') {
            return true;
        }

        if (question.type === 'checkbox') {
            const visibleOptions = getVisibleOptions(question, rootAnswers ?? answers);

            if (visibleOptions.length <= 1) {
                return value === true;
            }

            return Array.isArray(value) && value.length > 0;
        }

        if (question.type === 'repeater') {
            const items = Array.isArray(value) ? value : [];
            const minItems = question.min_items ?? (question.required ? 1 : 0);

            if (items.length < minItems) {
                return false;
            }

            const fields = question.fields ?? [];

            return items.every((item) => {
                if (!item || Array.isArray(item) || typeof item !== 'object') {
                    return false;
                }

                const itemAnswers = item as AnswerRecord;
                const mergedAnswers = mergeAnswerScopes(rootAnswers ?? answers, itemAnswers);
                const visibleFields = getVisibleQuestions(fields, mergedAnswers);

                return visibleFields.every((field) => isQuestionAnswered(field, itemAnswers[field.key], mergedAnswers));
            });
        }

        return !isEmptyValue(value);
    };

    const getVisibleQuestions = (questions: Question[], allAnswers: AnswerRecord): FlattenedQuestion[] => {
        const result: FlattenedQuestion[] = [];

        for (const question of questions) {
            if (!isVisibleQuestion(question, allAnswers)) {
                continue;
            }

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

    const visibleQuestions = useMemo(() => {
        return schema.steps.flatMap((step) => getVisibleQuestions(step.questions, answers));
    }, [schema.steps, answers]);

    const answeredCount = visibleQuestions.filter(
        (q) => q.type !== 'info' && q.type !== 'group' && isQuestionAnswered(q, answers[q.key], answers),
    ).length;

    const answerableVisibleQuestions = visibleQuestions.filter((q) => q.type !== 'info' && q.type !== 'group');

    const currentStep = schema.steps[currentStepIndex];
    const currentStepQuestions = getVisibleQuestions(currentStep.questions, answers);
    const currentStepMissing = currentStepQuestions.filter(
        (q) => q.type !== 'info' && q.type !== 'group' && !isQuestionAnswered(q, answers[q.key], answers),
    );

    const normalizeInputValue = (value: FormValue) => {
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }

        return '';
    };

    const shouldShowError = (question: Question) => {
        if (question.type === 'info' || question.type === 'group') {
            return false;
        }

        const attempted = attemptedNext || attemptedGenerate;

        if (!attempted) {
            return false;
        }

        return question.required && !isQuestionAnswered(question, answers[question.key], answers);
    };

    const setRepeaterItems = (questionKey: string, items: RepeaterItemValue[]) => {
        setAnswer(questionKey, items);
    };

    const getRepeaterItems = (questionKey: string): RepeaterItemValue[] => {
        const value = answers[questionKey];

        if (!Array.isArray(value)) {
            return [];
        }

        return value.filter((item) => item && typeof item === 'object' && !Array.isArray(item)) as RepeaterItemValue[];
    };

    const addRepeaterItem = (question: Question) => {
        const items = getRepeaterItems(question.key);
        const maxItems = question.max_items;

        if (typeof maxItems === 'number' && items.length >= maxItems) {
            return;
        }

        const nextItem: RepeaterItemValue = {};

        (question.fields ?? []).forEach((field) => {
            if (field.type === 'checkbox' && (field.options?.length ?? 0) > 1) {
                nextItem[field.key] = [];
            } else {
                nextItem[field.key] = '';
            }
        });

        setRepeaterItems(question.key, [...items, nextItem]);
    };

    const updateRepeaterItem = (questionKey: string, itemIndex: number, fieldKey: string, value: FormValue) => {
        const items = getRepeaterItems(questionKey);

        const updated = items.map((item, index) => {
            if (index !== itemIndex) {
                return item;
            }

            return {
                ...item,
                [fieldKey]: value,
            };
        });

        setRepeaterItems(questionKey, updated);
    };

    const removeRepeaterItem = (question: Question, itemIndex: number) => {
        const items = getRepeaterItems(question.key);
        const minItems = question.min_items ?? 0;

        if (items.length <= minItems) {
            return;
        }

        setRepeaterItems(
            question.key,
            items.filter((_, index) => index !== itemIndex),
        );
    };

    const RadioGroup = ({
        question,
        value,
        onChange,
        scopedAnswers,
    }: {
        question: Question;
        value: FormValue | undefined;
        onChange: (value: string) => void;
        scopedAnswers: AnswerRecord;
    }) => {
        const visibleOptions = getVisibleOptions(question, scopedAnswers);

        return (
            <div className="space-y-2">
                {visibleOptions.map((opt) => {
                    const checked = String(value ?? '') === opt;

                    return (
                        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-[#1A1614]">
                            <input
                                type="radio"
                                name={question.key}
                                value={opt}
                                checked={checked}
                                onChange={(e) => onChange(e.target.value)}
                                className="h-4 w-4 accent-[#3D2B1F]"
                            />
                            <span>{getDisplayLabel(question, opt)}</span>
                        </label>
                    );
                })}
            </div>
        );
    };

    const CheckboxGroup = ({
        question,
        value,
        onChange,
        scopedAnswers,
    }: {
        question: Question;
        value: FormValue | undefined;
        onChange: (value: string[]) => void;
        scopedAnswers: AnswerRecord;
    }) => {
        const selectedValues = Array.isArray(value) ? value.map(String) : [];
        const visibleOptions = getVisibleOptions(question, scopedAnswers);

        return (
            <div className="space-y-3">
                {visibleOptions.map((opt) => {
                    const checked = selectedValues.includes(opt);

                    return (
                        <label key={opt} className="flex items-start gap-2 text-sm text-[#3F3A36]">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        onChange([...selectedValues, opt]);
                                    } else {
                                        onChange(selectedValues.filter((v) => v !== opt));
                                    }
                                }}
                                className="mt-0.5 h-4 w-4 accent-[#3D2B1F]"
                            />
                            <span>{getDisplayLabel(question, opt)}</span>
                        </label>
                    );
                })}
            </div>
        );
    };

    const renderInput = (
        q: Question,
        scope?: {
            value?: FormValue;
            setValue?: (value: FormValue) => void;
            scopedAnswers?: AnswerRecord;
        },
    ) => {
        const value = scope?.value ?? answers[q.key];
        const scopedAnswers = scope?.scopedAnswers ?? answers;
        const setScopedValue = scope?.setValue ?? ((nextValue: FormValue) => setAnswer(q.key, nextValue));
        const placeholder = q.placeholder ?? q.help_text ?? `Enter ${q.label.toLowerCase()}`;

        switch (q.type) {
            case 'info':
                return (
                    <div className="rounded-xl border border-[#E7E1D7] bg-[#F8F3EA] px-4 py-3 text-sm text-[#5B534C]">
                        {q.content ?? q.help_text ?? q.label}
                    </div>
                );

            case 'group':
                return null;

            case 'radio':
                return <RadioGroup question={q} value={value} onChange={(nextValue) => setScopedValue(nextValue)} scopedAnswers={scopedAnswers} />;

            case 'select': {
                const visibleOptions = getVisibleOptions(q, scopedAnswers);

                return (
                    <select
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => setScopedValue(e.target.value)}
                        className="w-full rounded-xl border border-[#D8D1C5] bg-white px-3 py-2 text-sm text-[#1A1614] outline-none focus:border-[#A68A64]"
                    >
                        <option value="">Select an option</option>
                        {visibleOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {getDisplayLabel(q, opt)}
                            </option>
                        ))}
                    </select>
                );
            }

            case 'checkbox': {
                const visibleOptions = getVisibleOptions(q, scopedAnswers);

                if (visibleOptions.length <= 1) {
                    return (
                        <label className="flex items-center gap-2 text-sm text-[#3F3A36]">
                            <input
                                type="checkbox"
                                checked={value === true}
                                onChange={(e) => setScopedValue(e.target.checked)}
                                className="h-4 w-4 accent-[#3D2B1F]"
                            />
                            {getDisplayLabel(q, visibleOptions[0] ?? q.label)}
                        </label>
                    );
                }

                return <CheckboxGroup question={q} value={value} onChange={(nextValue) => setScopedValue(nextValue)} scopedAnswers={scopedAnswers} />;
            }

            case 'number':
                return (
                    <Input
                        type="number"
                        min={q.min}
                        max={q.max}
                        placeholder={placeholder}
                        value={typeof value === 'number' ? value : typeof value === 'string' ? value : ''}
                        onChange={(e) => {
                            const raw = e.target.value;
                            setScopedValue(raw === '' ? '' : Number(raw));
                        }}
                        className="rounded-xl border-[#D8D1C5]"
                    />
                );

            case 'date':
                return (
                    <Input
                        type="date"
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => setScopedValue(e.target.value)}
                        className="rounded-xl border-[#D8D1C5]"
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={typeof value === 'string' ? value : ''}
                        placeholder={placeholder}
                        onChange={(e) => setScopedValue(e.target.value)}
                        rows={5}
                        className="w-full rounded-xl border border-[#D8D1C5] bg-white p-3 text-sm text-[#1A1614] outline-none focus:border-[#A68A64]"
                    />
                );

            case 'repeater':
                return renderRepeater(q);

            case 'text':
            default:
                return (
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={normalizeInputValue(value)}
                        onChange={(e) => setScopedValue(e.target.value)}
                        className="rounded-xl border-[#D8D1C5]"
                    />
                );
        }
    };

    const renderRepeater = (question: Question) => {
        const items = getRepeaterItems(question.key);
        const fields = question.fields ?? [];
        const minItems = question.min_items ?? 0;
        const maxItems = question.max_items;

        return (
            <div className="space-y-4">
                {items.map((item, itemIndex) => {
                    const scopedAnswers = mergeAnswerScopes(answers, item);
                    const visibleFields = getVisibleQuestions(fields, scopedAnswers);

                    return (
                        <div key={`${question.key}-${itemIndex}`} className="rounded-2xl border border-[#E7E1D7] bg-[#FCFAF6] p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-[#1A1614]">
                                    {question.item_label ?? 'Item'} {itemIndex + 1}
                                </h4>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => removeRepeaterItem(question, itemIndex)}
                                    disabled={items.length <= minItems}
                                    className="rounded-xl border-[#D8D1C5]"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove
                                </Button>
                            </div>

                            <div className="space-y-5">
                                {visibleFields.map((field) => {
                                    const fieldValue = item[field.key];
                                    const showError =
                                        (attemptedNext || attemptedGenerate) &&
                                        field.required &&
                                        !isQuestionAnswered(field, fieldValue, scopedAnswers);

                                    if (field.type === 'info') {
                                        return (
                                            <div key={`${question.key}-${itemIndex}-${field.key}`}>
                                                {renderInput(field, { value: fieldValue, scopedAnswers })}
                                            </div>
                                        );
                                    }

                                    if (field.type === 'group') {
                                        return (
                                            <div key={`${question.key}-${itemIndex}-${field.key}`}>
                                                {field.label && (
                                                    <div className="mb-2">
                                                        <h4 className="text-sm font-semibold text-[#1A1614]">{field.label}</h4>
                                                        {field.help_text && <p className="mt-1 text-sm text-[#6B635B]">{field.help_text}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={`${question.key}-${itemIndex}-${field.key}`} className="space-y-2">
                                            <label className="block text-sm font-semibold text-[#1A1614]">
                                                {field.label}
                                                {field.required && <span className="ml-1 text-[#A63D40]">*</span>}
                                            </label>

                                            {renderInput(field, {
                                                value: fieldValue,
                                                scopedAnswers,
                                                setValue: (nextValue) => updateRepeaterItem(question.key, itemIndex, field.key, nextValue),
                                            })}

                                            {field.help_text && <p className="text-sm text-[#6B635B]">{field.help_text}</p>}
                                            {showError && <p className="text-sm text-[#A63D40]">This field is required.</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => addRepeaterItem(question)}
                    disabled={typeof maxItems === 'number' && items.length >= maxItems}
                    className="rounded-xl border-[#D8D1C5]"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {question.add_button_label ?? 'Add item'}
                </Button>
            </div>
        );
    };

    const renderQuestion = (question: Question) => {
        const showError = shouldShowError(question);

        if (question.type === 'info') {
            return (
                <div key={question.key} className="mt-6">
                    {renderInput(question)}
                </div>
            );
        }

        if (question.type === 'group') {
            return (
                <div key={question.key} className="mt-6">
                    {question.label && (
                        <div className="mb-2">
                            <h4 className="text-sm font-semibold text-[#1A1614]">{question.label}</h4>
                            {question.help_text && <p className="mt-1 text-sm text-[#6B635B]">{question.help_text}</p>}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div key={question.key} className="mt-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#1A1614]">
                        {question.label}
                        {question.required && <span className="ml-1 text-[#A63D40]">*</span>}
                    </label>

                    {renderInput(question)}

                    {question.help_text && <p className="text-sm text-[#6B635B]">{question.help_text}</p>}
                    {showError && <p className="text-sm text-[#A63D40]">This field is required.</p>}
                </div>
            </div>
        );
    };

    const renderQuestions = (questions: Question[]) => {
        return questions.map((question) => renderQuestion(question));
    };

    const handleNext = () => {
        setAttemptedNext(true);

        if (currentStepMissing.length > 0) {
            return;
        }

        setAttemptedNext(false);

        if (currentStepIndex < schema.steps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setAttemptedNext(false);
        setAttemptedGenerate(false);

        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
            return;
        }

        window.history.back();
    };

    const handleGenerate = () => {
        setAttemptedGenerate(true);

        const missingRequired = visibleQuestions.filter(
            (q) => q.type !== 'info' && q.type !== 'group' && !isQuestionAnswered(q, answers[q.key], answers),
        );

        if (missingRequired.length > 0) {
            const firstMissing = missingRequired[0];

            const stepIndex = schema.steps.findIndex((step) => getVisibleQuestions(step.questions, answers).some((q) => q.key === firstMissing.key));

            if (stepIndex >= 0) {
                setCurrentStepIndex(stepIndex);
            }

            return;
        }

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
            { answers },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    clearInterval(interval);
                    setProgress(100);
                },
                onError: () => {
                    clearInterval(interval);
                },
                onFinish: () => {
                    clearInterval(interval);
                    setLoading(false);
                },
            },
        );
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FCF9F2] text-center font-sans">
                <h2 className="text-4xl font-bold text-[#1A1614]">Building your document</h2>
                <p className="mt-2 text-[#70665E]">Submitting your answers and generating the document...</p>

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

            <section className="mx-auto max-w-5xl space-y-8 px-8 py-10">
                <Stepper steps={checkoutSteps} currentStep={3} />

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#1A1614]">{userDocument.document.title}</h2>
                    <p className="mt-2 text-[#6B635B]">{userDocument.document.description}</p>
                    <p className="mt-4 text-sm font-medium text-[#6B635B]">
                        {answeredCount} of {answerableVisibleQuestions.length} visible fields completed
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                    {schema.steps.map((step, index) => {
                        const active = index === currentStepIndex;

                        return (
                            <button
                                key={step.key}
                                type="button"
                                onClick={() => setCurrentStepIndex(index)}
                                className={`rounded-2xl border px-4 py-3 text-left transition ${
                                    active
                                        ? 'border-[#3D2B1F] bg-[#3D2B1F] text-white'
                                        : 'border-[#E7E1D7] bg-white text-[#1A1614] hover:border-[#B8A893]'
                                }`}
                            >
                                <p className="text-xs font-semibold tracking-wide uppercase opacity-80">Step {index + 1}</p>
                                <p className="mt-1 text-sm font-semibold">{step.title}</p>
                            </button>
                        );
                    })}
                </div>

                <Card className="rounded-2xl border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE8DC]">
                        <CardTitle className="text-xl text-[#1A1614]">{currentStep.title}</CardTitle>
                        {currentStep.description && <p className="text-sm text-[#6B635B]">{currentStep.description}</p>}
                    </CardHeader>

                    <CardContent className="pt-6">{renderQuestions(currentStepQuestions)}</CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <Button type="button" variant="outline" onClick={handleBack} className="rounded-xl border-[#D8D1C5]">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    <div className="flex items-center gap-3">
                        {currentStepIndex < schema.steps.length - 1 ? (
                            <Button type="button" onClick={handleNext} className="rounded-xl bg-[#3D2B1F] px-6 text-white hover:bg-[#52382a]">
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleGenerate}
                                disabled={processing}
                                className="rounded-xl bg-[#3D2B1F] px-6 text-white hover:bg-[#52382a]"
                            >
                                Generate Document
                            </Button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
