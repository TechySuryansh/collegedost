"use client";

import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaSearch, FaGlobeAmericas, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const InternationalCollegesContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [colleges, setColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial State from URL
    const [searchTerm, setSearchTerm] = useState('');
    const [country, setCountry] = useState('USA');
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
        setCountry(searchParams.get('country') || 'USA');
        setPage(Number(searchParams.get('page')) || 1);
    }, [searchParams]);

    useEffect(() => {
        // Debounce fetch
        const timer = setTimeout(() => {
            fetchColleges();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, country, page]);

    const fetchColleges = async () => {
        try {
            setLoading(true);
            const url = `/colleges?country=${encodeURIComponent(country)}&search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`;
            const res = await api.get(url);

            if (res.data.success) {
                setColleges(res.data.data);
                if (res.data.pagination) {
                    setTotalPages(res.data.pagination.pages);
                    setTotalCount(res.data.pagination.total);
                }
            }
        } catch (err) {
            console.error("Failed to fetch international colleges", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleCountryChange = (c: string) => {
        setCountry(c);
        setPage(1);
        setSearchTerm('');

        // Update URL just for UX (shallow) - optional but nice
        // We can just rely on local state updates if we don't care about deep linking for every click
        // But for consistency with other pages, let's keep it local state driven primarily 
        // or update URL via router.push() if needed.
        // Given we are inside Suspense now, router usage is safe.
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">

                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FaGlobeAmericas className="text-brand-blue" />
                                Study Abroad
                            </h1>
                            <p className="text-gray-600 mt-2">Explore {totalCount > 0 ? totalCount.toLocaleString() : 'thousands of'} top universities from around the world.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full md:w-96 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${country} universities...`}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    {/* Country Tabs */}
                    <div className="flex gap-4 mt-8 border-b border-gray-100 pb-1 overflow-x-auto">
                        {['USA', 'UK', 'Canada', 'Australia'].map((c) => (
                            <button
                                key={c}
                                onClick={() => handleCountryChange(c)}
                                className={`px-6 py-2 font-medium text-sm transition-all whitespace-nowrap relative ${country === c
                                    ? 'text-brand-blue font-bold'
                                    : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {country === c && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-t-full"></span>
                                )}
                                Study in {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {colleges.length > 0 ? (
                            <>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                                <tr>
                                                    <th className="p-4 w-16 text-center">#</th>
                                                    <th className="p-4">University Name</th>
                                                    <th className="p-4">Location</th>
                                                    <th className="p-4 text-center">Web</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {colleges.map((college, index) => (
                                                    <tr key={college._id} className="hover:bg-blue-50/50 transition-colors">
                                                        <td className="p-4 text-center text-gray-400 font-medium">
                                                            {(page - 1) * limit + index + 1}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-bold text-gray-900 text-base">{college.name}</div>
                                                        </td>
                                                        <td className="p-4 text-gray-600 text-sm">
                                                            {college.location?.city ? `${college.location.city}, ` : ''} {college.location?.state ? `${college.location.state}, ` : ''} {college.location?.country}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {college.website ? (
                                                                <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline text-sm font-medium">Visit</a>
                                                            ) : <span className="text-gray-400 text-sm">-</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-between items-center mt-6">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border ${page === 1 ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <FaArrowLeft /> Previous
                                    </button>

                                    <span className="text-gray-600 text-sm">
                                        Page <span className="font-bold text-gray-900">{page}</span> of {totalPages}
                                    </span>

                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border ${page === totalPages ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        Next <FaArrowRight />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <FaGlobeAmericas className="mx-auto text-4xl text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-600">No universities found.</h3>
                                <p className="text-gray-400">Try adjusting your search query.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternationalCollegesContent;
