"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaInfoCircle } from 'react-icons/fa';

const PageContent: React.FC = () => {
    const searchParams = useSearchParams();
    const examParam = searchParams?.get('exam') || 'Exam';
    const [score, setScore] = useState('');
    const [predictedRank, setPredictedRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Simple mock prediction logic based on exam type
    const handlePredict = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const numScore = parseFloat(score);
            let rank = 0;
            // Very rough dummy logic just to show "working" result
            if (numScore > 0) {
                rank = Math.floor(1000000 / (numScore + 1));
            }
            setPredictedRank(rank);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="bg-brand-deep-bg text-white py-12 mb-10">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 font-heading">{examParam} Rank Predictor</h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        Estimate your rank based on your expected score for {examParam} 2026.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-brand-orange to-brand-blue"></div>
                    <div className="p-8">
                        <form onSubmit={handlePredict} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Enter Your {examParam} Score
                                </label>
                                <input
                                    type="number"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    placeholder="e.g. 450"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue text-lg"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-brand-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Calculating...' : 'Predict My Rank'}
                            </button>
                        </form>
                    </div>

                    {predictedRank !== null && (
                        <div className="bg-blue-50 p-8 text-center border-t border-blue-100">
                            <h3 className="text-gray-600 font-medium mb-2">Based on your score, your expected rank is:</h3>
                            <div className="text-5xl font-bold text-brand-blue mb-4">
                                #{predictedRank.toLocaleString()}
                            </div>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto flex items-center gap-1 justify-center">
                                <FaInfoCircle /> This is an estimate based on previous year trends.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageContent;
