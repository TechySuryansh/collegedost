"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/api/axios';
import { FaUser, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
    // We initialize state safely for SSR
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');

    // Password Update
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token) {
            // Redirect or show message?
            // Usually AuthRedirect happens in Layout or middleware, but simple check here:
            // return;
        }

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setName(parsedUser.name || '');
            setEmail(parsedUser.email || '');
        }
    }, []);

    const handleUpdateDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);
        try {
            const res = await api.put(`/users/updatedetails`, {
                name,
                email,
                currentPassword: currentPasswordForEmail
            });

            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setCurrentPasswordForEmail('');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmNewPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const res = await api.put(`/users/updatepassword`, {
                currentPassword,
                newPassword
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    };

    if (!isMounted) return null; // Avoid hydration mismatch

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium pt-20">Please login to view profile.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-br from-brand-blue to-brand-indigo rounded-b-[3rem] shadow-none z-0"></div>
            <div className="absolute top-0 inset-x-0 h-96 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none rounded-b-[3rem]"></div>

            {/* Main Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-20">

                {/* Profile Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative mx-auto w-32 h-32 mb-4"
                    >
                        <div className="w-full h-full rounded-full bg-white p-1 shadow-2xl">
                            <div className="w-full h-full rounded-full bg-linear-to-tr from-brand-orange to-yellow-400 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                                {getInitials(user.name)}
                            </div>
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold text-white mb-2 font-heading"
                    >
                        {user.name}
                    </motion.h1>
                    <p className="text-blue-100 font-medium max-w-md mx-auto">{user.email}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Left Column: Personal Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-gray-100 overflow-hidden relative h-full flex flex-col"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center text-xl">
                                <FaUser />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                <p className="text-sm text-gray-500">Update your personal details here.</p>
                            </div>
                        </div>

                        {message.text && !message.text.includes('Password') && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleUpdateDetails} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-all font-medium text-gray-800 placeholder-gray-400 group-hover:bg-white"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                                    />
                                    {email !== user.email && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100"
                                        >
                                            <label className="block text-xs font-bold text-yellow-700 mb-2">Confirm Password to Change Email</label>
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                value={currentPasswordForEmail}
                                                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-yellow-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
                                                required
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Mobile Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={user.mobile || 'N/A'}
                                            disabled
                                            className="w-full px-5 py-3 bg-gray-100/50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">Verified</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-900/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100 w-full md:w-auto"
                                >
                                    {loading ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Right Column: Security */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="h-full flex flex-col"
                    >
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-gray-100 relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[80px] -mr-6 -mt-6 pointer-events-none"></div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                                    <FaLock />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Security</h2>
                                    <p className="text-sm text-gray-500">Manage your password.</p>
                                </div>
                            </div>

                            {message.text && message.text.includes('Password') && (
                                <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    {message.text}
                                </div>
                            )}

                            {user.googleId ? (
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl mx-auto mb-3 shadow-sm text-green-500">
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg>
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-1">Signed in with Google</h3>
                                    <p className="text-xs text-gray-500">Your account is secured via Google Authentication. Password changes are not applicable.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdatePassword} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Confirm New</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={confirmNewPassword}
                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                                    >
                                        {loading ? 'Updating...' : 'Change Password'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
