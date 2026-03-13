"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaChevronRight, FaBolt, FaDownload, FaComments, FaUserEdit, FaInfoCircle } from 'react-icons/fa';
import api from '@/api/axios';

interface GuideSection {
    id: string;
    title: string;
    content: string;
}

interface GuideFAQ {
    question: string;
    answer: string;
}

interface SpecializationGuideData {
    specName: string;
    sections: GuideSection[];
    highlights: { key: string; value: string }[];
    faqs: GuideFAQ[];
}

interface CollegeCategory {
    label: string;
    count: number;
    stream: string;
    city: string | null;
    state: string | null;
}

const PageContent: React.FC = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const [guide, setGuide] = useState<SpecializationGuideData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [colleges, setColleges] = useState<CollegeCategory[]>([]);
    const [error, setError] = useState<string | null>(null);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(`section-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const displayName = guide?.specName || slug
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    useEffect(() => {
        const fetchGuide = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/colleges/specialization/${slug}/guide`);
                if (res.data.success) {
                    setGuide(res.data.data);
                }
            } catch (err: any) {
                console.error("Error fetching specialization guide:", err);
                setError(err.response?.data?.message || err.message || 'Failed to load guide.');
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchGuide();
    }, [slug]);

    useEffect(() => {
        const fetchCategoryCounts = async () => {
            try {
                const res = await api.get('/colleges/category-counts');
                if (res.data.success) {
                    setColleges(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching college category counts:', err);
            }
        };
        fetchCategoryCounts();
    }, []);

    const tabs = ['Overview', 'Eligibility', 'Entrance Exams', 'Top Colleges', 'Syllabus', 'Career', 'Salary', 'Recruiters'];

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent mb-4"></div>
                <h3 className="text-xl font-bold text-gray-800">Generating {displayName} Guide</h3>
                <p className="text-gray-500 text-sm mt-1">Researching Career Data & Salaries...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                    <span className="text-2xl font-bold">!</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Guide</h3>
                <p className="text-gray-600 max-w-md mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Try Refreshing
                </button>
            </div>
        );
    }

    const tabToSection: Record<string, string> = {
        'Overview': 'overview',
        'Eligibility': 'eligibility',
        'Entrance Exams': 'exams',
        'Top Colleges': 'colleges',
        'Syllabus': 'subjects',
        'Career': 'career',
        'Salary': 'salary',
        'Recruiters': 'recruiters'
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        const sectionId = tabToSection[tab];
        if (sectionId) {
            scrollToSection(sectionId);
        } else if (tab === 'Overview') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            {/* ── Breadcrumbs ──────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 max-w-6xl py-3">
                    <nav className="flex items-center text-[13px] text-gray-500 gap-1.5 flex-wrap">
                        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                        <FaChevronRight className="text-[8px] text-gray-400" />
                        <Link href="/tools/colleges?stream=Engineering" className="hover:text-blue-600 transition">Engineering</Link>
                        <FaChevronRight className="text-[8px] text-gray-400" />
                        <span className="text-gray-900 font-medium">{displayName}</span>
                    </nav>
                </div>
            </div>

            {/* ── Hero Section ─────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 max-w-6xl py-7">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-[24px] md:text-[28px] font-bold text-gray-900 leading-tight mb-4">
                                What is {displayName}?: Subjects, Fees, {new Date().getFullYear()} Admission, Career Options
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500">
                                <Link href="#" className="inline-flex items-center gap-1.5 hover:text-blue-600 transition">
                                    <FaComments className="text-gray-400" />
                                    <span className="text-blue-600 font-medium">Student Q&A</span>
                                </Link>
                                <span className="flex items-center gap-1.5">
                                    <FaBolt className="text-yellow-500" />
                                    AI-Powered Insights
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="shrink-0 px-6 py-2.5 bg-orange-600 text-white font-bold text-[14px] rounded-lg hover:bg-orange-700 transition flex items-center gap-2 shadow-sm">
                                <FaDownload className="text-[12px]" />
                                Download Guide
                            </button>
                        </div>
                    </div>
                </div>
                {/* ── Sticky Tab Navigation ────────────────────────────── */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    className={`whitespace-nowrap px-5 py-4 text-[14px] font-medium border-b-[3px] transition-all ${activeTab === tab
                                        ? 'border-blue-600 text-blue-600 font-bold'
                                        : 'border-transparent text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Main Content Area ───────────────────────────────── */}
                <div className="container mx-auto px-4 max-w-6xl mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Author Bar */}
                                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <FaUserEdit size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Expert Analysis</p>
                                            <p className="text-[13px] text-gray-700 font-semibold">CollegeDost Editorial Team</p>
                                        </div>
                                    </div>
                                    <div className="text-[13px] text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100">
                                        Jan 2026 Batch
                                    </div>
                                </div>

                                <div className="p-6 md:p-8">
                                    {/* Highlights Table */}
                                    <div className="mb-10">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <FaInfoCircle className="text-blue-600" />
                                            {displayName} Course Highlights
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                            {guide?.highlights.map((h, i) => (
                                                <div key={i} className="flex flex-col p-4 bg-white hover:bg-blue-50/30 transition">
                                                    <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tight mb-1">{h.key}</span>
                                                    <span className="text-[15px] font-semibold text-gray-800">{h.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Table of Contents */}
                                    <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mb-10">
                                        <h3 className="text-[16px] font-bold text-gray-900 mb-4">Table of Contents</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
                                            {guide?.sections.map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => scrollToSection(section.id)}
                                                    className="text-blue-600 hover:text-blue-800 text-[14px] text-left hover:underline flex items-center gap-2 group"
                                                >
                                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:scale-125 transition-transform" />
                                                    {section.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main Sections */}
                                    <div className="space-y-12">
                                        {guide?.sections.map((section) => (
                                            <div key={section.id} id={`section-${section.id}`} className="scroll-mt-28">
                                                <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-100">
                                                    {section.title}
                                                </h2>
                                                <div
                                                    className="prose prose-blue max-w-none text-gray-700 text-[16px] leading-[1.8]
                                                    prose-p:mb-5 prose-headings:text-gray-900 prose-headings:font-bold
                                                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-5 prose-li:mb-2
                                                    prose-strong:text-gray-900 prose-strong:font-bold
                                                "
                                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* FAQ Section */}
                                    {guide?.faqs && guide.faqs.length > 0 && (
                                        <div className="mt-16 pt-8 border-t border-gray-100">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
                                            <div className="space-y-4">
                                                {guide.faqs.map((faq, i) => (
                                                    <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                                                        <summary className="font-bold text-[15px] text-gray-800 list-none flex justify-between items-center cursor-pointer p-5 bg-white group-open:bg-blue-50/50">
                                                            {faq.question}
                                                            <span className="transition-transform group-open:rotate-180 text-gray-400">
                                                                <FaChevronRight size={10} className="rotate-90" />
                                                            </span>
                                                        </summary>
                                                        <div className="p-5 text-gray-600 text-[15px] leading-relaxed bg-white border-t border-gray-100/50">
                                                            {faq.answer}
                                                        </div>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Colleges Sidebar */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <h4 className="font-bold text-[16px] text-gray-900 px-6 pt-6 pb-4 border-b border-gray-50">
                                    Popular Engineering Destinations
                                </h4>
                                <div className="divide-y divide-gray-50">
                                    {colleges.filter(c => c.stream === 'Engineering').slice(0, 8).map((cat, idx) => {
                                        const params = new URLSearchParams();
                                        params.set('stream', 'Engineering');
                                        if (cat.city) params.set('city', cat.city);
                                        if (cat.state) params.set('state', cat.state);
                                        return (
                                            <Link
                                                key={idx}
                                                href={`/tools/colleges?${params.toString()}`}
                                                className="block px-6 py-4 hover:bg-blue-50/50 transition-colors group"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[14px] text-gray-600 group-hover:text-blue-700 font-medium">
                                                        {cat.label}
                                                    </span>
                                                    <span className="text-[12px] font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                        {cat.count}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div className="p-4 border-t border-gray-50">
                                    <Link
                                        href="/tools/colleges?stream=Engineering"
                                        className="w-full py-3 border-2 border-blue-600 text-blue-600 font-bold text-[14px] rounded-xl hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-2"
                                    >
                                        Browse all Colleges
                                    </Link>
                                </div>
                            </div>

                            {/* Quick Links / Resources */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                                <h4 className="font-bold text-[18px] mb-4">Want specialized counseling?</h4>
                                <p className="text-blue-100 text-[14px] mb-6 leading-relaxed">
                                    Get personalized guidance for your {displayName} career journey from our experts.
                                </p>
                                <button className="w-full py-3 bg-white text-blue-700 font-bold text-[14px] rounded-xl hover:bg-blue-50 transition shadow-sm">
                                    Talk to Expert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageContent;
