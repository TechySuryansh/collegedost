import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
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
            const res = await axios.get('http://localhost:5001/api/articles');
            if (res.data.success) {
                setArticles(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                const token = localStorage.getItem('token');
                // Assuming you have a delete endpoint, if not we need to create it
                await axios.delete(`http://localhost:5001/api/articles/${slug}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setArticles(articles.filter(a => a.slug !== slug));
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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Articles Management</h1>
                    <p className="text-gray-500 text-sm">Create, edit, and manage news articles</p>
                </div>
                <Link to="/admin/articles/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                    <FaPlus /> Post Article
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                        <button className="text-gray-400 hover:text-green-600" title="Edit">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(article.slug)} className="text-gray-400 hover:text-red-600" title="Delete">
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
