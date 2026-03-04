"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/api/axios';
import { FaUser, FaCalendarAlt, FaTag, FaChevronRight } from 'react-icons/fa';

interface Article {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: string;
    author: string;
    tags?: string[];
    createdAt: string;
    image?: string;
}

const NewsDetailPage = () => {
    const params = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [recentNews, setRecentNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.slug) {
            fetchArticleAndRecent();
        }
    }, [params.slug]);

    const fetchArticleAndRecent = async () => {
        try {
            // Fetch the main article
            const res = await api.get(`/articles/${params.slug}`);
            if (res.data.success) {
                setArticle(res.data.data);
            }

            // Fetch recent news for sidebar
            const newsRes = await api.get('/articles/ai-news');
            if (newsRes.data.success) {
                setRecentNews(newsRes.data.data.filter((a: Article) => a.slug !== params.slug).slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching article content:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h1 className="text-2xl font-bold">Article not found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 lg:pt-32 pb-20 bg-[#f8f9fa]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-8 uppercase tracking-wider">
                    <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
                    <FaChevronRight size={8} />
                    <Link href="/news" className="hover:text-primary transition-colors">NEWS</Link>
                    <FaChevronRight size={8} />
                    <span className="text-gray-900 truncate max-w-[200px]">{article.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        <article className="bg-white rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-100">
                            {/* Category Badge */}
                            <div className="mb-6 flex items-center gap-3">
                                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                    LIVE
                                </span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{article.category}</span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                                {article.title}
                            </h1>

                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400 text-xs font-bold border-b border-gray-50 pb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                                        <FaUser size={12} />
                                    </div>
                                    <span className="text-gray-900">{article.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt size={12} />
                                    <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div
                                className="prose prose-lg max-w-none text-gray-800 leading-relaxed
                                           prose-headings:text-gray-900 prose-headings:font-black prose-headings:mb-6
                                           prose-p:mb-8 prose-li:mb-3 prose-strong:text-gray-900
                                           prose-img:rounded-xl prose-img:shadow-md"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center gap-3 flex-wrap">
                                    <FaTag className="text-gray-400 rotate-90" size={14} />
                                    {article.tags.map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Bottom 'Also Read' Section */}
                            <div className="mt-16 bg-gray-50 rounded-xl p-6 border-l-4 border-primary">
                                <h3 className="text-lg font-black text-gray-900 mb-4">Also Read</h3>
                                <div className="space-y-4">
                                    {recentNews.slice(0, 3).map(news => (
                                        <Link
                                            key={news._id}
                                            href={`/news/${news.slug}`}
                                            className="block group"
                                        >
                                            <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-white transition-all">
                                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                                                <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                                                    {news.title}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            {/* Latest Updates Sidebar */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-900 text-white px-6 py-4">
                                    <h3 className="font-black text-sm uppercase tracking-widest">Latest Updates</h3>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {recentNews.map((news) => (
                                        <Link
                                            key={news._id}
                                            href={`/news/${news.slug}`}
                                            className="block p-5 hover:bg-primary/5 transition-colors group"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black text-primary uppercase">{news.category}</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                {news.title}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 font-bold mt-2">
                                                {new Date(news.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                                <div className="p-4 bg-gray-50 text-center">
                                    <Link href="/news" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">
                                        View All News
                                    </Link>
                                </div>
                            </div>

                            {/* Ad Space/Newsletter or Similar placeholder */}
                            <div className="bg-gradient-to-br from-primary to-purple-700 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative group">
                                <div className="relative z-10 text-center">
                                    <h3 className="text-xl font-black mb-4">Never Miss an Update!</h3>
                                    <p className="text-white/80 text-sm font-medium mb-6 leading-relaxed">
                                        Get instant alerts on Exam Dates, Result Notifications & Admission Guides.
                                    </p>
                                    <button className="w-full bg-white text-primary font-black py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-xl">
                                        Subscribe Now
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetailPage;
