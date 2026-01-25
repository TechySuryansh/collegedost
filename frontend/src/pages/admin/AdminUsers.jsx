import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaUser, FaTrash, FaUserShield, FaCheckCircle, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                // Assuming delete endpoint exists, currently it may not
                 alert("Delete functionality not yet enabled in backend for safety.");
                 // const token = localStorage.getItem('token');
                 // await axios.delete(`http://localhost:5001/api/users/${id}`, {
                 //    headers: { Authorization: `Bearer ${token}` }
                 // });
                 // setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.includes(searchTerm)
    );

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-500 text-sm">View and manage registered users</p>
                </div>
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                </div>
            </div>

            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">User</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Contact</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Role</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Joined</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <motion.tr 
                                        key={user._id} 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-sm">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name || 'No Name'}</div>
                                                    <div className="text-xs text-green-600 flex items-center gap-1">
                                                        <FaCheckCircle className="text-[10px]" /> Active
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{user.email || '-'}</div>
                                            <div className="text-xs text-gray-400">{user.mobile || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                                    <FaUserShield className="text-[10px]" /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(user._id)} 
                                                className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                title="Delete User"
                                                disabled={user.role === 'admin'} // Prevent deleting admins easily
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminUsers;
