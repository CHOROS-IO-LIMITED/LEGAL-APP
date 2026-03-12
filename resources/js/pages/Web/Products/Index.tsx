import Header from '@/components/web/Header';

import Footer from '@/components/web/Footer';
import Explore from './Explore/Index';
import ProductProcess from './HowItWorks/ProductProcess';
import ProductHero from './ProductHero/ProductHero';
import ProductSubscribe from './ProductSubscribe/ProductSubscribe';

export default function Index() {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <ProductHero />
            <ProductProcess />
            <Explore />
            <ProductSubscribe />
            <Footer />
        </div>
    );
}
