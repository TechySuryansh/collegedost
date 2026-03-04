"use client";

import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

/**
 * Interface for YouTube video data returned from API
 */
interface Video {
    _id: string;
    title: string;
    videoId: string;
    thumbnail: string;
    category: string;
    createdAt: string;
}

/**
 * Admin YouTube Videos Management component.
 * Displays list of videos with CRUD operations.
 */
const AdminVideos: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async (): Promise<void> => {
        try {
            const res = await api.get('/youtube');
            if (res.data.success) {
                setVideos(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string): Promise<void> => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                await api.delete(`/youtube/${id}`);
                setVideos(videos.filter(v => v._id !== id));
            } catch (error) {
                console.error('Error deleting video:', error);
                alert('Failed to delete video');
            }
        }
    };

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
                        <FaYoutube className="text-red-600" /> YouTube Videos Management
                    </h1>
                    <p className="text-gray-500 text-sm">Manage video content for the platform</p>
                </div>
                <Link href="/admin/videos/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap">
                    <FaPlus /> Add Video
                </Link>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden flex flex-col gap-4">
                {videos.map((video, index) => (
                    <motion.div
                        key={video._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex gap-4 mb-4">
                            <div className="w-24 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="pr-4">
                                <h3 className="font-bold text-gray-900 mb-1 text-sm line-clamp-2">{video.title}</h3>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide bg-red-50 text-red-700">
                                    {video.category}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-xs text-gray-400 font-medium">
                                {new Date(video.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex gap-4">
                                <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue" title="Watch">
                                    <FaExternalLinkAlt />
                                </a>
                                <Link href={`/admin/videos/edit/${video._id}`} className="text-gray-400 hover:text-green-600" title="Edit">
                                    <FaEdit />
                                </Link>
                                <button onClick={() => handleDelete(video._id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {videos.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                        <p>No videos found.</p>
                    </div>
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Video</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Category</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {videos.map((video, index) => (
                            <motion.tr
                                key={video._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{video.title}</div>
                                            <div className="text-xs text-gray-500">ID: {video.videoId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-800 border border-red-100">
                                        {video.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue" title="Watch">
                                            <FaExternalLinkAlt />
                                        </a>
                                        <Link href={`/admin/videos/edit/${video._id}`} className="text-gray-400 hover:text-green-600" title="Edit">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(video._id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        {videos.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No videos found. Click &quot;Add Video&quot; to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminVideos;
