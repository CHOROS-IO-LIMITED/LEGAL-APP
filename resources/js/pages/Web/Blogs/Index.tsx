import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import BlogArticles from './BlogArticles/BlogArticles';
import BlogFeatured from './BlogFeatured/BlogFeatured';
import BlogHero from './BlogHero/BlogsHero';
import BlogSubscribe from './BlogSubscribe/BlogSubscribe';
import { usePage } from '@inertiajs/react';

export default function Index() {
    const { blogs } = usePage<{ blogs: any }>().props;
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-sans">
            <Header />
            <BlogHero />
            <BlogFeatured blog={blogs[0]} />
            <BlogArticles blogs={blogs.slice(1)} />
            <BlogSubscribe />
            <Footer />
        </div>
    );
}
