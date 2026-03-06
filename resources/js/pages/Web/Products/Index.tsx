import Header from '@/components/web/Header';

import HowItWorks from './HowItWorks/Index';
import Hero from './ProductHero/Index';
import Explore from './Explore/Index';

export default function Index() {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <Hero />
            <HowItWorks />
            <Explore />
        </div>
    );
}
