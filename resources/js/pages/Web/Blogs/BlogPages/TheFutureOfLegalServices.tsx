import { Button } from '@/components/ui/button';
import Footer from '@/components/web/Footer';
import Header from '@/components/web/Header';
import { Link } from '@inertiajs/react';
import { Variants, motion } from 'framer-motion';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';

interface Blog {
    title: string;
    slug: string;
    description: string;
    image: string;
    date: string;
    author: string;
}

interface Props {
    blog: Blog;
    relatedArticles: Blog[];
}

const TheFutureOfLegalServices = ({ blog, relatedArticles }: Props) => {
    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
        },
    };

    const listVariants: Variants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
        },
    };

    return (
        <>
            <Header />
            <section className="bg-[#FCF9F2] py-15">
                <div className="mx-auto flex max-w-6xl flex-col gap-x-12 px-6 lg:flex-row">
                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
                        >
                            {/* Back Link */}
                            <motion.div variants={fadeUp}>
                                <Link
                                    href="/blogs"
                                    className="group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3D2B1F] transition-colors hover:text-[#A68A64]"
                                >
                                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-x-1" />
                                    Back to Blogs
                                </Link>
                            </motion.div>

                            {/* Title */}
                            <motion.h1 variants={fadeUp} className="mb-4 font-serif text-4xl text-[#2E2A26]">
                                {blog.title}
                            </motion.h1>

                            {/* Meta */}
                            <motion.div variants={fadeUp} className="mb-8 flex items-center gap-4 text-sm text-[#A68A64]">
                                <img src="/images/logo/dd-logo.png" alt={blog.author} className="h-5 w-5" />
                                <span>{blog.author}</span>
                                <span>•</span>
                                <Calendar className="h-5 w-5 text-[#3D2B1F]" />
                                <span>{blog.date}</span>
                                <span>•</span>
                                <Eye className="h-5 w-5 text-[#3D2B1F]" />
                                <span>0 views</span>
                            </motion.div>

                            {/* Description */}
                            <motion.p variants={fadeUp} className="mb-10 text-lg leading-relaxed text-[#70665E]">
                                {blog.description}
                            </motion.p>

                            {/* Hero Image */}
                            <motion.figure variants={fadeUp} className="mb-12 overflow-hidden">
                                <img
                                    src="/images/blog/articles/The-Future-of-Legal-Services.webp"
                                    alt="The Future of Legal Services"
                                    className="h-full w-full scale-113 object-cover"
                                />
                            </motion.figure>

                            {/* Sections */}
                            <motion.section variants={fadeUp} className="mb-12">
                                <h2 className="mb-4 font-serif text-3xl text-[#2E2A26]">Why Legal Services Need a Revolution</h2>
                                <p className="mb-8 text-base leading-relaxed text-[#70665E]">
                                    Legal services have always been complex. Slow processes, high fees, and limited access make it difficult for
                                    individuals and small businesses to get the support they need. Drafting agreements, reviewing contracts, and
                                    preparing legal documents often take days or even weeks of back-and-forth with lawyers.
                                </p>

                                <div className="border-l-4 border-[#A68A64] bg-[#FFF8E5] p-6">
                                    <h3 className="mb-2 font-serif text-2xl text-[#2E2A26]">A Smarter Approach to Legal Work</h3>
                                    <p className="text-base leading-relaxed text-[#70665E]">
                                        At Daver & Daver, we are rewriting the rules. Our platform blends the efficiency of artificial intelligence
                                        with the reliability of human legal expertise. Users start by answering a few guided questions, and the system
                                        generates a fully tailored legal document that meets their exact needs.
                                    </p>
                                </div>
                            </motion.section>

                            <motion.section variants={fadeUp} className="mb-12">
                                <h2 className="mb-4 font-serif text-3xl text-[#2E2A26]">Human Expertise Where It Counts</h2>
                                <p className="mb-8 text-base leading-relaxed text-[#70665E]">
                                    Accuracy is essential. Every document can be reviewed by a licensed lawyer to ensure compliance and correctness.
                                    Once finalized, you can sign and send your documents instantly without extra tools or delays.
                                </p>

                                <div className="mb-12 flex flex-col bg-[#FFF8E5] md:flex-row">
                                    {/* Left Text */}
                                    <motion.div variants={fadeUp} className="p-6 md:w-2/5">
                                        <h3 className="mb-2 border-b border-[#A68A64]/40 pb-2 font-serif text-2xl text-[#2E2A26]">
                                            The Future of Legal Services Is Here
                                        </h3>
                                        <p className="text-base leading-relaxed text-[#70665E]">
                                            AI speed combined with human oversight represents the future of legal services. What once took days can
                                            now be done in minutes, making legal support accessible for everyone.
                                        </p>
                                    </motion.div>

                                    {/* Right Image */}
                                    <motion.figure variants={fadeUp} className="overflow-hidden md:w-3/5">
                                        <img
                                            src="../images/blog/pages/The-Future-of-Legal-Services-Is-Here.webp"
                                            alt="The Future of Legal Services"
                                            className="h-full w-full scale-115 object-cover"
                                        />
                                    </motion.figure>
                                </div>
                            </motion.section>

                            {/* CTA Section */}
                            <motion.section variants={fadeUp} className="mb-12">
                                <div className="mx-auto max-w-6xl px-6">
                                    <div className="mx-auto max-w-3xl bg-white p-12 text-center shadow-sm">
                                        <h2 className="mb-4 font-serif text-3xl text-[#2E2A26]">Legal Work, Simplified and Accessible</h2>
                                        <p className="mb-8 text-base leading-relaxed text-[#70665E]">
                                            With Daver & Daver, legal work is no longer a barrier. It is a seamless part of moving forward.
                                        </p>

                                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                                            <Link href="/products">
                                                <Button size="lg" className="cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]">
                                                    How It Works
                                                </Button>
                                            </Link>

                                            <Link href="/blogs/how-ai-is-transforming-legal-document-creation">
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    className="cursor-pointer rounded-none border-[#A68A64] text-[#3D2B1F] hover:bg-[#F2EDE4]"
                                                >
                                                    Next Article
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        </motion.div>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="sticky top-24 self-start bg-[#F2EDE4] p-6 lg:w-1/4">
                        <motion.h2
                            className="mb-6 font-serif text-2xl text-[#2E2A26]"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                        >
                            Related Articles
                        </motion.h2>

                        <motion.ul className="space-y-4" initial="hidden" whileInView="show" viewport={{ once: true }} variants={listVariants}>
                            {relatedArticles.map((article, idx) => (
                                <motion.li
                                    key={idx}
                                    className={`overflow-hidden bg-white p-3 ${idx !== relatedArticles.length - 1 ? 'border-b border-[#E8E2D6]' : ''}`}
                                    variants={itemVariants}
                                >
                                    <Link href={`/blogs/${article.slug}`} className="flex items-start gap-3 transition-colors hover:text-[#A68A64]">
                                        <img src={article.image} alt={article.title} className="h-16 w-16 flex-shrink-0 object-cover" />
                                        <div className="flex w-full flex-col justify-between">
                                            <span className="line-clamp-2 font-medium">{article.title}</span>
                                            <div className="mt-0.5 flex items-center gap-1 text-[0.625rem] text-[#A68A64]">
                                                <Calendar className="h-2 w-2 text-[#3D2B1F]" />
                                                <span>{article.date}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </aside>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default TheFutureOfLegalServices;
