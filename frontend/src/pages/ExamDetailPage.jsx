import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaCheckCircle, FaBook, FaFileAlt, FaGlobe, FaChevronRight } from 'react-icons/fa';

const ExamDetailPage = () => {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveSection(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/exams/${slug}`);
                if (res.data.success) {
                    setExam(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch exam details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [slug]);

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;
    if (!exam) return <div className="min-h-screen pt-24 text-center">Exam not found</div>;

    const sections = [
        { id: 'overview', label: 'Overview', icon: <FaFileAlt /> },
        { id: 'dates', label: 'Important Dates', icon: <FaCalendarAlt /> },
        { id: 'eligibility', label: 'Eligibility', icon: <FaCheckCircle /> },
        { id: 'syllabus', label: 'Syllabus & Pattern', icon: <FaBook /> },
        { id: 'application', label: 'Application Process', icon: <FaGlobe /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-8">
                     <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-20 h-20 rounded-xl bg-brand-deep-bg text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                            {exam.examName.charAt(0)}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.examName}</h1>
                            <p className="text-gray-500 font-medium">Conducted by {exam.conductingAuthority} • {exam.examLevel} Level</p>
                        </div>
                     </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                
                {/* Sidebar Navigation */}
                <div className="lg:w-1/4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sticky top-24">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1 ${activeSection === section.id ? 'bg-blue-50 text-brand-blue font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeSection === section.id ? 'text-brand-blue' : 'text-gray-400'}>{section.icon}</span>
                                    {section.label}
                                </div>
                                {activeSection === section.id && <FaChevronRight className="text-xs" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-3/4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
                        
                        {activeSection === 'overview' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">About {exam.examName}</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {exam.description || `The ${exam.examName} is a ${exam.examLevel} level entrance examination conducted by ${exam.conductingAuthority}. It is the gateway for admissions into prestigious institutes across the country.`}
                                </p>
                            </div>
                        )}

                        {activeSection === 'dates' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Important Dates</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                                                <th className="px-6 py-4 font-semibold">Event</th>
                                                <th className="px-6 py-4 font-semibold">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {exam.importantDates && exam.importantDates.length > 0 ? (
                                                exam.importantDates.map((d, i) => (
                                                    <tr key={i} className="hover:bg-gray-50/50">
                                                        <td className="px-6 py-4 font-medium text-gray-800">{d.title}</td>
                                                        <td className="px-6 py-4 text-gray-600">
                                                            {new Date(d.date).toLocaleDateString()}
                                                            {d.isTentative && <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Tentative</span>}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="2" className="px-6 py-4 text-center text-gray-500">Dates not updated yet.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeSection === 'eligibility' && (
                           <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Eligibility Criteria</h2>
                                <div className="prose prose-blue max-w-none text-gray-700">
                                    {/* In future, use a Markdown renderer here */}
                                    {exam.eligibility ? <div dangerouslySetInnerHTML={{ __html: exam.eligibility }} /> : <p>Eligibility criteria detailed information will be available soon.</p>}
                                </div>
                           </div> 
                        )}

                         {activeSection === 'syllabus' && (
                           <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Syllabus & Exam Pattern</h2>
                                <div className="prose prose-blue max-w-none text-gray-700">
                                     <h3 className="text-lg font-bold">Exam Pattern</h3>
                                     <p>{exam.examPattern || 'Pattern details pending.'}</p>
                                     
                                     <h3 className="text-lg font-bold mt-6">Syllabus</h3>
                                     {exam.syllabus ? <div dangerouslySetInnerHTML={{ __html: exam.syllabus }} /> : <p>Syllabus will be updated soon.</p>}
                                </div>
                           </div> 
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExamDetailPage;
