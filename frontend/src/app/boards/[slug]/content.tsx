"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaChevronRight, FaBolt, FaDownload, FaComments, FaUserEdit, FaCalendarAlt } from 'react-icons/fa';
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

interface CollegeCategory {
    label: string;
    count: number;
    stream: string;
    city: string | null;
    state: string | null;
}

// Popular courses data (Shiksha-style)
const coursesData: Record<string, { name: string; exams: string[] }[]> = {
    Science: [
        { name: 'Bachelor of Technology (BE/BTech)', exams: ['JEE Main', 'BITSAT', 'WBJEE'] },
        { name: 'Bachelor of Architecture (BArch)', exams: ['NATA', 'AAT', 'ITM NEST'] },
        { name: 'Bachelor of Science (BSc)', exams: ['CUET', 'UPCATET', 'IIT JAM'] },
        { name: 'MBBS', exams: ['NEET', 'AIIMS', 'JIPMER'] },
        { name: 'Bachelor of Pharmacy (BPharm)', exams: ['GPAT', 'MHT CET'] },
    ],
    Commerce: [
        { name: 'Bachelor of Commerce (BCom)', exams: ['CUET', 'DU JAT', 'IPU CET'] },
        { name: 'BBA / BMS', exams: ['IPMAT', 'SET', 'CUET'] },
        { name: 'Chartered Accountancy (CA)', exams: ['CA Foundation'] },
        { name: 'Bachelor of Economics (BA Eco)', exams: ['CUET', 'DU JAT'] },
    ],
    Arts: [
        { name: 'Bachelor of Arts (BA)', exams: ['CUET', 'BHU UET', 'DU JAT'] },
        { name: 'BA LLB (Integrated Law)', exams: ['CLAT', 'AILET', 'LSAT'] },
        { name: 'Bachelor of Design (BDes)', exams: ['NID DAT', 'UCEED', 'NIFT'] },
        { name: 'Bachelor of Journalism (BJM)', exams: ['CUET', 'IIMC'] },
        { name: 'BA in Psychology', exams: ['CUET', 'Christ University'] },
    ],
};

