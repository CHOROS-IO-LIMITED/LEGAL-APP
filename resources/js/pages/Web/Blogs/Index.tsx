import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import BlogArticles from './BlogArticles/BlogArticles';
import BlogFeatured from './BlogFeatured/BlogFeatured';
import BlogHero from './BlogHero/BlogsHero';
import BlogSubscribe from './BlogSubscribe/BlogSubscribe';

export default function Index() {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <BlogHero />
            <BlogFeatured />
            <BlogArticles />
            <BlogSubscribe />
            <Footer />
        </div>
    );
}
