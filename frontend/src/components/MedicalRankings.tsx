"use client";

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaChevronRight } from 'react-icons/fa';

interface RankingCard {
    title: string;
    href: string;
}

const medicalRankings: RankingCard[] = [
    { title: 'Top Medical Colleges in India', href: '/tools/colleges?stream=Medicine&sort=nirfRank' },
    { title: 'Top AIIMS in India', href: '/tools/colleges?stream=Medicine&search=AIIMS&sort=nirfRank' },
    { title: 'Top MBBS Colleges', href: '/tools/colleges?stream=Medicine&search=MBBS&sort=nirfRank' },
    { title: 'Top Government Medical Colleges', href: '/tools/colleges?stream=Medicine&ownership=Government&sort=nirfRank' },
    { title: 'Top Private Medical Colleges', href: '/tools/colleges?stream=Medicine&ownership=Private&sort=nirfRank' },
    { title: 'Top Dental Colleges', href: '/tools/colleges?stream=Medicine&search=Dental&sort=nirfRank' },
    { title: 'Top Pharmacy Colleges', href: '/tools/colleges?stream=Pharmacy&sort=nirfRank' },
    { title: 'Top Nursing Colleges', href: '/tools/colleges?stream=Medicine&search=Nursing&sort=nirfRank' },
];

const MedicalRankings: React.FC = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Top Medical Rankings
                    </h2>
                    <Link
                        href="/tools/colleges?search=Medical&sort=nirfRank"
                        className="flex items-center gap-2 text-primary hover:text-secondary font-semibold text-sm transition-colors"
                    >
                        View All
                        <FaArrowRight className="text-xs" />
                    </Link>
                </div>

                {/* Rankings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {medicalRankings.map((ranking, index) => (
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

export default MedicalRankings;
