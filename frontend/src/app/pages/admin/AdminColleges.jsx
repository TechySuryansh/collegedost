import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaUniversity, FaPlus, FaMapMarkerAlt, FaStar, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminColleges = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 9; // Items per page

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchColleges();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, page]);

    const fetchColleges = async () => {
        setLoading(true);
        try {
            const res = await api.get('/colleges', {
                params: {
                    search: search,
                    page: page,
                    limit: limit
                }
            });
            if (res.data.success) {
                setColleges(res.data.data);
                setTotalPages(res.data.pagination.pages);
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this college?')) {
             try {
                  await api.delete(`/colleges/${id}`);
                 setColleges(colleges.filter(c => c._id !== id));
             } catch (error) {
                 console.error('Error deleting college:', error);
                 alert('Failed to delete college');
             }
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 on search
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Colleges Management</h1>
                    <p className="text-gray-500 text-sm">Manage database of colleges</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search colleges..." 
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                        />
                    </div>
                    <Link to="/admin/colleges/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <FaPlus /> Add College
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
                </div>
            ) : (
                <>
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
                                            <Link to={`/admin/colleges/edit/${college._id}`} className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-full transition-colors">
                                                <FaEdit />
                                            </Link>
                                            <button onClick={() => handleDelete(college._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
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
                            <p>No colleges found matching satisfy your search.</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button 
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className={`p-2 rounded-lg border ${page === 1 ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-brand-orange'}`}
                            >
                                <FaChevronLeft />
                            </button>
                            
                            <span className="text-sm font-medium text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            
                            <button 
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className={`p-2 rounded-lg border ${page === totalPages ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-brand-orange'}`}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}
        </AdminLayout>
    );
};

export default AdminColleges;
