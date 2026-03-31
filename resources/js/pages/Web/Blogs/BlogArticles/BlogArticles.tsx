import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import React from 'react';

interface BlogArticle {
    id: number;
    slug: string;
    title: string;
    description: string;
    image: string;
    author?: string;
    views?: number;
}

interface BlogArticlesProps {
    blogs: BlogArticle[];
}

const BlogArticles: React.FC<BlogArticlesProps> = ({ blogs }) => {
    return (
        <section className="bg-[#F2EDE4] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    className="grid items-center gap-10 md:grid-cols-2"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <motion.h2
                        className="font-serif text-3xl text-[#2E2A26] md:text-4xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        Latest <span className="text-[#3D2B1F]">Legal & AI</span> Articles
                    </motion.h2>

                    <motion.p
                        className="border-l border-[#E6DED2] pl-8 text-base leading-relaxed text-[#70665E]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                    >
                        Explore key insights on AI, legal automation, and smarter workflows that empower businesses to create reliable legal documents
                        faster.
                    </motion.p>
                </motion.div>

                <motion.div
                    className="mt-16 grid gap-8 md:grid-cols-3"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.15 } },
                    }}
                >
                    {blogs.map((blog) => (
                        <motion.a
                            key={blog.id}
                            href={`/blogs/${blog.slug}`}
                            className="group flex flex-col overflow-hidden bg-white shadow-sm"
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
                        >
                            <div className="h-48 w-full overflow-hidden">
                                <motion.img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="h-full w-full scale-111 object-cover"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                />
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="mb-2 font-medium text-[#1A1614]">{blog.title}</h3>
                                <p className="text-sm leading-relaxed text-[#70665E]">{blog.description}</p>

                                <div className="mt-auto pt-2">
                                    <div className="my-4 h-px w-full bg-[#E8E2D6]" />

                                    <div className="flex items-center justify-between text-sm text-[#A68A64]">
                                        <div className="flex items-center gap-2">
                                            <img src="/images/logo/dd-logo.png" alt={blog.author} className="h-5 w-5" />
                                            <span>{blog.author}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Eye className="h-5 w-5 text-[#3D2B1F]" />
                                            <span>{blog.views} views</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default BlogArticles;
