import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import AboutClient from './AboutClients/AboutClient';
import AboutCTA from './AboutCTA/AboutCTA';
import AboutFounder from './AboutFounders/AboutFounder';
import AboutHero from './AboutHero/AboutHero';
import AboutMission from './AboutMission/AboutMission';
import AboutWhat from './AboutWhat/AboutWhat';

export default function Index() {
    return (
        <div>
            <Header />
            <AboutHero />
            <AboutMission />
            <AboutWhat />
            <AboutFounder />
            <AboutClient />
            <AboutCTA />
            <Footer />
        </div>
    );
}
