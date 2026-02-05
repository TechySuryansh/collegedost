"use client";

import React from 'react';
import { FaArrowUp, FaInfoCircle, FaMedal } from 'react-icons/fa';

interface NewsItem {
    type: 'new' | 'trending' | 'info' | 'alert' | 'award';
    text: string;
    link?: string;
}

interface NewsTickerProps {
    items?: NewsItem[];
}

const defaultNewsItems: NewsItem[] = [
    { type: 'new', text: 'JEE Advanced 2026 Registration Opens Next Week' },
    { type: 'trending', text: 'IIT Delhi tops Engineering Rankings for 5th consecutive year' },
    { type: 'info', text: 'NEET 2026 Exam Date Announced: May 4, 2026' },
    { type: 'alert', text: 'CAT 2025 Registration closes in 5 days' },
    { type: 'award', text: 'Top Engineering Colleges Ranking Released - Check Now' },
];

const NewsTicker: React.FC<NewsTickerProps> = ({ items = defaultNewsItems }) => {
    const getBadge = (type: NewsItem['type']) => {
        switch (type) {
            case 'new':
                return <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">NEW</span>;
            case 'alert':
                return <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded">ALERT</span>;
            case 'trending':
                return <FaArrowUp className="text-green-500" />;
            case 'info':
                return <FaInfoCircle className="text-blue-500" />;
            case 'award':
                return <FaMedal className="text-purple-500" />;
            default:
                return null;
        }
    };

    // Duplicate items for seamless loop
    const allItems = [...items, ...items];

    const renderItem = (item: NewsItem) => {
        const content = (
            <>
                {getBadge(item.type)}
                <span className="text-sm text-text-main-light font-medium">
                    {item.text}
                </span>
            </>
        );

        if (item.link) {
            return (
                <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                    {content}
                </a>
            );
        }

        return <div className="flex items-center gap-2">{content}</div>;
    };

    return (
        <div className="bg-surface-light border-y border-gray-200 py-3 overflow-hidden relative z-20">
            <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
                {allItems.map((item, index) => (
                    <div 
                        key={index} 
                        className="px-4 border-r border-gray-200 last:border-r-0"
                    >
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsTicker;
