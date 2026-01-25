import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaUniversity, FaCalendarAlt, FaBookOpen } from 'react-icons/fa';

const ExamsPage = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const fetchExams = async () => {
             // ... existing fetch logic
            try {
                const res = await axios.get('http://localhost:5001/api/exams');
                if (res.data.success) {
                    setExams(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch exams", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const filteredExams = exams.filter(exam => 
        exam.examName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        exam.conductingAuthority.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            
            {/* Hero Section */}
            <div className="bg-brand-deep-bg text-white py-16 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Explore Entrance Exams</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                        Discover important dates, syllabus, and eligibility for top engineering, medical, and management exams.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <input 
                            type="text" 
                            placeholder="Search exams (e.g., JEE Main, CAT, NEET)..."
                            className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-brand-cyan/30 shadow-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
                    </div>
                ) : (
                    <>
                        {filteredExams.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredExams.map((exam) => (
                                    <Link key={exam._id} to={`/exams/${exam.examSlug}`} className="group">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 h-full flex flex-col">
                                            <div className="h-2 bg-gradient-to-r from-brand-cyan to-brand-blue"></div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="bg-blue-50 text-brand-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        {exam.examLevel}
                                                    </div>
                                                    {/* Placeholder Logo */}
                                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                                        <FaUniversity />
                                                    </div>
                                                </div>
                                                
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
                                                    {exam.examName}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-4 font-medium flex-1">
                                                    By {exam.conductingAuthority}
                                                </p>

                                                <div className="border-t border-gray-50 pt-4 mt-auto">
                                                     <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                                        <FaBookOpen className="text-brand-orange" />
                                                        <span>View Syllabus & Pattern</span>
                                                     </div>
                                                     <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <FaCalendarAlt className="text-brand-cyan" />
                                                        <span>Check Important Dates</span>
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-20">
                                 <h3 className="text-xl font-medium text-gray-600">No exams found matching your search.</h3>
                             </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ExamsPage;
