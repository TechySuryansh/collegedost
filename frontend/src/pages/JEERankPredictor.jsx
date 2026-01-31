import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaChartLine, FaSearch, FaTrophy, FaCheckCircle, FaExclamationCircle, FaRobot, FaGraduationCap, FaUniversity, FaBuilding, FaStar, FaChevronRight, FaLightbulb, FaTimesCircle } from 'react-icons/fa';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const JEERankPredictor = ({ onOpenAuthModal }) => {
    const [searchParams] = useSearchParams();
    const [percentile, setPercentile] = useState('');
    const [marks, setMarks] = useState('');
    const [category, setCategory] = useState('General');
    const [inputMode, setInputMode] = useState('percentile'); // 'percentile' or 'marks'
    
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');

    const categories = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'];

    // Load prediction from URL if predictionId exists
    useEffect(() => {
        const predictionId = searchParams.get('id');
        if (predictionId) {
            loadPrediction(predictionId);
        }
    }, [searchParams]);

    const loadPrediction = async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/predictor/jee-rank-prediction/${id}`);
            if (response.data.success) {
                setPrediction(response.data);
                setPercentile(response.data.input?.percentile?.toString() || '');
                setMarks(response.data.input?.marks?.toString() || '');
                setCategory(response.data.input?.category || 'General');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load prediction');
        } finally {
            setLoading(false);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();

        if (inputMode === 'percentile' && (!percentile || parseFloat(percentile) < 0 || parseFloat(percentile) > 100)) {
            setError('Please enter a valid percentile (0-100)');
            return;
        }
        if (inputMode === 'marks' && (!marks || parseFloat(marks) < 0 || parseFloat(marks) > 300)) {
            setError('Please enter valid marks (0-300)');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        try {
            const payload = {
                category
            };
            
            if (inputMode === 'percentile') {
                payload.percentile = parseFloat(percentile);
            } else {
                payload.marks = parseFloat(marks);
            }

            const response = await api.post('/predictor/jee-rank-predict', payload);

            if (response.data.success) {
                setPrediction(response.data);
                // Update URL with prediction ID for sharing
                if (response.data.predictionId) {
                    window.history.replaceState({}, '', `/jee-rank-predictor?id=${response.data.predictionId}`);
                }
                // Scroll to results
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 503) {
                setError('Rank Predictor is currently disabled. Please try again later.');
            } else {
                setError('Failed to predict rank. Please try again later.');
            }
        } finally {
            setLoading(false);
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

    const EligibilityCard = ({ title, eligible, icon: Icon, color }) => (
        <motion.div 
            variants={itemVariants}
            className={`p-4 rounded-xl border-2 transition-all ${
                eligible 
                    ? `bg-${color}-50 border-${color}-200 text-${color}-700` 
                    : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${eligible ? `bg-${color}-100` : 'bg-gray-100'}`}>
                    <Icon className="text-xl" />
                </div>
                <div>
                    <div className="font-semibold text-sm">{title}</div>
                    <div className={`text-xs ${eligible ? `text-${color}-600` : 'text-gray-400'}`}>
                        {eligible ? '✓ Eligible' : '✗ Not Eligible'}
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const PossibilityCard = ({ item }) => (
        <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">{item.type}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            item.chance === 'High' ? 'bg-green-100 text-green-700' :
                            item.chance === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {item.chance} Chance
                        </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Examples:</span> {item.examples?.join(', ')}
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {item.branches?.map((branch, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                                {branch}
                            </span>
                        ))}
                    </div>
                </div>
                <FaChevronRight className="text-gray-300 mt-1" />
            </div>
        </motion.div>
    );

    const TipCard = ({ tip }) => (
        <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100"
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{tip.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{tip.text}</p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 overflow-x-hidden">
            {/* Header Section */}
            <div className="bg-brand-deep-bg relative overflow-hidden text-white pt-24 pb-20 mb-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] z-0"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] z-0 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-4"
                    >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                            <FaChartLine className="text-2xl text-brand-orange" />
                        </div>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight"
                    >
                        JEE Main Rank Predictor 2026
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-blue-100/80 max-w-2xl mx-auto font-light"
                    >
                        Predict your expected All India Rank from percentile or marks
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
                        <div className="h-2 bg-gradient-to-r from-brand-blue via-blue-500 to-brand-orange"></div>
                        <div className="p-8 md:p-10">
                            <form onSubmit={handlePredict} className="space-y-6">
                                {/* Input Mode Toggle */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Predict Rank Using</label>
                                    <div className="flex items-center gap-4">
                                        {['percentile', 'marks'].map((mode) => (
                                            <label 
                                                key={mode} 
                                                className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-xl border transition-all ${
                                                    inputMode === mode 
                                                        ? 'bg-blue-50 border-brand-blue text-brand-blue font-bold' 
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name="inputMode" 
                                                    value={mode} 
                                                    className="hidden" 
                                                    onChange={() => setInputMode(mode)} 
                                                    checked={inputMode === mode} 
                                                />
                                                {mode === 'percentile' ? 'Percentile' : 'Expected Marks'}
                                                {inputMode === mode && <FaCheckCircle />}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Input Field */}
                                <div>
                                    {inputMode === 'percentile' ? (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Percentile</label>
                                            <input
                                                type="number"
                                                step="0.0001"
                                                min="0"
                                                max="100"
                                                placeholder="e.g. 95.5678"
                                                value={percentile}
                                                onChange={(e) => setPercentile(e.target.value)}
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold text-3xl text-brand-blue placeholder:font-normal placeholder:text-gray-400 placeholder:text-lg"
                                                required
                                            />
                                            <p className="text-xs text-gray-500 mt-2">Enter your JEE Main percentile (up to 4 decimal places)</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Marks (Out of 300)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="300"
                                                placeholder="e.g. 180"
                                                value={marks}
                                                onChange={(e) => setMarks(e.target.value)}
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold text-3xl text-brand-blue placeholder:font-normal placeholder:text-gray-400 placeholder:text-lg"
                                                required
                                            />
                                            <p className="text-xs text-gray-500 mt-2">Enter your expected/mock test marks. We'll estimate the percentile first.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all appearance-none text-gray-700 font-medium"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 px-6 bg-gradient-to-r from-brand-blue to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-brand-blue/30 transition-all disabled:opacity-70 disabled:shadow-none min-h-[56px] flex items-center justify-center gap-3 text-lg"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>Predict My Rank <FaSearch className="text-sm" /></>
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
                            {prediction && (
                                <motion.div 
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                    className="pb-20 space-y-6"
                                >
                                    {/* Main Rank Card */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] text-white rounded-2xl p-8 text-center relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                                        
                                        <div className="relative z-10">
                                            <div className="text-blue-200 text-sm mb-2 uppercase tracking-wider">Your Expected All India Rank</div>
                                            <div className="text-6xl md:text-7xl font-black text-white mb-4">
                                                {prediction.prediction?.expected_rank?.toLocaleString()}
                                            </div>
                                            <div className="text-blue-200 text-sm mb-4">
                                                Rank Range: {prediction.prediction?.rank_range?.min?.toLocaleString()} - {prediction.prediction?.rank_range?.max?.toLocaleString()}
                                            </div>
                                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm">
                                                <span className="text-green-400">●</span>
                                                Confidence: {prediction.prediction?.confidence || '85%'}
                                            </div>
                                            
                                            {prediction.input?.estimatedFromMarks && (
                                                <div className="mt-4 text-xs text-blue-200">
                                                    <span className="bg-blue-800/50 px-3 py-1 rounded-full">
                                                        Marks: {prediction.input?.marks}/300 → Estimated Percentile: {prediction.input?.percentile?.toFixed(2)}%
                                                    </span>
                                                </div>
                                            )}

                                            {prediction.predictor_status && (
                                                <div className="mt-4 text-xs text-blue-200 flex items-center justify-center gap-2">
                                                    <FaRobot /> Powered by {prediction.predictor_status.powered_by} ({prediction.predictor_status.model})
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Eligibility Section */}
                                    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FaTrophy className="text-amber-500" /> Eligibility Status
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            <div className={`p-4 rounded-xl transition-all ${prediction.eligibility?.jeeAdvancedEligible ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-100'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaStar className={prediction.eligibility?.jeeAdvancedEligible ? 'text-green-600' : 'text-gray-300'} />
                                                    <span className="font-semibold text-sm">JEE Advanced</span>
                                                </div>
                                                <div className={`text-xs ${prediction.eligibility?.jeeAdvancedEligible ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {prediction.eligibility?.jeeAdvancedEligible ? '✓ Eligible for IITs' : '✗ Not Eligible'}
                                                </div>
                                            </div>
                                            <div className={`p-4 rounded-xl transition-all ${prediction.eligibility?.nitEligible ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border-2 border-gray-100'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaUniversity className={prediction.eligibility?.nitEligible ? 'text-blue-600' : 'text-gray-300'} />
                                                    <span className="font-semibold text-sm">NITs</span>
                                                </div>
                                                <div className={`text-xs ${prediction.eligibility?.nitEligible ? 'text-blue-600' : 'text-gray-400'}`}>
                                                    {prediction.eligibility?.nitEligible ? '✓ Eligible' : '✗ Low Chances'}
                                                </div>
                                            </div>
                                            <div className={`p-4 rounded-xl transition-all ${prediction.eligibility?.iiitEligible ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50 border-2 border-gray-100'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaBuilding className={prediction.eligibility?.iiitEligible ? 'text-purple-600' : 'text-gray-300'} />
                                                    <span className="font-semibold text-sm">IIITs</span>
                                                </div>
                                                <div className={`text-xs ${prediction.eligibility?.iiitEligible ? 'text-purple-600' : 'text-gray-400'}`}>
                                                    {prediction.eligibility?.iiitEligible ? '✓ Eligible' : '✗ Low Chances'}
                                                </div>
                                            </div>
                                            <div className={`p-4 rounded-xl transition-all ${prediction.eligibility?.gftiEligible ? 'bg-teal-50 border-2 border-teal-200' : 'bg-gray-50 border-2 border-gray-100'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaGraduationCap className={prediction.eligibility?.gftiEligible ? 'text-teal-600' : 'text-gray-300'} />
                                                    <span className="font-semibold text-sm">GFTIs</span>
                                                </div>
                                                <div className={`text-xs ${prediction.eligibility?.gftiEligible ? 'text-teal-600' : 'text-gray-400'}`}>
                                                    {prediction.eligibility?.gftiEligible ? '✓ Eligible' : '✗ Low Chances'}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* College Possibilities */}
                                    {prediction.college_possibilities?.length > 0 && (
                                        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaUniversity className="text-brand-blue" /> College Possibilities
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {prediction.college_possibilities.map((item, idx) => (
                                                    <PossibilityCard key={idx} item={item} />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Tips */}
                                    {prediction.tips?.length > 0 && (
                                        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaLightbulb className="text-amber-500" /> What Next?
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {prediction.tips.map((tip, idx) => (
                                                    <TipCard key={idx} tip={tip} />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* CTA to College Predictor */}
                                    <motion.div variants={itemVariants} className="text-center">
                                        <a 
                                            href="/jee-main-predictor" 
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                                        >
                                            <FaGraduationCap /> Find Colleges for This Rank
                                        </a>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default JEERankPredictor;
