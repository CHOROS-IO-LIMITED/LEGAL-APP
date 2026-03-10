import Header from '@/components/web/Header';

import Feature from './Feature/Index';
import Hero from './HomeHero/Index';
import Footer from '@/components/web/Footer';
import CookieConsent from '../Legal/CookieConsent';

export default function Index() {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <Hero />
            <Feature />
            <Footer />
            <CookieConsent />
        </div>
    );
}
