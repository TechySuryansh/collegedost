import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaUniversity, FaFilter, FaMapMarkerAlt } from 'react-icons/fa';

const CollegesPage = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Filters
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        state: searchParams.get('state') || '',
        type: searchParams.get('type') || '',
        exam: searchParams.get('exam') || ''
    });

    useEffect(() => {
        fetchColleges();
    }, [filters]); 

    // Debounce search could be added here
    
    const fetchColleges = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if(filters.search) params.append('search', filters.search);
            if(filters.state) params.append('state', filters.state);
            if(filters.type) params.append('type', filters.type);
            if(filters.exam) params.append('exam', filters.exam);

            const res = await axios.get(`http://localhost:5001/api/colleges?${params.toString()}`);
            if (res.data.success) {
                setColleges(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({...filters, [e.target.name]: e.target.value});
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            
            <div className="bg-brand-deep-bg text-white py-12 mb-8">
                 <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 font-heading">Find Your Dream College</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto">Explore thousands of colleges with detailed information on fees, placements, and cutoffs.</p>
                 </div>
            </div>

            <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">
                
                {/* Filters Sidebar */}
                <div className="lg:w-1/4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><FaFilter /> Filters</h3>
                            <button onClick={() => setFilters({search:'', state:'', type:'', exam:''})} className="text-xs text-brand-orange font-medium hover:underline">Clear All</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Search Name</label>
                                <input 
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-blue"
                                    placeholder="e.g. IIT Bombay..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                                <select name="state" value={filters.state} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none focus:border-brand-blue">
                                    <option value="">All States</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Karnataka">Karnataka</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">College Type</label>
                                <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none focus:border-brand-blue">
                                    <option value="">All Types</option>
                                    <option value="IIT">IIT</option>
                                    <option value="NIT">NIT</option>
                                    <option value="Private">Private</option>
                                    <option value="Government">Government</option>
                                </select>
                            </div>

                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Exam Accepted</label>
                                <select name="exam" value={filters.exam} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none focus:border-brand-blue">
                                    <option value="">Any Exam</option>
                                    <option value="JEE Main">JEE Main</option>
                                    <option value="JEE Advanced">JEE Advanced</option>
                                    <option value="NEET">NEET</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Listing */}
                <div className="lg:w-3/4">
                    {loading ? (
                        <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {colleges.length > 0 ? (
                                colleges.map(college => (
                                    <div key={college._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                                        <div className="w-full md:w-32 h-32 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl font-bold text-gray-300">
                                            {/* Logo Placeholder */}
                                            {college.name.charAt(0)}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{college.name}</h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                                        <FaMapMarkerAlt /> {college.location.city}, {college.location.state}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">NIRF #{college.nirfRank}</span>
                                                    <span className="text-xs text-gray-400 mt-1">{college.type}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                                {college.fees && (
                                                    <div className="bg-gray-50 px-3 py-2 rounded border border-gray-100">
                                                        <span className="block text-xs text-gray-500">Fees (Annual)</span>
                                                        <span className="font-semibold text-gray-800">₹ {(college.fees.tuition/100000).toFixed(1)} Lakhs</span>
                                                    </div>
                                                )}
                                                {college.placements && (
                                                    <div className="bg-gray-50 px-3 py-2 rounded border border-gray-100">
                                                        <span className="block text-xs text-gray-500">Avg Package</span>
                                                        <span className="font-semibold text-gray-800 text-green-600">{college.placements.averagePackage}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <div className="text-xs text-gray-500">
                                                    Offers: {college.coursesOffered.slice(0, 2).map(c => c.courseName).join(', ')}...
                                                </div>
                                                <Link to={`/colleges/${college.slug}`} className="text-brand-blue font-bold text-sm hover:underline">
                                                    View Details →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl">
                                    <h3 className="text-lg font-medium text-gray-600">No colleges found matching your criteria.</h3>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CollegesPage;
