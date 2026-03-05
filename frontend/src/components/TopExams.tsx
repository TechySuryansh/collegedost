"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/api/axios';

interface Exam {
    examName: string;
    examSlug: string;
}

const TopExams: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopExams = async () => {
            try {
                const { data } = await api.get('/exams?top=true');
                if (data.success) {
                    setExams(data.data);
                }
            } catch (error) {
                console.error('Error fetching top exams:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopExams();
    }, []);

    if (loading) {
        return (
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Exams this month</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-10 w-24 bg-gray-100 animate-pulse rounded-full"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (exams.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Exams this month</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {exams.map((exam) => (
                    <Link
                        key={exam.examSlug}
                        href={`/exams/${exam.examSlug}`}
                        className="px-6 py-2 rounded-full border border-purple-400 text-purple-700 hover:bg-purple-50 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                        {exam.examName}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TopExams;
