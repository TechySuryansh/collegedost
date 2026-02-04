"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaBalanceScale, FaUniversity, FaSearch, FaTimes, FaPlus, FaTrophy, FaBuilding, FaMoneyBillWave, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '@/api/axios';

const CompareCollegesContent = () => {
    const searchParams = useSearchParams();
    const [selectedColleges, setSelectedColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);

    const MAX_COLLEGES = 4;

    useEffect(() => {
        const collegeIds = searchParams?.get('ids');
        if (collegeIds) {
            fetchComparisonData(collegeIds.split(','));
        }
    }, [searchParams]);

    const fetchComparisonData = async (ids: string[]) => {
        try {
            setLoading(true);
            const response = await api.post('/colleges/compare', { ids });
            if (response.data.success) {
                const newColleges = response.data.data.filter((c: any) => !selectedColleges.find(existing => existing._id === c._id));
                setSelectedColleges(prev => [...prev, ...newColleges]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await api.get(`/colleges/search?q=${query}`);
            if (response.data.success) {
                setSearchResults(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addCollege = async (collegeData: any) => {
        if (selectedColleges.some(c => c.slug === collegeData.slug)) {
            alert('College already added to comparison');
            setSearchQuery('');
            setSearchResults([]);
            setActiveSearchIndex(null);
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/colleges/compare', { slugs: [collegeData.slug] });

            if (response.data.success && response.data.data.length > 0) {
                setSelectedColleges(prev => [...prev, response.data.data[0]]);
            }
        } catch (error) {
            console.error("Failed to add college", error);
        } finally {
            setLoading(false);
            setSearchQuery('');
            setSearchResults([]);
            setActiveSearchIndex(null);
        }
    };

    const removeCollege = (id: string) => {
        setSelectedColleges(prev => prev.filter(c => c._id !== id));
    };

    const RenderValue = ({ value, type, currency = "INR" }: { value: any, type?: string, currency?: string }) => {
        if (!value) return <span className="text-gray-400 text-sm">-</span>;

        if (type === 'currency') {
            if (typeof value === 'number') {
                return <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumSignificantDigits: 3 }).format(value)}</span>;
            }
            return <span>{value}</span>;
        }
        return <span>{value}</span>;
    };

    const SearchDropdown = () => (
        <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-xl z-50 border border-gray-100 max-h-80 overflow-y-auto">
            {searchResults.length > 0 ? (
                searchResults.map((college) => (
                    <button
                        key={college._id}
                        onClick={() => addCollege(college)}
                        className="w-full text-left p-3 hover:bg-blue-50 transition border-b border-gray-50 last:border-0 flex items-center justify-between group"
                    >
                        <div>
                            <div className="font-semibold text-gray-800 text-sm">{college.name}</div>
                            <div className="text-xs text-gray-500">{college.location?.city}, {college.location?.state}</div>
                        </div>
                        <FaPlus className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))
            ) : (
                <div className="p-4 text-center text-gray-400 text-sm">No colleges found</div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <span className="bg-blue-100 text-brand-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                        Advanced Comparison Tool
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
                        Head-to-Head <span className="text-brand-blue">Comparison</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Analyze placements, fees, rankings, and facilities side by side to make the best decision.
                    </p>
                </div>

                {/* College Selection Area */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {/* Render Selected Colleges Slots */}
                    {selectedColleges.map((college) => (
                        <motion.div
                            key={college._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 relative group"
                        >
                            <button
                                onClick={() => removeCollege(college._id)}
                                className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition z-10 border border-gray-100"
                            >
                                <FaTimes />
                            </button>

                            <div className="h-32 flex items-center justify-center mb-4 bg-gray-50 rounded-lg p-2">
                                {college.logo ? (
                                    <img src={college.logo} alt={college.name} className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <FaUniversity className="text-4xl text-gray-300" />
                                )}
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm line-clamp-2 min-h-[40px] text-center mb-1">
                                {college.name}
                            </h3>
                            <div className="text-center">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {college.location?.city}, {college.location?.state}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {/* Add Button Slots */}
                    {Array.from({ length: Math.max(0, MAX_COLLEGES - selectedColleges.length) }).map((_, idx) => (
                        <div key={idx} className="relative z-10">
                            {activeSearchIndex === idx ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-lg border-2 border-brand-blue p-4 h-full flex flex-col items-center justify-center relative"
                                >
                                    <button
                                        onClick={() => { setActiveSearchIndex(null); setSearchQuery(''); }}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes />
                                    </button>
                                    <h3 className="font-bold text-gray-900 mb-3 text-sm">Find College</h3>
                                    <div className="relative w-full">
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Type college name..."
                                                value={searchQuery}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                            />
                                        </div>
                                        {searchQuery.length >= 2 && <SearchDropdown />}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-4 text-center">
                                        Start typing to search from 5000+ colleges
                                    </p>
                                </motion.div>
                            ) : (
                                <button
                                    onClick={() => setActiveSearchIndex(idx)}
                                    className="w-full h-full min-h-[220px] bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-brand-blue hover:border-brand-blue hover:bg-blue-50/50 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                        <FaPlus className="text-xl" />
                                    </div>
                                    <span className="font-medium">Add College</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Comparison Table */}
                {selectedColleges.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-4 w-48 text-left font-bold text-gray-500 uppercase tracking-wider text-xs sticky left-0 bg-gray-50 z-20">Comparison Criteria</th>
                                        {selectedColleges.map(college => (
                                            <th key={college._id} className="p-4 w-64 text-left align-top">
                                                <div className="font-bold text-gray-900 line-clamp-2 mb-2 h-12 flex items-center">{college.name}</div>
                                                <div className="text-xs font-normal text-gray-500 flex items-center gap-1">
                                                    <FaMapMarkerAlt /> {college.location?.city}
                                                </div>
                                            </th>
                                        ))}
                                        {/* Empty headers */}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <th key={i} className="p-4 bg-gray-50/50"></th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* General Information */}
                                    <tr className="bg-blue-50/30">
                                        <td colSpan={MAX_COLLEGES + 1} className="p-3 text-xs font-bold text-brand-blue uppercase tracking-wider pl-4">
                                            <FaInfoCircle className="inline mr-2" /> General Information
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">Institute Type</td>
                                        {selectedColleges.map(c => (
                                            <td key={c._id} className="p-4 text-sm text-gray-600 capitalize">{c.type || '-'}</td>
                                        ))}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <td key={i}></td>)}
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">Established</td>
                                        {selectedColleges.map(c => (
                                            <td key={c._id} className="p-4 text-sm text-gray-600">{c.estYear || 'N/A'}</td>
                                        ))}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <td key={i}></td>)}
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">NIRF Ranking</td>
                                        {selectedColleges.map(c => (
                                            <td key={c._id} className="p-4">
                                                {c.nirfRank ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                                        <FaTrophy /> #{c.nirfRank}
                                                    </span>
                                                ) : <span className="text-gray-400 text-xs">Not Ranked</span>}
                                            </td>
                                        ))}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <td key={i}></td>)}
                                    </tr>

                                    {/* Fees & Placements */}
                                    <tr className="bg-blue-50/30">
                                        <td colSpan={MAX_COLLEGES + 1} className="p-3 text-xs font-bold text-brand-blue uppercase tracking-wider pl-4">
                                            <FaMoneyBillWave className="inline mr-2" /> Fees & Outcomes
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">Tuition Fees (Yearly)</td>
                                        {selectedColleges.map(c => (
                                            <td key={c._id} className="p-4 text-sm font-bold text-gray-900">
                                                {c.detailedFees?.length > 0 ? (
                                                    <RenderValue value={c.detailedFees[0]?.amount} type="currency" />
                                                ) : (
                                                    <RenderValue value={c.fees?.tuition} type="currency" />
                                                )}
                                                <div className="text-[10px] text-gray-400 font-normal">Approx. yearly tuition</div>
                                            </td>
                                        ))}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <td key={i}></td>)}
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">Highest Package</td>
                                        {selectedColleges.map(c => (
                                            <td key={c._id} className="p-4 text-sm text-green-600 font-bold">
                                                <RenderValue value={c.placements?.highestPackage} type="currency" />
                                            </td>
                                        ))}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <td key={i}></td>)}
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">Average Package</td>
                                        {selectedColleges.map(c => (
                                            <td key={c._id} className="p-4 text-sm text-gray-800 font-bold">
                                                <RenderValue value={c.placements?.averagePackage} type="currency" />
                                            </td>
                                        ))}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <td key={i}></td>)}
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">Placement %</td>
                                        {selectedColleges.map(c => (
                                            <td key={c._id} className="p-4 text-sm text-gray-600">
                                                {c.placements?.placementPercentage ? `${c.placements.placementPercentage}%` : '-'}
                                            </td>
                                        ))}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <td key={i}></td>)}
                                    </tr>

                                    {/* Facilities & Misc */}
                                    <tr className="bg-blue-50/30">
                                        <td colSpan={MAX_COLLEGES + 1} className="p-3 text-xs font-bold text-brand-blue uppercase tracking-wider pl-4">
                                            <FaBuilding className="inline mr-2" /> Campus & Details
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">Campus Size</td>
                                        {selectedColleges.map(c => (
                                            <td key={c._id} className="p-4 text-sm text-gray-600">
                                                {c.campus?.size ? `${c.campus.size} Acres` : '-'}
                                            </td>
                                        ))}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <td key={i}></td>)}
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-50">Website</td>
                                        {selectedColleges.map(c => (
                                            <td key={c._id} className="p-4 text-sm text-blue-500 truncate max-w-[150px]">
                                                {c.website ? <a href={c.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Visit Site</a> : '-'}
                                            </td>
                                        ))}
                                        {Array.from({ length: MAX_COLLEGES - selectedColleges.length }).map((_, i) => <td key={i}></td>)}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <FaBalanceScale className="text-4xl" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Start Comparing</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Add colleges to the slots above to compare their fees, rankings, and placement statistics side by side.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompareCollegesContent;
