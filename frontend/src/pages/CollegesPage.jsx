import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaFilter, FaRedo } from 'react-icons/fa';

const CollegesPage = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 20;

    // Filter Logic: We use array based filters for checkboxes to support multiple selections
    // URL params will be comma separated strings
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        state: searchParams.get('state') ? searchParams.get('state').split(',') : [],
        city: searchParams.get('city') || '',
        type: searchParams.get('type') || '',
        stream: searchParams.get('stream') ? searchParams.get('stream').split(',') : [],
        degree: searchParams.get('degree') ? searchParams.get('degree').split(',') : [],
        targetYear: searchParams.get('targetYear') ? searchParams.get('targetYear').split(',') : [],
        goal: searchParams.get('goal') ? searchParams.get('goal').split(',') : [],
        sort: 'nirfRank'
    });

    // Checkbox Options Data
    const streamsList = ["Engineering And Architecture", "Management And Business Administration", "Medicine And Allied Sciences", "Law", "Animation And Design", "Arts And Humanities", "Science", "Commerce"];
    const degreesList = ["Diploma", "B.E /B.Tech", "B.Arch", "B.Plan", "Other Bachelors", "MBA", "MBBS", "B.Sc", "B.Com", "B.A"];
    const statesList = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", "Haryana", "Karnataka", "Kerala", "Maharashtra", "Madhya Pradesh", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];

    const [searchTermStream, setSearchTermStream] = useState("");
    const [searchTermDegree, setSearchTermDegree] = useState("");
    const [searchTermState, setSearchTermState] = useState("");

    // Autocomplete State
    const [query, setQuery] = useState(filters.search);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Fetch on Filters or Page Change
    useEffect(() => {
        fetchColleges();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters, page]); 

    // Handle Checkbox Change
    const handleCheckboxChange = (category, value) => {
        setFilters(prev => {
            const current = prev[category];
            const updated = current.includes(value) 
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
        setPage(1);
    };

    // Helper to filter options based on search input
    const filterOptions = (options, term) => {
        return options.filter(opt => opt.toLowerCase().includes(term.toLowerCase()));
    };

    const fetchColleges = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            
            // Map our state arrays to comma separated URL params
            if (filters.search) params.append('search', filters.search);
            if (filters.state.length) params.append('state', filters.state.join(','));
            if (filters.stream.length) params.append('branch', filters.stream.join(',')); // Mapping stream to backend 'branch' logic
            if (filters.degree.length) params.append('course', filters.degree.join(','));
            if (filters.sort) params.append('sort', filters.sort);
            if (filters.city) params.append('city', filters.city);

            // Add Pagination
            params.append('page', page);
            params.append('limit', LIMIT);

            const res = await api.get(`/colleges?${params.toString()}`);
            if (res.data.success) {
                setColleges(res.data.data);
                if(res.data.pagination) {
                    setTotalPages(res.data.pagination.pages);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        if(e.key === 'Enter' || e.type === 'click') {
             setFilters({...filters, search: query});
             setPage(1);
             setShowSuggestions(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            
            <div className="container mx-auto px-4 pt-12 pb-8 flex flex-col lg:flex-row gap-8">
                
                {/* --- LEFT SIDEBAR FILTERS --- */}
                <div className="w-full lg:w-1/4 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-32 max-h-[calc(100vh-160px)] overflow-hidden flex flex-col">
                        
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-brand-blue/10 rounded-lg">
                                    <FaFilter className="text-brand-blue text-sm" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Filter</h2>
                            </div>
                            <button 
                                onClick={() => setFilters({search:'', state:[], city:'', type:'', stream:[], degree:[], targetYear:[], goal:[], sort:'nirfRank'})}
                                className="text-xs font-semibold text-brand-blue hover:text-blue-700 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-brand-blue/5"
                            >
                                <FaRedo className="text-[10px]" /> Clear
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5 custom-scrollbar space-y-8">
                            {/* GOAL */}
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Goal</h3>
                                <div className="grid grid-cols-1 gap-2.5">
                                    {['Colleges', 'Exams', 'Coachings', 'Study Abroad'].map((goal) => (
                                        <label key={goal} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${filters.goal.includes(goal) ? 'bg-brand-blue border-brand-blue shadow-sm shadow-brand-blue/30' : 'border-slate-200 group-hover:border-brand-blue/50'}`}>
                                                {filters.goal.includes(goal) && <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                                            </div>
                                            <input 
                                                type="checkbox" 
                                                className="hidden" 
                                                checked={filters.goal.includes(goal)}
                                                onChange={() => handleCheckboxChange('goal', goal)}
                                            />
                                            <span className={`text-[14px] transition-colors ${filters.goal.includes(goal) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-brand-blue'}`}>{goal}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* EDUCATION STREAM */}
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Education Stream</h3>
                                <div className="relative mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Search streams..." 
                                        value={searchTermStream}
                                        onChange={(e) => setSearchTermStream(e.target.value)}
                                        className="w-full pl-3 pr-9 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none bg-slate-50/50 transition-all placeholder:text-slate-400"
                                    />
                                    <FaSearch className="absolute right-3.5 top-3 text-slate-400 text-xs" />
                                </div>
                                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                                    {filterOptions(streamsList, searchTermStream).map((stream) => (
                                        <label key={stream} className="flex items-center gap-3 cursor-pointer group">
                                             <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${filters.stream.includes(stream) ? 'bg-brand-blue border-brand-blue' : 'border-slate-200 group-hover:border-brand-blue/50'}`}>
                                                {filters.stream.includes(stream) && <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={filters.stream.includes(stream)} onChange={() => handleCheckboxChange('stream', stream)} />
                                            <span className={`text-[13.5px] leading-snug transition-colors ${filters.stream.includes(stream) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-brand-blue'}`}>{stream}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                             {/* DEGREE */}
                             <div>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Degree</h3>
                                <div className="relative mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Search degrees..." 
                                        value={searchTermDegree}
                                        onChange={(e) => setSearchTermDegree(e.target.value)}
                                        className="w-full pl-3 pr-9 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none bg-slate-50/50 transition-all placeholder:text-slate-400"
                                    />
                                    <FaSearch className="absolute right-3.5 top-3 text-slate-400 text-xs" />
                                </div>
                                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                                    {filterOptions(degreesList, searchTermDegree).map((deg) => (
                                        <label key={deg} className="flex items-center gap-3 cursor-pointer group">
                                             <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${filters.degree.includes(deg) ? 'bg-brand-blue border-brand-blue' : 'border-slate-200 group-hover:border-brand-blue/50'}`}>
                                                {filters.degree.includes(deg) && <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={filters.degree.includes(deg)} onChange={() => handleCheckboxChange('degree', deg)} />
                                            <span className={`text-[13.5px] leading-snug transition-colors ${filters.degree.includes(deg) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-brand-blue'}`}>{deg}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>



                            {/* STATE */}
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">State</h3>
                                <div className="relative mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Search states..." 
                                        value={searchTermState}
                                        onChange={(e) => setSearchTermState(e.target.value)}
                                        className="w-full pl-3 pr-9 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none bg-slate-50/50 transition-all placeholder:text-slate-400"
                                    />
                                    <FaSearch className="absolute right-3.5 top-3 text-slate-400 text-xs" />
                                </div>
                                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                                    {filterOptions(statesList, searchTermState).map((st) => (
                                        <label key={st} className="flex items-center gap-3 cursor-pointer group">
                                             <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${filters.state.includes(st) ? 'bg-brand-blue border-brand-blue' : 'border-slate-200 group-hover:border-brand-blue/50'}`}>
                                                {filters.state.includes(st) && <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={filters.state.includes(st)} onChange={() => handleCheckboxChange('state', st)} />
                                            <span className={`text-[13.5px] leading-snug transition-colors ${filters.state.includes(st) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-brand-blue'}`}>{st}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT CONTENT AREA --- */}
                <div className="flex-1">
                    
                    {/* Top Search Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input 
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleSearchSubmit} 
                                placeholder="Search for colleges, exams, courses and more..." 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-blue outline-none"
                            />
                        </div>
                        <button className="bg-brand-orange text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg">
                            Search
                        </button>
                    </div>

                    {/* Result Count & Active Filters */}
                    <div className="mb-4 flex justify-between items-center">
                        <p className="text-gray-500 font-medium">Found <span className="text-brand-blue font-bold">{colleges.length}</span> Colleges</p>
                        <select 
                            value={filters.sort} 
                            onChange={(e) => setFilters({...filters, sort: e.target.value})}
                            className="bg-white border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-brand-blue"
                        >
                            <option value="nirfRank">Sort by Ranking</option>
                            <option value="fees_low">Fees: Low to High</option>
                            <option value="fees_high">Fees: High to Low</option>
                        </select>
                    </div>

                    {/* College Listing */}
                    {loading ? (
                        <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>
                    ) : (
                        <div className="space-y-4">
                            {colleges.length > 0 ? (
                                colleges.map(college => (
                                    <div key={college._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group">
                                        <div className="w-full md:w-48 h-32 md:h-auto bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                                             {college.logo ? (
                                                 <img src={college.logo} alt={college.name} className="w-full h-full object-contain p-2" />
                                             ) : (
                                                 <span className="text-4xl font-bold text-gray-300">{college.name.charAt(0)}</span>
                                             )}
                                             
                                             {/* OWNERSHIP / TYPE BADGE */}
                                             <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-0.5 rounded shadow-sm text-gray-700 uppercase">
                                                 {college.type || 'Institute'}
                                             </div>
                                        </div>
                                        
                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-brand-blue transition-colors">
                                                        <Link to={`/colleges/${college.slug}`}>{college.name}</Link>
                                                    </h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                                                        <FaMapMarkerAlt /> 
                                                        {college.location.city ? `${college.location.city}, ` : ''}
                                                        {college.location.state || college.location.address || 'India'}
                                                    </p>
                                                </div>
                                                {college.nirfRank && (
                                                    <div className="text-right">
                                                        <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">NIRF Rank</span>
                                                        <span className="text-xl font-bold text-brand-blue">#{college.nirfRank}</span>
                                                    </div>
                                                )}
                                                {/* Fallback for unranked but rated colleges */}
                                                {!college.nirfRank && college.rating && (
                                                     <div className="text-right">
                                                        <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Rating</span>
                                                        <span className="text-lg font-bold text-brand-orange">{college.rating}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                                {/* COURSES */}
                                                <div className="bg-blue-50/50 p-2 rounded border border-blue-100/50">
                                                    <span className="block text-xs text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Courses Offered</span>
                                                    <div className="text-sm font-bold text-gray-800 line-clamp-2">
                                                        {college.coursesOffered && college.coursesOffered.length > 0 
                                                            ? college.coursesOffered.slice(0, 3).map(c => c.courseName).join(', ') + (college.coursesOffered.length > 3 ? '...' : '')
                                                            : (college.streams?.join(', ') || 'View Details')}
                                                    </div>
                                                </div>

                                                {/* FEES */}
                                                <div className="bg-green-50/50 p-2 rounded border border-green-100/50">
                                                    <span className="block text-xs text-gray-500 font-medium">Avg Fees</span>
                                                    <span className="text-sm font-bold text-green-700">
                                                        {/* Check coursesOffered[0].fee first, then root fee */}
                                                        {college.coursesOffered?.[0]?.fee > 0 
                                                            ? `₹ ${(college.coursesOffered[0].fee).toLocaleString('en-IN')}` 
                                                            : (college.fees?.tuition ? `₹ ${(college.fees.tuition).toLocaleString('en-IN')}` : 'Check Website')}
                                                    </span>
                                                </div>

                                                {/* OWNERSHIP / PLACEMENT */}
                                                <div className="bg-purple-50/50 p-2 rounded border border-purple-100/50 hidden md:block">
                                                    <span className="block text-xs text-gray-500 font-medium">Ownership</span>
                                                    <span className="text-sm font-bold text-purple-700 capitalize">
                                                        {college.type || 'Private'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <a 
                                                    href={college.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="flex-1 bg-brand-orange text-white text-center py-2.5 rounded-lg font-bold text-sm hover:bg-orange-600 transition shadow opacity-90 hover:opacity-100"
                                                >
                                                    Visit Website
                                                </a>
                                                <Link to={`/colleges/${college.slug}`} className="flex-1 bg-white text-gray-800 border border-gray-300 text-center py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No colleges found</h3>
                                    <p className="text-gray-500">We couldn't find any results matching your filters.</p>
                                    <button 
                                        onClick={() => setFilters({search:'', state:[], city:'', type:'', stream:[], degree:[], targetYear:[], goal:[], sort:'nirfRank'})}
                                        className="mt-6 text-brand-blue font-bold hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {!loading && colleges.length > 0 && (
                        <div className="flex justify-center mt-8 gap-2">
                             <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
                             <span className="px-4 py-2 bg-brand-blue text-white rounded">{page}</span>
                             <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CollegesPage;
