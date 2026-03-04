"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaRegComment, FaShareAlt, FaEye, FaChevronRight } from 'react-icons/fa';
import api from '@/api/axios';
import { motion } from 'framer-motion';

interface Article {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    author: string;
    image?: string;
    isLive?: boolean;
    createdAt: string;
}

const LatestNews: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await api.get('/articles/ai-news');
            if (res.data.success) {
                setArticles(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching AI news:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-10">Latest News & Articles</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                    {articles.slice(0, 6).map((article, index) => (
                        <motion.div
                            key={article._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-4 group cursor-pointer"
                        >
                            <div className="flex-1">
                                <Link href={`/news/${article.slug}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {article.isLive && (
                                            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                                LIVE
                                            </span>
                                        )}
                                        <span className="text-xs font-bold text-gray-900 line-clamp-2 hover:text-primary transition-colors leading-snug text-lg">
                                            {article.title}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed">
                                        {article.summary}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                                        <span>{article.author}</span>
                                        <span>•</span>
                                        <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    {/* Optional stats - matching screenshot style */}
                                    <div className="flex items-center gap-6 mt-3 text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <FaRegComment size={14} />
                                            <span className="text-[11px] font-bold">{Math.floor(Math.random() * 50) + 10} Comments</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaShareAlt size={14} />
                                            <span className="text-[11px] font-bold">{Math.floor(Math.random() * 100) + 50} Shares</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="w-24 h-24 md:w-32 md:h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-gray-100 flex items-center justify-center">
                                {article.image ? (
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                ) : (
                                    <div className="text-primary/20 p-4 text-center">
                                        <img src={`https://placehold.co/400x300/f8fafc/14b8a6?text=News`} alt="Placeholder" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/news" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-2.5 rounded-lg font-bold hover:bg-primary hover:text-white transition-all">
                        View All Updates <FaChevronRight size={10} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestNews;
