"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaExclamationTriangle, FaGraduationCap } from 'react-icons/fa';
import api from '@/api/axios';

const CourseDetailPage: React.FC = () => {
    const params = useParams();
    const slug = params?.slug as string;

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCourse(null);
        setLoading(true);
        setError(null);

        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${slug}`);
                if (res.data.success) {
                    setCourse(res.data.data);
                } else {
                    setError('Course not found');
                }
            } catch (err) {
                console.error("Error fetching course:", err);
                setError('Course not found or failed to load');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCourse();
        }
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="animate-spin h-10 w-10 border-2 border-brand-orange rounded-full border-t-transparent"></div>
        </div>
    );

    if (error || !course) return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 text-center py-20">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-lg mx-auto">
                    <FaExclamationTriangle className="text-6xl text-amber-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
                    <p className="text-gray-600 mb-8">
                        The course &quot;{slug}&quot; you&apos;re looking for doesn&apos;t exist in our database yet.
                    </p>
                    <Link href="/courses" className="inline-block px-6 py-3 bg-brand-orange text-white font-bold rounded-lg hover:bg-orange-600 transition">
                        Browse All Courses
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero */}
            <div className="bg-white border-b border-gray-200 mb-8">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <FaGraduationCap className="text-2xl text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{course.name || course.title || slug}</h1>
                            {course.duration && <p className="text-gray-500 text-sm">Duration: {course.duration}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                    {course.description && (
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About this Course</h2>
                            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: course.description }} />
                        </div>
                    )}

                    {course.eligibility && (
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility</h2>
                            <div className="prose max-w-none text-gray-700 bg-blue-50 p-6 rounded-lg border border-blue-100" dangerouslySetInnerHTML={{ __html: course.eligibility }} />
                        </div>
                    )}

                    {course.careerScope && (
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Career Scope</h2>
                            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: course.careerScope }} />
                        </div>
                    )}

                    {!course.description && !course.eligibility && !course.careerScope && (
                        <p className="text-gray-500 text-center py-8">Detailed information about this course will be available soon.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
