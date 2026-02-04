"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { FaUserGraduate, FaUniversity, FaNewspaper, FaSync, FaRobot } from 'react-icons/fa';
import api from '@/api/axios';
import { IconType } from 'react-icons';

/**
 * Interface for admin dashboard statistics
 */
interface AdminStats {
    colleges: number;
    users: number;
    articles: number;
}

/**
 * Interface for user data returned from API
 */
interface RecentUser {
    _id: string;
    name: string;
    email: string;
    role?: 'admin' | 'user';
}

/**
 * Interface for stat card configuration
 */
interface StatCard {
    title: string;
    value: number;
    icon: IconType;
    color: string;
}

/**
 * Admin Dashboard component.
 * Displays overview statistics, recent users, and quick actions.
 */
const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats>({
        colleges: 0,
        users: 0,
        articles: 0
    });
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    const handleSync = async (): Promise<void> => {
        setIsSyncing(true);
        try {
            const { data } = await api.post('/colleges/sync');  
            if (data.success) {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to start sync');
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        const fetchStats = async (): Promise<void> => {
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

    const statCards: StatCard[] = [
        { title: 'Total Colleges', value: stats.colleges, icon: FaUniversity, color: 'bg-blue-500' },
        { title: 'Registered Users', value: stats.users, icon: FaUserGraduate, color: 'bg-green-500' },
        { title: 'Total Articles', value: stats.articles, icon: FaNewspaper, color: 'bg-orange-500' },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h2>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleSync} 
                        disabled={isSyncing}
                        className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all ${isSyncing ? 'animate-pulse' : ''}`}
                    >
                        <FaSync className={isSyncing ? 'animate-spin' : ''} /> {isSyncing ? 'Syncing...' : 'Sync Data'}
                    </button>
                </div>
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
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex items-start justify-between border border-gray-100 group cursor-default"
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{loading ? '...' : card.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center text-xl shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                            <card.icon />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Recent Users</h3>
                        <Link href="/admin/users" className="text-sm text-brand-blue hover:text-blue-700 font-medium hover:underline">View All</Link>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        {loading ? (
                            <p className="text-gray-500 text-sm text-center py-4">Loading users...</p>
                        ) : (
                            recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <div key={user._id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                        <div className="w-10 h-10 rounded-full bg-brand-light text-brand-blue flex items-center justify-center text-sm font-bold shadow-sm group-hover:scale-110 transition-transform">
                                            {user.name ? user.name[0].toUpperCase() : <FaUserGraduate />}
                                        </div>
                                        <div className="overflow-hidden flex-1">
                                            <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                            {user.role || 'user'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">No recent users found.</p>
                            )
                        )}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit"
                >
                    <h3 className="font-bold text-lg mb-6 text-gray-800">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        <Link href="/admin/colleges/new" className="p-4 bg-gray-50 hover:bg-brand-light border border-gray-200 hover:border-brand-blue/30 rounded-xl flex items-center gap-4 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-brand-blue group-hover:scale-110 transition-transform">
                                <FaUniversity className="text-lg" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 group-hover:text-brand-blue transition-colors">Add College</h4>
                                <p className="text-xs text-gray-500">Create a new college listing</p>
                            </div>
                        </Link>
                        <Link href="/admin/articles/new" className="p-4 bg-gray-50 hover:bg-brand-light border border-gray-200 hover:border-brand-blue/30 rounded-xl flex items-center gap-4 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-orange-500 group-hover:scale-110 transition-transform">
                                <FaNewspaper className="text-lg" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 group-hover:text-brand-blue transition-colors">Post Article</h4>
                                <p className="text-xs text-gray-500">Publish news or updates</p>
                            </div>
                        </Link>
                        <button onClick={handleSync} className="w-full p-4 bg-gray-50 hover:bg-brand-light border border-gray-200 hover:border-brand-blue/30 rounded-xl flex items-center gap-4 transition-all group text-left">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-green-500 group-hover:scale-110 transition-transform">
                                <FaSync className={`text-lg ${isSyncing ? 'animate-spin' : ''}`} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 group-hover:text-brand-blue transition-colors">Sync Data</h4>
                                <p className="text-xs text-gray-500">Refresh content from ingestion</p>
                            </div>
                        </button>
                        <Link href="/admin/predictor-settings" className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 hover:border-purple-300 rounded-xl flex items-center gap-4 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-purple-600 group-hover:scale-110 transition-transform">
                                <FaRobot className="text-lg" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 group-hover:text-purple-700 transition-colors">AI Predictor</h4>
                                <p className="text-xs text-gray-500">Configure college predictor</p>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
