"use client";

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaChevronRight } from 'react-icons/fa';

interface RankingCard {
    title: string;
    href: string;
}

const managementRankings: RankingCard[] = [
    { title: 'Top MBA Colleges in India', href: '/tools/colleges?stream=Management&sort=nirfRank' },
    { title: 'Top IIMs in India', href: '/tools/colleges?stream=Management&search=IIM&sort=nirfRank' },
    { title: 'Top BBA Colleges', href: '/tools/colleges?stream=Management&search=BBA&sort=nirfRank' },
    { title: 'Top Government MBA Colleges', href: '/tools/colleges?stream=Management&ownership=Government&sort=nirfRank' },
    { title: 'Top Private MBA Colleges', href: '/tools/colleges?stream=Management&ownership=Private&sort=nirfRank' },
    { title: 'MBA Colleges with Best ROI', href: '/tools/colleges?stream=Management&sort=nirfRank' },
    { title: 'Top Executive MBA Colleges', href: '/tools/colleges?stream=Management&search=Executive&sort=nirfRank' },
    { title: 'Distance MBA Rankings', href: '/tools/colleges?stream=Management&search=Distance&sort=nirfRank' },
];

const ManagementRankings: React.FC = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Top Management Rankings
                    </h2>
                    <Link
                        href="/tools/colleges?search=MBA&sort=nirfRank"
                        className="flex items-center gap-2 text-primary hover:text-secondary font-semibold text-sm transition-colors"
                    >
                        View All
                        <FaArrowRight className="text-xs" />
                    </Link>
                </div>

                {/* Rankings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {managementRankings.map((ranking, index) => (
                        <Link
                            key={index}
                            href={ranking.href}
                            className="group bg-gray-50 hover:bg-primary/5 border border-gray-200 hover:border-primary rounded-xl p-4 transition-all duration-200 flex items-center justify-between"
                        >
                            <span className="text-gray-700 group-hover:text-primary font-medium text-sm transition-colors">
                                {ranking.title}
                            </span>
                            <FaChevronRight className="text-gray-400 group-hover:text-primary text-xs transition-colors flex-shrink-0 ml-2" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ManagementRankings;
