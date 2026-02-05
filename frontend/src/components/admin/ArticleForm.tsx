"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaPlus, FaTrash, FaLink, FaSave, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import api from '@/api/axios';

/**
 * Interface for article link
 */
interface ArticleLink {
    title: string;
    url: string;
}

/**
 * Interface for article form data
 */
interface ArticleFormData {
    title: string;
    category: 'General' | 'Exam News' | 'College News' | 'Admission Alert';
    summary: string;
    content: string;
    image: string;
    tags: string;
    links: ArticleLink[];
}

/**
 * Post/Edit Article component.
 * Form for creating new articles or editing existing ones.
 */
const ArticleForm: React.FC = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEditMode = !!id;
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<ArticleFormData>({
        title: '',
        category: 'General',
        summary: '',
        content: '',
        image: '',
        tags: '',
        links: []
    });

    // Helper for links input
    const [newLink, setNewLink] = useState<ArticleLink>({ title: '', url: '' });

    useEffect(() => {
        if (isEditMode) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async (): Promise<void> => {
        try {
            setLoading(true);
            const res = await api.get(`/articles/id/${id}`);
            if (res.data.success) {
                const article = res.data.data;
                setFormData({
                    title: article.title,
                    category: article.category,
                    summary: article.summary,
                    content: article.content,
                    image: article.image || '',
                    tags: article.tags ? article.tags.join(', ') : '',
                    links: article.links || []
                });
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            alert('Failed to fetch details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddLink = (): void => {
        if (newLink.title && newLink.url) {
            setFormData({
                ...formData,
                links: [...formData.links, newLink]
            });
            setNewLink({ title: '', url: '' });
        }
    };

    const removeLink = (index: number): void => {
        const updatedLinks = [...formData.links];
        updatedLinks.splice(index, 1);
        setFormData({ ...formData, links: updatedLinks });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSubmit = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
            };
            
            if (isEditMode) {
                await api.put(`/articles/${id}`, dataToSubmit);
                alert('Article updated successfully!');
            } else {
                await api.post('/articles', dataToSubmit);
                alert('Article posted successfully!');
            }

            router.push('/admin/articles');
        } catch (error: unknown) {
            console.error(error);
            alert('Failed to post article');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/articles" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Article' : 'Post New Article'}</h1>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                placeholder="e.g. JEE Main 2026 Dates Announced"
                            />
                        </div>

                        {/* Category & Tags */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                >
                                    <option value="General">General</option>
                                    <option value="Exam News">Exam News</option>
                                    <option value="College News">College News</option>
                                    <option value="Admission Alert">Admission Alert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                    placeholder="engineering, exam, results"
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Summary (Short Description)</label>
                            <textarea
                                name="summary"
                                required
                                rows={3}
                                value={formData.summary}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                placeholder="Brief overview of the news..."
                            ></textarea>
                        </div>

                        {/* Main Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                            <textarea
                                name="content"
                                required
                                rows={10}
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all font-mono text-sm"
                                placeholder="Markdown or HTML content supported..."
                            ></textarea>
                            <p className="text-xs text-gray-400 mt-1">You can use basic HTML tags for formatting.</p>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                placeholder="http://example.com/image.jpg"
                            />
                        </div>

                        {/* External Links Section */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaLink /> Important Links
                            </h3>
                            
                            {/* List of added links */}
                            <div className="space-y-3 mb-4">
                                {formData.links.map((link, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200 shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-800">{link.title}</span>
                                            <span className="text-xs text-gray-500">{link.url}</span>
                                        </div>
                                        <button type="button" onClick={() => removeLink(idx)} className="text-red-400 hover:text-red-600 p-2">
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Link inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Link Title</label>
                                    <input
                                        type="text"
                                        value={newLink.title}
                                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-orange outline-none"
                                        placeholder="e.g. Official Brochure"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">URL</label>
                                    <input
                                        type="text"
                                        value={newLink.url}
                                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-orange outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleAddLink}
                                    className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors h-9.5"
                                >
                                    Add Link
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-brand-orange text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : <><FaSave /> {isEditMode ? 'Update Article' : 'Publish Article'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ArticleForm;
