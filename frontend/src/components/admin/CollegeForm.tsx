"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import api from '@/api/axios';

/**
 * Interface for college location
 */
interface CollegeLocation {
    state: string;
    city: string;
}

/**
 * Interface for college form data
 */
interface CollegeFormData {
    name: string;
    slug: string;
    location: CollegeLocation;
    type: 'Private' | 'Public' | 'Deemed';
    nirfRank: string;
    website: string;
    images: string;
}

/**
 * Add/Edit College component.
 * Form for creating new colleges or editing existing ones.
 */
const CollegeForm: React.FC = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEditMode = !!id;
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<CollegeFormData>({
        name: '',
        slug: '',
        location: { state: '', city: '' },
        type: 'Private',
        nirfRank: '',
        website: '',
        images: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchCollege();
        }
    }, [id]);

    const fetchCollege = async (): Promise<void> => {
        try {
            setLoading(true);
            const res = await api.get(`/colleges/id/${id}`);
            if (res.data.success) {
                const college = res.data.data;
                setFormData({
                    name: college.name,
                    slug: college.slug,
                    location: {
                        state: college.location?.state || '',
                        city: college.location?.city || ''
                    },
                    type: college.type || 'Private',
                    nirfRank: college.nirfRank?.toString() || '',
                    website: college.website || '',
                    images: college.images?.[0] || ''
                });
            }
        } catch (error) {
            console.error('Error fetching college:', error);
            alert('Failed to fetch details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            if (parent === 'location') {
                setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, [child]: value }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                nirfRank: formData.nirfRank ? parseInt(formData.nirfRank) : undefined,
                images: formData.images ? [formData.images] : []
            };
            
            if (isEditMode) {
                await api.put(`/colleges/${id}`, payload);
                alert('College updated successfully');
            } else {
                await api.post('/colleges', payload);
                alert('College added successfully');
            }
            
            router.push('/admin/colleges');
        } catch (error) {
            console.error(error);
            alert('Failed to save college');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/colleges" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit College' : 'Add New College'}</h1>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select 
                                    name="type" 
                                    value={formData.type} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                >
                                    <option value="Private">Private</option>
                                    <option value="Public">Public/Government</option>
                                    <option value="Deemed">Deemed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">NIRF Rank</label>
                                <input
                                    type="number"
                                    name="nirfRank"
                                    value={formData.nirfRank}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    name="location.state"
                                    value={formData.location.state}
                                    onChange={handleChange}
                                    placeholder="e.g. Maharashtra"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="location.city"
                                    value={formData.location.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Mumbai"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                />
                            </div>
                            
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                                <input
                                    type="text"
                                    name="images"
                                    value={formData.images}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-brand-orange text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : <><FaSave /> {isEditMode ? 'Update College' : 'Save College'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CollegeForm;
