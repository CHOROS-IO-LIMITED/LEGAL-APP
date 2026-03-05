import Header from '@/components/web/Header'

import HowItWorks from './HowItWorks/Index'
import Hero from './ProductHero/Index'

export default function Index() {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <Hero />
            <HowItWorks />
        </div>
    )
}