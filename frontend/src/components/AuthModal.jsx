import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaGoogle, FaEnvelope, FaLock, FaUser, FaPhone, FaGraduationCap, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialTab = 'signup' }) => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password (only for forgot password)
  
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
    agree: false
  });

  const [error, setError] = useState('');

  // Reset body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveTab(initialTab);
      setStep(1);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialTab]);

  // Multi-step verification removed
  const apiCall = async (method, endpoint, data = {}) => {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const url = `${BASE_URL}${endpoint}`;
      const token = localStorage.getItem('token');
      const config = {
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
          }
      };
      
      return axios({ method, url, data, ...config });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- LOGIN LOGIC ---
    if (activeTab === 'login') {
        if (!formData.email || !formData.password) {
            setError('Please enter email and password');
            return;
        }
        setLoading(true);
        try {
            const response = await apiCall('post', '/auth/login', { email: formData.email, password: formData.password });
            if (response.data.success) {
                login(response.data.user, response.data.token);
                if (onClose) onClose();
            }
        } catch (err) {
             setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
        return;
    }
    
    // --- SIGNUP LOGIC ---
    if (activeTab === 'signup') {
        if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
            setError('Please fill all required fields');
            return;
        }
        if (!formData.agree) {
            setError('Please agree to terms');
            return;
        }

        setLoading(true);
        try {
            const response = await apiCall('post', '/auth/register', formData);
            if (response.data.success) {
                login(response.data.user, response.data.token);
                if (onClose) onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
        return;
    }

    // --- FORGOT PASSWORD LOGIC ---
    if (activeTab === 'forgotPassword') {
         // Validation for forgot password steps
         if (step === 1 && !formData.email) {
             setError('Please enter your email address');
             return;
         }
         if (step === 2) {
             if (!formData.otp) {
                 setError('Please enter the OTP sent to your email');
                 return;
             }
             if (!formData.password) {
                  setError('Please enter new password');
                  return;
             }
             if (formData.password !== formData.confirmPassword) {
                 setError('Passwords do not match');
                 return;
             }
         }

         setLoading(true);
         try {
            if (step === 1) { 
                 await apiCall('post', '/auth/forgot-password', { email: formData.email });
                 setStep(2);
                 setError(''); 
            } else {
                 await apiCall('post', '/auth/reset-password', { email: formData.email, otp: formData.otp, password: formData.password });
                 alert('Password reset successfully!');
                 setActiveTab('login');
                 setStep(1);
            }
         } catch(err) {
             setError(err.response?.data?.message || 'Operation failed');
         } finally {
             setLoading(false);
         }
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        setLoading(true);
        const res = await apiCall('post', '/auth/google', {
            token: credentialResponse.credential
        });
        
        if (res.data.success) {
             login(res.data.user, res.data.token);
             if (onClose) onClose();
        }
    } catch (err) {
        console.error("Google Login Error", err);
        setError('Google Login Failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="relative z-[200]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md"
          />

          {/* Scrollable Container */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="w-full max-w-lg lg:max-w-4xl transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl relative flex flex-col md:flex-row my-8"
                onClick={(e) => e.stopPropagation()}
              >
                  {/* Close Button */}
                  <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/5 hover:bg-black/10 text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <FaTimes />
                  </button>

                  {/* Left Side: Premium Theme Marketing (Hidden on Mobile) */}
                  <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] text-white p-8 flex-col relative overflow-hidden">
                     {/* Decorative Elements */}
                     <div className="absolute top-0 left-0 w-64 h-64 bg-brand-cyan/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
                     <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-violet/20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                     {/* Mesh */}
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                     <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-auto">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-brand-cyan font-bold text-xl mb-6 shadow-2xl border border-white/10">CD</div>
                            <h2 className="text-3xl font-bold font-heading leading-tight mb-4">
                                Unlock Your <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-mint">Dream College</span>
                            </h2>
                            <p className="text-blue-200/80 text-sm leading-relaxed">
                                Join 50,000+ students leveraging AI tools, premium counselling, and 100+ ebooks to get ahead.
                            </p>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                <div className="text-brand-cyan text-xs font-bold uppercase tracking-wider mb-1">Premium Access</div>
                                <div className="text-sm font-medium opacity-90">Get AI Rank Predictors & Exams Alerts</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                <div className="text-brand-mint text-xs font-bold uppercase tracking-wider mb-1">Community</div>
                                <div className="text-sm font-medium opacity-90">Connect with Toppers & Experts</div>
                            </div>
                        </div>
                     </div>
                  </div>

              {/* Right Side: Form (Compact & Clean) */}
              <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col bg-slate-50">
                
                {/* Compact Tabs */}
                <div className="flex bg-gray-200/80 p-1 rounded-xl mb-6 self-start w-full sm:w-auto">
                    <button 
                        className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => {setActiveTab('signup'); setError(''); setStep(1);}}
                    >
                        Sign Up
                    </button>
                    <button 
                        className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => {setActiveTab('login'); setError(''); setStep(1);}}
                    >
                        Login
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                        {activeTab === 'signup' ? 'Create Account' : activeTab === 'forgotPassword' ? 'Reset Password' : 'Welcome Back'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {activeTab === 'signup' ? 'Get started for free today.' : activeTab === 'forgotPassword' ? (step === 1 ? 'Enter your email to receive a reset code.' : 'Enter the code sent to your email.') : 'Enter your details to access your account.'}
                    </p>
                </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {activeTab === 'forgotPassword' ? (
                           <>
                             {step === 1 ? (
                                 <div className="space-y-1">
                                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                     <div className="relative group">
                                         <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                         <input 
                                             type="email" 
                                             placeholder="john@example.com" 
                                             className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                             value={formData.email}
                                             onChange={(e) => setFormData({...formData, email: e.target.value})}
                                             required
                                         />
                                     </div>
                                 </div>
                             ) : (
                                 <>
                                     <div className="space-y-1">
                                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Reset Code (OTP)</label>
                                         <div className="relative group">
                                             <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                             <input 
                                                 type="text" 
                                                 placeholder="123456" 
                                                 className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 tracking-widest"
                                                 value={formData.otp}
                                                 onChange={(e) => setFormData({...formData, otp: e.target.value})}
                                                 required
                                             />
                                         </div>
                                     </div>
                                     <div className="space-y-1">
                                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                         <div className="relative group">
                                             <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                             <input 
                                                 type="password" 
                                                 placeholder="••••••••" 
                                                 className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                                 value={formData.password}
                                                 onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                 required
                                             />
                                         </div>
                                     </div>
                                     <div className="space-y-1">
                                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                         <div className="relative group">
                                             <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                             <input 
                                                 type="password" 
                                                 placeholder="••••••••" 
                                                 className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                                 value={formData.confirmPassword}
                                                 onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                                 required
                                             />
                                         </div>
                                     </div>
                                 </>
                             )}

                             {error && (
                                <div className={`text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-2 ${error.includes('sent') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {error.includes('sent') ? <FaCheckCircle /> : <FaTimes />} {error}
                                </div>
                             )}

                             <button 
                                 type="submit"
                                 disabled={loading}
                                 className="w-full bg-brand-deep-bg hover:bg-brand-blue-dark text-white shadow-lg shadow-brand-blue/30 font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                             >
                                 {loading ? (
                                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                 ) : (
                                     step === 1 ? 'Send Reset Code' : 'Reset Password'
                                 )}
                             </button>

                             <button 
                                type="button"
                                onClick={() => {setActiveTab('login'); setError(''); setStep(1);}}
                                className="w-full text-sm text-gray-500 hover:text-gray-800 font-medium py-2"
                             >
                                Back to Login
                             </button>
                           </>
                        ) : (
                        <>
                        {activeTab === 'signup' && (
                             <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <div className="relative group">
                                                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="John Doe" 
                                                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                             <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                                                <div className="relative group">
                                                    <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                    <input 
                                                        type="tel" 
                                                        placeholder="+91 98765 43210" 
                                                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                                        value={formData.mobile}
                                                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                            <div className="relative group">
                                                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                <input 
                                                    type="email" 
                                                    placeholder="john@example.com" 
                                                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                            <div className="relative group">
                                                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                <input 
                                                    type="password" 
                                                    placeholder="••••••••" 
                                                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Studying In</label>
                                                <div className="relative group">
                                                    <FaGraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                    <select 
                                                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-700 appearance-none"
                                                        value={formData.currentClass}
                                                        onChange={(e) => setFormData({...formData, currentClass: e.target.value})}
                                                    >
                                                        <option value="">Select Class</option>
                                                        <option value="Class 12th">Class 12th</option>
                                                        <option value="Class 11th">Class 11th</option>
                                                        <option value="Dropper">Dropper</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                                                <div className="relative group">
                                                    <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Mumbai" 
                                                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 mt-2">
                                            <input 
                                                type="checkbox" 
                                                id="agree" 
                                                className="mt-1 w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue cursor-pointer"
                                                checked={formData.agree}
                                                onChange={(e) => setFormData({...formData, agree: e.target.checked})}
                                            />
                                            <label htmlFor="agree" className="text-xs text-gray-500 leading-tight cursor-pointer">
                                                I agree to <span className="text-brand-blue font-bold">Privacy Policy</span> & <span className="text-brand-blue font-bold">Terms</span>.
                                            </label>
                                        </div>
                             </>
                        )}

                        {activeTab === 'login' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative group">
                                        <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input 
                                            type="email" 
                                            placeholder="john@example.com" 
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative group">
                                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {activeTab === 'login' && (
                             <div className="flex justify-end">
                                <button 
                                    type="button"
                                    onClick={() => {setActiveTab('forgotPassword'); setError(''); setStep(1);}}
                                    className="text-xs font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}
                        
                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-2">
                                <FaTimes className="" /> {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-deep-bg hover:bg-brand-blue-dark text-white shadow-lg shadow-brand-blue/30 font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {activeTab === 'signup' ? 'Create Account' : 'Login'} 
                                    <FaArrowRight className="text-xs" />
                                </>
                            )}
                        </button>
                        
                        <div className="relative flex py-2 items-center justify-center">
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">Or continue with</span>
                        </div>

                         <div className="flex justify-center">
                            <GoogleLogin 
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Login Failed')}
                                type="standard"
                                theme="outline"
                                size="large"
                                shape="pill"
                                text="continue_with"
                            />
                        </div>
                        </>
                        )}
                    </form>
                  </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
