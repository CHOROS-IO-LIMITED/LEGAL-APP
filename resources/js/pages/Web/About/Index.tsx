import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import AboutClient from './AboutClients/AboutClient';
import AboutHero from './AboutHero/AboutHero';
import AboutMission from './AboutMission/AboutMission';
import AboutCTA from './AboutCTA/AboutCTA';

export default function Index() {
    return (
        <div>
            <Header />
            <AboutHero />
            <AboutMission />
            <AboutClient />
            <AboutCTA/>
            <Footer />
        </div>
    );
}
