import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaUniversity, FaNewspaper } from 'react-icons/fa';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        colleges: 0,
        users: 0,
        articles: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
             try {
                 const { data } = await api.get('/admin/stats');
                 if (data.success) {
                     setStats({
                         colleges: data.stats.colleges,
                         users: data.stats.users,
                         articles: data.stats.articles
                     });
                     setRecentUsers(data.recentUsers || []);
                 }
             } catch (err) {
                 console.error("Failed to fetch admin stats:", err);
             } finally {
                 setLoading(false);
             }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Colleges', value: stats.colleges, icon: FaUniversity, color: 'bg-blue-500' },
        { title: 'Registered Users', value: stats.users, icon: FaUserGraduate, color: 'bg-green-500' },
        { title: 'Total Articles', value: stats.articles, icon: FaNewspaper, color: 'bg-orange-500' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <p className="text-gray-500">Welcome back, Admin.</p>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
                {statCards.map((card, i) => (
                    <motion.div 
                        key={i} 
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow cursor-default"
                    >
                        <div className={`w-12 h-12 rounded-lg ${card.color} text-white flex items-center justify-center text-xl shadow-lg shadow-gray-200`}>
                            <card.icon />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Recent Users</h3>
                    <div className="flex flex-col gap-4">
                        {loading ? <p>Loading users...</p> : (
                            recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <div key={user._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <FaUserGraduate />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <span className={`ml-auto text-xs font-bold px-2 py-1 rounded ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-50 text-green-600'}`}>
                                            {user.role || 'user'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No recent users found.</p>
                            )
                        )}
                    </div>
                </motion.div>

                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                 >
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/admin/colleges/new" className="p-4 bg-brand-light border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-brand-blue hover:text-brand-blue transition-all group">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <FaUniversity className="text-xl text-brand-blue" />
                             </div>
                             <span className="text-sm font-bold">Add College</span>
                        </Link>
                         <Link to="/admin/articles/new" className="p-4 bg-brand-light border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-brand-blue hover:text-brand-blue transition-all group">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <FaNewspaper className="text-xl text-brand-blue" />
                             </div>
                             <span className="text-sm font-bold">Post Article</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
