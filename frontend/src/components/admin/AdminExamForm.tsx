"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaSave, FaArrowLeft, FaBookOpen } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import api from '@/api/axios';

interface ExamFormData {
    examName: string;
    examSlug: string;
    conductingAuthority: string;
    examLevel: 'National' | 'State';
    description: string;
    isTop: boolean;
}

const AdminExamForm: React.FC = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEditMode = !!id;
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<ExamFormData>({
        examName: '',
        examSlug: '',
        conductingAuthority: '',
        examLevel: 'National',
        description: '',
        isTop: false
    });

    useEffect(() => {
        if (isEditMode) {
            fetchExam();
        }
    }, [id]);

    const fetchExam = async (): Promise<void> => {
        try {
            setLoading(true);
            const res = await api.get(`/exams/id/${id}`);
            if (res.data.success) {
                const exam = res.data.data;
                setFormData({
                    examName: exam.examName,
                    examSlug: exam.examSlug,
                    conductingAuthority: exam.conductingAuthority || '',
                    examLevel: exam.examLevel || 'National',
                    description: exam.description || '',
                    isTop: !!exam.isTop
                });
            }
        } catch (error) {
            console.error('Error fetching exam:', error);
            alert('Failed to fetch details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await api.put(`/exams/${id}`, formData);
                alert('Exam updated successfully!');
            } else {
                await api.post('/exams', formData);
                alert('Exam added successfully!');
            }

            router.push('/admin/top-exams');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to save exam');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/top-exams" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Exam' : 'Add New Exam'}</h1>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                                <input
                                    type="text"
                                    name="examName"
                                    required
                                    value={formData.examName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                    placeholder="e.g. JEE Main"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Slug</label>
                                <input
                                    type="text"
                                    name="examSlug"
                                    required
                                    value={formData.examSlug}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                    placeholder="e.g. jee-main"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Conducting Authority</label>
                                <input
                                    type="text"
                                    name="conductingAuthority"
                                    required
                                    value={formData.conductingAuthority}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                    placeholder="e.g. NTA"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                <select
                                    name="examLevel"
                                    value={formData.examLevel}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                >
                                    <option value="National">National</option>
                                    <option value="State">State</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                placeholder="Brief description of the exam..."
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <input
                                type="checkbox"
                                id="isTop"
                                name="isTop"
                                checked={formData.isTop}
                                onChange={handleChange}
                                className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange border-gray-300"
                            />
                            <label htmlFor="isTop" className="text-sm font-bold text-gray-800 cursor-pointer">
                                Featured Exam (Show on home page)
                            </label>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-brand-orange text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : <><FaSave /> {isEditMode ? 'Update Exam' : 'Save Exam'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminExamForm;
