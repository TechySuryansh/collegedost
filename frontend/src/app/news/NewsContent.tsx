"use client";

import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';

const NewsContent = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    // Initialize filter from URL or default to 'All'
    // In Next.js App Router, usage of useSearchParams is reactive.
    const filter = searchParams.get('category') || 'All';

    // Fetch articles
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const res = await api.get('/articles');
                if (res.data.success && Array.isArray(res.data.data)) {
                    setArticles(res.data.data);
                } else {
                    setArticles([]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const categories = ['All', 'Exam News', 'College News', 'Admission Alert', 'General'];

    const filteredArticles = filter === 'All'
        ? articles
        : articles.filter(article => article.category === filter);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 mb-10">
                <div className="container mx-auto px-4 py-12 text-center">
                    <span className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-2 block">Stay Updated</span>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">Education News & Articles</h1>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                href={cat === 'All' ? '/news' : `/news?category=${encodeURIComponent(cat)}`}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-brand-blue text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-blue border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map(article => (
                                <article key={article._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-blue shadow-sm">
                                            {article.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(article.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><FaUser /> {article.author}</span>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
                                            <Link href={`/news/${article.slug}`}>{article.title}</Link>
                                        </h2>

                                        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                                            {article.summary}
                                        </p>

                                        <Link href={`/news/${article.slug}`} className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm hover:gap-3 transition-all mt-auto">
                                            Read Article <FaArrowRight />
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <h3 className="text-xl font-medium text-gray-600">No articles found in this category.</h3>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsContent;
