import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const ProfilePage = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
    
    // Password Update
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const res = await axios.put('http://localhost:5001/api/users/updatedetails', {
                name,
                email,
                currentPassword: currentPasswordForEmail
            }, config);

            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setCurrentPasswordForEmail('');
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        if (newPassword !== confirmNewPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const res = await axios.put('http://localhost:5001/api/users/updatepassword', {
                currentPassword,
                newPassword
            }, config);

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } catch (err) {
             setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return <div className="p-10 text-center">Please login to view profile.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

                {message.text && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Update Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaUser className="text-brand-orange" /> Personal Info
                        </h2>
                        <form onSubmit={handleUpdateDetails} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange"
                                />
                                {email !== user.email && (
                                     <div className="mt-2">
                                         <label className="block text-xs font-medium text-gray-500 mb-1">Confirm Current Password to Change Email</label>
                                         <input 
                                            type="password" 
                                            placeholder="Current Password"
                                            value={currentPasswordForEmail}
                                            onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                                            className="w-full p-2 bg-yellow-50 border border-yellow-200 rounded text-sm focus:outline-none focus:border-brand-orange"
                                            required
                                        />
                                     </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                                <input 
                                    type="text" 
                                    value={user.mobile || 'N/A'}
                                    disabled
                                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-brand-blue text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {loading ? 'Updating...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaLock className="text-brand-orange" /> Security
                        </h2>
                        {user.googleId ? (
                            <div className="text-gray-500 italic">
                                You are logged in via Google. You cannot change your password here.
                            </div>
                        ) : (
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input 
                                        type="password" 
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input 
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange"
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-black transition-colors"
                                >
                                    {loading ? 'Updating...' : 'Change Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
