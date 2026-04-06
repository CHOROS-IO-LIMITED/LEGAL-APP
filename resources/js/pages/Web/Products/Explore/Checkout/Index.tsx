import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/web/Header';
import Stepper from '@/components/web/Stepper';
import { Link, usePage } from '@inertiajs/react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import React, { useMemo, useState } from 'react';

type CheckoutDocument = {
    id: number;
    price: string | number;
    document: {
        title: string;
    } | null;
};

type PageProps = {
    batchUuid?: string;
    documents?: CheckoutDocument[];
    stripeKey?: string;
    clientSecret?: string;
} & Record<string, unknown>;

const CheckoutForm: React.FC<{ batchUuid: string; total: string }> = ({ batchUuid, total }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message ?? 'Validation failed.');
            setIsSubmitting(false);
            return;
        }

        const { error: confirmError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${route('product.checkout.continue')}?batch_uuid=${batchUuid}`,
            },
        });

        if (confirmError) {
            setError(confirmError.message ?? 'Payment failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Payment</CardTitle>
                    <CardDescription>Enter your card details to complete your purchase.</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <PaymentElement />

                    {error && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                    <button
                        type="submit"
                        disabled={isSubmitting || !stripe || !elements}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-[#3D2B1F] px-4 py-2 text-white hover:bg-[#5A4638] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Lock size={16} />
                        {isSubmitting ? 'Processing...' : `Pay £${total} Securely`}
                    </button>
                </CardContent>
            </Card>
        </form>
    );
};

const Checkout: React.FC = () => {
    const { props } = usePage<PageProps>();

    const batchUuid = props.batchUuid ?? '';
    const documents = useMemo(() => (Array.isArray(props.documents) ? props.documents : []), [props.documents]);
    const stripeKey = props.stripeKey ?? '';
    const clientSecret = props.clientSecret ?? '';

    const steps = ['Products', 'KYC', 'Payment', 'Q&A'];

    const total = useMemo(() => {
        return documents.reduce((sum, item) => sum + Number(item.price ?? 0), 0).toFixed(2);
    }, [documents]);

    const stripePromise = useMemo(() => {
        return stripeKey ? loadStripe(stripeKey) : null;
    }, [stripeKey]);

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />

            <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-8 py-10">
                <div className="flex flex-col space-y-12">
                    <div>
                        <Stepper steps={steps} currentStep={2} />
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={route('product.kyc', { batch_uuid: batchUuid })}
                            className="group mb-4 inline-flex items-center font-medium text-[#3D2B1F] transition-colors duration-200 hover:text-[#5A4638]"
                        >
                            <ArrowLeft size={18} className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                            Back
                        </Link>

                        <h2 className="font-serif text-4xl font-bold text-[#1A1614]">Secure Checkout</h2>

                        <p className="mt-2 text-base font-medium text-[#70665E]">
                            Review your order and complete payment to generate your <span className="text-[#3D2B1F]">legally-binding</span> documents.
                        </p>
                    </div>

                    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-12">
                        <div className="flex flex-col gap-6 lg:col-span-7">
                            {stripePromise && clientSecret ? (
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        clientSecret,
                                        appearance: {
                                            theme: 'stripe',
                                            variables: {
                                                colorPrimary: '#3D2B1F',
                                                borderRadius: '6px',
                                            },
                                        },
                                    }}
                                >
                                    <CheckoutForm batchUuid={batchUuid} total={total} />
                                </Elements>
                            ) : (
                                <Card>
                                    <CardContent className="p-6 text-center text-sm text-[#70665E]">Loading payment form...</CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="lg:col-span-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-4">
                                    {documents.length > 0 ? (
                                        documents.map((item) => (
                                            <div key={item.id} className="rounded-xl bg-[#FCF9F2] p-4">
                                                <div className="flex justify-between text-sm font-semibold text-[#1A1614]">
                                                    <span>{item.document?.title ?? 'Untitled Document'}</span>
                                                    <span>£{Number(item.price).toFixed(2)}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-[#70665E]">AI-Drafted • Legally Reviewed</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-xl bg-[#FCF9F2] p-4 text-sm text-[#70665E]">No selected documents found.</div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span>Lawyer Review</span>
                                        <span>Included</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span>VAT (0%)</span>
                                        <span>£0.00</span>
                                    </div>

                                    <div className="flex justify-between border-t border-[#E8E2D6] pt-4 font-semibold">
                                        <span>Total</span>
                                        <span>£{total}</span>
                                    </div>

                                    <div className="rounded-xl border border-green-300 bg-green-50 p-3 shadow-sm">
                                        <h4 className="mb-2 text-xs font-semibold text-[#1A1614]">What to Expect</h4>

                                        <ul className="flex flex-col gap-1">
                                            {[
                                                'Guided Q&A',
                                                'Document prepared professionally',
                                                'Legally reviewed within 24 hours',
                                                'Sign and Download',
                                            ].map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-100 px-2 py-1.5 text-xs text-[#1A1614]"
                                                >
                                                    <Check size={14} className="text-green-600" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Checkout;