const PageContent: React.FC = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const [guide, setGuide] = useState<BoardGuideData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [colleges, setColleges] = useState<CollegeCategory[]>([]);
    const [activeStream, setActiveStream] = useState('Science');
    const [error, setError] = useState<string | null>(null);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(`section-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

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

    const tabs = ['Overview', 'Time table', 'Dates', 'Admit Card', 'Preparation', 'Question Papers', 'Syllabus', 'Pattern', 'Answer Key', 'Results', 'News'];

    // Dynamic hero title based on active tab
    const heroTitles: Record<string, string> = {
        'Overview': `${displayName} Exam 2026: Date Sheet, Syllabus, Pattern, Question Papers & Result`,
        'Time table': `${displayName} Time Table 2026: Download Date Sheet PDF`,
        'Dates': `${displayName} Date Sheet 2026 PDF (Released): Download Exam Datesheet`,
        'Admit Card': `${displayName} Admit Card 2026: Download Hall Ticket`,
        'Preparation': `${displayName} Preparation Tips 2026: Expert Strategies to Score High`,
        'Question Papers': `${displayName} Question Papers: Previous Year Papers & Sample Papers`,
        'Syllabus': `${displayName} Syllabus 2026: Subject-wise Syllabus & Marking Scheme`,
        'Pattern': `${displayName} Exam Pattern 2026: Marking Scheme & Question Types`,
        'Answer Key': `${displayName} Answer Key 2026: Download Official Answer Key`,
        'Results': `${displayName} Result 2026: Check Board Results & Grading System`,
        'News': `${displayName} Latest News & Updates 2026`,
    };

    // CTA button labels per tab
    const ctaLabels: Record<string, string> = {
        'Overview': 'Guide',
        'Time table': 'Download Time Table',
        'Dates': 'Download Dates',
        'Admit Card': 'Download Admit Card',
        'Preparation': 'Preparation Guide',
        'Question Papers': 'Download Papers',
        'Syllabus': 'Download Syllabus',
        'Pattern': 'Download Pattern',
        'Answer Key': 'Download Answer Key',
        'Results': 'Check Results',
        'News': 'Latest Updates',
    };

    const tabToSectionId: Record<string, string> = {
        'Time table': 'timetable',
        'Dates': 'dates',
        'Admit Card': 'admit-card',
        'Preparation': 'preparation',
        'Question Papers': 'question-papers',
        'Syllabus': 'syllabus',
        'Pattern': 'pattern',
        'Answer Key': 'answer-key',
        'Results': 'result',
    };

    const getSectionById = (id: string) => guide?.sections.find(s => s.id === id);

    const renderSection = (sectionId: string, fallbackMessage: string) => {
        const section = getSectionById(sectionId);
        if (!section) {
            return <p className="text-gray-500 text-center py-10">{fallbackMessage}</p>;
        }
        return (
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                <div
                    className="prose prose-blue max-w-none text-gray-700 text-[15px] leading-[1.8]
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-p:mb-4
                        prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 prose-li:mb-2
                        prose-strong:text-gray-900
                    "
                    dangerouslySetInnerHTML={{ __html: section.content }}
                />
            </div>
        );
    };

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

            {/* ── Breadcrumbs ──────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 max-w-6xl py-3">
                    <nav className="flex items-center text-[13px] text-gray-500 gap-1.5 flex-wrap">
                        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                        <FaChevronRight className="text-[8px] text-gray-400" />
                        <span className="text-gray-400">Boards</span>
                        <FaChevronRight className="text-[8px] text-gray-400" />
                        <span className="text-gray-400">{displayName}</span>
                        {activeTab !== 'Overview' && (
                            <>
                                <FaChevronRight className="text-[8px] text-gray-400" />
                                <span className="text-gray-900 font-medium">{activeTab}</span>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            {/* ── Hero Section ─────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 max-w-6xl py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-[22px] md:text-[26px] font-bold text-gray-900 leading-tight mb-3">
                                {heroTitles[activeTab] || `${displayName} 2026`}
                            </h1>
                            <Link href="#" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-blue-600 transition">
                                <FaComments className="text-gray-400" />
                                <span className="text-blue-600 hover:underline">Students Q&A</span>
                            </Link>
                        </div>
                        <button className="shrink-0 px-5 py-2.5 bg-orange-600 text-white font-bold text-[14px] rounded-lg hover:bg-orange-700 transition flex items-center gap-2 shadow-sm">
                            <FaDownload className="text-[12px]" />
                            {ctaLabels[activeTab] || 'Guide'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Sticky Tab Navigation ────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap px-4 py-3 text-[14px] font-medium border-b-[3px] transition-colors ${activeTab === tab
                                    ? 'border-gray-900 text-gray-900 font-semibold'
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
            <div className="container mx-auto px-4 max-w-6xl mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-0">

                        {/* Author / Updated Date Bar */}
                        <div className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-t-xl">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <FaUserEdit className="text-gray-500 text-sm" />
                            </div>
                            <div>
                                <p className="text-[13px] text-gray-500">
                                    Updated on {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                <p className="text-[13px] text-gray-400">By CollegeDost Editorial Team</p>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white px-6 py-6 border border-t-0 border-gray-100 rounded-b-xl">

                            {/* OVERVIEW TAB */}
                            {activeTab === 'Overview' && (
                                <div className="space-y-8">
                                    {/* Latest Updates */}
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 mb-3">Latest Updates:</h2>
                                        <ul className="space-y-2">
                                            {guide?.sections.slice(0, 3).map((section) => (
                                                <li key={section.id}>
                                                    <button
                                                        onClick={() => scrollToSection(section.id)}
                                                        className="text-blue-600 hover:underline text-[14px] text-left leading-relaxed"
                                                    >
                                                        {section.title}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Intro paragraph */}
                                    {guide?.sections.find(s => s.id === 'overview') && (
                                        <div
                                            className="prose prose-blue max-w-none text-gray-700 text-[15px] leading-[1.8]
                                                prose-headings:font-bold prose-headings:text-gray-900
                                                prose-p:mb-4 prose-strong:text-gray-900
                                            "
                                            dangerouslySetInnerHTML={{ __html: guide!.sections.find(s => s.id === 'overview')!.content }}
                                        />
                                    )}

                                    {/* Table of Contents */}
                                    <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                                        <h2 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
                                        <ul className="space-y-3">
                                            {guide?.sections.map((section) => (
                                                <li key={section.id}>
                                                    <button
                                                        onClick={() => scrollToSection(section.id)}
                                                        className="text-blue-600 hover:underline text-[14px] font-medium text-left"
                                                    >
                                                        {section.title}
                                                    </button>
                                                </li>
                                            ))}
                                            {guide?.faqs && guide.faqs.length > 0 && (
                                                <li>
                                                    <button
                                                        onClick={() => scrollToSection('faqs')}
                                                        className="text-blue-600 hover:underline text-[14px] font-medium"
                                                    >
                                                        FAQs on {displayName} 2026
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* All Sections */}
                                    {guide?.sections.map((section) => (
                                        <div key={section.id} id={`section-${section.id}`} className="scroll-mt-24 pt-4 border-t border-gray-100">
                                            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                                            <div
                                                className="prose prose-blue max-w-none text-gray-700 text-[15px] leading-[1.8]
                                                    prose-headings:font-bold prose-headings:text-gray-900
                                                    prose-p:mb-4
                                                    prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 prose-li:mb-2
                                                    prose-strong:text-gray-900
                                                "
                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                            />
                                        </div>
                                    ))}

                                    {/* FAQs */}
                                    {guide?.faqs && guide.faqs.length > 0 && (
                                        <div id="section-faqs" className="scroll-mt-24 pt-4 border-t border-gray-100">
                                            <h2 className="text-xl font-bold text-gray-900 mb-6">FAQs on {displayName} 2026</h2>
                                            <div className="space-y-3">
                                                {guide.faqs.map((faq, i) => (
                                                    <details key={i} className="group border border-gray-200 rounded-lg">
                                                        <summary className="font-semibold text-[15px] text-gray-900 list-none flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50 transition">
                                                            {faq.question}
                                                            <span className="transition group-open:rotate-180 text-gray-400 text-[12px]">▼</span>
                                                        </summary>
                                                        <p className="text-gray-600 text-[14px] leading-relaxed px-4 pb-4 pt-0 border-t border-gray-100">
                                                            {faq.answer}
                                                        </p>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* INDIVIDUAL TAB SECTIONS */}
                            {activeTab !== 'Overview' && activeTab !== 'News' && tabToSectionId[activeTab] && (
                                <div>{renderSection(tabToSectionId[activeTab], `${activeTab} details coming soon.`)}</div>
                            )}

                            {/* NEWS TAB */}
                            {activeTab === 'News' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
                                    <p className="text-gray-500 text-center py-10">No recent news available for {displayName}.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className="lg:col-span-4 space-y-5">

                        {/* ── Popular Courses After 12th (Shiksha-style) ─── */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <h3 className="font-bold text-[17px] text-gray-900 px-5 pt-5 pb-3">Popular Courses After 12th</h3>

                            {/* Stream Tabs */}
                            <div className="flex gap-2 px-5 pb-4">
                                {Object.keys(coursesData).map((stream) => (
                                    <button
                                        key={stream}
                                        onClick={() => setActiveStream(stream)}
                                        className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition ${activeStream === stream
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        {stream}
                                    </button>
                                ))}
                            </div>

                            {/* Course Cards */}
                            <div className="divide-y divide-gray-100">
                                {coursesData[activeStream]?.map((course, idx) => (
                                    <div key={idx} className="px-5 py-4 hover:bg-gray-50 transition">
                                        <h4 className="text-[15px] font-bold text-gray-900 mb-1.5">{course.name}</h4>
                                        <p className="text-[12px] text-gray-500 mb-1">Exams accepted</p>
                                        <div className="flex flex-wrap gap-1 text-[12px] font-medium text-blue-600">
                                            {course.exams.map((exam, i) => (
                                                <React.Fragment key={exam}>
                                                    <Link href={`/exams/${exam.toLowerCase().replace(/\s+/g, '-')}`} className="hover:underline">
                                                        {exam}
                                                    </Link>
                                                    {i < course.exams.length - 1 && <span className="text-gray-300">|</span>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="px-5 py-4 border-t border-gray-100">
                                <Link
                                    href="/courses"
                                    className="w-full py-2.5 border border-gray-800 rounded-full text-gray-800 font-bold text-[14px] hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                >
                                    View all courses after 12th
                                    <FaChevronRight className="text-[10px]" />
                                </Link>
                            </div>
                        </div>

                        {/* ── Trending Colleges After 12th ──────────────── */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <h3 className="font-bold text-[17px] text-gray-900 px-5 pt-5 pb-3">Trending Colleges after 12th</h3>

                            {colleges.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {colleges.map((cat, idx) => {
                                        const params = new URLSearchParams();
                                        if (cat.stream) params.set('stream', cat.stream);
                                        if (cat.city) params.set('city', cat.city);
                                        if (cat.state) params.set('state', cat.state);
                                        return (
                                            <li key={idx} className="px-5 py-3 hover:bg-gray-50 transition">
                                                <Link
                                                    href={`/tools/colleges?${params.toString()}`}
                                                    className="text-blue-600 hover:underline text-[14px] leading-snug block font-medium"
                                                >
                                                    {cat.count} {cat.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="px-5 space-y-3 pb-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="h-5 bg-gray-100 animate-pulse rounded-md" />
                                    ))}
                                </div>
                            )}

                            <div className="px-5 py-4 border-t border-gray-100">
                                <Link
                                    href="/tools/colleges"
                                    className="w-full py-2.5 border border-gray-800 rounded-full text-gray-800 font-bold text-[14px] hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                >
                                    View all colleges
                                    <FaChevronRight className="text-[10px]" />
                                </Link>
                            </div>
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
