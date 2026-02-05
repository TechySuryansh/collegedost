"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaHospital, FaSearch, FaFilter, FaCheckCircle, FaExclamationCircle, FaRobot, FaStethoscope, FaBuilding, FaStar, FaTooth, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '@/api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const PageContent: React.FC = () => {
    const searchParams = useSearchParams();
    const [score, setScore] = useState('');
    const [category, setCategory] = useState('General');
    const [homeState, setHomeState] = useState('');
    const [gender, setGender] = useState('Male');

    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [error, setError] = useState('');
    const [expandedSections, setExpandedSections] = useState<any>({
        AIIMS: true,
        JIPMER: true,
        Government_Medical: true,
        Private_Medical: false,
        Dental: false
    });

    const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Puducherry"
    ];

    useEffect(() => {
        const predictionId = searchParams?.get('id');
        if (predictionId) {
            loadPrediction(predictionId);
        }
    }, [searchParams]);

    const loadPrediction = async (id: string) => {
        try {
            setLoading(true);
            const response = await api.get(`/predictor/neet-prediction/${id}`);
            if (response.data.success) {
                setPrediction(response.data);
                setScore(response.data.input?.score?.toString() || '');
                setCategory(response.data.input?.category || 'General');
                setHomeState(response.data.input?.homeState || '');
                setGender(response.data.input?.gender || 'Male');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load prediction');
        } finally {
            setLoading(false);
        }
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!score || parseInt(score) < 0 || parseInt(score) > 720) {
            setError('Please enter a valid NEET Score (0-720)');
            return;
        }
        if (!homeState) {
            setError('Please select your Home State');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        try {
            const response = await api.post('/predictor/neet-predict', {
                score: parseInt(score),
                category,
                homeState,
                gender
            });

            if (response.data.success) {
                setPrediction(response.data);
                // Update URL with prediction ID for sharing
                if (response.data.predictionId) {
                    window.history.replaceState({}, '', `/neet-predictor?id=${response.data.predictionId}`);
                }
                // Scroll to results
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 503) {
                setError('NEET College Predictor is currently disabled. Please try again later.');
            } else {
                setError('Failed to fetch predictions. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSections((prev: any) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getSectionIcon = (type: string) => {
        switch (type) {
            case 'AIIMS': return <FaHospital className="text-blue-600" />;
            case 'JIPMER': return <FaStethoscope className="text-purple-600" />;
            case 'Government_Medical': return <FaBuilding className="text-green-600" />;
            case 'Private_Medical': return <FaStar className="text-orange-500" />;
            case 'Dental': return <FaTooth className="text-pink-500" />;
            default: return <FaHospital />;
        }
    };

    const getSectionTitle = (type: string) => {
        switch (type) {
            case 'AIIMS': return 'All India Institute of Medical Sciences (AIIMS)';
            case 'JIPMER': return 'JIPMER (Jawaharlal Institute)';
            case 'Government_Medical': return 'Government Medical Colleges';
            case 'Private_Medical': return 'Private Medical Colleges';
            case 'Dental': return 'Dental Colleges (BDS)';
            default: return type;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const CollegeCard = ({ college }: { college: any }) => (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 group"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors text-sm md:text-base truncate">
                        {college.college_name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{college.course} • {college.state}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {college.quota && (
                            <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded font-medium">
                                {college.quota}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className="text-[10px] text-gray-400 uppercase">Cutoff Rank</div>
                    <div className="font-bold text-green-600 text-lg">{college.last_year_cutoff?.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">{college.fees}</div>
                </div>
            </div>
        </motion.div>
    );

    const ResultSection = ({ title, icon, data, type }: any) => {
        const isExpanded = expandedSections[type];
        const totalCount = (data?.good_chances?.length || 0) + (data?.may_get?.length || 0) + (data?.tough_chances?.length || 0);

        if (totalCount === 0) return null;

        return (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                <button
                    onClick={() => toggleSection(type)}
                    className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                            {icon}
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500">{totalCount} options available</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-xs">
                            {data?.good_chances?.length > 0 && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">{data.good_chances.length} Good</span>
                            )}
                        </div>
                        {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </div>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="p-5 pt-0 space-y-6">
                                {/* Good Chances */}
                                {data?.good_chances?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            Good Chances ({data.good_chances.length})
                                        </h4>
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                                        >
                                            {data.good_chances.map((college: any, idx: number) => (
                                                <CollegeCard key={idx} college={college} />
                                            ))}
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 overflow-x-hidden">
            {/* Header Section */}
            <div className="bg-linear-to-br from-green-900 via-emerald-800 to-green-900 relative overflow-hidden text-white pt-24 pb-20 mb-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] z-0 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-4"
                    >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                            <FaStethoscope className="text-2xl text-green-300" />
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight"
                    >
                        NEET College Predictor 2026
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-green-100/80 max-w-2xl mx-auto font-light"
                    >
                        AI-powered predictions for AIIMS, JIPMER, Government & Private Medical Colleges
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Input Form Card */}
                    <div className="bg-white rounded-2xl shadow-premium overflow-hidden mb-12 border border-white/40 relative z-20">
                        <div className="h-2 bg-linear-to-r from-green-500 via-emerald-400 to-teal-500"></div>
                        <div className="p-8 md:p-10">
                            <form onSubmit={handlePredict} className="grid grid-cols-1 gap-6">
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2 border-b border-gray-100 pb-4">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                                            <FaFilter className="text-sm" />
                                        </div>
                                        Enter Your Details
                                    </h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* NEET Score */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">NEET-UG Score (Out of 720)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="720"
                                            placeholder="e.g. 580"
                                            value={score}
                                            onChange={(e) => setScore(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-bold text-2xl text-green-600 placeholder:font-normal placeholder:text-gray-400"
                                            required
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <div className="relative">
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all appearance-none text-gray-700 font-medium"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                        </div>
                                    </div>

                                    {/* Home State */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Home State (Domicile)</label>
                                        <div className="relative">
                                            <select
                                                value={homeState}
                                                onChange={(e) => setHomeState(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all appearance-none text-gray-700 font-medium"
                                                required
                                            >
                                                <option value="">Select State</option>
                                                {states.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                                    <div className="flex items-center gap-4">
                                        {['Male', 'Female'].map((opt) => (
                                            <label key={opt} className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition-all ${gender === opt ? 'bg-green-50 border-green-500 text-green-600 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                                <input type="radio" name="gender" value={opt} className="hidden" onChange={() => setGender(opt)} checked={gender === opt} />
                                                {opt}
                                                {gender === opt && <FaCheckCircle />}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 px-6 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all disabled:opacity-70 disabled:shadow-none min-h-14 flex items-center justify-center gap-3 text-lg"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>Predict My Medical Colleges <FaSearch className="text-sm" /></>
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
                                        <FaExclamationCircle className="shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PageContent;
