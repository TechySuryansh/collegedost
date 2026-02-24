"use client";

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaChevronRight } from 'react-icons/fa';

interface RankingCard {
    title: string;
    href: string;
}

const engineeringRankings: RankingCard[] = [
    { title: 'Top Engineering Colleges in India', href: '/tools/colleges?stream=Engineering&sort=nirfRank' },
    { title: 'Top IITs in India', href: '/tools/colleges?stream=Engineering&search=Indian+Institute+of+Technology&sort=nirfRank' },
    { title: 'Top NITs in India', href: '/tools/colleges?stream=Engineering&search=National+Institute+of+Technology&sort=nirfRank' },
    { title: 'Top Government Engineering Colleges', href: '/tools/colleges?stream=Engineering&ownership=Government&sort=nirfRank' },
    { title: 'Top Private Engineering Colleges', href: '/tools/colleges?stream=Engineering&ownership=Private&sort=nirfRank' },
    { title: 'Top B.Tech Colleges', href: '/tools/colleges?stream=Engineering&search=B.Tech&sort=nirfRank' },
    { title: 'Top Computer Science Colleges', href: '/tools/colleges?stream=Engineering&search=Computer+Science&sort=nirfRank' },
    { title: 'Top Mechanical Engineering Colleges', href: '/tools/colleges?stream=Engineering&search=Mechanical&sort=nirfRank' },
];

const EngineeringRankings: React.FC = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Top Engineering Rankings
                    </h2>
                    <Link
                        href="/tools/colleges?search=Engineering&sort=nirfRank"
                        className="flex items-center gap-2 text-primary hover:text-secondary font-semibold text-sm transition-colors"
                    >
                        View All
                        <FaArrowRight className="text-xs" />
                    </Link>
                </div>

                {/* Rankings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {engineeringRankings.map((ranking, index) => (
                        <Link
                            key={index}
                            href={ranking.href}
                            className="group bg-white hover:bg-primary/5 border border-gray-200 hover:border-primary rounded-xl p-4 transition-all duration-200 flex items-center justify-between"
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

export default EngineeringRankings;
