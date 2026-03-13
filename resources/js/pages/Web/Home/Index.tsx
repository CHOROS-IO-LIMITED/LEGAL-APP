import Header from '@/components/web/Header';

import Footer from '@/components/web/Footer';
import CookieConsent from '../Legal/CookieConsent';
import Feature from './Feature/HomeFeature';
import HomeCTA from './HomeCTA/HomeCTA';
import HomeFAQ from './HomeFAQ/HomeFAQ';
import Hero from './HomeHero/Index';
import HomeOffer from './HomeOffer/HomeOffer';
import HomePowered from './HomePowered/HomePowered';

export default function Index() {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <Hero />
            <Feature />
            <HomePowered />
            <HomeOffer />
            <HomeFAQ />
            <HomeCTA />
            <Footer />
            <CookieConsent />
        </div>
    );
}
