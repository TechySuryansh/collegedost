"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaCalendarAlt, FaExternalLinkAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { browseByStreamData } from '@/data/navigation';

const PageContent: React.FC = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const searchParams = useSearchParams();

    const [exam, setExam] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const { user } = useAuth();

    const tabs = ['Overview', 'Important Dates', 'Syllabus', 'Exam Pattern', 'Application', 'News'];

    // Handle tab from URL params
    useEffect(() => {
        const tabParam = searchParams?.get('tab');
        if (tabParam) {
            const tabMap: Record<string, string> = {
                'dates': 'Important Dates',
                'syllabus': 'Syllabus',
                'pattern': 'Exam Pattern',
                'application': 'Application',
                'news': 'News',
                'resources': 'Overview',
                'mock-test': 'Overview',
                'previous-papers': 'Overview'
            };

            const targetTab = tabMap[tabParam] || tabParam;
            if (tabs.includes(targetTab)) {
                setActiveTab(targetTab);
            }
        }
    }, [searchParams]);

    // Refetch exam data when slug changes
    useEffect(() => {
        setExam(null);
        setLoading(true);
        setError(null);
        setActiveTab('Overview');

        const fetchExam = async () => {
            try {
                const res = await api.get(`/exams/${slug}`);
                if (res.data.success) {
                    setExam(res.data.data);
                } else {
                    setError('Exam not found');
                }
            } catch (err) {
                console.error("Error fetching exam:", err);
                setError('Exam not found or failed to load');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchExam();
        }
    }, [slug]);

    const handleRefreshNews = async () => {
        if (!exam || !user) return;
        setRefreshing(true);
        try {
            const res = await api.post(`/exams/${exam._id}/refresh-news`);
            if (res.data.success) {
                setExam((prev: any) => ({ ...prev, news: res.data.data }));
                alert("News refreshed successfully!");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to refresh news.");
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center"><div className="animate-spin h-10 w-10 border-2 border-brand-orange rounded-full border-t-transparent"></div></div>;

    if (error || !exam) return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 text-center py-20">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-lg mx-auto">
                    <FaExclamationTriangle className="text-6xl text-amber-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Exam Not Found</h1>
                    <p className="text-gray-600 mb-8">
                        The exam "{slug}" you're looking for doesn't exist in our database yet.
                        It may be added soon!
                    </p>
                    <Link href="/tools/exams" className="inline-block px-6 py-3 bg-brand-orange text-white font-bold rounded-lg hover:bg-orange-600 transition">
                        Browse All Exams
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-12">

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 mb-8">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                        <div className="flex gap-6">
                            <img src={exam.logoUrl} alt={exam.examName} className="w-24 h-24 object-contain p-2 bg-white border border-gray-100 rounded-xl shadow-sm" />
                            <div>
                                <div className="flex gap-3 mb-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase">{exam.examLevel}</span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{exam.conductingAuthority}</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.examName}</h1>
                                <p className="text-gray-500 max-w-2xl text-sm">{exam.description}</p>
                            </div>
                        </div>
                        {exam.registrationLink && (
                            <a href={exam.registrationLink} target="_blank" rel="noreferrer" className="px-8 py-3 bg-brand-orange text-white font-bold rounded-lg shadow hover:bg-orange-600 transition">
                                Apply Now <FaExternalLinkAlt className="inline ml-2 text-xs" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-3">

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-x-auto sticky top-20 z-10">
                        <div className="flex">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                        ? 'border-brand-orange text-brand-orange bg-orange-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-100">

                        {activeTab === 'Overview' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">About the Exam</h2>
                                    {exam.details ? (
                                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: exam.details }} />
                                    ) : (
                                        <p className="text-gray-500">Detailed information not available.</p>
                                    )}
                                </div>
                                {exam.eligibility && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                                        <div className="prose max-w-none text-gray-700 bg-blue-50 p-6 rounded-lg border border-blue-100" dangerouslySetInnerHTML={{ __html: exam.eligibility }} />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Important Dates' && (
                            <div className="animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Exam Schedule</h2>
                                {exam.importantDates && exam.importantDates.length > 0 ? (
                                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-700 font-bold">
                                                <tr>
                                                    <th className="px-6 py-4">Event</th>
                                                    <th className="px-6 py-4">Date</th>
                                                    <th className="px-6 py-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {exam.importantDates.map((date: any, idx: number) => (
                                                    <tr key={idx} className="bg-white hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-medium text-gray-900">{date.title}</td>
                                                        <td className="px-6 py-4 text-gray-600">{new Date(date.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</td>
                                                        <td className="px-6 py-4">
                                                            {date.isTentative ? <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold">Tentative</span> : <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Confirmed</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="text-gray-500">Dates not announced yet.</p>}
                            </div>
                        )}

                        {activeTab === 'Syllabus' && (
                            <div className="animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Syllabus</h2>
                                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: exam.syllabus || '<p>Syllabus details coming soon.</p>' }} />
                            </div>
                        )}

                        {activeTab === 'Exam Pattern' && (
                            <div className="animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Exam Pattern</h2>
                                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: exam.examPattern || '<p>Pattern details coming soon.</p>' }} />
                            </div>
                        )}

                        {activeTab === 'Application' && (
                            <div className="animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Application Process</h2>
                                {exam.applicationProcess ? (
                                    <div className="space-y-6">
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex justify-between items-center">
                                            <span className="font-bold text-green-800">Application Fee</span>
                                            <span className="text-green-900 font-bold text-lg">{exam.applicationProcess.fee}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-2">Steps to Apply:</h3>
                                            <ul className="list-decimal pl-5 space-y-2 text-gray-700">
                                                {exam.applicationProcess.steps.map((step: string, i: number) => (
                                                    <li key={i}>{step}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        {exam.applicationProcess.websiteUrl && (
                                            <a href={exam.applicationProcess.websiteUrl} target="_blank" rel="noreferrer" className="inline-block text-brand-blue font-bold hover:underline">
                                                Visit Official Website →
                                            </a>
                                        )}
                                    </div>
                                ) : <p className="text-gray-500">Application details not available.</p>}
                            </div>
                        )}

                        {activeTab === 'News' && (
                            <div className="animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
                                    {user && user.role === 'admin' && (
                                        <button onClick={handleRefreshNews} disabled={refreshing} className="text-sm text-brand-blue font-bold hover:underline">
                                            {refreshing ? 'Refreshing...' : 'Refresh Feed'}
                                        </button>
                                    )}
                                </div>
                                <div className="grid gap-4">
                                    {exam.news && exam.news.length > 0 ? exam.news.map((item: any, idx: number) => (
                                        <a key={idx} href={item.link} target="_blank" rel="noreferrer" className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 group">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-800 group-hover:text-brand-orange transition line-clamp-2">{item.title}</h3>
                                                <FaExternalLinkAlt className="text-gray-300 text-xs shrink-0 ml-2" />
                                            </div>
                                            <span className="text-xs text-gray-400 mt-2 block">{new Date(item.pubDate).toLocaleDateString()}</span>
                                        </a>
                                    )) : <p className="text-gray-500">No recent news.</p>}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Related Exams</h3>
                        <ul className="space-y-3">
                            {(() => {
                                const categoryId = exam.category ? exam.category.toLowerCase() : 'engineering';
                                const categoryData = browseByStreamData.find(s => s.id === categoryId || s.label.toLowerCase().includes(categoryId));

                                const relatedExams = categoryData ? categoryData.content.exams : [];

                                return relatedExams.length > 0 ? relatedExams.map((item, idx) => (
                                    <li key={idx}>
                                        <Link href={item.href} className="text-sm text-gray-600 hover:text-brand-orange cursor-pointer transition block py-1">
                                            {item.title}
                                        </Link>
                                    </li>
                                )) : <p className="text-sm text-gray-500">No related exams found.</p>;
                            })()}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PageContent;
