import React, { useState } from 'react';
import axios from 'axios';
import { FaCalculator, FaSortNumericDown, FaChartPie, FaMobileAlt, FaCalendarAlt, FaIdCard, FaShareAlt } from 'react-icons/fa';

const JEEMainRankPredictor = ({ onOpenAuthModal }) => {
    const [mode, setMode] = useState('score'); // 'score' or 'percentile'
    
    // Inputs
    const [score, setScore] = useState('');
    const [percentile, setPercentile] = useState('');
    const [session, setSession] = useState('');
    const [applicationNo, setApplicationNo] = useState('');
    const [dob, setDob] = useState('');
    const [mobile, setMobile] = useState('');

    // Output
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePredict = async (e) => {
        e.preventDefault();
        console.log('Predicting...', { mode, score, percentile, mobile });
        setError('');
        setResult(null);

        // Auth Check - Temporarily Disabled to allow easier access
        /*
        const token = localStorage.getItem('token');
        if (!token) {
            onOpenAuthModal();
            return;
        }
        */

        if (mode === 'score') {
            const val = parseFloat(score);
            if (!score || isNaN(val) || val < 0 || val > 300) {
                const msg = 'Please enter a valid score (0-300)';
                setError(msg);
                alert(msg); // Force visibility
                return;
            }
        } else {
             const val = parseFloat(percentile);
             if (!percentile || isNaN(val) || val < 0 || val > 100) {
                const msg = 'Please enter a valid percentile (0-100)';
                setError(msg);
                alert(msg); // Force visibility
                return;
            }
        }

        if (!mobile || mobile.length < 10) {
            const msg = 'Please enter a valid 10-digit mobile number';
            setError(msg);
            alert(msg); // Force visibility
            return;
        }

        setLoading(true);

        try {
            const payload = {
                shift: session || 'Jan 27 Shift 1', // Default if empty
                score: mode === 'score' ? score : undefined,
                percentile: mode === 'percentile' ? percentile : undefined,
                mobile: mobile
            };

            console.log('Sending payload:', payload);

            const response = await axios.post('http://localhost:5001/api/predictor/jee-main-rank', payload);
            console.log('Response:', response.data);

            if (response.data.success) {
                setResult(response.data.data);
            } else {
                setError('API returned success: false');
            }

        } catch (err) {
            console.error('Prediction Error:', err);
            const msg = err.response?.data?.message || 'Prediction failed. Is the backend running?';
            setError(msg);
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                 <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        JEE Main <span className="text-brand-orange">Rank Predictor</span> 2026
                    </h1>
                    <p className="text-gray-500">Know your expected Rank & Percentile based on your Score</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header Strip */}
                    <div className="h-2 bg-gradient-to-r from-brand-orange to-brand-blue"></div>
                    
                    <div className="p-6 md:p-10">
                         <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
                             Enter <span className="text-brand-orange">Paper 1</span> Exam Details
                         </h2>

                         <form onSubmit={handlePredict} className="space-y-6">
                            
                            {/* Mode Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                     <label className="text-sm font-semibold text-gray-700">Select Score / Percentile to Input</label>
                                     <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                                         <button
                                            type="button" 
                                            onClick={() => setMode('score')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'score' ? 'bg-brand-blue text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                                         >
                                            <div className={`w-3 h-3 rounded-full border-2 ${mode === 'score' ? 'border-white bg-white' : 'border-gray-400'}`}></div>
                                            Score
                                         </button>
                                         <button 
                                            type="button"
                                            onClick={() => setMode('percentile')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'percentile' ? 'bg-brand-blue text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                                         >
                                             <div className={`w-3 h-3 rounded-full border-2 ${mode === 'percentile' ? 'border-white bg-white' : 'border-gray-400'}`}></div>
                                            Percentile
                                         </button>
                                     </div>
                                </div>

                                <div className="space-y-2">
                                     <label className="text-sm font-semibold text-gray-700">
                                         {mode === 'score' ? 'JEE Main Paper-1 Overall Score' : 'JEE Paper-1 Overall Percentile'}
                                     </label>
                                     <div className="relative">
                                         {mode === 'score' ? (
                                              <input
                                                type="number"
                                                min="0" max="300"
                                                placeholder="Enter your score out of 300"
                                                value={score}
                                                onChange={(e) => setScore(e.target.value)}
                                                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                                              />
                                         ) : (
                                              <input
                                                type="number"
                                                step="0.0000001"
                                                min="0" max="100"
                                                placeholder="Enter your percentile"
                                                value={percentile}
                                                onChange={(e) => setPercentile(e.target.value)}
                                                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                                              />
                                         )}
                                     </div>
                                </div>
                            </div>

                            {/* Session & App Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">JEE Paper-1 Exam Session</label>
                                    <div className="relative">
                                        <select
                                            value={session}
                                            onChange={(e) => setSession(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all appearance-none text-gray-600"
                                        >
                                            <option value="">Select your exam's shift</option>
                                            <option value="Jan 27 Shift 1">Jan 27 Shift 1</option>
                                            <option value="Jan 27 Shift 2">Jan 27 Shift 2</option>
                                            <option value="Jan 29 Shift 1">Jan 29 Shift 1</option>
                                            <option value="Jan 29 Shift 2">Jan 29 Shift 2</option>
                                            <option value="Apr Session">April Session</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                     <label className="text-sm font-semibold text-gray-700">Application Number (Optional)</label>
                                     <div className="relative">
                                         <input
                                            type="text"
                                            placeholder="Enter exam's application number"
                                            value={applicationNo}
                                            onChange={(e) => setApplicationNo(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                                         />
                                         <FaIdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                     </div>
                                </div>
                            </div>

                             {/* DOB & Mobile */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                     <label className="text-sm font-semibold text-gray-700">D.O.B (Optional)</label>
                                     <div className="relative">
                                         <input
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all text-gray-600"
                                         />
                                          <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                     </div>
                                </div>
                                <div className="space-y-2">
                                     <label className="text-sm font-semibold text-brand-orange">Result predictor report will be sent to you on:</label>
                                     <div className="relative">
                                         <input
                                            type="tel"
                                            placeholder="Enter 10 digit mobile number"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            className="w-full pl-28 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                                         />
                                          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-gray-300 pr-2 pl-1">
                                             <img src="https://flagcdn.com/w20/in.png" alt="IN" className="h-3 w-5" />
                                             <span className="text-xs font-medium text-gray-600">+91</span>
                                          </div>
                                     </div>
                                </div>
                            </div>
                            
                            {/* Submit */}
                            <div className="pt-4 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-orange-100 hover:bg-orange-200 text-brand-orange border border-orange-200 font-bold py-3 px-8 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-lg disabled:opacity-70 transform hover:-translate-y-0.5"
                                >
                                    {loading ? 'Predicting...' : (
                                        <>
                                            {mode === 'score' ? 'Predict My Percentile' : 'Predict My Rank'} <span className="text-xl">➔</span>
                                        </>
                                    )}
                                </button>
                            </div>
                         </form>

                         {error && <p className="text-center text-red-500 mt-4 font-medium bg-red-50 p-3 rounded">{error}</p>}
                    
                        {/* Users Stats */}
                         <div className="mt-8 flex items-center justify-center gap-2 bg-gray-50 py-3 rounded-full max-w-md mx-auto">
                            <div className="flex -space-x-2">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-[10px] overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                                <span className="font-bold text-black">611+</span> users have predicted <span className="text-brand-orange">🔍</span> their results in the last 3 hours.
                            </span>
                         </div>
                    </div>
                </div>

                {/* Result Display */}
                {result && (
                    <div className="mt-8">
                        {/* Report Header */}
                        <div className="text-center mb-8">
                             <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                                <span className="text-2xl">🎉</span>
                                <span className="font-medium text-gray-600">Congratulation for giving your best in exam</span>
                             </div>
                             <h2 className="text-3xl font-bold text-gray-900 mb-6">JEE Main Rank Predictor 2026 Report</h2>
                             
                             <div className="flex items-center justify-center gap-4 bg-gray-50 py-3 px-6 rounded-full inline-flex mx-auto border border-gray-100">
                                 <span className="text-gray-600 font-medium">Your Inputs for Result Prediction:</span>
                                 <span className="font-bold text-gray-800">Overall {mode === 'score' ? 'Score' : 'Percentile'}: {mode === 'score' ? score : percentile}</span>
                                 <button 
                                    onClick={() => setResult(null)}
                                    className="ml-4 flex items-center gap-1.5 bg-brand-orange text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
                                 >
                                     <FaChartPie className="text-xs" /> Reuse
                                 </button>
                             </div>
                        </div>

                        {/* Main Result Card */}
                        <div className="bg-[#effcf5] rounded-3xl p-8 md:p-16 relative overflow-hidden text-center border border-[#d4f3e6]">
                            {/* Decorative Background Elements (Simple blobs to mimic illustrations) */}
                            <div className="absolute top-10 left-10 w-24 h-24 bg-green-200/50 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-200/50 rounded-full blur-3xl"></div>

                            {/* Share Button absolute top right */}
                            <button className="absolute top-6 right-6 flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all font-medium text-sm">
                                <FaShareAlt /> Share
                            </button>

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-2xl md:text-3xl text-gray-800 font-medium mb-6">
                                    Your estimated <span className="font-bold">Overall Percentile</span> is
                                </h3>

                                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-100 text-sm text-gray-600 mb-8 shadow-sm">
                                    <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-serif">i</span>
                                    <span>According to the experts, <span className="font-bold text-gray-800">{session || 'your shift'}</span> was <span className="font-bold text-gray-800">Moderately Difficult</span></span>
                                </div>

                                {/* Percentile Range Display */}
                                <div className="mb-8">
                                    <span className="text-4xl md:text-6xl font-bold text-[#2e7d32] tracking-tight">
                                        {(result.percentile - 0.08).toFixed(4)} - {(result.percentile + 0.08).toFixed(4)}
                                    </span>
                                </div>

                                {/* Progress Bar Visual */}
                                <div className="w-full max-w-lg mx-auto h-3 bg-gray-200 rounded-full mb-12 relative overflow-hidden">
                                     <div className="absolute top-0 left-0 h-full bg-[#2e7d32] rounded-full" style={{ width: `${result.percentile}%` }}></div>
                                </div>

                                {/* Disclaimer */}
                                <div className="bg-[#e0f2f1] text-[#00695c] text-xs leading-relaxed p-4 rounded-xl border border-[#b2dfdb] text-justify md:text-center max-w-2xl mx-auto">
                                    <span className="font-bold">Disclaimer :</span> Rank predictor tool gives you an accurate idea of your rank. The predictor uses historical data and statistical analysis to estimate your rank range based on your score. It also considers various factors such as the difficulty level of the exam, the number of candidates appearing, and their scores. We do not take responsibility for any deviation between the actual result and the one displayed/predicted by this tool. Our company accepts no liability for the consequences of any actions taken on the basis of the information provided.
                                </div>
                            </div>
                        </div>
                        
                        {/* More Info Section */}
                        <div className="mt-12 text-center">
                            <h4 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all text-left">
                                    <h5 className="font-bold text-lg text-gray-800 mb-2">Check College Predictor</h5>
                                    <p className="text-gray-500 text-sm mb-4">Based on this percentile, see which colleges and branches you can get.</p>
                                    <a href="/jee-main-predictor" className="text-brand-blue font-semibold hover:underline">Predict Colleges →</a>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all text-left">
                                    <h5 className="font-bold text-lg text-gray-800 mb-2">View Rank Details</h5>
                                    <p className="text-gray-500 text-sm mb-4">Your estimated rank is <span className="font-bold text-gray-900">#{result.rank.toLocaleString()}</span>. See detailed breakdown.</p>
                                    <button className="text-brand-orange font-semibold hover:underline">View Analysis →</button>
                                </div>
                             </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default JEEMainRankPredictor;
