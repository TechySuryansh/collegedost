"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/api/axios';
import { FaArrowLeft, FaDownload, FaCalendarAlt, FaUser, FaSpinner } from 'react-icons/fa';

const TestPrepViewPage = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Determine if we need to encode/decode slug? 
                const res = await api.get(`/test-prep/${slug}`);
                if (res.data.success) {
                    setData(res.data.data);
                } else {
                    setError('Resource not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load content');
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchData();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50">
            <div className="animate-spin text-4xl text-brand-blue mb-4"><FaSpinner /></div>
            <p className="text-gray-500">Loading Content...</p>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
            <p className="text-gray-600 mb-6">{error || 'Content unavailable'}</p>
            <Link href="/" className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition">
                Go Home
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12">

            {/* Breadcrumb / Back */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href={`/test-prep/${data.stream.toLowerCase()}/${data.exam.toLowerCase().replace(/ /g, '-')}/${data.type.toLowerCase()}`}
                        className="inline-flex items-center text-brand-blue font-bold hover:underline transition"
                    >
                        <FaArrowLeft className="mr-2" /> Back to {data.exam} {data.type}
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full 
                                    ${data.type === 'Mock-Test' ? 'bg-purple-100 text-purple-700' :
                                        data.type === 'Previous-Paper' ? 'bg-red-100 text-red-700' :
                                            'bg-green-100 text-green-700'}`}>
                                    {data.type}
                                </span>
                                <span className="text-sm text-gray-500 font-medium">
                                    {data.exam}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                {data.title}
                            </h1>

                            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                                {data.author && (
                                    <div className="flex items-center gap-2">
                                        <FaUser className="text-gray-400" />
                                        <span>By {data.author}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span>Updated recently</span>
                                </div>
                            </div>

                            {/* Rich HTML Content */}
                            {data.overview && (
                                <div
                                    className="prose prose-lg max-w-none text-gray-700 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-brand-blue hover:prose-a:underline prose-img:rounded-xl"
                                    dangerouslySetInnerHTML={{ __html: data.overview }}
                                />
                            )}

                            {!data.overview && data.metaDescription && (
                                <p className="text-lg text-gray-700 italic">
                                    {data.metaDescription}
                                </p>
                            )}

                            {/* Download Action */}
                            {data.downloadUrl && (
                                <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-blue-900 text-lg">Download Material</h3>
                                        <p className="text-blue-700 text-sm">Get the full PDF for offline access.</p>
                                    </div>
                                    <a
                                        href={data.downloadUrl}
                                        className="inline-flex items-center px-6 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
                                    >
                                        <FaDownload className="mr-2" /> Download Now
                                    </a>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="sticky top-24 space-y-6">

                            {/* Quick Links Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Related Exams</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/test-prep/engineering/jee-main/preparation" className="block text-gray-600 hover:text-brand-blue hover:translate-x-1 transition text-sm">
                                            JEE Main Preparation
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/test-prep/engineering/jee-advanced/preparation" className="block text-gray-600 hover:text-brand-blue hover:translate-x-1 transition text-sm">
                                            JEE Advanced Strategy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/test-prep/engineering/bitsat/preparation" className="block text-gray-600 hover:text-brand-blue hover:translate-x-1 transition text-sm">
                                            BITSAT Crash Course
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Promo Card */}
                            <div className="bg-linear-to-br from-brand-blue to-purple-600 rounded-xl shadow-lg p-6 text-white">
                                <h3 className="font-bold text-xl mb-2">Need Counselling?</h3>
                                <p className="text-blue-100 text-sm mb-4">Get expert guidance for your engineering admission journey.</p>
                                <button className="w-full py-2 bg-white text-brand-blue font-bold rounded-lg text-sm hover:bg-gray-50 transition">
                                    Book Session
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPrepViewPage;
