import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaArrowLeft, FaSave, FaUniversity } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddCollege = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        location: { state: '', city: '' },
        type: 'Private', // or Public
        nirfRank: '',
        website: '',
        images: [] 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Basic payload - real app would have exams/cutoffs forms too
            const payload = {
                ...formData,
                images: formData.images ? [formData.images] : [] // quick hack for single image input
            };
            
            await axios.post('http://localhost:5001/api/colleges', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('College added successfully');
            navigate('/admin/colleges');
        } catch (error) {
            console.error(error);
            alert('Failed to add college');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
             <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/colleges" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Add New College</h1>
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
                                {loading ? 'Saving...' : <><FaSave /> Save College</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddCollege;
