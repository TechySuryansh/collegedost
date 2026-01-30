import React, { useState } from 'react';
import { FaUniversity, FaSearch, FaTrophy, FaMapMarkerAlt, FaFilter, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const JEEMainPredictor = ({ onOpenAuthModal }) => {
    const [percentile, setPercentile] = useState('');
    const [category, setCategory] = useState('General');
    const [homeState, setHomeState] = useState('');
    const [gender, setGender] = useState('');
    const [isPwd, setIsPwd] = useState('');
    const [mobile, setMobile] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState(null);
    const [error, setError] = useState('');

    const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
        "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
    ];

    const handlePredict = async (e) => {
        e.preventDefault();

        // Check Auth
        const token = localStorage.getItem('token');
        if (!token) {
            onOpenAuthModal();
            return;
        }

        if (!percentile || percentile < 0 || percentile > 100) {
            setError('Please enter a valid JEE Main Percentile (0-100)');
            return;
        }
        if (!homeState) setError('Please select your Home State');
        if (!gender) setError('Please select your Gender');
        if (!isPwd) setError('Please select Specially Abled status');
        if (!mobile || mobile.length < 10) setError('Please enter a valid mobile number');
        
        if (!homeState || !gender || !isPwd || !mobile || mobile.length < 10) return;

        setLoading(true);
        setError('');
        setColleges(null);

        // Convert Percentile to Rank
        // Formula: Rank = (100 - P) * Total_Candidates / 100
        // Approx Total Candidates = 14,00,000 for 2024-25
        const totalCandidates = 1400000;
        const calculatedRank = ((100 - parseFloat(percentile)) * totalCandidates) / 100;
        const rank = Math.floor(calculatedRank);

        try {
            const response = await api.post(`/predictor/jee-main`, {
                rank: rank, // Send calculated rank to backend
                category,
                homeState,
                gender,
                isPwd
            });

            if (response.data.success) {
                setColleges(response.data.colleges); // Using 'colleges' as per my backend
                // Scroll to results
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch predictions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 overflow-x-hidden">
            {/* Header Section */}
            <div className="bg-brand-deep-bg relative overflow-hidden text-white pt-24 pb-20 mb-10">
                 {/* Premium Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] z-0"></div>
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] z-0 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight"
                    >
                        JEE Main College Predictor 2026
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-blue-100/80 max-w-2xl mx-auto font-light"
                    >
                         Enter your JEE Main Percentile to find the best engineering colleges you can get into.
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Input Form Card */}
                    <div className="bg-white rounded-2xl shadow-premium overflow-hidden mb-12 border border-white/40 relative z-20">
                        <div className="h-2 bg-gradient-to-r from-brand-orange via-yellow-400 to-brand-blue"></div>
                        <div className="p-8 md:p-10">
                            <form onSubmit={handlePredict} className="grid grid-cols-1 gap-6">
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2 border-b border-gray-100 pb-4">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center">
                                            <FaFilter className="text-sm" /> 
                                        </div>
                                        Enter Your Details
                                    </h3>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Percentile */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">JEE Main Paper-1 Percentile</label>
                                        <input
                                            type="number"
                                            step="0.0000001"
                                            min="0"
                                            max="100"
                                            placeholder="e.g. 96.89"
                                            value={percentile}
                                            onChange={(e) => setPercentile(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold text-2xl text-brand-blue placeholder:font-normal placeholder:text-gray-400"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">We will convert this to an approximate Rank (Assuming ~14L candidates) for prediction.</p>
                                    </div>

                                    {/* Home State */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Home State</label>
                                        <div className="relative">
                                            <select
                                                value={homeState}
                                                onChange={(e) => setHomeState(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all appearance-none text-gray-700 font-medium"
                                            >
                                                <option value="">Select State</option>
                                                {states.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                        </div>
                                    </div>

                                    {/* Caste Group */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <div className="relative">
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all appearance-none text-gray-700 font-medium"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gender & PwD */}
                                <div className="grid md:grid-cols-2 gap-6 pt-2">
                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                                        <div className="flex items-center gap-4">
                                            {['Male', 'Female'].map((opt) => (
                                                <label key={opt} className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition-all ${gender === opt ? 'bg-orange-50 border-brand-orange text-brand-orange font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                                    <input type="radio" name="gender" value={opt} className="hidden" onChange={() => setGender(opt)} checked={gender === opt} />
                                                    {opt}
                                                    {gender === opt && <FaCheckCircle />}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Specially Abled */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Specially Abled?</label>
                                        <div className="flex items-center gap-4">
                                            {['No', 'Yes'].map((opt) => (
                                                <label key={opt} className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition-all ${isPwd === opt ? 'bg-orange-50 border-brand-orange text-brand-orange font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                                    <input type="radio" name="pwd" value={opt} className="hidden" onChange={() => setIsPwd(opt)} checked={isPwd === opt} />
                                                    {opt}
                                                    {isPwd === opt && <FaCheckCircle />}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile */}
                                <div className="pt-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number <span className="text-gray-400 font-normal">(For report)</span></label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your 10-digit number"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-gray-800 font-medium"
                                    />
                                </div>

                                {/* Submit */}
                                <div className="mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 px-6 bg-gradient-to-r from-brand-orange to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all disabled:opacity-70 disabled:shadow-none min-h-[56px] flex items-center justify-center gap-3 text-lg"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>Predict My Colleges <FaSearch className="text-sm" /></>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                            
                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 text-red-700"
                                    >
                                        <FaExclamationCircle className="flex-shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div id="results-section">
                        <AnimatePresence>
                            {colleges && (
                                <motion.div 
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                    className="pb-20"
                                >
                                    <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                                        <span className="bg-green-100 text-green-700 text-sm px-4 py-1.5 rounded-full border border-green-200 shadow-sm">{colleges.length} Colleges Found</span>
                                        <span className="text-gray-500 text-lg font-normal">for {percentile} Percentile</span>
                                    </h2>

                                    {colleges.length === 0 ? (
                                        <motion.div 
                                            variants={itemVariants}
                                            className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100"
                                        >
                                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">🤷‍♂️</div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Colleges Found</h3>
                                            <p className="text-gray-500">Try adjusting your percentile or category filters to broaden your search.</p>
                                        </motion.div>
                                    ) : (
                                        <div className="grid gap-6">
                                            {colleges.map((college, idx) => (
                                                <motion.div 
                                                    key={idx} 
                                                    variants={itemVariants}
                                                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-premium transition-all duration-300 group"
                                                >
                                                    <div className="p-6 md:flex gap-6">
                                                        <div className="w-20 h-20 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 mb-4 md:mb-0 shadow-sm">
                                                            <FaUniversity />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                                <div>
                                                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors leading-tight mb-2">{college.name}</h3>
                                                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500">
                                                                        <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-brand-orange" /> {college.location ? `${college.location.city}, ${college.location.state}` : 'Location NA'}</span>
                                                                        <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-800 px-2.5 py-0.5 rounded-md border border-yellow-100 font-medium"><FaTrophy className="text-xs" /> NIRF: {college.nirfRank || 'NA'}</span>
                                                                        <span className="px-2.5 py-0.5 bg-gray-100 rounded-md text-gray-600 font-medium text-xs border border-gray-200">{college.type}</span>
                                                                    </div>
                                                                </div>
                                                                <a href="#" className="px-5 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 hover:bg-brand-blue hover:text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap">
                                                                    View Details
                                                                </a>
                                                            </div>

                                                            <div className="mt-6 pt-5 border-t border-gray-50 bg-slate-50/50 -mx-6 -mb-6 p-6">
                                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Qualifying Branches
                                                                </h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                    {college.matchedBranches.map((branch, branchIdx) => (
                                                                        <div key={branchIdx} className={`p-3 rounded-lg border text-sm flex justify-between items-center transition-colors ${branch.chance === 'High' ? 'bg-green-50/50 border-green-100 text-green-900' : 'bg-yellow-50/50 border-yellow-100 text-yellow-900'}`}>
                                                                            <span className="font-medium truncate mr-3" title={branch.branch}>{branch.branch}</span>
                                                                            <div className="text-right flex-shrink-0 pl-3 border-l border-black/5">
                                                                                <div className="text-[10px] opacity-60 uppercase tracking-wide">Closing</div>
                                                                                <div className="font-bold">{branch.closingRank}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default JEEMainPredictor;
