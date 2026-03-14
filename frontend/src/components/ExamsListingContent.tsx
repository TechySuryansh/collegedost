"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronRight, FaCalendarAlt, FaUniversity, FaSpinner, FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import api from '@/api/axios';

interface ExamDate {
    event: string;
    date: string;
}

interface ExamListItem {
    examName: string;
    slug: string;
    fullForm: string;
    conductingBody: string;
    examLevel: string;
    upcomingDates: ExamDate[];
    quickLinks: string[];
}

interface Props {
    category: 'Banking' | 'SSC' | 'Teaching';
    title: string;
    description: string;
}

const ExamsListingContent: React.FC<Props> = ({ category, title, description }) => {
    const [exams, setExams] = useState<ExamListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await api.get(`/exams/category/${category.toLowerCase()}/list`);
                if (res.data.success) {
                    setExams(res.data.data);
                }
            } catch (err: any) {
                console.error(`Error fetching ${category} exams:`, err);
                setError(`Failed to load ${category} exams list`);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, [category]);

    const filteredExams = exams.filter(exam =>
        exam.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.fullForm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.conductingBody.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center gap-6">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-100 rounded-full animate-spin border-t-purple-600"></div>
                <FaSpinner className="absolute inset-0 m-auto text-purple-600 text-2xl animate-pulse" />
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Loading {category} Exams...</h3>
                <p className="text-sm text-gray-500 max-w-md">
                    Fetching the complete list of {category} exams in India. This may take a moment on first load.
                </p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md">
                <p className="text-red-600 font-bold mb-2">Something went wrong</p>
                <p className="text-gray-500 text-sm">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center text-xs text-gray-500 gap-2">
                        <Link href="/" className="hover:text-purple-600">Home</Link>
                        <FaChevronRight className="text-[10px]" />
                        <span className="text-gray-400">Sarkari Exams</span>
                        <FaChevronRight className="text-[10px]" />
                        <span className="text-gray-900 font-medium">{category} Exams</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 py-10 md:py-14">
                    <h1 className="text-3xl md:text-4xl font-black mb-4">
                        {title}
                    </h1>
                    <p className="text-purple-100 max-w-3xl text-sm md:text-base leading-relaxed mb-8">
                        {description}
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${category.toLowerCase()} exams...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FaUniversity className="text-purple-600 text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Exams</p>
                            <p className="font-black text-gray-900">{filteredExams.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaCalendarAlt className="text-green-600 text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Year</p>
                            <p className="font-black text-gray-900">2026</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exams List */}
            <div className="container mx-auto px-4 mt-8">
                <div className="space-y-6">
                    {filteredExams.map((exam, index) => (
                        <div
                            key={exam.slug}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                    {/* Left: Exam Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-4">
                                            {/* Exam Icon */}
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg ${['bg-purple-600', 'bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-fuchsia-600', 'bg-cyan-600', 'bg-teal-600', 'bg-emerald-600'][index % 8]
                                                }`}>
                                                {exam.examName.charAt(0)}
                                            </div>
                                            <div>
                                                <Link
                                                    href={`/exams/${exam.slug}`}
                                                    className="text-xl font-black text-gray-900 hover:text-purple-600 transition group-hover:text-purple-600"
                                                >
                                                    {exam.examName} 2026
                                                </Link>
                                                <p className="text-sm text-gray-500 font-medium mt-1">
                                                    {exam.fullForm}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                        {exam.examLevel}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                        {exam.conductingBody}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Upcoming Dates */}
                                    <div className="lg:w-80 shrink-0">
                                        <div className="space-y-2">
                                            {exam.upcomingDates.slice(0, 2).map((dateInfo, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-500 truncate">{dateInfo.event}</p>
                                                    </div>
                                                    <span className="text-xs font-black text-purple-700 whitespace-nowrap">
                                                        {dateInfo.date}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-2">
                                    {exam.quickLinks.map((link) => (
                                        <Link
                                            key={link}
                                            href={`/exams/${exam.slug}`}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-700 text-xs font-bold rounded-xl transition border border-gray-100 hover:border-purple-200"
                                        >
                                            {link}
                                            <FaExternalLinkAlt className="text-[8px] opacity-50" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredExams.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 font-medium">No exams found matching &quot;{searchQuery}&quot;</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamsListingContent;
