"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaGraduationCap, FaSearch, FaBookOpen, FaUserTie } from 'react-icons/fa';
import api from '@/api/axios';

const CoursesContent = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    // Parse URL URL params
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('All');

    // Sync URL → State
    useEffect(() => {
        const newSearchTerm = searchParams.get('search') || '';
        const newLevel = searchParams.get('level') || 'All';

        setSearchTerm(newSearchTerm);
        setSelectedLevel(newLevel);
    }, [searchParams]);

    // Initial fetch
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/courses`);
            if (res.data.success) {
                setCourses(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch courses", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.shortName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = selectedLevel === 'All' || course.degreeLevel === selectedLevel;
        return matchesSearch && matchesLevel;
    });

    const levels = ['All', 'Undergraduate', 'Postgraduate', 'Diploma', 'Doctorate'];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">

            {/* Header */}
            <div className="bg-gradient-to-r from-brand-violet to-brand-indigo text-white py-16 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Explore Courses</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                        Find the perfect course to shape your career. From Engineering to Medicine, we cover it all.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search courses (e.g. B.Tech, MBA)..."
                            className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-brand-cyan/30 shadow-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Level Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {levels.map(level => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedLevel === level ? 'bg-brand-indigo text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
                    </div>
                ) : (
                    <>
                        {filteredCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <Link key={course._id} href={`/courses/${course.slug}`} className="group">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-brand-indigo/30 transition-all duration-300 h-full flex flex-col">
                                            <div className="p-6 flex-1">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-brand-indigo text-xl">
                                                        <FaGraduationCap />
                                                    </div>
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                                                        {course.degreeLevel}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-indigo transition-colors">
                                                    {course.courseName} <span className="text-gray-400 font-normal">({course.shortName})</span>
                                                </h3>

                                                <p className="text-sm text-gray-500 mb-6 line-clamp-3">
                                                    {course.overview}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {course.careerOptions.slice(0, 3).map((job: string, i: number) => (
                                                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md flex items-center gap-1">
                                                            <FaUserTie className="text-[10px]" /> {job}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                                <span className="text-gray-500 flex items-center gap-2">
                                                    <FaBookOpen className="text-brand-orange" /> {course.duration}
                                                </span>
                                                <span className="font-bold text-brand-indigo">View Details →</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-medium text-gray-600">No courses found matching your criteria.</h3>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CoursesContent;
