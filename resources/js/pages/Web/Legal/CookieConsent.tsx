import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const COOKIE_KEY = 'cookie_consent';
const EXPIRY_DAYS = 180;

type CookieConsentValue = {
    value: 'accepted' | 'rejected';
    timestamp: number;
};

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_KEY);

        if (!stored) {
            show();
            return;
        }

        try {
            const data: CookieConsentValue = JSON.parse(stored);

            const expiry = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
            const isExpired = Date.now() - data.timestamp > expiry;

            if (isExpired) {
                localStorage.removeItem(COOKIE_KEY);
                show();
            }
        } catch {
            localStorage.removeItem(COOKIE_KEY);
            show();
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const show = () => {
        setVisible(true);
        document.body.style.overflow = 'hidden';
    };

    const save = (value: 'accepted' | 'rejected') => {
        const payload: CookieConsentValue = {
            value,
            timestamp: Date.now(),
        };

        localStorage.setItem(COOKIE_KEY, JSON.stringify(payload));
        close();
    };

    const close = () => {
        setVisible(false);
        document.body.style.overflow = '';
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#E8E2D6] bg-white p-8 shadow-xl">
                <button onClick={close} className="absolute top-4 right-4 text-[#70665E] hover:text-[#1A1614]">
                    <X size={18} />
                </button>

                <h2 className="text-xl font-semibold text-[#1A1614]">Cookie Preferences</h2>

                <p className="mt-3 text-sm leading-relaxed text-[#70665E]">
                    We use cookies to improve your experience, analyze traffic, and enhance our services. You can choose to accept or reject
                    non-essential cookies.
                </p>

                <div className="my-6 h-px bg-[#E8E2D6]" />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => save('rejected')}
                        className="rounded-md border border-[#E8E2D6] px-5 py-2 text-sm font-medium text-[#3D2B1F] transition hover:bg-[#F6F2EA]"
                    >
                        Reject
                    </button>

                    <button
                        onClick={() => save('accepted')}
                        className="rounded-md bg-[#3D2B1F] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
