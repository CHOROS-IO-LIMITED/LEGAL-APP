import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Loader2, MessageSquare, Minus, Plus, Send, Sparkles, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

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

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

type ChatResponse = {
    message: string;
    next_question_key: string | null;
    follow_up_needed: boolean;
    warnings: string[];
};

const checkoutSteps = ['Products', 'KYC', 'Payment', 'Q&A'];
const PAGE_SIZE_UNITS = 5;

export default function QuestionAndAnswer({ userDocument }: Props) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [attemptedNext, setAttemptedNext] = useState(false);
    const [attemptedGenerate, setAttemptedGenerate] = useState(false);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: 'Hello. I can help you complete this form.',
        },
        {
            role: 'assistant',
            content: 'I can explain questions in simple terms.',
        },
        {
            role: 'assistant',
            content: 'I can clarify legal meanings.',
        },
        {
            role: 'assistant',
            content: 'I can help you decide what to answer next.',
        },
    ]);

    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [assistantOpen, setAssistantOpen] = useState(false);
    const chatScrollRef = useRef<HTMLDivElement | null>(null);
    const chatInputRef = useRef<HTMLInputElement | null>(null);
    const nextButtonRef = useRef<HTMLButtonElement | null>(null);
    const generateButtonRef = useRef<HTMLButtonElement | null>(null);

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

    const openAssistant = () => {
        setAssistantOpen(true);

        setTimeout(() => {
            chatInputRef.current?.focus();
            if (chatScrollRef.current) {
                chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
            }
        }, 100);
    };

    const toggleAssistant = () => {
        setAssistantOpen((prev) => !prev);
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

    const findQuestionInTree = (questions: Question[], targetKey: string): boolean => {
        for (const question of questions) {
            if (question.key === targetKey) {
                return true;
            }

            if (question.type === 'repeater' && Array.isArray(question.fields) && findQuestionInTree(question.fields, targetKey)) {
                return true;
            }

            if (question.follow_ups?.length) {
                for (const followUp of question.follow_ups) {
                    if (findQuestionInTree(followUp.questions, targetKey)) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    const orderedSteps = useMemo<SchemaStep[]>(() => {
        const stepMap = new Map(schema.steps.map((step) => [step.key, step]));
        const answeringPartyRole = typeof answers.answering_party_role === 'string' ? answers.answering_party_role : null;

        const orderedKeys = [
            'agreement_details',
            'form_completion',
            ...(answeringPartyRole === 'borrower' ? ['borrower_details', 'lender_details'] : ['lender_details', 'borrower_details']),
        ];

        const prioritizedSteps = orderedKeys.map((key) => stepMap.get(key)).filter((step): step is SchemaStep => Boolean(step));
        const remainingSteps = schema.steps.filter((step) => !orderedKeys.includes(step.key));

        return [...prioritizedSteps, ...remainingSteps];
    }, [schema.steps, answers.answering_party_role]);

    const findStepIndexForQuestionKey = (targetKey: string): number => {
        return orderedSteps.findIndex((step) => findQuestionInTree(step.questions, targetKey));
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

    const getQuestionWeight = (question: Question): number => {
        switch (question.type) {
            case 'textarea':
            case 'info':
            case 'group':
            case 'repeater':
                return 2;
            default:
                return 1;
        }
    };

    const paginateQuestions = (questions: Question[], maxUnits = PAGE_SIZE_UNITS): Question[][] => {
        if (questions.length === 0) {
            return [[]];
        }

        const pages: Question[][] = [];
        let currentPage: Question[] = [];
        let currentUnits = 0;

        for (const question of questions) {
            const weight = getQuestionWeight(question);

            if (currentPage.length > 0 && currentUnits + weight > maxUnits) {
                pages.push(currentPage);
                currentPage = [question];
                currentUnits = weight;
                continue;
            }

            currentPage.push(question);
            currentUnits += weight;
        }

        if (currentPage.length > 0) {
            pages.push(currentPage);
        }

        return pages;
    };

    const visibleQuestions = useMemo(() => {
        return orderedSteps.flatMap((step) => getVisibleQuestions(step.questions, answers));
    }, [orderedSteps, answers]);

    const answeredCount = visibleQuestions.filter(
        (q) => q.type !== 'info' && q.type !== 'group' && isQuestionAnswered(q, answers[q.key], answers),
    ).length;

    const answerableVisibleQuestions = visibleQuestions.filter((q) => q.type !== 'info' && q.type !== 'group');

    const currentStep = orderedSteps[currentStepIndex] ?? orderedSteps[0];
    const currentStepQuestions = useMemo(() => getVisibleQuestions(currentStep.questions, answers), [currentStep, answers]);
    const currentStepPages = useMemo(() => paginateQuestions(currentStepQuestions), [currentStepQuestions]);
    const safeCurrentPageIndex = Math.min(currentPageIndex, Math.max(currentStepPages.length - 1, 0));
    const currentPageQuestions = currentStepPages[safeCurrentPageIndex] ?? [];

    useEffect(() => {
        setCurrentPageIndex(0);
    }, [currentStepIndex]);

    useEffect(() => {
        if (currentPageIndex > currentStepPages.length - 1) {
            setCurrentPageIndex(Math.max(currentStepPages.length - 1, 0));
        }
    }, [currentPageIndex, currentStepPages.length]);

    useEffect(() => {
        if (assistantOpen && chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [chatMessages, chatLoading, assistantOpen]);

    useEffect(() => {
        const handleEnterPress = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            const isTextarea = target.tagName === 'TEXTAREA';
            const isChatInput = target === chatInputRef.current;

            if (e.key === 'Enter' && !isTextarea && !isChatInput) {
                e.preventDefault();

                const isLastStep = currentStepIndex === orderedSteps.length - 1 && safeCurrentPageIndex === currentStepPages.length - 1;

                if (isLastStep) {
                    generateButtonRef.current?.click();
                } else {
                    nextButtonRef.current?.click();
                }
            }
        };

        window.addEventListener('keydown', handleEnterPress);
        return () => window.removeEventListener('keydown', handleEnterPress);
    }, [currentStepIndex, safeCurrentPageIndex, currentStepPages.length, orderedSteps.length]);

    const currentPageMissing = currentPageQuestions.filter(
        (q) => q.type !== 'info' && q.type !== 'group' && !isQuestionAnswered(q, answers[q.key], answers),
    );

    const currentAnswerablePageQuestions = currentPageQuestions.filter((q) => q.type !== 'info' && q.type !== 'group');
    const currentActiveQuestion = currentAnswerablePageQuestions.find((q) => !isQuestionAnswered(q, answers[q.key], answers)) ?? null;

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

    const appendAssistantMessage = (message: string, warnings?: string[]) => {
        const textParts = [message];

        if (Array.isArray(warnings) && warnings.length > 0) {
            textParts.push('');
            textParts.push('Warnings:');
            warnings.forEach((warning) => {
                textParts.push(`- ${warning}`);
            });
        }

        setChatMessages((prev) => [
            ...prev,
            {
                role: 'assistant',
                content: textParts.join('\n'),
            },
        ]);
    };

    const sendChatMessage = async (message: string, overrideQuestion?: Question | null) => {
        const trimmed = message.trim();

        if (!trimmed || chatLoading) {
            return;
        }

        const activeQuestion = overrideQuestion ?? currentActiveQuestion ?? null;

        setChatMessages((prev) => [
            ...prev,
            {
                role: 'user',
                content: trimmed,
            },
        ]);

        setChatLoading(true);

        try {
            const response = await axios.post(route('ai.loan-agreement.chat', userDocument.id), {
                answers,
                current_question: activeQuestion?.key ?? null,
                message: trimmed,
            });

            const result = response.data as ChatResponse;

            if (result.next_question_key) {
                const matchingStepIndex = findStepIndexForQuestionKey(result.next_question_key);

                if (matchingStepIndex >= 0) {
                    setCurrentStepIndex(matchingStepIndex);

                    const targetStep = orderedSteps[matchingStepIndex];
                    const targetQuestions = getVisibleQuestions(targetStep.questions, answers);
                    const targetPages = paginateQuestions(targetQuestions);

                    const pageIndex = targetPages.findIndex((page) => page.some((q) => q.key === result.next_question_key));

                    if (pageIndex >= 0) {
                        setCurrentPageIndex(pageIndex);
                    }
                }
            }

            appendAssistantMessage(result.message, result.warnings);
        } catch (error: any) {
            console.error('AI chat failed:', error);

            const serverMessage = error?.response?.data?.message || error?.message || 'Sorry, I could not process that right now.';
            const warnings = Array.isArray(error?.response?.data?.warnings) ? error.response.data.warnings : [];

            appendAssistantMessage(serverMessage, warnings);
        } finally {
            setChatLoading(false);
        }
    };

    const handleSendChat = async () => {
        const trimmed = chatInput.trim();

        if (!trimmed || chatLoading) {
            return;
        }

        setChatInput('');
        await sendChatMessage(trimmed);
    };

    const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void handleSendChat();
        }
    };

    const handleExplainQuestion = async (question: Question) => {
        openAssistant();

        const prompt = `Explain this question in plain English and help me answer it:\nQuestion key: ${question.key}\nQuestion label: ${question.label}`;

        await sendChatMessage(prompt, question);
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
            <div className="flex flex-col gap-2">
                {visibleOptions.map((opt) => {
                    const checked = String(value ?? '') === opt;

                    return (
                        <label key={opt} className="flex cursor-pointer items-start gap-3 px-1 py-1 text-sm">
                            <input
                                type="radio"
                                name={question.key}
                                value={opt}
                                checked={checked}
                                onChange={(e) => onChange(e.target.value)}
                                className="mt-0.5 h-4 w-4 accent-[#3D2B1F]"
                            />
                            <span className="text-[#1A1614]">{getDisplayLabel(question, opt)}</span>
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
            <div className="flex flex-col gap-2">
                {visibleOptions.map((opt) => {
                    const checked = selectedValues.includes(opt);

                    return (
                        <label key={opt} className="flex cursor-pointer items-start gap-3 px-1 py-1 text-sm">
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
                            <span className="text-[#1A1614]">{getDisplayLabel(question, opt)}</span>
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
                    <div className="rounded-2xl border border-[#E7E1D7] bg-[#F8F3EA] px-4 py-4 text-sm leading-6 text-[#5B534C]">
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
                        className="w-full rounded-2xl border border-[#D8D1C5] bg-white px-4 py-3 text-sm text-[#1A1614] outline-none focus:border-[#A68A64]"
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
                        <label className="flex cursor-pointer items-start gap-3 px-1 py-1 text-sm">
                            <input
                                type="checkbox"
                                checked={value === true}
                                onChange={(e) => setScopedValue(e.target.checked)}
                                className="mt-0.5 h-4 w-4 accent-[#3D2B1F]"
                            />
                            <span className="text-[#1A1614]">{getDisplayLabel(q, visibleOptions[0] ?? q.label)}</span>
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
                        className="h-12 rounded-2xl border-[#D8D1C5]"
                    />
                );

            case 'date':
                return (
                    <Input
                        type="date"
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => setScopedValue(e.target.value)}
                        className="h-12 rounded-2xl border-[#D8D1C5]"
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={typeof value === 'string' ? value : ''}
                        placeholder={placeholder}
                        onChange={(e) => setScopedValue(e.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-[#D8D1C5] bg-white p-4 text-sm text-[#1A1614] outline-none focus:border-[#A68A64]"
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
                        className="h-12 rounded-2xl border-[#D8D1C5]"
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
                                            <div className="flex items-start justify-between gap-3">
                                                <label className="block text-sm font-semibold text-[#1A1614]">
                                                    {field.label}
                                                    {field.required && <span className="ml-1 text-[#A63D40]">*</span>}
                                                </label>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => void handleExplainQuestion(field)}
                                                    disabled={chatLoading}
                                                    className="h-8 rounded-xl border-[#D8D1C5] px-3 text-xs"
                                                >
                                                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                                                    Ask AI
                                                </Button>
                                            </div>

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
                    <div className="flex items-start justify-between gap-3">
                        <label className="block text-sm font-semibold text-[#1A1614]">
                            {question.label}
                            {question.required && <span className="ml-1 text-[#A63D40]">*</span>}
                        </label>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => void handleExplainQuestion(question)}
                            disabled={chatLoading}
                            className="h-8 rounded-xl border-[#D8D1C5] px-3 text-xs"
                        >
                            <Sparkles className="mr-1 h-3.5 w-3.5" />
                            Ask AI
                        </Button>
                    </div>

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

    const goToStep = (stepIndex: number) => {
        setAttemptedNext(false);
        setAttemptedGenerate(false);
        setCurrentStepIndex(stepIndex);
        setCurrentPageIndex(0);
    };

    const handleNext = () => {
        setAttemptedNext(true);

        if (currentPageMissing.length > 0) {
            return;
        }

        setAttemptedNext(false);

        if (safeCurrentPageIndex < currentStepPages.length - 1) {
            setCurrentPageIndex((prev) => prev + 1);
            return;
        }

        if (currentStepIndex < orderedSteps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
            setCurrentPageIndex(0);
        }
    };

    const handleBack = () => {
        setAttemptedNext(false);
        setAttemptedGenerate(false);

        if (safeCurrentPageIndex > 0) {
            setCurrentPageIndex((prev) => prev - 1);
            return;
        }

        if (currentStepIndex > 0) {
            const previousStepIndex = currentStepIndex - 1;
            const previousStep = orderedSteps[previousStepIndex];
            const previousQuestions = getVisibleQuestions(previousStep.questions, answers);
            const previousPages = paginateQuestions(previousQuestions);

            setCurrentStepIndex(previousStepIndex);
            setCurrentPageIndex(Math.max(previousPages.length - 1, 0));
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
            const stepIndex = findStepIndexForQuestionKey(firstMissing.key);

            if (stepIndex >= 0) {
                const missingStep = orderedSteps[stepIndex];
                const missingQuestions = getVisibleQuestions(missingStep.questions, answers);
                const missingPages = paginateQuestions(missingQuestions);
                const pageIndex = missingPages.findIndex((page) => page.some((q) => q.key === firstMissing.key));

                setCurrentStepIndex(stepIndex);
                setCurrentPageIndex(pageIndex >= 0 ? pageIndex : 0);
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

            <section className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
                <Stepper steps={checkoutSteps} currentStep={3} />

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#1A1614]">{userDocument.document.title}</h2>
                    <p className="mt-2 text-[#6B635B]">{userDocument.document.description}</p>
                    <p className="mt-4 text-sm font-medium text-[#6B635B]">
                        {answeredCount} of {answerableVisibleQuestions.length} visible fields completed
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                    {orderedSteps.map((step, index) => {
                        const active = index === currentStepIndex;

                        return (
                            <button
                                key={step.key}
                                type="button"
                                onClick={() => goToStep(index)}
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

                <Card className="self-start rounded-3xl border-[#E7E1D7] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#EFE8DC] pb-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <CardTitle className="text-xl text-[#1A1614]">{currentStep.title}</CardTitle>
                                {currentStep.description && <p className="mt-1 text-sm text-[#6B635B]">{currentStep.description}</p>}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#F7F1E8] px-3 py-1 text-xs font-semibold text-[#6B635B]">
                                    Step {currentStepIndex + 1} of {orderedSteps.length}
                                </span>
                                <span className="rounded-full bg-[#F7F1E8] px-3 py-1 text-xs font-semibold text-[#6B635B]">
                                    Page {safeCurrentPageIndex + 1} of {currentStepPages.length}
                                </span>
                            </div>
                        </div>

                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EFE8DC]">
                            <div
                                className="h-full rounded-full bg-[#3D2B1F] transition-all duration-300"
                                style={{ width: `${((safeCurrentPageIndex + 1) / Math.max(currentStepPages.length, 1)) * 100}%` }}
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="pt-2 pb-8">{renderQuestions(currentPageQuestions)}</CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <Button type="button" variant="outline" onClick={handleBack} className="rounded-xl border-[#D8D1C5]">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {safeCurrentPageIndex > 0 || currentStepIndex > 0 ? 'Previous' : 'Back'}
                    </Button>

                    <div className="flex items-center gap-3">
                        {currentStepIndex === orderedSteps.length - 1 && safeCurrentPageIndex === currentStepPages.length - 1 ? (
                            <Button
                                ref={generateButtonRef}
                                type="button"
                                onClick={handleGenerate}
                                disabled={processing}
                                className="rounded-xl bg-[#3D2B1F] px-6 text-white hover:bg-[#52382a]"
                            >
                                Generate Document
                            </Button>
                        ) : (
                            <Button
                                ref={nextButtonRef}
                                type="button"
                                onClick={handleNext}
                                className="rounded-xl bg-[#3D2B1F] px-6 text-white hover:bg-[#52382a]"
                            >
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            <div className="fixed right-6 bottom-6 z-50">
                <div className="flex flex-col items-end gap-3">
                    {assistantOpen && (
                        <div className="w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-[#E7E1D7] bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-[#EFE8DC] bg-[#FCFAF6] px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3D2B1F] text-white">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#1A1614]">AI Assistant</p>
                                        <p className="text-xs text-[#6B635B]">
                                            {currentActiveQuestion ? `Current: ${currentActiveQuestion.label}` : 'Ask any question'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setAssistantOpen(false)}
                                        className="rounded-full p-2 text-[#6B635B] transition hover:bg-[#F3ECE2]"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setAssistantOpen(false)}
                                        className="rounded-full p-2 text-[#6B635B] transition hover:bg-[#F3ECE2]"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex h-[500px] flex-col">
                                <div ref={chatScrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#FCFAF6] p-4">
                                    {chatMessages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`w-fit max-w-[75%] rounded-2xl px-4 py-3 text-sm break-words whitespace-pre-line ${
                                                message.role === 'user'
                                                    ? 'ml-auto bg-[#3D2B1F] text-white'
                                                    : 'border border-[#E7E1D7] bg-white text-[#1A1614]'
                                            }`}
                                        >
                                            {message.content}
                                        </div>
                                    ))}

                                    {chatLoading && (
                                        <div className="flex items-center gap-2 rounded-2xl border border-[#E7E1D7] bg-white px-4 py-3 text-sm text-[#6B635B]">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Thinking...
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-[#EFE8DC] bg-white p-3">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            ref={chatInputRef}
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={handleChatKeyDown}
                                            placeholder="Ask about this question..."
                                            className="rounded-xl border-[#D8D1C5]"
                                        />

                                        <Button
                                            type="button"
                                            onClick={() => void handleSendChat()}
                                            disabled={chatLoading || !chatInput.trim()}
                                            className="rounded-xl bg-[#3D2B1F] text-white hover:bg-[#52382a]"
                                        >
                                            {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={toggleAssistant}
                        className="group flex h-16 w-16 items-center justify-center rounded-full bg-[#3D2B1F] text-white shadow-xl hover:bg-[#52382a]"
                    >
                        <MessageSquare className="h-7 w-7" />
                    </button>
                </div>
            </div>
        </div>
    );
}
