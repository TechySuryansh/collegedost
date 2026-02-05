"use client";

import React from 'react';
import { FaBolt } from 'react-icons/fa';
import Link from 'next/link';

interface NewsItem {
    id?: string;
    title?: string;
    slug?: string;
    [key: string]: any;
}

interface NewsSectionProps {
    items?: NewsItem[] | string[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ items = [] }) => {
    const newsList = items.length > 0 ? items : ["Welcome to CollegeDost", "Stay updated with latest news"];

    return (
        <div className="bg-brand-dark border-y border-white/5 py-3 overflow-hidden relative">
            <div className="container mx-auto px-4 flex items-center">
                <div className="bg-linear-to-r from-brand-orange to-brand-orange-light text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2 mr-6 shrink-0 shadow-lg shadow-brand-orange/20 z-10 relative">
                    <FaBolt className="animate-pulse" /> LATEST UPDATES
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <div className="flex gap-4 animate-scroll w-max hover:paused">
                        {[...newsList, ...newsList].map((news, idx) => {
                            const title = typeof news === 'string' ? news : news.title;
                            const link = typeof news !== 'string' && news.slug ? `/news/${news.slug}` : '#';

                            return (
                                <Link href={link} key={idx} className="text-sm text-gray-400 font-medium flex items-center gap-3 hover:text-white transition-colors whitespace-nowrap">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                                    {title}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsSection;
