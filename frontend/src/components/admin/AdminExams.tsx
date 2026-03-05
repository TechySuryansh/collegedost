"use client";

import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaBookOpen, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Exam {
    _id: string;
    examName: string;
    examSlug: string;
    conductingAuthority: string;
    examLevel: string;
    isTop: boolean;
    createdAt: string;
}

const AdminExams: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async (): Promise<void> => {
        try {
            const res = await api.get('/exams');
            if (res.data.success) {
                setExams(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string): Promise<void> => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await api.delete(`/exams/${id}`);
                setExams(exams.filter(e => e._id !== id));
            } catch (error) {
                console.error('Error deleting exam:', error);
                alert('Failed to delete exam');
            }
        }
    };

    const filteredExams = exams.filter(exam =>
        (exam.examName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exam.examSlug || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                        <FaBookOpen className="text-purple-600" /> Exams Management
                    </h1>
                    <p className="text-gray-500 text-sm">Manage entries for "Top Exams" and all exam listings</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue/20 w-full md:w-64"
                    />
                    <Link href="/admin/top-exams/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <FaPlus /> Add Exam
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Exam Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Level</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-center">Featured</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredExams.map((exam, index) => (
                            <motion.tr
                                key={exam._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900">{exam.examName}</div>
                                        <div className="text-xs text-gray-500">Slug: {exam.examSlug}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100">
                                        {exam.examLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {exam.isTop ? (
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
                                        <Link href={`/exams/${exam.examSlug}`} target="_blank" className="text-gray-400 hover:text-brand-blue" title="View Page">
                                            <FaExternalLinkAlt />
                                        </Link>
                                        <Link href={`/admin/top-exams/edit/${exam._id}`} className="text-gray-400 hover:text-green-600" title="Edit">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(exam._id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        {filteredExams.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No exams found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminExams;
