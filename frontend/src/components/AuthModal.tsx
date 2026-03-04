"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaEnvelope, FaLock, FaUser, FaPhone, FaGraduationCap, FaMapMarkerAlt, FaArrowRight, FaShieldAlt, FaStar, FaBolt } from 'react-icons/fa';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// Compact Styled Input Field
const AuthInputField = ({
    label, icon: Icon, type = 'text', placeholder, value, onChange, required = false, extraInputClass = ''
}: {
    label: string;
    icon: React.ComponentType<{ className?: string }>
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    extraInputClass?: string;
}) => (
    <div className="space-y-1 w-full">
        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-0.5">{label}</label>
        <div className="relative group">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs transition-colors group-focus-within:text-primary" />
            <input
                type={type}
                placeholder={placeholder}
                className={`w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium text-xs text-gray-800 placeholder:text-gray-400 ${extraInputClass}`}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    </div>
);

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'login' | 'signup' | 'forgotPassword';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'signup' }) => {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgotPassword'>(initialTab);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        otp: '',
        currentClass: '',
        interest: '',
        city: '',
        agree: true
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setActiveTab(initialTab);
            setStep(1);
            setError('');
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, initialTab]);

    const apiCall = async (method: string, endpoint: string, data = {}) => {
        return api({ method, url: endpoint, data });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (activeTab === 'login') {
            if (!formData.email || !formData.password) return setError('Enter email and password');
            setLoading(true);
            try {
                const res = await apiCall('post', '/auth/login', { email: formData.email, password: formData.password });
                if (res.data.success) { login(res.data.user, res.data.token); onClose(); }
            } catch (err: any) { setError(err.response?.data?.message || 'Login failed'); }
            finally { setLoading(false); }
            return;
        }

        if (activeTab === 'signup') {
            if (!formData.name || !formData.email || !formData.mobile || !formData.password) return setError('Fill all required fields');
            setLoading(true);
            try {
                const res = await apiCall('post', '/auth/signup-new', formData);
                if (res.data.success) { login(res.data.user, res.data.token); onClose(); }
            } catch (err: any) { setError(err.response?.data?.message || 'Registration failed'); }
            finally { setLoading(false); }
            return;
        }

        if (activeTab === 'forgotPassword') {
            if (step === 1 && !formData.email) return setError('Enter your email');
            setLoading(true);
            try {
                if (step === 1) {
                    await apiCall('post', '/auth/forgot-password', { email: formData.email });
                    setStep(2);
                } else {
                    await apiCall('post', '/auth/reset-password', { email: formData.email, otp: formData.otp, password: formData.password });
                    setActiveTab('login');
                    setStep(1);
                }
            } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
            finally { setLoading(false); }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    {/* Backdrop - NO BLUR as requested */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/70"
                    />

                    {/* Modal Shell (Fixed 340px Width, Height fits content) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="relative w-full max-w-[340px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button onClick={onClose} className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                            <FaTimes size={12} />
                        </button>

                        {/* Top Branding Section (Shortened) */}
                        <div className="pt-6 pb-2 px-6 text-center border-b border-gray-50 bg-gray-50/50">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-lg text-white font-black text-lg mb-2 shadow-lg shadow-primary/20">CD</div>
                            <h3 className="text-base font-bold text-gray-900 leading-tight">
                                {activeTab === 'signup' ? 'Join CollegeDost' : activeTab === 'login' ? 'Login' : 'Reset Password'}
                            </h3>
                        </div>

                        {/* Feature Bar (Icon Row) - Compact Horizontal */}
                        <div className="flex items-center justify-around py-1.5 px-4 bg-white border-b border-gray-100">
                            <div className="flex items-center gap-1 opacity-70">
                                <FaBolt className="text-orange-500" size={8} />
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Alerts</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-70">
                                <FaShieldAlt className="text-blue-500" size={8} />
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Trusted</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-70">
                                <FaStar className="text-yellow-500" size={8} />
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Reviews</span>
                            </div>
                        </div>

                        {/* Scrollable Form Content (Reduced padding) */}
                        <div className="flex-1 overflow-y-auto max-h-[60vh] p-5 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-3">
                                {activeTab === 'login' && (
                                    <>
                                        <AuthInputField label="Email" icon={FaEnvelope} type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                        <AuthInputField label="Password" icon={FaLock} type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                        <div className="flex justify-end pt-0.5">
                                            <button type="button" onClick={() => setActiveTab('forgotPassword')} className="text-[10px] font-bold text-primary hover:underline">Forgot Password?</button>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'signup' && (
                                    <>
                                        <AuthInputField label="Full Name" icon={FaUser} type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                        <AuthInputField label="Email" icon={FaEnvelope} type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                        <AuthInputField label="Mobile" icon={FaPhone} type="tel" placeholder="+91 9876543210" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
                                        <AuthInputField label="Password" icon={FaLock} type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />

                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase ml-0.5">Class</label>
                                                <div className="relative">
                                                    <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
                                                    <select
                                                        className="w-full pl-8 pr-1 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 appearance-none focus:outline-none focus:border-primary"
                                                        value={formData.currentClass}
                                                        onChange={(e) => setFormData({ ...formData, currentClass: e.target.value })}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="12th">12th</option>
                                                        <option value="11th">11th</option>
                                                        <option value="Dropper">Dropper</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <AuthInputField label="City" icon={FaMapMarkerAlt} placeholder="Mumbai" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'forgotPassword' && (
                                    <>
                                        {step === 1 ? (
                                            <AuthInputField label="Enter Email" icon={FaEnvelope} type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                        ) : (
                                            <>
                                                <AuthInputField label="Reset Code" icon={FaShieldAlt} placeholder="123456" value={formData.otp} onChange={(e) => setFormData({ ...formData, otp: e.target.value })} required />
                                                <AuthInputField label="New Password" icon={FaLock} type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                            </>
                                        )}
                                    </>
                                )}

                                {error && (
                                    <div className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold flex items-center gap-1.5">
                                        <FaTimes className="shrink-0" /> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-2.5 rounded-lg text-xs shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-1"
                                >
                                    {loading ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {activeTab === 'login' ? 'LOGIN' : activeTab === 'signup' ? 'SIGN UP' : 'CONTINUE'}
                                            <FaArrowRight size={8} />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Switch Tab Link - More compact */}
                            <div className="mt-6 text-center pb-1">
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                                    {activeTab === 'signup' ? 'Already Registered?' : 'New here?'}
                                </p>
                                <button
                                    onClick={() => { setActiveTab(activeTab === 'login' ? 'signup' : 'login'); setError(''); setStep(1); }}
                                    className="text-xs text-primary font-black mt-0.5 hover:underline underline-offset-4"
                                >
                                    {activeTab === 'login' ? 'CREATE AN ACCOUNT' : 'LOGIN TO ACCOUNT'}
                                </button>
                            </div>
                        </div>

                        {/* Footer Disclaimer (Minimal) */}
                        <div className="bg-gray-50 p-3 border-t border-gray-100">
                            <p className="text-[8px] text-gray-400 text-center uppercase font-bold tracking-tighter">
                                Secure Payment & Privacy Guaranteed
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
