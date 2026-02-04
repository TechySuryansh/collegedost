import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await api.get('/articles');
            if (res.data.success) {
                setArticles(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                const token = localStorage.getItem('token');
                await api.delete(`/articles/${id}`);
                setArticles(articles.filter(a => a._id !== id));
            } catch (error) {
                console.error('Error deleting article:', error);
                alert('Failed to delete article');
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
                    <h1 className="text-2xl font-bold text-gray-900">Articles Management</h1>
                    <p className="text-gray-500 text-sm">Create, edit, and manage news articles</p>
                </div>
                <Link href="/admin/articles/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap">
                    <FaPlus /> Post Article
                </Link>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden flex flex-col gap-4">
                {articles.map((article, index) => (
                    <motion.div
                        key={article._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-3">
                             <div className="pr-4">
                                <h3 className="font-bold text-gray-900 mb-1">{article.title}</h3>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide bg-blue-50 text-blue-700">
                                    {article.category}
                                </span>
                             </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{article.summary}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                             <span className="text-xs text-gray-400 font-medium">
                                {new Date(article.createdAt).toLocaleDateString()}
                             </span>
                             <div className="flex gap-4">
                                <a href={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue" title="View">
                                    <FaExternalLinkAlt />
                                </a>
                                <Link href={`/admin/articles/edit/${article._id}`} className="text-gray-400 hover:text-green-600" title="Edit">
                                    <FaEdit />
                                </Link>
                                <button onClick={() => handleDelete(article._id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                    <FaTrash />
                                </button>
                             </div>
                        </div>
                    </motion.div>
                ))}
                
                {articles.length === 0 && (
                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                        <p>No articles found.</p>
                     </div>
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Title</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Category</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {articles.map((article, index) => (
                            <motion.tr 
                                key={article._id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{article.title}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-xs">{article.summary}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                                        {article.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <a href={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue" title="View">
                                            <FaExternalLinkAlt />
                                        </a>
                                        <Link href={`/admin/articles/edit/${article._id}`} className="text-gray-400 hover:text-green-600" title="Edit">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(article._id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                    No articles found. Click "Post Article" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminArticles;
