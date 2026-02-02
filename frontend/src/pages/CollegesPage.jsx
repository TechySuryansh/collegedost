import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import api from '../api/axios';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaFilter, FaRedo } from 'react-icons/fa';

// Helper function to parse URL params into filter state
const parseFiltersFromParams = (searchParams) => ({
    search: searchParams.get('search') || '',
    state: searchParams.get('state') ? searchParams.get('state').split(',') : [],
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    stream: searchParams.get('stream') ? searchParams.get('stream').split(',') : [],
    degree: searchParams.get('degree') ? searchParams.get('degree').split(',') : [],
    targetYear: searchParams.get('targetYear') ? searchParams.get('targetYear').split(',') : [],
    goal: searchParams.get('goal') ? searchParams.get('goal').split(',') : [],
    sort: searchParams.get('sort') || 'nirfRank'
});

const CollegesPage = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Track if the URL change is internal (from setFilters) or external (from navigation)
    const isInternalUpdate = useRef(false);
    
    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMoreResults, setHasMoreResults] = useState(false); // Tracks if more results exist beyond MAX_PAGES
    const LIMIT = 20;
    const MAX_PAGES = 5; // Strict pagination limit - never show more than 5 pages

    // Filter Logic: We use array based filters for checkboxes to support multiple selections
    // URL params will be comma separated strings
    const [filters, setFilters] = useState(() => parseFiltersFromParams(searchParams));

    // Checkbox Options Data
    const streamsList = ["Engineering And Architecture", "Management And Business Administration", "Medicine And Allied Sciences", "Law", "Animation And Design", "Pharmacy", "Arts And Humanities", "Science", "Commerce"];
    const degreesList = ["Diploma", "B.E /B.Tech", "B.Arch", "B.Plan", "Other Bachelors", "MBA", "MBBS", "B.Sc", "B.Com", "B.A", "B.Pharma", "M.Pharma", "D.Pharma"];
    const statesList = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", "Haryana", "Karnataka", "Kerala", "Maharashtra", "Madhya Pradesh", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];

    const [searchTermStream, setSearchTermStream] = useState("");
    const [searchTermDegree, setSearchTermDegree] = useState("");
    const [searchTermState, setSearchTermState] = useState("");

    // Autocomplete State
    const [query, setQuery] = useState(filters.search);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Safe page setter that respects MAX_PAGES limit
    const safeSetPage = (newPage) => {
        if (typeof newPage === 'function') {
            setPage(p => Math.min(MAX_PAGES, Math.max(1, newPage(p))));
        } else {
            setPage(Math.min(MAX_PAGES, Math.max(1, newPage)));
        }
    };

    // ===== KEY FIX: Sync URL → State when external navigation occurs =====
    // This effect detects when URL params change from external navigation (navbar links)
    // and reinitializes the filter state accordingly
    useEffect(() => {
        // Skip if this was an internal update (from setFilters)
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        // Parse new filters from URL
        const newFilters = parseFiltersFromParams(searchParams);
        
        // Update filter state from URL
        setFilters(newFilters);
        setQuery(newFilters.search);
        setPage(1); // Reset to page 1 on navigation
        
        // Clear filter search terms
        setSearchTermStream("");
        setSearchTermDegree("");
        setSearchTermState("");
        
    }, [location.search]); // Triggered when URL query string changes

    // Fetch on Filters or Page Change (State → URL sync)
    useEffect(() => {
        // Mark that we're making an internal URL update
        isInternalUpdate.current = true;
        
        // Sync URL with state
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.state.length) params.state = filters.state.join(',');
        if (filters.city) params.city = filters.city;
        if (filters.type) params.type = filters.type;
        if (filters.stream.length) params.stream = filters.stream.join(',');
        if (filters.degree.length) params.degree = filters.degree.join(',');
        if (filters.targetYear.length) params.targetYear = filters.targetYear.join(',');
        if (filters.goal.length) params.goal = filters.goal.join(',');
        if (filters.sort && filters.sort !== 'nirfRank') params.sort = filters.sort;
        
        setSearchParams(params, { replace: true });
        fetchColleges();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters, page]); 

    // Fetch Suggestions Debounced
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query && query.length > 1 && query !== filters.search) {
                fetchSuggestions(query);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); 

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
            // GOAL-BASED FILTERING LOGIC:
            // If a goal is selected but does NOT include "Colleges", don't fetch colleges
            // This handles cases like "Study Abroad", "Exams", "Coaching" being selected alone
            const hasGoalFilter = filters.goal.length > 0;
            const includesCollegesGoal = filters.goal.includes('Colleges');
            
            // If user has selected goals but "Colleges" is NOT among them, show empty state
            if (hasGoalFilter && !includesCollegesGoal) {
                setColleges([]);
                setTotalPages(1);
                setLoading(false);
                return;
            }

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
                    const actualTotalPages = res.data.pagination.pages;
                    // STRICT 5-PAGE LIMIT: Cap displayable pages at MAX_PAGES
                    const cappedPages = Math.min(actualTotalPages, MAX_PAGES);
                    setTotalPages(cappedPages);
                    // Track if more results exist beyond our limit
                    setHasMoreResults(actualTotalPages > MAX_PAGES);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestions = async (searchTerm) => {
        try {
            const res = await api.get(`/colleges/search?q=${searchTerm}`);
            if (res.data.success) {
                setSuggestions(res.data.data);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
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
                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 sticky top-32 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
                        
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-blue/5 text-brand-blue rounded-lg">
                                    <FaFilter className="text-sm" />
                                </div>
                                <h2 className="text-base font-bold text-slate-800">Filters</h2>
                            </div>
                            <button 
                                onClick={() => setFilters({search:'', state:[], city:'', type:'', stream:[], degree:[], targetYear:[], goal:[], sort:'nirfRank'})}
                                className="text-xs font-semibold text-slate-500 hover:text-brand-orange transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-orange-50"
                            >
                                <FaRedo className="text-[10px]" /> Reset
                            </button>
                        </div>

                        <div className="overflow-y-auto px-6 py-6 custom-scrollbar space-y-8 flex-1">
                            {/* GOAL */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-brand-orange rounded-full"></span>
                                    Goal
                                </h3>
                                <div className="space-y-1">
                                    {['Colleges', 'Exams', 'Coachings', 'Study Abroad'].map((goal) => (
                                        <label key={goal} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2">
                                            <div className="relative flex items-center justify-center flex-shrink-0">
                                                <input 
                                                    type="checkbox" 
                                                    className="peer appearance-none w-5 h-5 border-[1.5px] border-slate-300 rounded-[6px] bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                                    checked={filters.goal.includes(goal)}
                                                    onChange={() => handleCheckboxChange('goal', goal)}
                                                />
                                                <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${filters.goal.includes(goal) ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                                {goal}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* EDUCATION STREAM */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-brand-blue rounded-full"></span>
                                    Stream
                                </h3>
                                <div className="relative mb-3 group">
                                    <input 
                                        type="text" 
                                        placeholder="Search streams..." 
                                        value={searchTermStream}
                                        onChange={(e) => setSearchTermStream(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                                    />
                                    <FaSearch className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-brand-blue transition-colors text-xs" />
                                </div>
                                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                    {filterOptions(streamsList, searchTermStream).map((stream) => (
                                        <label key={stream} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2">
                                            <div className="relative flex items-center justify-center flex-shrink-0">
                                                <input type="checkbox" className="peer appearance-none w-5 h-5 border-[1.5px] border-slate-300 rounded-[6px] bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" checked={filters.stream.includes(stream)} onChange={() => handleCheckboxChange('stream', stream)} />
                                                <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className={`text-sm leading-snug transition-colors ${filters.stream.includes(stream) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{stream}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                             {/* DEGREE */}
                             <div>
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                                    Degree
                                </h3>
                                <div className="relative mb-3 group">
                                    <input 
                                        type="text" 
                                        placeholder="Search degrees..." 
                                        value={searchTermDegree}
                                        onChange={(e) => setSearchTermDegree(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                    <FaSearch className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors text-xs" />
                                </div>
                                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                    {filterOptions(degreesList, searchTermDegree).map((deg) => (
                                        <label key={deg} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2">
                                            <div className="relative flex items-center justify-center flex-shrink-0">
                                                <input type="checkbox" className="peer appearance-none w-5 h-5 border-[1.5px] border-slate-300 rounded-[6px] bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" checked={filters.degree.includes(deg)} onChange={() => handleCheckboxChange('degree', deg)} />
                                                <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className={`text-sm leading-snug transition-colors ${filters.degree.includes(deg) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{deg}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* STATE */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
                                    State
                                </h3>
                                <div className="relative mb-3 group">
                                    <input 
                                        type="text" 
                                        placeholder="Search states..." 
                                        value={searchTermState}
                                        onChange={(e) => setSearchTermState(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                    <FaSearch className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-teal-500 transition-colors text-xs" />
                                </div>
                                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                    {filterOptions(statesList, searchTermState).map((st) => (
                                        <label key={st} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2">
                                            <div className="relative flex items-center justify-center flex-shrink-0">
                                                <input type="checkbox" className="peer appearance-none w-5 h-5 border-[1.5px] border-slate-300 rounded-[6px] bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" checked={filters.state.includes(st)} onChange={() => handleCheckboxChange('state', st)} />
                                                <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className={`text-sm leading-snug transition-colors ${filters.state.includes(st) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{st}</span>
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
                        <div className="flex-1 relative" ref={searchRef}>
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input 
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if(e.target.value.length === 0) {
                                        setFilters({...filters, search: ''});
                                        setShowSuggestions(false);
                                    }
                                }}
                                onFocus={() => {
                                    if(query.length > 1 && suggestions.length > 0) setShowSuggestions(true);
                                }}
                                onKeyDown={handleSearchSubmit} 
                                placeholder="Search for colleges, exams, courses and more..." 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-blue outline-none"
                            />
                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-80 overflow-y-auto">
                                    {suggestions.map((item) => (
                                        <div 
                                            key={item._id}
                                            onClick={() => {
                                                setQuery(item.name);
                                                setFilters({...filters, search: item.name}); // Or navigate directly `navigate('/colleges/' + item.slug)`
                                                setPage(1);
                                                setShowSuggestions(false);
                                            }}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center justify-between group"
                                        >
                                            <div>
                                                <div className="text-sm font-medium text-gray-800 group-hover:text-brand-blue">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    {item.location?.city}, {item.location?.state}
                                                    {item.type && <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">{item.type}</span>}
                                                </div>
                                            </div>
                                            <div className="text-gray-300 group-hover:text-brand-orange">
                                                <FaChevronRight className="text-xs" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                    {/* Context-aware empty state based on selected goals */}
                                    {filters.goal.includes('Study Abroad') && !filters.goal.includes('Colleges') ? (
                                        <>
                                            <div className="text-6xl mb-4">✈️</div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">Study Abroad Programs</h3>
                                            <p className="text-gray-500 max-w-md mx-auto">
                                                Study Abroad programs are not listed on this page.<br />
                                                Select <strong>"Colleges"</strong> in the Goal filter to view college listings.
                                            </p>
                                            <button 
                                                onClick={() => handleCheckboxChange('goal', 'Colleges')}
                                                className="mt-6 bg-brand-blue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition"
                                            >
                                                Show Colleges Instead
                                            </button>
                                        </>
                                    ) : filters.goal.includes('Exams') && !filters.goal.includes('Colleges') ? (
                                        <>
                                            <div className="text-6xl mb-4">📝</div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">Exams Information</h3>
                                            <p className="text-gray-500 max-w-md mx-auto">
                                                This page displays colleges only.<br />
                                                Select <strong>"Colleges"</strong> in the Goal filter to view college listings.
                                            </p>
                                            <button 
                                                onClick={() => handleCheckboxChange('goal', 'Colleges')}
                                                className="mt-6 bg-brand-blue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition"
                                            >
                                                Show Colleges Instead
                                            </button>
                                        </>
                                    ) : filters.goal.includes('Coachings') && !filters.goal.includes('Colleges') ? (
                                        <>
                                            <div className="text-6xl mb-4">🎓</div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">Coaching Institutes</h3>
                                            <p className="text-gray-500 max-w-md mx-auto">
                                                This page displays colleges only.<br />
                                                Select <strong>"Colleges"</strong> in the Goal filter to view college listings.
                                            </p>
                                            <button 
                                                onClick={() => handleCheckboxChange('goal', 'Colleges')}
                                                className="mt-6 bg-brand-blue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition"
                                            >
                                                Show Colleges Instead
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-6xl mb-4">🔍</div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">No colleges found</h3>
                                            <p className="text-gray-500">We couldn't find any results matching your filters.</p>
                                            <button 
                                                onClick={() => setFilters({search:'', state:[], city:'', type:'', stream:[], degree:[], targetYear:[], goal:[], sort:'nirfRank'})}
                                                className="mt-6 text-brand-blue font-bold hover:underline"
                                            >
                                                Clear all filters
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Pagination - Strict 5-Page Limit */}
                    {!loading && colleges.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center items-center mt-10 mb-4 gap-1">
                            {/* Previous Button - Only show if not on first page */}
                            {page > 1 && (
                                <button 
                                    onClick={() => safeSetPage(p => p - 1)} 
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    ← Prev
                                </button>
                            )}
                            
                            {/* Page Numbers - Simple 1 to totalPages (max 5) */}
                            <div className="flex items-center gap-1 mx-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={() => safeSetPage(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 ${
                                            page === pageNum 
                                                ? 'bg-brand-blue text-white shadow-md shadow-blue-200' 
                                                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Next Button - Only show if not on last page */}
                            {page < totalPages && (
                                <button 
                                    onClick={() => safeSetPage(p => p + 1)} 
                                    className="px-4 py-2.5 text-sm font-semibold text-brand-blue border-2 border-brand-blue hover:bg-brand-blue hover:text-white rounded-lg transition-all duration-200 flex items-center gap-1"
                                >
                                    Next <span className="text-lg">→</span>
                                </button>
                            )}
                        </div>
                    )}
                    
                    {/* Message when more results exist beyond 5-page limit */}
                    {!loading && hasMoreResults && (
                        <div className="flex justify-center mt-4 mb-2">
                            <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-sm">
                                <span className="text-amber-600 text-lg">💡</span>
                                <span className="text-amber-800 font-medium">
                                    Showing top results only
                                </span>
                                <span className="text-amber-600">—</span>
                                <span className="text-amber-700">
                                    apply more filters to refine the list
                                </span>
                                <button 
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="ml-2 text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 hover:underline"
                                >
                                    <FaFilter className="text-xs" /> Filters ↑
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CollegesPage;
