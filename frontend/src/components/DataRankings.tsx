"use client";

import React from 'react';
import { FaChartBar, FaArrowRight, FaMagic } from 'react-icons/fa';
import Link from 'next/link';

interface RankingItem {
    type: 'top' | 'exam';
    label: string;
    href: string;
}

interface DataRankingsProps {
    items?: RankingItem[];
}

const defaultItems: RankingItem[] = [
    { type: 'top', label: 'Engineering Colleges', href: '/tools/colleges?stream=Engineering' },
    { type: 'top', label: 'MBA Colleges', href: '/tools/colleges?stream=Management' },
    { type: 'top', label: 'Medical Colleges', href: '/tools/colleges?stream=Medicine' },
    { type: 'exam', label: 'JEE Main', href: '/predictors/jee-main-predictor' },
    { type: 'exam', label: 'NEET', href: '/predictors/neet-predictor' },
    { type: 'exam', label: 'CAT', href: '/exams/cat' },
];

const DataRankings: React.FC<DataRankingsProps> = ({ items = defaultItems }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Data & Rankings Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-200 transition-colors duration-500"></div>

                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                        <FaChartBar className="text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-text-main-light">Data & Rankings</h3>
                </div>

                <p className="text-text-muted-light mb-8 max-w-lg relative z-10">
                    Access simplified data on over 30,000 Colleges, 500 Exams and 500 Courses across domains and regions all over India.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="p-3 rounded-lg bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all text-center"
                        >
                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                                {item.type === 'top' ? 'Top' : 'Exam'}
                            </span>
                            <span className="text-sm font-semibold text-text-main-light">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Smart Predictors Card */}
            <div className="lg:col-span-5 bg-linear-to-br from-primary to-indigo-700 rounded-3xl p-8 lg:p-10 shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")" }}></div>

                <div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                        <FaMagic className="text-2xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold font-display mb-2">Smart Predictors</h3>
                    <p className="text-white/80 mb-6">Analyze your chances. Enter your score or rank to get a tailored list of colleges.</p>
                </div>

                <div className="space-y-3 relative z-10">
                    <Link
                        href="/predictors"
                        className="w-full bg-white text-primary hover:bg-indigo-50 font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-between group transition-all"
                    >
                        <span>College Predictors</span>
                        <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/predictors/rank-predictor"
                        className="w-full bg-indigo-800/50 text-white hover:bg-indigo-800 font-bold py-3 px-4 rounded-xl border border-white/20 flex items-center justify-between group transition-all"
                    >
                        <span>Rank Predictors</span>
                        <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DataRankings;
