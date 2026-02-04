"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/api/axios';
import { FaCalendarAlt, FaUser, FaTag, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
// import SEO from '@/components/SEO'; // TODO: Replace with Metadata once we move to pure server components or use a wrapper

const NewsDetailPage = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const [article, setArticle] = useState<any>(null);
    const [latestNews, setLatestNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Current Article
                const res = await api.get(`/articles/${slug}`);
                if (res.data.success) {
                    setArticle(res.data.data);
                }

                // Fetch Latest News for Sidebar
                const newsRes = await api.get('/articles');
                if (newsRes.data.success) {
                    // Filter out current article and take top 5
                    const otherNews = newsRes.data.data.filter((item: any) => item.slug !== slug).slice(0, 5);
                    setLatestNews(otherNews);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) {
            fetchData();
        }
    }, [slug]);

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin h-10 w-10 border-2 border-brand-blue rounded-full border-t-transparent"></div></div>;
    if (!article) return <div className="min-h-screen pt-24 text-center">Article Not Found</div>;

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* 
            TODO: Add Metadata component or similar for SEO
            <SEO 
                title={article.title}
                description={article.summary}
                image={article.image}
                article={true}
                author={article.author}
                keywords={article.tags ? article.tags.join(', ') : ''}
            /> 
            */}

            {/* Hero Image */}
            <div className="h-[400px] relative w-full">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                    <div className="container mx-auto max-w-4xl">
                        <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                            {article.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 leading-tight">{article.title}</h1>
                        <div className="flex items-center gap-6 text-sm text-gray-300">
                            <span className="flex items-center gap-2"><FaUser className="text-brand-orange" /> {article.author}</span>
                            <span className="flex items-center gap-2"><FaCalendarAlt className="text-brand-orange" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl md:flex gap-12">

                {/* Main Content */}
                <div className="flex-1">
                    {/* Share Bar */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                        <span className="text-sm font-bold text-gray-500 uppercase">Share</span>
                        <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"><FaFacebook /></button>
                        <button className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition"><FaTwitter /></button>
                        <button className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition"><FaLinkedin /></button>
                        <button className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"><FaWhatsapp /></button>
                    </div>

                    <div
                        className="prose prose-lg max-w-none text-gray-700 font-serif leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    ></div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FaTag className="text-brand-orange" /> Related Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag: string, i: number) => (
                                    <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="md:w-80 mt-12 md:mt-0 space-y-8">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-lg mb-4">Latest Updates</h3>
                        {latestNews.length > 0 ? (
                            <ul className="space-y-4">
                                {latestNews.map((item) => (
                                    <li key={item._id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                                        <Link href={`/news/${item.slug}`} className="text-sm font-medium text-gray-800 hover:text-brand-blue hover:underline line-clamp-2">
                                            {item.title}
                                        </Link>
                                        <span className="block text-xs text-gray-500 mt-1">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No other updates found.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NewsDetailPage;
