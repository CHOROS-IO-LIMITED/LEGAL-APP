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

const HowAIisTransformingLegalDocumentCreation = ({ blog, relatedArticles }: Props) => {
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
                                    src="/images/blog/articles/How-AI-is-Transforming-Legal-Document-Creation.webp"
                                    alt="How AI is Transforming Legal Document Creation"
                                    className="h-full w-full scale-113 object-cover"
                                />
                            </motion.figure>

                            {/* Sections */}
                            <motion.section variants={fadeUp} className="mb-12">
                                <h2 className="mb-4 font-serif text-3xl text-[#2E2A26]">The Challenge of Legal Precision</h2>
                                <p className="mb-8 text-base leading-relaxed text-[#70665E]">
                                    Legal documents require precision. Even small errors can have serious consequences. Traditionally, drafting
                                    agreements meant relying on static templates or paying expensive consultations, which are often inefficient.
                                </p>

                                <div className="border-l-4 border-[#A68A64] bg-[#FFF8E5] p-6">
                                    <h3 className="mb-2 font-serif text-2xl text-[#2E2A26]">AI That Understands Your Context</h3>
                                    <p className="text-base leading-relaxed text-[#70665E]">
                                        At Daver & Daver, AI does more than automate. It interprets context from user inputs and generates tailored
                                        documents, including partnership agreements, service contracts, or formal letters. Every output is structured,
                                        clear, and personalized.
                                    </p>
                                </div>
                            </motion.section>

                            <motion.section variants={fadeUp} className="mb-12">
                                <h2 className="mb-4 font-serif text-3xl text-[#2E2A26]">Consistency, Speed, and Clarity</h2>
                                <p className="mb-8 text-base leading-relaxed text-[#70665E]">
                                    AI improves consistency, reduces human errors, and allows users to focus on their business goals rather than
                                    formatting details.
                                </p>

                                <div className="mb-12 flex flex-col bg-[#FFF8E5] md:flex-row">
                                    {/* Left Text */}
                                    <motion.div variants={fadeUp} className="p-6 md:w-2/5">
                                        <h3 className="mb-2 border-b border-[#A68A64]/40 pb-2 font-serif text-2xl text-[#2E2A26]">
                                            Verified by Human Experts
                                        </h3>
                                        <p className="text-base leading-relaxed text-[#70665E]">
                                            Legal accuracy is non-negotiable. That is why every document can be reviewed by a licensed lawyer. Users
                                            benefit from the speed of AI combined with professional validation.
                                        </p>
                                    </motion.div>

                                    {/* Right Image */}
                                    <motion.figure variants={fadeUp} className="overflow-hidden md:w-3/5">
                                        <img
                                            src="../images/blog/pages/Verified-by-Human-Experts.webp"
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
                                        <h2 className="mb-4 font-serif text-3xl text-[#2E2A26]">Faster, Smarter, Reliable Legal Documents</h2>
                                        <p className="mb-8 text-base leading-relaxed text-[#70665E]">
                                            Daver & Daver makes legal document creation faster, smarter, and more reliable.
                                        </p>

                                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                                            <Link href="/products">
                                                <Button size="lg" className="cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2F2118]">
                                                    How It Works
                                                </Button>
                                            </Link>

                                            <Link href="/blogs/why-small-businesses-need-smarter-legal-tools">
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
                            {relatedArticles.map((article) => (
                                <motion.li
                                    key={article.slug} // use slug as key
                                    className="overflow-hidden border-b border-[#E8E2D6] bg-white p-3 last:border-b-0"
                                    variants={itemVariants}
                                >
                                    <Link href={`/blogs/${article.slug}`} className="flex items-start gap-3 transition-colors hover:text-[#A68A64]">
                                        <img
                                            src={article.image || '/images/logo/dd-logo.png'} // fallback if missing
                                            alt={article.title}
                                            className="h-16 w-16 flex-shrink-0 object-cover"
                                        />
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

export default HowAIisTransformingLegalDocumentCreation;
