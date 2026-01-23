import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaGoogle, FaEnvelope, FaLock, FaUser, FaPhone, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, initialTab = 'signup' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
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
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const benefits = [
    "Exam And Admission Alerts",
    "Mock Tests & Sample Papers",
    "100+ Entrance Exam Preparation E-Books",
    "AI-Based College/Rank Prediction Tools",
    "College And Course Guides",
    "Large Community Of Like Minded Students",
    "Detailed Webinars And Online Sessions",
    "1 On 1 Counselling From Experts"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signup' && !formData.agree) {
        setError('Please agree to terms and conditions');
        return;
    }
    
    // Basic validation
    if (!formData.password) {
        setError('Please enter password');
        return;
    }

    setLoading(true);
    try {
        const endpoint = activeTab === 'signup' 
            ? 'http://localhost:5000/api/auth/register' 
            : 'http://localhost:5000/api/auth/login';

        const payload = activeTab === 'signup' 
            ? formData 
            : { mobile: formData.mobile, password: formData.password };

        const response = await axios.post(endpoint, payload);

        if (response.data.success) {
            // Save token
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // Close
            onClose();
            window.location.reload();
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Authentication failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="relative z-[100]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
          />

          {/* Scrollable Container */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl relative flex flex-col md:flex-row my-8 border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                 {/* Close Button */}
                 <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-gray-500 hover:text-red-500 transition-all"
                  >
                    <FaTimes />
                  </button>

                  {/* Left Side: Marketing */}
                  <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-orange-50 to-orange-100 p-10 flex-col justify-center relative overflow-hidden">
                     {/* Decorative Elements */}
                     <div className="absolute top-0 left-0 w-72 h-72 bg-brand-orange/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
                     <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-indigo/10 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2"></div>
                     <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2"></div>

                     <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">COLLEGE<span className="text-brand-orange">DOST</span></h2>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">The Education Portal</p>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">Unlock Your Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Premium Access</span></h3>
                        <p className="text-gray-600 mb-8 text-sm font-medium">Join 50,000+ students getting ahead in their career.</p>

                        <ul className="space-y-3.5">
                            {benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 group">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                        <FaCheckCircle className="text-[10px]" />
                                    </div>
                                    <span className="font-medium group-hover:text-gray-900 transition-colors">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                     </div>
                  </div>

                  {/* Right Side: Form */}
                  <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-14 bg-white relative">
                    
                    {/* Tabs */}
                    <div className="flex gap-8 border-b-2 border-gray-100 mb-8 relative">
                        <button 
                            className={`pb-4 text-lg font-bold transition-all px-2 ${activeTab === 'signup' ? 'text-brand-orange' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => setActiveTab('signup')}
                        >
                            Create Account
                            {activeTab === 'signup' && <motion.div layoutId="authTab" className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-brand-orange rounded-full"></motion.div>}
                        </button>
                        <button 
                            className={`pb-4 text-lg font-bold transition-all px-2 ${activeTab === 'login' ? 'text-brand-orange' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                            {activeTab === 'login' && <motion.div layoutId="authTab" className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-brand-orange rounded-full"></motion.div>}
                        </button>
                    </div>

                    <div className="mb-8">
                         <button className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md group">
                            <FaGoogle className="text-xl text-red-500 group-hover:scale-110 transition-transform" /> 
                            <span>Continue with Google</span>
                        </button>
                        <div className="relative flex py-5 items-center">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">Or continue with email</span>
                            <div className="flex-grow border-t border-gray-100"></div>
                        </div>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {activeTab === 'signup' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">Full Name</label>
                                    <div className="relative group">
                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                                        <input 
                                            type="text" 
                                            placeholder="John Doe" 
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">Email Address</label>
                                    <div className="relative group">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                                        <input 
                                            type="email" 
                                            placeholder="john@example.com" 
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">Mobile Number</label>
                            <div className="relative group">
                                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                                <input 
                                    type="tel" 
                                    placeholder="+91 98765 43210" 
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">Password</label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {activeTab === 'signup' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">Studying In</label>
                                        <div className="relative group">
                                            <FaGraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                                            <select 
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-700 appearance-none"
                                                value={formData.currentClass}
                                                onChange={(e) => setFormData({...formData, currentClass: e.target.value})}
                                            >
                                                <option value="">Select Class</option>
                                                <option value="Class 12th">Class 12th</option>
                                                <option value="Class 11th">Class 11th</option>
                                                <option value="Class 10th">Class 10th</option>
                                                <option value="Dropper">Dropper</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">City</label>
                                        <div className="relative group">
                                            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                                            <input 
                                                type="text" 
                                                placeholder="Mumbai" 
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                                                value={formData.city}
                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">Goal / Interest</label>
                                    <div className="relative group">
                                        <select 
                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-700"
                                            value={formData.interest}
                                            onChange={(e) => setFormData({...formData, interest: e.target.value})}
                                        >
                                            <option value="">Select Course Interest</option>
                                            <option value="B.E/B.Tech">Engineering (B.E/B.Tech)</option>
                                            <option value="MBBS">Medical (MBBS/BDS)</option>
                                            <option value="MBA">Management (MBA)</option>
                                            <option value="Law">Law</option>
                                            <option value="Design">Design</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="relative flex items-center h-5">
                                        <input 
                                            type="checkbox" 
                                            id="agree" 
                                            className="w-5 h-5 text-brand-orange border-gray-300 rounded focus:ring-brand-orange focus:ring-2 cursor-pointer"
                                            checked={formData.agree}
                                            onChange={(e) => setFormData({...formData, agree: e.target.checked})}
                                        />
                                    </div>
                                    <label htmlFor="agree" className="text-xs text-gray-600 leading-snug cursor-pointer">
                                        I agree to the <a href="#" className="text-brand-indigo font-bold hover:underline">Privacy Policy</a> & <a href="#" className="text-brand-indigo font-bold hover:underline">Terms</a>. I consent to receive updates via Email/SMS/WhatsApp.
                                    </label>
                                </div>
                            </>
                        )}
                        
                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                                <FaCheckCircle className="rotate-45" /> {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-orange to-red-500 text-white hover:shadow-lg hover:shadow-brand-orange/30 font-bold py-4 rounded-xl transition-all transform hover:-translate-y-0.5 mt-4"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...
                                </span>
                            ) : (
                                activeTab === 'signup' ? 'Create Account' : 'Login Securely'
                            )}
                        </button>

                        {/* Footer Switch */}
                        <div className="text-center mt-6 text-sm text-gray-500 font-medium">
                            {activeTab === 'login' ? (
                                <>Don't have an account? <button type="button" onClick={() => setActiveTab('signup')} className="text-brand-indigo font-bold hover:underline">Sign Up Now</button></>
                            ) : (
                                <>Already have an account? <button type="button" onClick={() => setActiveTab('login')} className="text-brand-indigo font-bold hover:underline">Login Here</button></>
                            )}
                        </div>
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
