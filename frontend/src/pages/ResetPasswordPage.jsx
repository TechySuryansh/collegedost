import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaCheckCircle, FaTimes, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password
      });

      if (response.data.success) {
        setSuccess(true);
        // Save token immediately or just redirect to login?
        // Let's redirect to home where they can see they are logged in if the backend sent a token
        if (response.data.token) {
           localStorage.setItem('token', response.data.token);
           localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
              <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center"
              >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCheckCircle className="text-4xl text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
                  <p className="text-gray-500 mb-6">You will be redirected to the dashboard shortly.</p>
              </motion.div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-gray-500 text-sm">Create a new secure password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative group">
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-2">
                        <FaTimes /> {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-deep-bg hover:bg-brand-blue-dark text-white shadow-lg shadow-brand-blue/30 font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>Reset Password <FaArrowRight className="text-xs" /></>
                    )}
                </button>
            </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
