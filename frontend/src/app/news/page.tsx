"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FaSearch, FaChevronRight, FaRegComment, FaShareAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';
import api from '@/api/axios';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

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

const NewsListPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [recentNews, setRecentNews] = useState<Article[]>([]);

    const categories = ['All', 'Exam News', 'College News', 'Admission Alert', 'General'];

    const fetchNews = useCallback(async (currentCategory: string, currentSearch: string) => {
        setLoading(true);
        try {
            const res = await api.get('/articles', {
                params: {
                    category: currentCategory === 'All' ? undefined : currentCategory,
                    search: currentSearch || undefined,
                    limit: 20
                }
            });
            if (res.data.success) {
                setArticles(res.data.data);
            }

            // Fetch recent news for sidebar if not already loaded
            if (recentNews.length === 0) {
                const newsRes = await api.get('/articles/ai-news');
                if (newsRes.data.success) {
                    setRecentNews(newsRes.data.data.slice(0, 5));
                }
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    }, [recentNews.length]);

    const debouncedSearch = useCallback(
        debounce((val: string) => {
            fetchNews(category, val);
        }, 500),
        [category, fetchNews]
    );

    useEffect(() => {
        fetchNews(category, '');
    }, [category, fetchNews]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    return (
        <div className="min-h-screen pt-24 lg:pt-32 pb-20 bg-[#f8f9fa]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header & Search */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-6">Latest Education News & Updates</h1>
                    <div className="relative max-w-2xl">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search news, exams, colleges..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-700"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${category === cat
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {cat === 'All' ? 'ALL NEWS' : cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* News List */}
                    <div className="lg:col-span-8 space-y-6">
                        {loading ? (
                            <div className="py-20 flex justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : articles.length > 0 ? (
                            articles.map((article, index) => (
                                <motion.div
                                    key={article._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex gap-6"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {article.isLive && (
                                                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                                                    <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                                                    LIVE
                                                </span>
                                            )}
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{article.category}</span>
                                        </div>
                                        <Link href={`/news/${article.slug}`}>
                                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-tight">
                                                {article.title}
                                            </h2>
                                        </Link>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                                            {article.summary}
                                        </p>
                                        <div className="flex items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5 text-gray-900">
                                                <FaUser size={10} className="text-gray-400" />
                                                {article.author}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FaCalendarAlt size={10} />
                                                {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-32 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-50 hidden sm:block shadow-inner">
                                        {article.image ? (
                                            <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                <img src={`https://placehold.co/400x300/f8fafc/14b8a6?text=News`} alt="Placeholder" className="w-full h-full object-cover opacity-50" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
                                <p className="text-gray-500 font-bold">No news articles found matching your criteria.</p>
                                <button
                                    onClick={() => { setCategory('All'); setSearch(''); }}
                                    className="mt-4 text-primary font-black uppercase text-xs hover:underline"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Trending Sidebar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                            <div className="bg-gray-900 text-white px-6 py-4">
                                <h3 className="font-black text-sm uppercase tracking-widest">Trending Now</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {recentNews.map((news) => (
                                    <Link
                                        key={news._id}
                                        href={`/news/${news.slug}`}
                                        className="block p-5 hover:bg-primary/5 transition-colors group"
                                    >
                                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            {news.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-tight">{news.category}</span>
                                            <span className="text-[10px] text-gray-300">•</span>
                                            <span className="text-[10px] text-gray-400 font-bold">
                                                {new Date(news.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Banner */}
                        <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-2xl p-8 text-white shadow-lg sticky top-[480px]">
                            <h3 className="text-xl font-black mb-4">Admissions 2026?</h3>
                            <p className="text-white/80 text-sm font-medium mb-6">
                                Get personalized college recommendations based on your preferences and scores.
                            </p>
                            <Link href="/predictors" className="block w-full bg-white text-primary text-center font-black py-3 rounded-xl hover:bg-gray-100 transition-colors">
                                Start Predicting
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsListPage;
