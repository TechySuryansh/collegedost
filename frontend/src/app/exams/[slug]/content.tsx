"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaCalendarAlt, FaBook, FaClipboardList, FaInfoCircle, FaNewspaper, FaChevronRight, FaFileAlt, FaSpinner, FaListUl, FaQuestionCircle } from 'react-icons/fa';
import api from '@/api/axios';

interface GuideSection {
    id: string;
    title: string;
    content: string;
}

interface GuideHighlight {
    key: string;
    value: string;
}

interface GuideFAQ {
    question: string;
    answer: string;
}

interface GuideData {
    examName: string;
    sections: GuideSection[];
    highlights: GuideHighlight[];
    faqs: GuideFAQ[];
}

interface PageContentProps {
    slug?: string;
}

const PageContent: React.FC<PageContentProps> = ({ slug: propSlug }) => {
    const params = useParams();
    const slug = propSlug || (params?.slug as string);
    const [exam, setExam] = useState<any>(null);
    const [guide, setGuide] = useState<GuideData | null>(null);
    const [loading, setLoading] = useState(true);
    const [guideLoading, setGuideLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('Complete Guide');
    const [activeTocId, setActiveTocId] = useState<string>('');

    const tabs = [
        { name: 'Complete Guide', icon: <FaFileAlt /> },
        { name: 'Overview', icon: <FaInfoCircle /> },
        { name: 'Dates', icon: <FaCalendarAlt /> },
        { name: 'Syllabus', icon: <FaBook /> },
        { name: 'Pattern', icon: <FaClipboardList /> },
        { name: 'News', icon: <FaNewspaper /> }
    ];

    // Fetch basic exam data
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await api.get(`/exams/${slug}`);
                if (res.data.success) {
                    setExam(res.data.data);
                }
            } catch (err) {
                console.log("Exam not in DB yet, will be auto-created by guide endpoint");
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchExam();
    }, [slug]);

    // Fetch AI guide
    useEffect(() => {
        const fetchGuide = async () => {
            setGuideLoading(true);
            try {
                const res = await api.get(`/exams/${slug}/guide`);
                if (res.data.success) {
                    setGuide(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching guide:", err);
                setError('Failed to generate exam guide');
            } finally {
                setGuideLoading(false);
            }
        };
        if (slug) fetchGuide();
    }, [slug]);

    const scrollToSection = (id: string) => {
        setActiveTocId(id);
        const el = document.getElementById(`section-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Derive display name
    const displayName = exam?.examName || guide?.examName || slug
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
        .toUpperCase();

    const conductingAuthority = exam?.conductingAuthority || guide?.highlights?.find((h: GuideHighlight) => h.key.toLowerCase().includes('conducting'))?.value || '';
    const examLevel = exam?.examLevel || 'National';
    const description = exam?.description || guide?.sections?.find((s: GuideSection) => s.id === 'what-is')?.content?.replace(/<[^>]*>/g, '').substring(0, 300) || '';

    if (loading && !guide) return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="animate-spin h-12 w-12 border-4 border-purple-600 rounded-full border-t-transparent"></div>
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
                        <span className="text-gray-400">Exams</span>
                        <FaChevronRight className="text-[10px]" />
                        <span className="text-gray-900 font-medium">{displayName}</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-purple-50 rounded-2xl flex items-center justify-center p-4 border border-purple-100 shadow-sm shrink-0">
                            <span className="text-4xl font-black text-purple-600">{displayName.charAt(0)}</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                    {examLevel} Level
                                </span>
                                {conductingAuthority && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                        {conductingAuthority}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{displayName} 2026</h1>
                            {description && (
                                <p className="text-gray-600 max-w-3xl text-sm md:text-base leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>
                        <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto mt-6 md:mt-0">
                            <button className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:bg-purple-700 transition transform hover:-translate-y-1">
                                Download Guide
                            </button>
                            <button className="px-8 py-3 bg-white border-2 border-purple-600 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabbed Content */}
            <div className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto no-scrollbar sticky top-0 z-10 backdrop-blur-md">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.name}
                                        onClick={() => setActiveTab(tab.name)}
                                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === tab.name
                                            ? 'border-purple-600 text-purple-600 bg-white'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                            }`}
                                    >
                                        {tab.icon}
                                        {tab.name}
                                    </button>
                                ))}
                            </div>

                            {/* Inner Content */}
                            <div className="p-6 md:p-8 min-h-[400px]">

                                {/* ═══════════════════════════════════════ */}
                                {/* COMPLETE GUIDE TAB (AI-Generated)       */}
                                {/* ═══════════════════════════════════════ */}
                                {activeTab === 'Complete Guide' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {guideLoading ? (
                                            <div className="flex flex-col items-center justify-center py-20 gap-6">
                                                <div className="relative">
                                                    <div className="w-20 h-20 border-4 border-purple-100 rounded-full animate-spin border-t-purple-600"></div>
                                                    <FaSpinner className="absolute inset-0 m-auto text-purple-600 text-2xl animate-pulse" />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Generating {displayName} Guide...</h3>
                                                    <p className="text-sm text-gray-500 max-w-md">
                                                        Our AI is crafting a comprehensive, detailed guide for {displayName}. This may take 15-30 seconds on first load.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : guide ? (
                                            <article className="space-y-12">
                                                {/* Table of Contents */}
                                                <nav className="p-6 md:p-8 bg-purple-50 rounded-2xl border border-purple-100">
                                                    <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-3">
                                                        <FaListUl className="text-purple-600" />
                                                        Table of Contents
                                                    </h2>
                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                                                        {guide.sections.map((section, i) => (
                                                            <li
                                                                key={section.id}
                                                                onClick={() => scrollToSection(section.id)}
                                                                className={`cursor-pointer flex items-center gap-2 transition hover:text-purple-600 ${activeTocId === section.id ? 'text-purple-600 font-bold' : 'text-gray-600 font-medium'}`}
                                                            >
                                                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTocId === section.id ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
                                                                {section.title}
                                                            </li>
                                                        ))}
                                                        {guide.faqs && guide.faqs.length > 0 && (
                                                            <li
                                                                onClick={() => scrollToSection('faqs')}
                                                                className="cursor-pointer flex items-center gap-2 transition hover:text-purple-600 text-gray-600 font-medium"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-300 shrink-0"></div>
                                                                FAQs on {displayName}
                                                            </li>
                                                        )}
                                                    </ul>
                                                </nav>

                                                {/* Highlights Table */}
                                                {guide.highlights && guide.highlights.length > 0 && (
                                                    <section id="section-highlights">
                                                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg text-sm">
                                                                <FaInfoCircle />
                                                            </div>
                                                            {displayName} Highlights
                                                        </h2>
                                                        <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
                                                            <table className="w-full text-left">
                                                                <tbody className="divide-y divide-gray-100">
                                                                    {guide.highlights.map((row, i) => (
                                                                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                                                            <td className="px-6 py-4 font-bold text-gray-900 w-1/3">{row.key}</td>
                                                                            <td className="px-6 py-4 text-gray-600 font-medium">{row.value}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </section>
                                                )}

                                                {/* All AI-Generated Sections */}
                                                {guide.sections.map((section, i) => (
                                                    <section key={section.id} id={`section-${section.id}`} className="scroll-mt-20">
                                                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg text-sm ${['bg-purple-600', 'bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-cyan-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-teal-500', 'bg-violet-500', 'bg-lime-500', 'bg-sky-500', 'bg-gray-700'][i % 16]
                                                                }`}>
                                                                {i + 1}
                                                            </div>
                                                            {section.title}
                                                        </h2>
                                                        <div
                                                            className="prose prose-purple max-w-none text-gray-700 leading-relaxed
                                                                prose-headings:text-gray-900 prose-headings:font-bold
                                                                prose-p:mb-4 prose-p:leading-relaxed
                                                                prose-ul:space-y-2 prose-ol:space-y-2
                                                                prose-li:text-gray-600
                                                                prose-strong:text-gray-900
                                                                prose-table:border prose-table:border-gray-200 prose-table:rounded-xl prose-table:overflow-hidden
                                                                prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-100
                                                                prose-th:px-4 prose-th:py-3 prose-th:bg-purple-50 prose-th:text-purple-900 prose-th:font-bold"
                                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                                        />
                                                    </section>
                                                ))}

                                                {/* FAQs */}
                                                {guide.faqs && guide.faqs.length > 0 && (
                                                    <section id="section-faqs" className="scroll-mt-20">
                                                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center text-white shadow-lg text-sm">
                                                                <FaQuestionCircle />
                                                            </div>
                                                            FAQs on {displayName}
                                                        </h2>
                                                        <div className="space-y-4">
                                                            {guide.faqs.map((faq, i) => (
                                                                <details key={i} className="group p-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition cursor-pointer">
                                                                    <summary className="font-bold text-gray-900 flex justify-between items-center list-none">
                                                                        {faq.question}
                                                                        <span className="text-purple-600 transition group-open:rotate-180 shrink-0 ml-4">▼</span>
                                                                    </summary>
                                                                    <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                                                                        {faq.answer}
                                                                    </p>
                                                                </details>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}
                                            </article>
                                        ) : (
                                            <div className="text-center py-20">
                                                <p className="text-gray-500">Failed to load the guide. Please try refreshing the page.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ═══════════════════════════════════════ */}
                                {/* OVERVIEW TAB                            */}
                                {/* ═══════════════════════════════════════ */}
                                {activeTab === 'Overview' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6">About the Exam</h2>
                                        <div className="prose prose-purple max-w-none text-gray-700 leading-relaxed">
                                            {exam?.description ? (
                                                <p>{exam.description}</p>
                                            ) : guide ? (
                                                <div dangerouslySetInnerHTML={{ __html: guide.sections.find(s => s.id === 'what-is')?.content || '' }} />
                                            ) : (
                                                <p className="text-gray-500 text-center py-10">Loading overview...</p>
                                            )}
                                            {exam?.eligibility && (
                                                <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                                    <h3 className="text-lg font-bold text-blue-900 mb-3">Eligibility Criteria</h3>
                                                    <p className="text-blue-800 text-sm whitespace-pre-line">{exam.eligibility}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ═══════════════════════════════════════ */}
                                {/* DATES TAB                              */}
                                {/* ═══════════════════════════════════════ */}
                                {activeTab === 'Dates' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6">Important Schedule</h2>
                                        {exam?.importantDates && exam.importantDates.length > 0 ? (
                                            <div className="space-y-4">
                                                {exam.importantDates.map((d: any, i: number) => (
                                                    <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 transition">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{d.event}</h4>
                                                            {d.note && <span className="text-xs text-purple-600 font-medium">{d.note}</span>}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-sm font-black text-purple-700">
                                                                {new Date(d.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : guide ? (
                                            <div className="prose prose-purple max-w-none" dangerouslySetInnerHTML={{ __html: guide.sections.find(s => s.id === 'dates')?.content || '<p>Dates haven\'t been announced yet.</p>' }} />
                                        ) : (
                                            <p className="text-gray-500 text-center py-10">Dates haven't been announced yet.</p>
                                        )}
                                    </div>
                                )}

                                {/* ═══════════════════════════════════════ */}
                                {/* SYLLABUS TAB                            */}
                                {/* ═══════════════════════════════════════ */}
                                {activeTab === 'Syllabus' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6">Exam Syllabus</h2>
                                        {exam?.syllabus && exam.syllabus.length > 0 ? (
                                            <div className="grid gap-6">
                                                {exam.syllabus.map((s: any, i: number) => (
                                                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition">
                                                        <h4 className="font-black text-purple-700 mb-4 flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                                                            {s.subject}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {s.topics && s.topics.map((t: string, j: number) => (
                                                                <span key={j} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg">{t}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : guide ? (
                                            <div className="prose prose-purple max-w-none" dangerouslySetInnerHTML={{ __html: guide.sections.find(s => s.id === 'syllabus')?.content || '<p>Syllabus details coming soon.</p>' }} />
                                        ) : (
                                            <p className="text-gray-500 text-center py-10">Syllabus details coming soon.</p>
                                        )}
                                    </div>
                                )}

                                {/* ═══════════════════════════════════════ */}
                                {/* PATTERN TAB                             */}
                                {/* ═══════════════════════════════════════ */}
                                {activeTab === 'Pattern' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6">Exam Pattern</h2>
                                        {guide ? (
                                            <div className="prose prose-purple max-w-none" dangerouslySetInnerHTML={{ __html: guide.sections.find(s => s.id === 'pattern')?.content || '<p>Pattern details coming soon.</p>' }} />
                                        ) : (
                                            <p className="text-gray-500 text-center py-10">Pattern details coming soon.</p>
                                        )}
                                    </div>
                                )}

                                {/* ═══════════════════════════════════════ */}
                                {/* NEWS TAB                                */}
                                {/* ═══════════════════════════════════════ */}
                                {activeTab === 'News' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6">Latest Updates</h2>
                                        {exam?.news && exam.news.length > 0 ? (
                                            <div className="space-y-6">
                                                {exam.news.map((n: any, i: number) => (
                                                    <a key={i} href={n.link} target="_blank" rel="noreferrer" className="block group p-6 border border-gray-100 rounded-2xl hover:bg-purple-50 transition">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-black text-gray-800 group-hover:text-purple-600 transition">{n.title}</h4>
                                                            <span className="text-xs text-gray-400 shrink-0">{new Date(n.pubDate).toLocaleDateString()}</span>
                                                        </div>
                                                        <span className="text-xs font-bold text-purple-600 group-hover:underline">Read full article →</span>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-10">No recent news available.</p>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Sticky TOC Sidebar (visible when Complete Guide is active) */}
                        {activeTab === 'Complete Guide' && guide && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
                                <h3 className="font-black text-gray-900 mb-4 pb-2 border-b text-sm">Quick Navigation</h3>
                                <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                                    {guide.sections.map((section) => (
                                        <li
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`text-xs cursor-pointer flex items-center gap-2 py-1 transition hover:text-purple-600 ${activeTocId === section.id ? 'text-purple-600 font-bold' : 'text-gray-500 font-medium'}`}
                                        >
                                            <div className={`w-1 h-1 rounded-full shrink-0 ${activeTocId === section.id ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                                            {section.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-black text-gray-900 mb-4 pb-2 border-b">Top Colleges Accepting<br />{displayName}</h3>
                            <ul className="space-y-4">
                                {(guide?.highlights?.find(h => h.key.toLowerCase().includes('universities') || h.key.toLowerCase().includes('institutions'))
                                    ? ['Delhi University (DU)', 'Banaras Hindu University (BHU)', 'Jawaharlal Nehru University (JNU)', 'Jamia Millia Islamia', 'Aligarh Muslim University (AMU)']
                                    : ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'NIT Trichy', 'BITS Pilani']
                                ).map((uni) => (
                                    <li key={uni} className="flex items-center gap-2 group cursor-pointer">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-300 group-hover:bg-purple-600 group-hover:scale-125 transition"></div>
                                        <span className="text-sm font-bold text-gray-600 group-hover:text-purple-600 transition">{uni}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                            <h3 className="font-black text-purple-900 mb-2">Need Help?</h3>
                            <p className="text-xs text-purple-700 font-medium mb-4 leading-relaxed">Our experts can help you with registration, college selection, and preparation strategies.</p>
                            <button className="w-full py-3 bg-white text-purple-600 font-black rounded-xl text-sm shadow-sm hover:shadow-md transition border border-purple-100">
                                Talk to Expert
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageContent;
