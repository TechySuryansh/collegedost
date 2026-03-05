"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/api/axios';

interface Course {
    courseName: string;
    slug: string;
}

const TrendingCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingCourses = async () => {
            try {
                const { data } = await api.get('/courses?trending=true');
                if (data.success) {
                    setCourses(data.data);
                }
            } catch (error) {
                console.error('Error fetching trending courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingCourses();
    }, []);

    if (loading) {
        return (
            <section className="mt-16 mb-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Courses</h2>
                <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-10 w-24 bg-gray-100 animate-pulse rounded-full"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (courses.length === 0) return null;

    return (
        <section className="mt-16 mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Courses</h2>
            <div className="flex flex-wrap gap-3">
                {courses.map((course, index) => (
                    <Link
                        key={index}
                        href={`/courses/${course.slug}`}
                        className="px-6 py-2.5 rounded-full border border-blue-400 text-blue-600 font-medium hover:bg-blue-50 transition-colors whitespace-nowrap text-sm"
                    >
                        {course.courseName}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TrendingCourses;
