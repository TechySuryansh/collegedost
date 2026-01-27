import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCalendarAlt, FaNewspaper, FaExternalLinkAlt, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'; // Use centralized api

const ExamDetailPage = () => {
    const { slug } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchExam = async () => {
            try {
                // Remove /api prefix if base URL already has it, or ensure it matches your setup
                 const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/exams/${slug}`);
                 if (res.data.success) {
                     setExam(res.data.data);
                 }
            } catch (error) {
                console.error("Error fetching exam:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [slug]);

    const handleRefreshNews = async () => {
        if (!exam || !user) return;
        setRefreshing(true);
        try {
            const res = await api.post(`/exams/${exam._id}/refresh-news`);
            if (res.data.success) {
                // Update local state news
                setExam(prev => ({ ...prev, news: res.data.data }));
                alert("News refreshed successfully!");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to refresh news. Ensure RSS URL is valid.");
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
            </div>
        );
    }

    if (!exam) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                    <FaExclamationTriangle className="text-4xl text-gray-300 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">Exam Not Found</h1>
                    <p className="text-gray-500 mb-4">Request the admin to add data for "{slug}".</p>
                    <Link to="/" className="text-brand-orange hover:underline">Go Home</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-28 pb-12">
            
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 mb-8">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                            <img 
                                src={exam.logoUrl} 
                                alt={exam.examName} 
                                className="w-24 h-24 object-contain p-2 bg-white border border-gray-100 rounded-xl shadow-sm"
                            />
                            <div>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">{exam.examLevel}</span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{exam.conductingAuthority}</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{exam.examName}</h1>
                                <p className="text-gray-500 max-w-2xl text-sm md:text-base">{exam.description || `Complete guide, news, and updates for ${exam.examName}.`}</p>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            {exam.registrationLink ? (
                                <a 
                                    href={exam.registrationLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-orange text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5"
                                >
                                    Apply / Register Now <FaExternalLinkAlt className="text-sm" />
                                </a>
                            ) : (
                                <button disabled className="px-8 py-3 bg-gray-200 text-gray-400 font-bold rounded-full cursor-not-allowed">
                                    Registration Closed
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Sidebar: Important Dates */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-brand-blue" /> Important Dates
                        </h2>
                        {exam.importantDates && exam.importantDates.length > 0 ? (
                            <div className="space-y-4">
                                {exam.importantDates.map((date, idx) => (
                                    <div key={idx} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <p className="font-semibold text-gray-800 text-sm mb-1">{date.title}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-brand-indigo font-bold bg-indigo-50 px-2 py-1 rounded">
                                                {new Date(date.date).toLocaleDateString()}
                                            </span>
                                            {date.isTentative && <span className="text-[10px] text-gray-400">*Tentative</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic">No specific dates announced yet.</p>
                        )}
                    </div>
                </div>

                {/* Main Content: News Grid */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FaNewspaper className="text-brand-orange" /> Latest News & Updates
                        </h2>
                        {user && user.role === 'admin' && (
                            <button 
                                onClick={handleRefreshNews}
                                disabled={refreshing}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-blue bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <FaSync className={refreshing ? "animate-spin" : ""} /> {refreshing ? 'Refreshing...' : 'Refresh Feed'}
                            </button>
                        )}
                    </div>

                    {exam.news && exam.news.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {exam.news.map((item, idx) => (
                                <a 
                                    key={idx} 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-orange/30 transition-all group flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            {new Date(item.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <FaExternalLinkAlt className="text-gray-300 group-hover:text-brand-orange text-xs transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-3 line-clamp-3 group-hover:text-brand-indigo transition-colors flex-1">
                                        {item.title}
                                    </h3>
                                    {item.contentSnippet && (
                                        <p className="text-sm text-gray-500 line-clamp-3 mt-auto">
                                            {item.contentSnippet.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    )}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                            <div className="inline-block p-4 rounded-full bg-gray-50 text-gray-300 mb-4">
                                <FaNewspaper className="text-4xl" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No news available yet</h3>
                            <p className="text-gray-500 mb-6">Click refresh if you are an admin, or check back later.</p>
                            {user && user.role === 'admin' && (
                                <button onClick={handleRefreshNews} className="text-brand-blue font-medium hover:underline">Fetch News Now</button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ExamDetailPage;
