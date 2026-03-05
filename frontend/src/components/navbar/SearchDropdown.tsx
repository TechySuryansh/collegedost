"use client";

import React from 'react';
import Link from 'next/link';
import { FaArrowTrendUp } from 'react-icons/fa6';

interface SearchResult {
    colleges: any[];
    exams: any[];
    courses: any[];
}

interface SearchDropdownProps {
    results: SearchResult;
    isVisible: boolean;
    onClose: () => void;
    isLoading: boolean;
    searchQuery: string;
}

// Trending searches shown when the bar is focused but empty
const TRENDING_SEARCHES = [
    { name: 'IIT Delhi', category: 'College', href: '/tools/colleges/indian-institute-of-technology-delhi' },
    { name: 'JEE Main', category: 'Exam', href: '/tools/exams/jee-main' },
    { name: 'NEET UG', category: 'Exam', href: '/predictors/neet-predictor' },
    { name: 'B.Tech', category: 'Course', href: '/courses/btech' },
    { name: 'MBA', category: 'Course', href: '/courses/mba' },
    { name: 'IIT Bombay', category: 'College', href: '/tools/colleges/indian-institute-of-technology-bombay' },
    { name: 'AIIMS Delhi', category: 'College', href: '/tools/colleges/aiims-delhi' },
    { name: 'CAT', category: 'Exam', href: '/tools/exams/cat' },
];

/** Highlight matching parts of text with bold */
const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query.trim()) return <>{text}</>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <strong key={i} className="font-bold text-primary">{part}</strong>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

/** Category badge colors */
const categoryStyles: Record<string, string> = {
    College: 'bg-primary/10 text-primary',
    Exam: 'bg-secondary/10 text-secondary',
    Course: 'bg-blue-50 text-blue-600',
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({ results, isVisible, onClose, isLoading, searchQuery }) => {
    if (!isVisible) return null;

    const hasQuery = searchQuery.trim().length >= 2;
    const hasResults = results.colleges.length > 0 || results.exams.length > 0 || results.courses.length > 0;

    // Flatten results into a unified list
    const flatResults: { name: string; category: string; href: string }[] = [];
    results.colleges.forEach((c) => flatResults.push({
        name: c.name,
        category: 'College',
        href: `/tools/colleges/${c.slug}`,
    }));
    results.exams.forEach((e) => flatResults.push({
        name: e.examName,
        category: 'Exam',
        href: `/tools/exams/${e.slug}`,
    }));
    results.courses.forEach((c) => flatResults.push({
        name: c.name,
        category: 'Course',
        href: `/courses/${c.slug}`,
    }));

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden z-[60]">
            {/* ── Trending Searches ── */}
            {!hasQuery && (
                <div className="py-2">
                    <div className="px-5 pt-3 pb-2">
                        <span className="text-[10px] font-bold text-text-muted-light uppercase tracking-[1.5px]">
                            Trending Searches
                        </span>
                    </div>
                    {TRENDING_SEARCHES.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center justify-between px-5 py-2.5 hover:bg-primary/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <FaArrowTrendUp className="text-primary/50 text-xs" />
                                <span className="text-[13px] text-gray-700">{item.name}</span>
                            </div>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryStyles[item.category] || 'bg-gray-100 text-gray-500'}`}>
                                {item.category}
                            </span>
                        </Link>
                    ))}
                </div>
            )}

            {/* ── Loading ── */}
            {hasQuery && isLoading && (
                <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <p className="mt-2 text-xs text-text-muted-light">Searching...</p>
                </div>
            )}

            {/* ── No Results ── */}
            {hasQuery && !isLoading && !hasResults && (
                <div className="py-8 text-center text-text-muted-light">
                    <p className="text-sm">No results for &quot;{searchQuery}&quot;</p>
                    <p className="text-xs mt-1">Try a different keyword</p>
                </div>
            )}

            {/* ── Search Results ── */}
            {hasQuery && !isLoading && hasResults && (
                <div className="max-h-[60vh] overflow-y-auto py-2">
                    {flatResults.map((item, idx) => (
                        <Link
                            key={`${item.category}-${idx}`}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center justify-between px-5 py-2.5 hover:bg-primary/5 transition-colors"
                        >
                            <span className="text-[13px] text-gray-700 truncate flex-1 min-w-0">
                                <HighlightText text={item.name} query={searchQuery} />
                            </span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ml-3 shrink-0 ${categoryStyles[item.category] || 'bg-gray-100 text-gray-500'}`}>
                                {item.category}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;
