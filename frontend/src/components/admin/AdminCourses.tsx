"use client";

import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaGraduationCap, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Course {
    _id: string;
    courseName: string;
    slug: string;
    degreeLevel: string;
    duration: string;
    isTrending: boolean;
    createdAt: string;
}

const AdminCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async (): Promise<void> => {
        try {
            const res = await api.get('/courses');
            if (res.data.success) {
                setCourses(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string): Promise<void> => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${id}`);
                setCourses(courses.filter(c => c._id !== id));
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course');
            }
        }
    };

    const filteredCourses = courses.filter(course =>
        (course.courseName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.slug || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaGraduationCap className="text-blue-600" /> Courses Management
                    </h1>
                    <p className="text-gray-500 text-sm">Manage entries for "Trending Courses" and all course listings</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue/20 w-full md:w-64"
                    />
                    <Link href="/admin/trending-courses/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <FaPlus /> Add Course
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Course Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Level</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-center">Trending</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCourses.map((course, index) => (
                            <motion.tr
                                key={course._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900">{course.courseName}</div>
                                        <div className="text-xs text-gray-500">Slug: {course.slug}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-800 border border-green-100">
                                        {course.degreeLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {course.isTrending ? (
                                        <span className="text-amber-500 flex justify-center" title="Featured on home page">
                                            <FaStar />
                                        </span>
                                    ) : (
                                        <span className="text-gray-300 flex justify-center">
                                            <FaStar />
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link href={`/courses/${course.slug}`} target="_blank" className="text-gray-400 hover:text-brand-blue" title="View Page">
                                            <FaExternalLinkAlt />
                                        </Link>
                                        <Link href={`/admin/trending-courses/edit/${course._id}`} className="text-gray-400 hover:text-green-600" title="Edit">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(course._id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        {filteredCourses.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No courses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminCourses;
