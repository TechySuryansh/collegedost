"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaSave, FaArrowLeft, FaYoutube, FaVideo } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import api from '@/api/axios';

/**
 * Interface for video form data
 */
interface VideoFormData {
    title: string;
    videoId: string;
    category: string;
    description: string;
    thumbnail: string;
}

/**
 * Add/Edit YouTube Video component.
 * Form for creating new video entries or editing existing ones.
 */
const AdminVideoForm: React.FC = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEditMode = !!id;
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<VideoFormData>({
        title: '',
        videoId: '',
        category: 'General',
        description: '',
        thumbnail: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchVideo();
        }
    }, [id]);

    const fetchVideo = async (): Promise<void> => {
        try {
            setLoading(true);
            const res = await api.get(`/youtube/${id}`);
            if (res.data.success) {
                const video = res.data.data;
                setFormData({
                    title: video.title,
                    videoId: video.videoId,
                    category: video.category,
                    description: video.description || '',
                    thumbnail: video.thumbnail || ''
                });
            }
        } catch (error) {
            console.error('Error fetching video:', error);
            alert('Failed to fetch details');
        } finally {
            setLoading(false);
        }
    };

    const extractVideoId = (input: string): string => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = input.match(regex);
        return match ? match[1] : input;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        let value = e.target.value;
        if (e.target.name === 'videoId') {
            value = extractVideoId(value);
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await api.put(`/youtube/${id}`, formData);
                alert('Video updated successfully!');
            } else {
                await api.post('/youtube', formData);
                alert('Video added successfully!');
            }

            router.push('/admin/videos');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to save video');
        } finally {
            setLoading(false);
        }
    };

    const getThumbnailPreview = () => {
        if (formData.thumbnail) return formData.thumbnail;
        if (formData.videoId) return `https://img.youtube.com/vi/${formData.videoId}/maxresdefault.jpg`;
        return null;
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/videos" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Video' : 'Add New Video'}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                        placeholder="e.g. Best Engineering Colleges in India 2026"
                                    />
                                </div>

                                {/* Video ID & Category */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                            <FaYoutube className="text-red-600" /> YouTube Video ID
                                        </label>
                                        <input
                                            type="text"
                                            name="videoId"
                                            required
                                            value={formData.videoId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                            placeholder="e.g. dQw4w9WgXcQ"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">The string after watch?v= in the URL</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                        >
                                            <option value="General">General</option>
                                            <option value="College Reviews">College Reviews</option>
                                            <option value="Exam Strategy">Exam Strategy</option>
                                            <option value="Admission Guidance">Admission Guidance</option>
                                            <option value="Campus Tours">Campus Tours</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                        placeholder="Brief description of the video..."
                                    ></textarea>
                                </div>

                                {/* Thumbnail (Optional Override) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (Optional)</label>
                                    <input
                                        type="text"
                                        name="thumbnail"
                                        value={formData.thumbnail}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                        placeholder="Leave blank for default YouTube thumbnail"
                                    />
                                </div>

                                {/* Submit */}
                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`bg-brand-orange text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Saving...' : <><FaSave /> {isEditMode ? 'Update Video' : 'Save Video'}</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Preview Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaVideo className="text-brand-blue" /> Preview
                            </h3>

                            <div className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex items-center justify-center relative group">
                                {getThumbnailPreview() ? (
                                    <>
                                        <img src={getThumbnailPreview()!} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                                                <FaYoutube className="text-xl" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6 text-gray-400">
                                        <FaYoutube className="text-4xl mx-auto mb-2 opacity-20" />
                                        <p className="text-xs">Enter a valid YouTube video ID to see preview</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <h4 className="font-bold text-sm text-gray-900 truncate">{formData.title || 'Video Title'}</h4>
                                <p className="text-xs text-gray-500 mt-1">{formData.category}</p>
                                {formData.videoId && (
                                    <a
                                        href={`https://youtube.com/watch?v=${formData.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-brand-blue hover:underline mt-2 inline-block font-medium"
                                    >
                                        View on YouTube
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminVideoForm;
