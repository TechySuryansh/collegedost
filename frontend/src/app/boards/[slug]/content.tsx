"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaChevronRight, FaSpinner, FaBolt } from 'react-icons/fa';
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

interface BoardGuideData {
    boardName: string;
    sections: GuideSection[];
    highlights: { key: string; value: string }[];
    faqs: GuideFAQ[];
}

const PageContent: React.FC = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const [guide, setGuide] = useState<BoardGuideData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    const [error, setError] = useState<string | null>(null);

    // Smooth scrolling
    const scrollToSection = (id: string) => {
        const el = document.getElementById(`section-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Format display name from slug if guide is loading
    const rawDisplayName = slug
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
        .replace(/\b(Hsc|Ssc|Puc|Chse|Cbse|Usp|Gseb|Pseb)\b/gi, (m: string) => m.toUpperCase());

    const displayName = guide?.boardName || rawDisplayName;

    useEffect(() => {
        const fetchGuide = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/boards/${slug}/guide`);
                if (res.data.success) {
                    setGuide(res.data.data);
                }
            } catch (err: any) {
                console.error("Error fetching board guide:", err);
                const errorMessage = err.code === 'ECONNABORTED'
                    ? 'Request timed out. The AI is taking longer than usual to generate content. Please try again.'
                    : err.response?.data?.message || err.message || 'Failed to load guide.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchGuide();
    }, [slug]);

    const tabs = ['Overview', 'Time table', 'Dates', 'Admit Card', 'Preparation', 'Question Papers', 'Syllabus', 'Pattern', 'Answer Key', 'Results', 'News'];

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent mb-4"></div>
                <h3 className="text-xl font-bold text-gray-800">Generating {rawDisplayName} Guide</h3>
                <p className="text-gray-500 text-sm mt-2">Powered by AI Analytics...</p>
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

    if (!guide && !loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <p className="text-gray-500">Failed to load guide. Please try refreshing.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            {/* Sticky Tab Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap px-4 py-3 text-[14px] font-semibold border-b-[3px] transition-colors ${activeTab === tab
                                    ? 'border-blue-600 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl mt-6">
                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: Content */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Title Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{displayName} Board Exam 2026</h1>
                            <p className="text-blue-600 text-sm hover:underline cursor-pointer font-medium mb-1">
                                {displayName} Exam 2026 From Feb 26: Check Day 1 Subjects, Timings & What to Carry
                            </p>
                        </div>

                        {/* Table of Contents */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Table of contents</h2>
                            <ul className="space-y-4">
                                {guide?.sections.map((section) => (
                                    <li key={section.id}>
                                        <button
                                            onClick={() => scrollToSection(section.id)}
                                            className="text-blue-600 hover:underline text-[15px] font-medium text-left"
                                        >
                                            {section.title}
                                        </button>
                                    </li>
                                ))}
                                {guide?.faqs && guide.faqs.length > 0 && (
                                    <li>
                                        <button
                                            onClick={() => scrollToSection('faqs')}
                                            className="text-blue-600 hover:underline text-[15px] font-medium"
                                        >
                                            FAQs on {displayName} 2026
                                        </button>
                                    </li>
                                )}
                            </ul>
                            <button className="text-blue-600 mt-6 text-sm font-semibold flex items-center gap-1">
                                View Less <span className="rotate-180 inline-block text-[10px] ml-1">▼</span>
                            </button>
                        </div>

                        {/* AI Generated Sections */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            {guide?.sections.map((section, idx) => (
                                <div key={section.id} id={`section-${section.id}`} className="p-6 md:p-8 border-b border-gray-50 scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                                            <FaBolt className="text-[12px]" />
                                        </div>
                                        <h2 className="text-[22px] font-bold text-gray-900">{section.title}</h2>
                                    </div>
                                    <div
                                        className="prose prose-blue max-w-none text-gray-700 text-[15px] leading-relaxed
                                            prose-headings:font-bold prose-headings:text-gray-900
                                            prose-p:mb-4
                                            prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 prose-li:mb-2
                                            prose-strong:text-gray-900
                                        "
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </div>
                            ))}

                            {/* FAQs Section */}
                            {guide?.faqs && guide.faqs.length > 0 && (
                                <div id="section-faqs" className="p-6 md:p-8 scroll-mt-24">
                                    <h2 className="text-[22px] font-bold text-gray-900 mb-6">FAQs on {displayName} 2026</h2>
                                    <div className="space-y-4">
                                        {guide.faqs.map((faq, i) => (
                                            <details key={i} className="group border border-gray-200 rounded-lg bg-gray-50">
                                                <summary className="font-semibold text-[15px] text-gray-900 list-none flex justify-between items-center cursor-pointer p-4">
                                                    {faq.question}
                                                    <span className="transition group-open:rotate-180">▼</span>
                                                </summary>
                                                <p className="text-gray-600 text-[14px] leading-relaxed p-4 pt-0 border-t border-gray-200 mt-2 bg-white">
                                                    {faq.answer}
                                                </p>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Sidebar: Applications */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[16px] text-gray-900 mb-1">Applications (BCA)</h3>
                            <p className="text-[13px] text-gray-500 mb-2">Exams accepted</p>
                            <div className="flex flex-wrap gap-2 text-blue-600 text-[12px] font-medium">
                                <span>BUMAT</span> | <span>GSAT</span> | <span>SET</span>
                            </div>
                        </div>

                        {/* Sidebar: MBBS */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[16px] text-gray-900 mb-1 leading-snug">Bachelor of Medicine & Bachelor<br />of Surgery (MBBS)</h3>
                            <p className="text-[13px] text-gray-500 mb-2 mt-2">Exams accepted</p>
                            <div className="flex flex-wrap gap-2 text-blue-600 text-[12px] font-medium mb-4">
                                <span>NEET</span> | <span>AYUSH</span> | <span>FMGE</span>
                            </div>
                            <button className="w-full py-2.5 border border-gray-800 rounded-full text-gray-800 font-bold text-[14px] hover:bg-gray-50 transition flex items-center justify-center gap-2">
                                View all courses after 12th
                                <FaChevronRight className="text-[10px]" />
                            </button>
                        </div>

                        {/* Sidebar: Trending Colleges */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[18px] text-gray-900 mb-4">Trending Colleges after 12th</h3>

                            <ul className="space-y-0 divide-y divide-gray-100">
                                {[
                                    "24 BCA colleges in Ahmedabad",
                                    "199 B.Sc. in Science Colleges in Gujarat",
                                    "6 Fashion Design Colleges in Vadodara",
                                    "19 Interior Design Colleges in Ahmedabad",
                                    "7 B.Sc. in Science Colleges in Surat",
                                    "18 Engineering colleges in Surat",
                                    "6 Event Management Colleges in Ahmedabad",
                                    "7908 IT & Software colleges in India"
                                ].map((college, idx) => (
                                    <li key={idx} className="py-3">
                                        <Link href="#" className="text-blue-500 hover:text-blue-700 hover:underline text-[14px] leading-snug block">
                                            {college}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            {/* Floating Help Button */}
            <div className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-xl shadow-xl flex items-center p-3 cursor-pointer hover:bg-blue-700 transition z-50">
                <div className="mr-3 ml-1">
                    <div className="text-[11px] font-semibold opacity-90 mb-0.5">Get Instant Answer to your queries</div>
                    <div className="text-[14px] font-bold">Ask Now</div>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                    <FaBolt className="text-xl pt-0.5" />
                    <div className="absolute -top-1 -right-1 bg-white text-blue-600 w-4 h-4 rounded-full flex flex-col justify-center items-center font-bold text-[10px] leading-none">x</div>
                </div>
            </div>

        </div>
    );
};

export default PageContent;
