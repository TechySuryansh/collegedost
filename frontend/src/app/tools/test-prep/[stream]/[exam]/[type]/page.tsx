"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/api/axios';
import { FaBookOpen, FaDownload, FaEdit, FaClipboardList, FaSpinner } from 'react-icons/fa';

const TestPrepListPage = () => {
    const params = useParams();
    const stream = params?.stream as string;
    const exam = params?.exam as string;
    const type = params?.type as string;

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper map to fix case sensitivity for API query - TypeScript record for safety
    const examMap: Record<string, string> = {
        'jee-main': 'JEE Main',
        'jee-advanced': 'JEE Advanced',
        'bitsat': 'BITSAT',
        'viteee': 'VITEEE',
        'neet': 'NEET',
        'aiims': 'AIIMS'
    };

    const typeMap: Record<string, string> = {
        'preparation': 'Preparation',
        'mock-test': 'Mock-Test',
        'previous-paper': 'Previous-Paper',
        'resource': 'Resource'
    };

    useEffect(() => {
        const fetchData = async () => {
            // Avoid fetching if params incomplete
            if (!stream || !exam || !type) return;

            setLoading(true);
            try {
                // Construct Query API
                // URL params are already decoded, but we handle mapping
                const queryExam = examMap[exam] || exam.replace(/-/g, ' ');
                const queryType = typeMap[type] || type;
                const queryStream = stream.charAt(0).toUpperCase() + stream.slice(1);

                const res = await api.get(`/test-prep?stream=${encodeURIComponent(queryStream)}&exam=${encodeURIComponent(queryExam)}&type=${queryType}`);
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [stream, exam, type]);

    const getIcon = () => {
        if (type === 'preparation') return <FaBookOpen />;
        if (type === 'mock-test') return <FaEdit />;
        if (type === 'previous-paper') return <FaDownload />;
        return <FaClipboardList />; // resource
    };

    const getTitle = () => {
        if (!exam || !type) return 'Test Prep';
        const e = examMap[exam] || exam.replace(/-/g, ' ');
        const t = type.replace('-', ' ');
        return `${e} ${t}`;
    };

    if (loading) return (
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
            <div className="animate-spin text-4xl text-brand-blue mb-4"><FaSpinner /></div>
            <p className="text-gray-500">Loading Prep Content...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
            {/* Header */}
            <div className="bg-brand-blue-dark text-white py-12 mb-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full text-3xl mb-4 backdrop-blur-sm">
                        {getIcon()}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold capitalize mb-4">{getTitle()}</h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        Best in class resources, mock tests, and study material to help you crack the exam with top ranks.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {data.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-400">No Content Found</h2>
                        <p className="text-gray-500 mt-2">We are currently updating resources for this section. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((item) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full 
                                            ${item.type === 'Mock-Test' ? 'bg-purple-100 text-purple-700' :
                                                item.type === 'Previous-Paper' ? 'bg-red-100 text-red-700' :
                                                    'bg-green-100 text-green-700'}`}>
                                            {item.type}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium ml-auto">
                                            {item.exam}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-brand-blue transition">
                                        {item.title}
                                    </h3>

                                    {item.overview ? (
                                        <div
                                            className="text-gray-600 text-sm line-clamp-3 mb-4"
                                            dangerouslySetInnerHTML={{ __html: item.overview }}
                                        />
                                    ) : (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {item.metaDescription || "Click to view detailed content regarding this topic."}
                                        </p>
                                    )}

                                    {/* Action Button */}
                                    <div className="pt-4 border-t border-gray-50">
                                        {item.downloadUrl ? (
                                            <a href={item.downloadUrl} className="w-full block text-center py-2 bg-gray-50 hover:bg-brand-blue hover:text-white text-gray-700 font-bold rounded-lg transition border border-gray-200 hover:border-brand-blue">
                                                Download PDF
                                            </a>
                                        ) : (
                                            <Link
                                                href={`/test-prep/view/${item.slug}`}
                                                className="block w-full text-center py-2 bg-brand-orange text-white font-bold rounded-lg hover:bg-orange-600 transition shadow-md hover:shadow-lg"
                                            >
                                                View Details
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestPrepListPage;
