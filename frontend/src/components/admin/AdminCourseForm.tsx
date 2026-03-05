"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaSave, FaArrowLeft, FaGraduationCap } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import api from '@/api/axios';

interface CourseFormData {
    courseName: string;
    shortName: string;
    slug: string;
    degreeLevel: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Doctorate';
    duration: string;
    overview: string;
    isTrending: boolean;
}

const AdminCourseForm: React.FC = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEditMode = !!id;
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<CourseFormData>({
        courseName: '',
        shortName: '',
        slug: '',
        degreeLevel: 'Undergraduate',
        duration: '',
        overview: '',
        isTrending: false
    });

    useEffect(() => {
        if (isEditMode) {
            fetchCourse();
        }
    }, [id]);

    const fetchCourse = async (): Promise<void> => {
        try {
            setLoading(true);
            const res = await api.get(`/courses/id/${id}`);
            if (res.data.success) {
                const course = res.data.data;
                setFormData({
                    courseName: course.courseName,
                    shortName: course.shortName || '',
                    slug: course.slug,
                    degreeLevel: course.degreeLevel || 'Undergraduate',
                    duration: course.duration || '',
                    overview: course.overview || '',
                    isTrending: !!course.isTrending
                });
            }
        } catch (error) {
            console.error('Error fetching course:', error);
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
                await api.put(`/courses/${id}`, formData);
                alert('Course updated successfully!');
            } else {
                await api.post('/courses', formData);
                alert('Course added successfully!');
            }

            router.push('/admin/trending-courses');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/trending-courses" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Course' : 'Add New Course'}</h1>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                <input
                                    type="text"
                                    name="courseName"
                                    required
                                    value={formData.courseName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                    placeholder="e.g. Bachelor of Technology"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                                <input
                                    type="text"
                                    name="shortName"
                                    required
                                    value={formData.shortName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                    placeholder="e.g. B.Tech"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    required
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                    placeholder="e.g. btech"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level</label>
                                <select
                                    name="degreeLevel"
                                    value={formData.degreeLevel}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                >
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Postgraduate">Postgraduate</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Doctorate">Doctorate</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                required
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                placeholder="e.g. 4 Years"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                            <textarea
                                name="overview"
                                rows={4}
                                required
                                value={formData.overview}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                placeholder="Brief overview of the course..."
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <input
                                type="checkbox"
                                id="isTrending"
                                name="isTrending"
                                checked={formData.isTrending}
                                onChange={handleChange}
                                className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange border-gray-300"
                            />
                            <label htmlFor="isTrending" className="text-sm font-bold text-gray-800 cursor-pointer">
                                Trending Course (Show on home page)
                            </label>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-brand-orange text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : <><FaSave /> {isEditMode ? 'Update Course' : 'Save Course'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCourseForm;
