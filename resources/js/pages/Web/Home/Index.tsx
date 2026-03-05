import Header from '@/components/web/Header';

import Feature from './Feature/Index';
import Hero from './HomeHero/Index';

export default function Index() {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <Hero />
            <Feature />
        </div>
    );
}
