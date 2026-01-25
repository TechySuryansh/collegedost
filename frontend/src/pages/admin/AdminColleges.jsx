import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaUniversity, FaPlus, FaMapMarkerAlt, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminColleges = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/colleges');
            if (res.data.success) {
                setColleges(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug) => {
        if(window.confirm('Are you sure you want to delete this college?')) {
             try {
                 // Assuming endpoint exists or will exist
                 alert("Delete functionality pending backend implementation");
             } catch (error) {
                 console.error(error);
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
                    <h1 className="text-2xl font-bold text-gray-900">Colleges Management</h1>
                    <p className="text-gray-500 text-sm">Manage database of colleges</p>
                </div>
                <Link to="/admin/colleges/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                    <FaPlus /> Add College
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleges.map((college, index) => (
                    <motion.div 
                        key={college._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                    >
                        <div className="h-40 bg-gray-100 relative">
                            <img 
                                src={college.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'} 
                                alt={college.name} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-brand-orange shadow-sm flex items-center gap-1">
                                <FaStar className="text-yellow-400" /> {college.nirfRank ? `#${college.nirfRank} NIRF` : 'N/A'}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3rem]">{college.name}</h3>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <FaMapMarkerAlt className="text-gray-400" />
                                <span className="truncate">{college.location?.city}, {college.location?.state}</span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                    {college.type}
                                </span>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-full transition-colors">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(college.slug)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {colleges.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                    <FaUniversity className="text-4xl mx-auto mb-4 opacity-20" />
                    <p>No colleges found. Click "Add College" to start building your database.</p>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminColleges;
