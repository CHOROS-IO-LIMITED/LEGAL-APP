import { motion, TargetAndTransition } from 'framer-motion';
import { ArrowRight, Calendar, Eye } from 'lucide-react';

interface BlogArticle {
    id: number;
    slug: string;
    title: string;
    description: string;
    image: string;
    author?: string;
    authorLogo?: string;
    views?: number;
    date?: string;
}

interface BlogFeaturedProps {
    blog: BlogArticle;
}

export default function BlogFeatured({ blog }: BlogFeaturedProps) {
    const arrowVariants: Record<string, TargetAndTransition> = {
        initial: { x: 0 },
        hover: { x: 6, transition: { duration: 0.3, ease: 'easeOut' as const } },
    };

    return (
        <section className="bg-[#FCF9F2] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    className="mx-auto mb-12 max-w-3xl text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12 } },
                    }}
                >
                    <motion.h2
                        className="font-serif text-3xl text-[#2E2A26] md:text-4xl"
                        variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
                        }}
                    >
                        Featured <span className="text-[#3D2B1F]">Stories</span>
                    </motion.h2>

                    <motion.p
                        className="mt-4 text-base leading-relaxed text-[#70665E]"
                        variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
                        }}
                    >
                        Explore our hand-picked articles, insights, and stories. Stay inspired and informed with each post.
                    </motion.p>
                </motion.div>

                {/* Card */}
                <motion.a
                    href={`/blogs/${blog.slug}`}
                    className="group relative mx-auto flex max-w-6xl flex-col overflow-hidden border border-[#E8E2D6] bg-white md:flex-row"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
                >
                    {/* Image */}
                    <motion.div
                        className="relative h-64 overflow-hidden md:h-auto md:w-1/2"
                        initial={{ opacity: 0, scale: 1 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: 'easeOut' } }}
                    >
                        <img src={blog.image} alt={blog.title} className="h-full w-full object-cover transition-transform duration-300" />
                        <span className="absolute top-4 left-4 rounded-none border border-[#A68A64] bg-[#FFF8E5] px-3 py-1 text-xs font-semibold text-[#A68A64]">
                            Featured
                        </span>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        className="flex flex-col justify-center p-10 md:w-1/2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                    >
                        <h3 className="mb-4 font-serif text-2xl text-[#2E2A26] md:text-2xl">{blog.title}</h3>
                        <p className="mb-6 text-base leading-relaxed text-[#70665E]">{blog.description}</p>

                        <div className="mb-4 inline-flex items-center gap-2 font-semibold text-[#3D2B1F]">
                            Read Article
                            <motion.span
                                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                                initial={{ x: 0 }}
                                animate={{ x: 0 }}
                            >
                                <ArrowRight className="h-4 w-4" />
                            </motion.span>
                        </div>

                        <div className="my-4 h-px w-full bg-[#E8E2D6]" />

                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-[#A68A64]">
                            <div className="flex items-center gap-2">
                                {blog.authorLogo && <img src={blog.authorLogo} alt={blog.author} className="h-5 w-5" />}
                                <span>{blog.author}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-[#3D2B1F]" />
                                <span>{blog.date}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-[#3D2B1F]" />
                                <span>{blog.views} views</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.a>
            </div>
        </section>
    );
}
