"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/api/axios';

interface Article {
    _id: string;
    title: string;
    slug: string;
    category: string;
    summary: string;
    author: string;
    image?: string;
    createdAt: string;
}

const FeaturedArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedArticles = async () => {
            try {
                const res = await api.get('/articles?isFeatured=true&limit=4');
                if (res.data.success) {
                    setArticles(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching featured articles:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedArticles();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 font-display">Featured Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="flex-1 space-y-3">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                            </div>
                            <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (articles.length === 0) return null;

    return (
        <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-display">Featured Articles</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {articles.map((article) => (
                    <Link
                        key={article._id}
                        href={`/tools/news/${article.slug}`}
                        className="group flex gap-4 items-start hover:bg-gray-50/50 p-2 -m-2 rounded-xl transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-primary-blue transition-colors mb-2 line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                                {article.summary}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 gap-2">
                                <span className="font-medium text-gray-700">{article.author}</span>
                                <span>•</span>
                                <span>{formatDate(article.createdAt)}</span>
                            </div>
                        </div>

                        {article.image && (
                            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-100">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link
                    href="/tools/news"
                    className="inline-flex items-center gap-2 px-8 py-2.5 border border-primary-blue text-primary-blue font-semibold rounded-lg hover:bg-blue-50 transition-all group"
                >
                    View All Articles
                    <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </section>
    );
};

export default FeaturedArticles;
