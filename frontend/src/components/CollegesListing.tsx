"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/api/axios';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
    FaSearch, FaMapMarkerAlt, FaStar, FaChevronDown, FaChevronUp,
    FaTimes, FaFilter, FaUniversity, FaArrowRight
} from 'react-icons/fa';
import { CollegesPageSkeleton } from '@/components/ui';

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface FilterState {
    search: string;
    state: string[];
    city: string[];
    degree: string[];
    stream: string[];
    ownership: string[];
    specialization: string[];
    fees: string;
    rating: string;
    sort: string;
    management: string[];
    institutionCategory: string[];
    collegeType: string[];
    locationType: string[];
}

/* ─── Filter Options Data ───────────────────────────────────────────────── */
const statesList = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
];

const citiesList = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
    "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Indore",
    "Bhopal", "Nagpur", "Coimbatore", "Kochi", "Vellore", "Manipal",
    "Noida", "Gurgaon", "Dehradun", "Thiruvananthapuram", "Patna",
    "Bhubaneswar", "Visakhapatnam"
];

const degreesList = [
    "B.E / B.Tech", "MBA / PGDM", "MBBS", "B.Sc", "B.Com", "B.A",
    "B.Arch", "B.Plan", "BBA", "BCA", "B.Pharma", "LLB", "B.Des",
    "M.E / M.Tech", "M.Sc", "M.A", "M.Com", "MCA", "M.Pharma",
    "D.Pharma", "Diploma", "Ph.D"
];

const streamsList = [
    "Engineering", "Management", "Medicine", "Law",
    "Science", "Commerce", "Arts", "Design",
    "Pharmacy", "Education", "Hospitality", "Media",
    "Computer Application", "Architecture"
];

const ownershipList = ["Government", "Private", "Private Aided", "University"];

const managementList = [
    "Private Un-Aided", "Private Aided (Government Aided)", "State Government",
    "Central Government", "Local Body", "University"
];

const institutionCategoryList = ["College", "Standalone", "University"];

const collegeTypeList = [
    "Affiliated College", "Autonomous College", "Constituent / University College",
    "PG Center / Off-Campus Center", "Recognized Center",
    "Technical/Polytechnic", "Teacher Training", "Nursing",
    "Pharmacy Institutions", "PGDM Institutes", "Paramedical",
    "Hotel Management and Catering"
];

const locationTypeList = ["Urban", "Rural"];

const specializationList = [
    "Computer Science", "Mechanical", "Electrical", "Civil", "Electronics",
    "Information Technology", "Chemical", "Aerospace", "Biotechnology",
    "Data Science", "Artificial Intelligence", "Finance", "Marketing",
    "Human Resources", "Operations", "General Medicine", "Surgery",
    "Pediatrics", "Dermatology"
];

const feesOptions = [
    { label: "Under ₹1 Lakh", value: "under_1l" },
    { label: "₹1 - 3 Lakhs", value: "1l_3l" },
    { label: "₹3 - 5 Lakhs", value: "3l_5l" },
    { label: "₹5 - 10 Lakhs", value: "5l_10l" },
    { label: "Above ₹10 Lakhs", value: "above_10l" },
];

const ratingOptions = [
    { label: "4★ & above", value: "4" },
    { label: "3★ & above", value: "3" },
    { label: "2★ & above", value: "2" },
];

/* ─── Collapsible Filter Panel ──────────────────────────────────────────── */
const FilterPanel = ({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full font-bold text-[13px] tracking-wide text-gray-900"
            >
                {title}
                {open
                    ? <FaChevronUp className="text-xs text-gray-400" />
                    : <FaChevronDown className="text-xs text-gray-400" />}
            </button>
            {open && <div className="mt-4">{children}</div>}
        </div>
    );
};

