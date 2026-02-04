"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaUniversity } from 'react-icons/fa';
import api from '@/api/axios';

interface PredictionForm {
    rank: string;
    exam: string;
    category: string;
    state: string;
}

const PageContent: React.FC = () => {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<PredictionForm>({
        rank: searchParams?.get('rank') || '',
        exam: searchParams?.get('exam') || 'JEE Advanced',
        category: searchParams?.get('category') || 'General',
        state: ''
    });
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const checkPrediction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.rank) return;

        setLoading(true);
        setSearched(true);
        try {
            const params = new URLSearchParams(formData as any);
            const res = await api.get(`/colleges/predict?${params.toString()}`);
            if (res.data.success) {
                setResults(res.data.data);
            }
        } catch (err) {
            console.error("Prediction failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">

            {/* Header */}
            <div className="bg-brand-blue-dark text-white py-12 mb-10">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 font-heading">College Predictor</h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        Enter your rank and category to find out which colleges you can get into.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-10">
                    <form onSubmit={checkPrediction} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Exam</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                value={formData.exam}
                                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                            >
                                <option value="JEE Main">JEE Main</option>
                                <option value="JEE Advanced">JEE Advanced</option>
                                <option value="NEET">NEET</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rank</label>
                            <input
                                type="number"
                                placeholder="Enter your Rank"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                value={formData.rank}
                                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="EWS">EWS</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors shadow-md h-[50px]"
                        >
                            Predict Colleges
                        </button>
                    </form>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-blue border-t-transparent"></div>
                    </div>
                ) : searched && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Results <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{results.length} colleges found</span>
                        </h2>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {results.map((college) => (
                                    <div key={college._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400 text-xl">
                                                    {college.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                                                        <Link href={`/colleges/${college.slug}`} className="hover:text-brand-blue">{college.name}</Link>
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{college.location.city}, {college.location.state}</p>
                                                </div>
                                            </div>
                                            <span className="bg-blue-50 text-brand-blue text-xs font-bold px-2 py-1 rounded">NIRF #{college.nirfRank}</span>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-4">
                                            <h4 className="text-xs font-bold text-green-800 uppercase mb-2">Chances of Admission</h4>
                                            <div className="space-y-2">
                                                {college.matchingCutoffs.map((cut: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span className="font-medium text-gray-700">{cut.branch}</span>
                                                        <span className="font-bold text-green-700">Closing Rank: {cut.closing}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Link href={`/colleges/${college.slug}`} className="block text-center w-full py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                            View Full Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <FaUniversity className="text-4xl text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-600">No colleges found within this rank range.</h3>
                                <p className="text-gray-400 mt-2">Try changing your category or look for other exams.</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default PageContent;