/* ─── Checkbox List with Optional Search ────────────────────────────────── */
const CheckboxFilterList = ({
    options,
    selected,
    onToggle,
    searchable = false,
}: {
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
    searchable?: boolean;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filtered = searchable
        ? options.filter(o => o.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;

    return (
        <div>
            {searchable && (
                <div className="relative mb-3">
                    <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 shadow-sm"
                    />
                </div>
            )}
            <div className="space-y-1.5 filter-scroll max-h-52 overflow-y-auto pr-2">
                {filtered.map((item) => (
                    <label
                        key={item}
                        className={`flex items-center justify-between group cursor-pointer p-2 rounded-xl transition-colors -mx-2 ${selected.includes(item)
                            ? 'bg-primary/5 ring-1 ring-primary/10'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="relative flex items-center justify-center shrink-0">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(item)}
                                    onChange={() => onToggle(item)}
                                    className="peer appearance-none w-4 h-4 border-[1.5px] border-gray-300 rounded-md bg-white checked:bg-primary checked:border-primary checked:ring-2 checked:ring-primary/20 transition-all cursor-pointer"
                                />
                                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className={`text-sm leading-snug transition-colors ${selected.includes(item) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                {item}
                            </span>
                        </div>
                    </label>
                ))}
                {filtered.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">No matches</p>
                )}
            </div>
        </div>
    );
};

/* ─── URL Parsing Helper ────────────────────────────────────────────────── */
const parseFiltersFromParams = (sp: URLSearchParams): FilterState => ({
    search: sp.get('search') || '',
    state: sp.get('state') ? sp.get('state')!.split(',') : [],
    city: sp.get('city') ? sp.get('city')!.split(',') : [],
    degree: sp.get('degree') ? sp.get('degree')!.split(',') : [],
    stream: sp.get('stream') ? sp.get('stream')!.split(',') : [],
    ownership: sp.get('ownership') ? sp.get('ownership')!.split(',') : [],
    specialization: sp.get('specialization') ? sp.get('specialization')!.split(',') : [],
    fees: sp.get('fees') || '',
    rating: sp.get('rating') || '',
    sort: sp.get('sort') || 'popularity',
    management: sp.get('management') ? sp.get('management')!.split(',') : [],
    institutionCategory: sp.get('institutionCategory') ? sp.get('institutionCategory')!.split(',') : [],
    collegeType: sp.get('collegeType') ? sp.get('collegeType')!.split(',') : [],
    locationType: sp.get('locationType') ? sp.get('locationType')!.split(',') : [],
});

interface CollegesListingProps {
    initialStream?: string;
    hideHero?: boolean;
    title?: React.ReactNode;
    subtitle?: string;
}

const CollegesListing: React.FC<CollegesListingProps> = ({
    initialStream,
    hideHero = false,
    title,
    subtitle = "Discover Colleges"
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<FilterState>(() => {
        const parsed = parseFiltersFromParams(new URLSearchParams(searchParams?.toString()));
        if (initialStream && !parsed.stream.includes(initialStream) && parsed.stream.length === 0) {
            parsed.stream = [initialStream];
        }
        return parsed;
    });
    const [colleges, setColleges] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 20;

    const [query, setQuery] = useState(filters.search);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const isInternalUpdate = useRef(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    /* ── Active Filter Count ─────────────────────────────────── */
    const activeFilterCount = [
        filters.state.length, filters.city.length, filters.degree.length,
        filters.stream.length, filters.ownership.length, filters.specialization.length,
        filters.management.length, filters.institutionCategory.length,
        filters.collegeType.length, filters.locationType.length,
        filters.fees ? 1 : 0, filters.rating ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    /* ── Handlers ────────────────────────────────────────────── */
    type MultiSelectKey = 'state' | 'city' | 'degree' | 'stream' | 'ownership' | 'specialization' | 'management' | 'institutionCategory' | 'collegeType' | 'locationType';

    const handleCheckboxToggle = (category: MultiSelectKey, value: string) => {
        setFilters(prev => {
            const current = (prev[category] || []) as string[];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
        setPage(1);
    };

    const clearAllFilters = () => {
        setFilters({
            search: '', state: [], city: [], degree: [], stream: initialStream ? [initialStream] : [],
            ownership: [], specialization: [], fees: '', rating: '', sort: 'popularity',
            management: [], institutionCategory: [], collegeType: [], locationType: [],
        });
        setQuery('');
        setPage(1);
    };

    /* ── API Functions ───────────────────────────────────────── */
    const fetchColleges = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.state.length) params.append('state', filters.state.join(','));
            if (filters.city.length) params.append('city', filters.city.join(','));
            if (filters.stream.length) params.append('stream', filters.stream.join(','));
            if (filters.specialization.length) params.append('branch', filters.specialization.join(','));
            if (filters.degree.length) params.append('course', filters.degree.join(','));
            if (filters.ownership.length) params.append('type', filters.ownership.join(','));
            if (filters.fees) params.append('fees', filters.fees);
            if (filters.rating) params.append('rating', filters.rating);
            if (filters.sort) params.append('sort', filters.sort);
            if (filters.management.length) params.append('management', filters.management.join(','));
            if (filters.institutionCategory.length) params.append('institutionCategory', filters.institutionCategory.join(','));
            if (filters.collegeType.length) params.append('collegeType', filters.collegeType.join(','));
            if (filters.locationType.length) params.append('locationType', filters.locationType.join(','));
            params.append('page', page.toString());
            params.append('limit', LIMIT.toString());
            const res = await api.get(`/colleges?${params.toString()}`);
            if (res.data.success) {
                setColleges(res.data.data);
                if (res.data.pagination) {
                    setTotalPages(res.data.pagination.pages);
                    setTotalCount(res.data.pagination.total || res.data.data.length);
                }
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [filters, page]);

    const fetchSuggestions = useCallback(async (term: string) => {
        try {
            const res = await api.get(`/colleges/search?q=${term}`);
            if (res.data.success) { setSuggestions(res.data.data); setShowSuggestions(true); }
        } catch { /* silent */ }
    }, []);

    const handleSearchSubmit = () => {
        setFilters(prev => ({ ...prev, search: query }));
        setPage(1);
        setShowSuggestions(false);
    };

    /* ── URL ↔ State Sync ────────────────────────────────────── */
    useEffect(() => {
        if (isInternalUpdate.current) { isInternalUpdate.current = false; return; }
        const newFilters = parseFiltersFromParams(new URLSearchParams(searchParams?.toString()));
        // If it's a stream-specific page and no stream is in URL, use the initialStream
        if (initialStream && newFilters.stream.length === 0) {
            newFilters.stream = [initialStream];
        }
        setFilters(newFilters);
        setQuery(newFilters.search);
        setPage(1);
    }, [searchParams, initialStream]);

    useEffect(() => {
        isInternalUpdate.current = true;
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.state.length) params.set('state', filters.state.join(','));
        if (filters.city.length) params.set('city', filters.city.join(','));
        if (filters.degree.length) params.set('degree', filters.degree.join(','));
        if (filters.stream.length) params.set('stream', filters.stream.join(','));
        if (filters.ownership.length) params.set('ownership', filters.ownership.join(','));
        if (filters.specialization.length) params.set('specialization', filters.specialization.join(','));
        if (filters.management.length) params.set('management', filters.management.join(','));
        if (filters.institutionCategory.length) params.set('institutionCategory', filters.institutionCategory.join(','));
        if (filters.collegeType.length) params.set('collegeType', filters.collegeType.join(','));
        if (filters.locationType.length) params.set('locationType', filters.locationType.join(','));
        if (filters.fees) params.set('fees', filters.fees);
        if (filters.rating) params.set('rating', filters.rating);
        if (filters.sort && filters.sort !== 'popularity') params.set('sort', filters.sort);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        fetchColleges();
    }, [filters, page, router, pathname, fetchColleges]);

    /* ── Search Suggestions ──────────────────────────────────── */
    useEffect(() => {
        const t = setTimeout(() => {
            if (query && query.length > 1 && query !== filters.search) {
                fetchSuggestions(query);
            } else { setSuggestions([]); setShowSuggestions(false); }
        }, 300);
        return () => clearTimeout(t);
    }, [query, filters.search, fetchSuggestions]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* ── Active Filter Chips ─────────────────────────────────── */
    const activeChips: { label: string; onRemove: () => void }[] = [];
    filters.state.forEach(s => activeChips.push({ label: s, onRemove: () => handleCheckboxToggle('state', s) }));
    filters.city.forEach(c => activeChips.push({ label: c, onRemove: () => handleCheckboxToggle('city', c) }));
    filters.degree.forEach(d => activeChips.push({ label: d, onRemove: () => handleCheckboxToggle('degree', d) }));
    filters.stream.forEach(s => activeChips.push({ label: s, onRemove: () => handleCheckboxToggle('stream', s) }));
    filters.ownership.forEach(o => activeChips.push({ label: o, onRemove: () => handleCheckboxToggle('ownership', o) }));
    filters.specialization.forEach(s => activeChips.push({ label: s, onRemove: () => handleCheckboxToggle('specialization', s) }));
    filters.management.forEach(m => activeChips.push({ label: m, onRemove: () => handleCheckboxToggle('management', m) }));
    filters.institutionCategory.forEach(ic => activeChips.push({ label: ic, onRemove: () => handleCheckboxToggle('institutionCategory', ic) }));
    filters.collegeType.forEach(ct => activeChips.push({ label: ct, onRemove: () => handleCheckboxToggle('collegeType', ct) }));
    filters.locationType.forEach(lt => activeChips.push({ label: lt, onRemove: () => handleCheckboxToggle('locationType', lt) }));
    if (filters.fees) {
        const feeLabel = feesOptions.find(f => f.value === filters.fees)?.label || filters.fees;
        activeChips.push({ label: `Fees: ${feeLabel}`, onRemove: () => setFilters(prev => ({ ...prev, fees: '' })) });
    }
    if (filters.rating) {
        activeChips.push({ label: `${filters.rating}★ & above`, onRemove: () => setFilters(prev => ({ ...prev, rating: '' })) });
    }

    /* ── Shared Sidebar Filter Panels ────────────────────────── */
    const renderFilters = () => (
        <div className="space-y-5">
            <FilterPanel title="Institution Category" defaultOpen={true}>
                <CheckboxFilterList options={institutionCategoryList} selected={filters.institutionCategory} onToggle={(v) => handleCheckboxToggle('institutionCategory', v)} />
            </FilterPanel>
            <FilterPanel title="State" defaultOpen={true}>
                <CheckboxFilterList options={statesList} selected={filters.state} onToggle={(v) => handleCheckboxToggle('state', v)} searchable />
            </FilterPanel>
            <FilterPanel title="Management" defaultOpen={false}>
                <CheckboxFilterList options={managementList} selected={filters.management} onToggle={(v) => handleCheckboxToggle('management', v)} />
            </FilterPanel>
            <FilterPanel title="College Type" defaultOpen={false}>
                <CheckboxFilterList options={collegeTypeList} selected={filters.collegeType} onToggle={(v) => handleCheckboxToggle('collegeType', v)} searchable />
            </FilterPanel>
            <FilterPanel title="Location Type" defaultOpen={false}>
                <CheckboxFilterList options={locationTypeList} selected={filters.locationType} onToggle={(v) => handleCheckboxToggle('locationType', v)} />
            </FilterPanel>
            <FilterPanel title="City" defaultOpen={false}>
                <CheckboxFilterList options={citiesList} selected={filters.city} onToggle={(v) => handleCheckboxToggle('city', v)} searchable />
            </FilterPanel>
            <FilterPanel title="Ownership" defaultOpen={false}>
                <CheckboxFilterList options={ownershipList} selected={filters.ownership} onToggle={(v) => handleCheckboxToggle('ownership', v)} />
            </FilterPanel>
            <FilterPanel title="Degree" defaultOpen={false}>
                <CheckboxFilterList options={degreesList} selected={filters.degree} onToggle={(v) => handleCheckboxToggle('degree', v)} searchable />
            </FilterPanel>
            <FilterPanel title="Branch / Stream" defaultOpen={false}>
                <CheckboxFilterList options={streamsList} selected={filters.stream} onToggle={(v) => handleCheckboxToggle('stream', v)} />
            </FilterPanel>
            <FilterPanel title="Specialization" defaultOpen={false}>
                <CheckboxFilterList options={specializationList} selected={filters.specialization} onToggle={(v) => handleCheckboxToggle('specialization', v)} searchable />
            </FilterPanel>
            <FilterPanel title="Avg Fees (Yearly)" defaultOpen={false}>
                <div className="space-y-2.5">
                    {feesOptions.map(opt => (
                        <label
                            key={opt.value}
                            className={`flex items-center gap-3 group cursor-pointer p-2 rounded-xl transition-colors ${filters.fees === opt.value ? 'bg-primary/5 ring-1 ring-primary/10' : 'hover:bg-gray-50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="fees"
                                checked={filters.fees === opt.value}
                                onChange={() => { setFilters(prev => ({ ...prev, fees: prev.fees === opt.value ? '' : opt.value })); setPage(1); }}
                                className="border-gray-300 text-primary focus:ring-primary w-4 h-4"
                            />
                            <span className={`text-sm font-medium transition-colors ${filters.fees === opt.value ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}>
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterPanel>
            <FilterPanel title="Rating" defaultOpen={false}>
                <div className="space-y-2.5">
                    {ratingOptions.map(opt => (
                        <label
                            key={opt.value}
                            className={`flex items-center gap-3 group cursor-pointer p-2 rounded-xl transition-colors ${filters.rating === opt.value ? 'bg-primary/5 ring-1 ring-primary/10' : 'hover:bg-gray-50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.rating === opt.value}
                                onChange={() => { setFilters(prev => ({ ...prev, rating: prev.rating === opt.value ? '' : opt.value })); setPage(1); }}
                                className="border-gray-300 text-primary focus:ring-primary w-4 h-4"
                            />
                            <span className={`text-sm font-medium transition-colors ${filters.rating === opt.value ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}>
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterPanel>
        </div>
    );

    /* ━━━━━━━━━━━━━━━━  RENDER  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!mounted) {
        return <CollegesPageSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background-light antialiased">

            {/* ── Hero Section ───────────────────────────────────── */}
            {!hideHero && (
                <section className="bg-[radial-gradient(circle_at_top_left,#F5F3FF_0%,#FFFFFF_100%)] pt-8 pb-8 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Breadcrumb */}
                        <nav aria-label="Breadcrumb" className="flex mb-8 text-sm font-medium text-gray-500">
                            <ol className="flex items-center space-x-2">
                                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                                <li><FaChevronDown className="text-[10px] -rotate-90" /></li>
                                <li className="text-primary font-semibold">Admissions Open</li>
                            </ol>
                        </nav>
                        <div className="max-w-3xl">
                            <h1 className="font-display text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight text-gray-900 leading-tight">
                                {title || (
                                    <>
                                        Discover Colleges with <br />
                                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                                            Open Admissions
                                        </span>
                                    </>
                                )}
                            </h1>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Main Content ───────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── Sidebar Filters (Desktop) ──────────────── */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-28 space-y-5 max-h-[calc(100vh-8rem)] overflow-y-auto filter-scroll pr-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <FaFilter className="text-primary" /> Filters
                                    {activeFilterCount > 0 && (
                                        <span className="text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
                                    )}
                                </h3>
                                <button onClick={clearAllFilters} className="text-xs font-bold text-primary hover:underline">Clear All</button>
                            </div>
                            {renderFilters()}
                        </div>
                    </aside>

                    {/* ── Mobile Filter FAB ───────────────────────── */}
                    <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm"
                    >
                        <FaFilter /> Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{activeFilterCount}</span>
                        )}
                    </button>

                    {/* ── Mobile Filter Drawer ────────────────────── */}
                    {mobileFiltersOpen && (
                        <>
                            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
                            <div className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-background-light z-50 lg:hidden overflow-y-auto shadow-2xl">
                                <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white sticky top-0 z-10">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <FaFilter className="text-primary" /> Filters
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <button onClick={clearAllFilters} className="text-xs font-bold text-primary">Clear All</button>
                                        <button onClick={() => setMobileFiltersOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                                            <FaTimes className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">{renderFilters()}</div>
                            </div>
                        </>
                    )}

                    {/* ── Results Column ──────────────────────────── */}
                    <div className="flex-1">

                        {/* Result Count & Search Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 border-b border-gray-100 mb-6">
                            <div className="text-sm font-medium text-gray-500">
                                Showing <span className="text-gray-900 font-bold">{totalCount.toLocaleString('en-IN')}</span> Colleges
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                                <div className="relative">
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => {
                                            setFilters(prev => ({ ...prev, sort: e.target.value }));
                                            setPage(1);
                                        }}
                                        className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-gray-700 hover:border-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer shadow-sm"
                                    >
                                        <option value="popularity">NIRF Rank (Default)</option>
                                        <option value="rating">User Rating</option>
                                        <option value="fees_low">Fees: Low to High</option>
                                        <option value="fees_high">Fees: High to Low</option>
                                        <option value="name">Name: A to Z</option>
                                    </select>
                                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative group mb-6" ref={searchRef}>
                            <div className="absolute -inset-1 bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl blur opacity-30"></div>
                            <div className="relative flex items-center bg-white rounded-2xl shadow-lg p-1.5 border border-gray-100">
                                <FaSearch className="ml-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        if (e.target.value.length === 0) {
                                            setFilters(prev => ({ ...prev, search: '' }));
                                            setShowSuggestions(false);
                                        }
                                    }}
                                    onFocus={() => { if (query.length > 1 && suggestions.length > 0) setShowSuggestions(true); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                                    placeholder="Search by college name, course or city..."
                                    className="w-full bg-transparent border-0 focus:ring-0 text-gray-900 placeholder-gray-400 h-12 px-4 text-base outline-none"
                                />
                                <button
                                    onClick={handleSearchSubmit}
                                    className="bg-primary hover:bg-secondary text-white rounded-xl h-10 px-6 font-bold transition-colors flex items-center gap-2 shrink-0"
                                >
                                    Find Colleges
                                </button>
                            </div>
                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-80 overflow-y-auto">
                                    {suggestions.map((item: any) => (
                                        <div
                                            key={item._id}
                                            onClick={() => {
                                                setQuery(item.name);
                                                setFilters(prev => ({ ...prev, search: item.name }));
                                                setPage(1);
                                                setShowSuggestions(false);
                                            }}
                                            className="px-5 py-3.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center justify-between group/s"
                                        >
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800 group-hover/s:text-primary">{item.name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <FaMapMarkerAlt className="text-[10px]" />
                                                    {item.location?.city}, {item.location?.state}
                                                    {item.type && <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">{item.type}</span>}
                                                </div>
                                            </div>
                                            <FaArrowRight className="text-xs text-gray-300 group-hover/s:text-primary" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Active Filter Chips */}
                        {activeChips.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {activeChips.map((chip, i) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary text-xs font-semibold rounded-full">
                                        {chip.label}
                                        <button onClick={chip.onRemove} className="hover:text-red-500 transition-colors"><FaTimes className="text-[10px]" /></button>
                                    </span>
                                ))}
                                <button onClick={clearAllFilters} className="text-xs font-bold text-gray-500 hover:text-primary px-2">Clear all</button>
                            </div>
                        )}

                        {/* College Cards */}
                        {loading ? (
                            <div className="grid grid-cols-1 gap-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                                        <div className="flex gap-5">
                                            <div className="shrink-0">
                                                <div className="w-28 h-28 rounded-xl bg-gray-200 animate-pulse" />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-4">
                                                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                                                    {Array.from({ length: 6 }).map((_, j) => (
                                                        <div key={j} className="h-4 bg-gray-100 rounded-md animate-pulse" style={{ width: `${65 + (j % 3) * 12}%` }} />
                                                    ))}
                                                </div>
                                                <div className="flex gap-3 mt-2">
                                                    <div className="h-9 w-40 bg-gray-200 rounded-lg animate-pulse" />
                                                    <div className="h-9 w-28 bg-gray-100 rounded-lg animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {colleges.length > 0 ? colleges.map((college: any) => (
                                    <div
                                        key={college._id}
                                        className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex gap-5">
                                            {/* Left - Logo */}
                                            <div className="shrink-0">
                                                <div className="w-28 h-28 rounded-xl border-2 border-gray-200 p-2 bg-white flex items-center justify-center">
                                                    {college.logo ? (
                                                        <img src={college.logo} alt={college.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <FaUniversity className="text-4xl text-gray-300" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Middle - Info */}
                                            <div className="flex-1 min-w-0">
                                                {/* College Name + Category Badge */}
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                        <Link href={`/tools/colleges/${college.slug}`}>{college.name}</Link>
                                                    </h3>
                                                    <div className="flex items-center gap-1.5">
                                                        {college.nirfRank && (
                                                            <div className="bg-amber-50 text-amber-700 px-2.5 py-0.5 text-[11px] font-bold rounded-full border border-amber-200/50 flex items-center gap-1">
                                                                <FaStar className="text-[10px]" />
                                                                NIRF #{college.nirfRank}
                                                            </div>
                                                        )}
                                                        {college.institutionCategory && (
                                                            <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${college.institutionCategory === 'University' ? 'bg-purple-100 text-purple-700' :
                                                                college.institutionCategory === 'Standalone' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                {college.institutionCategory}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Info Grid - 3 columns */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 text-sm mb-3">
                                                    {/* Location */}
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <FaMapMarkerAlt className="text-secondary shrink-0" />
                                                        <span>{college.location?.city ? `${college.location.city}, ` : ''}{college.location?.state || 'India'}</span>
                                                    </div>

                                                    {/* Management */}
                                                    {college.management && college.management !== '-' && (
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <svg className="w-4 h-4 text-secondary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                                            </svg>
                                                            <span className="truncate">{college.management}</span>
                                                        </div>
                                                    )}

                                                    {/* Year of Establishment */}
                                                    {college.yearOfEstablishment && college.yearOfEstablishment !== '-' && (
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <svg className="w-4 h-4 text-secondary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="font-medium">Est:</span>
                                                            <span>{college.yearOfEstablishment}</span>
                                                        </div>
                                                    )}

                                                    {/* College Type */}
                                                    {college.collegeType && college.collegeType !== '-' && (
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <FaUniversity className="text-secondary shrink-0 text-sm" />
                                                            <span className="truncate">{college.collegeType}</span>
                                                        </div>
                                                    )}

                                                    {/* Ownership */}
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <svg className="w-4 h-4 text-secondary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="font-medium">Type:</span>
                                                        <span>{college.type || 'Private'}</span>
                                                    </div>

                                                    {/* University Name */}
                                                    {college.universityName && (
                                                        <div className="flex items-center gap-2 text-gray-700 lg:col-span-2">
                                                            <svg className="w-4 h-4 text-secondary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                                            </svg>
                                                            <span className="font-medium">University:</span>
                                                            <span className="truncate">{college.universityName}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons - Below Info */}
                                                <div className="flex gap-3 mt-2">
                                                    {college.website ? (
                                                        <a
                                                            href={college.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-5 py-2 bg-secondary text-white font-semibold rounded-lg text-sm flex items-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                                            </svg>
                                                            Visit Website
                                                        </a>
                                                    ) : null}
                                                    <Link
                                                        href={`/tools/colleges/${college.slug}`}
                                                        className="px-5 py-2 bg-white border-2 border-primary text-primary font-semibold rounded-lg text-sm hover:bg-primary hover:text-white transition-all duration-200 flex items-center gap-2"
                                                    >
                                                        <FaArrowRight className="text-xs" />
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    /* Empty State */
                                    <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No colleges found</h3>
                                        <p className="text-gray-500">We couldn&apos;t find any results matching your filters.</p>
                                        <button onClick={clearAllFilters} className="mt-6 text-primary font-bold hover:underline">Clear all filters</button>
                                    </div>
                                )}

                                {/* Pagination */}
                                {colleges.length > 0 && totalPages > 1 && (
                                    <div className="py-10 flex justify-center">
                                        <div className="flex items-center gap-1">
                                            {page > 1 && (
                                                <button
                                                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    ← Prev
                                                </button>
                                            )}
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let pageNum: number;
                                                if (totalPages <= 5) pageNum = i + 1;
                                                else if (page <= 3) pageNum = i + 1;
                                                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                                                else pageNum = page - 2 + i;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                        className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${page === pageNum
                                                            ? 'bg-primary text-white shadow-md'
                                                            : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                            {page < totalPages && (
                                                <button
                                                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    className="px-4 py-2.5 text-sm font-semibold text-primary border-2 border-primary/20 hover:bg-primary hover:text-white rounded-lg transition-all"
                                                >
                                                    Next →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CollegesListing;
