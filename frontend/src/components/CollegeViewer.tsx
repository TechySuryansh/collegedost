"use client";

import React, { useState, useEffect, useRef } from 'react';
import api from '@/api/axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import {
    FaMapMarkerAlt, FaBuilding, FaDownload, FaArrowRight,
    FaUniversity, FaStar, FaPhone, FaEnvelope, FaHeart,
    FaGraduationCap, FaChalkboardTeacher, FaMapMarkedAlt,
    FaTrophy, FaUsers, FaCheckCircle, FaCalendarAlt,
    FaRupeeSign, FaBriefcase, FaImage, FaQuoteLeft,
    FaClipboardList, FaFileAlt, FaUserGraduate, FaChartLine,
    FaBuilding as FaCompany, FaThumbsUp, FaThumbsDown
} from 'react-icons/fa';

// Define Types for College Data
interface CollegeData {
    _id: string;
    slug: string;
    name: string;
    bannerImage?: string;
    logo?: string;
    nirfRank?: number;
    rating?: number | string;
    location?: { city: string; state: string; address?: string };
    type?: string;
    estYear?: string | number;
    accreditation?: { grade: string; body?: string };
    overview?: string;
    highlights?: string[];
    gallery?: string[];
    coursesOffered?: any[];
    detailedFees?: any[];
    placementStats?: any;
    placements?: any;
    infrastructure?: any;
    cutoff?: any[];
    admissionProcess?: any;
    website?: string;
    phone?: string;
    email?: string;
    streams?: string[];
    facilities?: string[];
    faqs?: any[];
    facultyCount?: number;
    totalFaculty?: number;
    studentCount?: number;
    campusSize?: string;
    landArea?: string;
    placementHistory?: Array<{
        year: number;
        highestPackage: string;
        averagePackage: string;
        placedPercentage: string;
    }>;
}

interface CollegeViewerProps {
    initialData?: CollegeData;
}

const CollegeViewer: React.FC<CollegeViewerProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    
    // Safely handle slug param (can be string | string[] | undefined)
    const rawSlug = params?.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || '';

    const [college, setCollege] = useState<CollegeData | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isShortlisted, setIsShortlisted] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    
    const sectionRefs = {
        overview: useRef<HTMLDivElement>(null),
        courses: useRef<HTMLDivElement>(null),
        admission: useRef<HTMLDivElement>(null),
        placement: useRef<HTMLDivElement>(null),
        scholarship: useRef<HTMLDivElement>(null),
        gallery: useRef<HTMLDivElement>(null),
        reviews: useRef<HTMLDivElement>(null),
    };

    // Dynamic navigation - IntersectionObserver to highlight active section on scroll
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveTab(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sectionRefs).forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => observer.disconnect();
    }, [college]);

    useEffect(() => {
        if (initialData) return;
        
        const abortController = new AbortController();
        
        const fetchCollege = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get(`/colleges/${slug}`, {
                    signal: abortController.signal
                });
                if (res.data.success) {
                    setCollege(res.data.data);
                }
            } catch (err: any) {
                const isCanceled = err?.name === 'AbortError' || err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED';
                if (!isCanceled) {
                    console.error('Error fetching college:', err);
                    setError(err.response?.data?.message || 'Failed to load college data');
                }
            } finally {
                setLoading(false);
            }
        };
        
        if (slug) {
            fetchCollege();
        }

        return () => {
            abortController.abort();
        };
    }, [slug, initialData]);

    // Fetch reviews for the college
    useEffect(() => {
        if (college?._id && activeTab === 'reviews') {
            fetchReviews();
        }
    }, [college?._id, activeTab]);

    const fetchReviews = async (page: number = 1) => {
        if (!college?._id) return;
        
        try {
            setIsLoadingReviews(true);
            const response = await api.get(`/reviews/college/${college._id}?page=${page}&limit=5`);
            const reviewsData = response.data?.data || [];
            
            if (page === 1) {
                setReviews(reviewsData);
            } else {
                setReviews(prev => [...prev, ...reviewsData]);
            }
            
            const totalPages = Number(response.data?.pages || 0);
            setHasMoreReviews(totalPages > 0 ? page < totalPages : false);
            setReviewsPage(page);
        } catch (error: any) {
            const isCanceled = error?.name === 'AbortError' || error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED';
            if (!isCanceled) {
                console.error('Error fetching reviews:', error);
            }
        } finally {
            setIsLoadingReviews(false);
        }
    };

    const loadMoreReviews = () => {
        if (!isLoadingReviews && hasMoreReviews) {
            fetchReviews(reviewsPage + 1);
        }
    };

    const scrollToSection = (sectionId: string) => {
        setActiveTab(sectionId);
        const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
        if (ref?.current) {
            const offset = 140; // Account for sticky headers
            const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-background-light">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent"></div>
                    <p className="text-text-muted-light font-medium">Loading college details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-background-light">
                <div className="flex flex-col items-center gap-4 max-w-md text-center">
                    <div className="text-red-500 text-6xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-text-main-light">Error Loading College</h2>
                    <p className="text-text-muted-light">{error}</p>
                    <Link href="/tools/colleges" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition">
                        Browse All Colleges
                    </Link>
                </div>
            </div>
        );
    }

    if (!college) {
        return (
            <div className="min-h-screen text-center bg-background-light flex flex-col items-center justify-center">
                <FaUniversity className="text-8xl text-gray-300 mb-6" />
                <h2 className="text-3xl font-display font-bold text-text-main-light mb-2">College Not Found</h2>
                <p className="text-text-muted-light mb-6">The college you are looking for does not exist or has been moved.</p>
                <Link href="/tools/colleges" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition shadow-lg shadow-primary/30">
                    Browse Colleges
                </Link>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'courses', label: 'Courses & Fees' },
        { id: 'admission', label: 'Admission 2026' },
        { id: 'placement', label: 'Placements' },
        { id: 'scholarship', label: 'Scholarships' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'reviews', label: 'Reviews' },
    ];

    // Sample scholarship data (can be moved to API later)
    const scholarships = [
        {
            type: 'Merit Based',
            title: 'Institute Merit-cum-Means',
            description: 'Awarded to 25% of students admitted. Exemption from tuition fees and pocket allowance of ₹1000/month.',
            icon: FaGraduationCap,
            color: 'green'
        },
        {
            type: 'Category Based',
            title: 'SC/ST Scholarship',
            description: 'Free messing and pocket allowance of ₹250/month over and above tuition fee exemption.',
            icon: FaUsers,
            color: 'blue'
        }
    ];

    // Key highlights derived from college data
    const keyHighlights = [
        { label: 'Institute Type', value: college.type || 'N/A', icon: FaUniversity, colorClass: 'bg-indigo-50 text-primary' },
        { label: 'Total Faculty', value: college.totalFaculty || college.facultyCount ? `${college.totalFaculty || college.facultyCount}+ Faculty` : 'N/A', icon: FaChalkboardTeacher, colorClass: 'bg-violet-50 text-secondary' },
        { label: 'Campus Size', value: college.campusSize || college.landArea || 'N/A', icon: FaMapMarkedAlt, colorClass: 'bg-pink-50 text-pink-600' },
        { label: 'Accreditation', value: college.accreditation ? `${college.accreditation.body || 'NAAC'} '${college.accreditation.grade}'` : 'N/A', icon: FaTrophy, colorClass: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <main className="min-h-screen pb-20 bg-background-light">
            {/* --- HERO SECTION --- */}
            <div className="relative h-120 w-full group">
                {/* Banner Image */}
                <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                    {college.bannerImage ? (
                        <img 
                            src={college.bannerImage} 
                            alt={`${college.name} Campus`} 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                            <FaUniversity className="text-white/20 text-9xl" />
                        </div>
                    )}
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full z-10 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Glass Card */}
                        <div className="glass-card bg-white/20! rounded-2xl p-6 lg:p-8 border-white/20! shadow-2xl backdrop-blur-xl relative overflow-hidden">
                            {/* Top gradient line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-secondary to-primary"></div>
                            
                            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                                {/* College Info */}
                                <div className="text-white space-y-3">
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="bg-white text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            NIRF RANK #{college.nirfRank || 'N/A'}
                                        </span>
                                        <span className="bg-black/30 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-xs" /> {college.location?.city || 'City'}, {college.location?.state || 'State'}
                                        </span>
                                        <span className="bg-black/30 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <FaBuilding className="text-xs" /> Estd. {college.estYear || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    {/* Title */}
                                    <h1 className="text-3xl lg:text-5xl font-display font-bold tracking-tight text-white drop-shadow-sm">
                                        {college.name}
                                    </h1>
                                    
                                    {/* Description */}
                                    <p className="text-white/90 max-w-3xl text-sm lg:text-base font-medium leading-relaxed drop-shadow-sm line-clamp-2">
                                        {college.overview 
                                            ? college.overview.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
                                            : 'A premier institution offering undergraduate, postgraduate and doctoral programs.'}
                                    </p>
                                </div>
                                
                                {/* CTA Buttons */}
                                <div className="flex gap-4 shrink-0 w-full lg:w-auto">
                                    <button 
                                        onClick={() => college.website ? window.open(college.website, '_blank') : scrollToSection('overview')}
                                        className="flex-1 lg:flex-none bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg backdrop-blur-md flex items-center justify-center gap-2"
                                    >
                                        <FaDownload className="text-lg" /> Brochure
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection('admission')}
                                        className="flex-1 lg:flex-none bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                                    >
                                        Apply Now <FaArrowRight className="font-bold" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- STICKY NAVIGATION TABS --- */}
            <div className="sticky top-16 z-30 bg-surface-light border-b border-gray-200 shadow-sm transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar h-14">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                className={`h-full flex items-center px-4 text-sm whitespace-nowrap font-medium transition-all ${
                                    activeTab === tab.id 
                                        ? 'text-primary border-b-[3px] border-primary font-bold bg-primary/5' 
                                        : 'text-text-muted-light hover:text-primary hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    
                    {/* LEFT CONTENT COLUMN */}
                    <div className="lg:col-span-8 space-y-10">
                        
                        {/* OVERVIEW SECTION */}
                        <div 
                            ref={sectionRefs.overview}
                            id="overview"
                            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
                        >
                            <h2 className="text-2xl font-display font-bold text-text-main-light mb-4 flex items-center gap-3">
                                <span className="w-2 h-8 bg-linear-to-b from-primary to-secondary rounded-full"></span>
                                About {college.name.split(',')[0]}
                            </h2>
                            <div className="prose max-w-none text-text-muted-light text-sm leading-7">
                                {college.overview ? (
                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(college.overview) }} />
                                ) : (
                                    <p>
                                        {college.name} is one of the foremost institutes of national importance in higher technological education, 
                                        basic and applied research. The Institute has academic departments and advanced research centres in various 
                                        disciplines of engineering and pure sciences.
                                    </p>
                                )}
                            </div>
                            
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                                <div className="p-4 rounded-xl bg-background-light text-center border border-gray-100">
                                    <div className="text-primary font-bold text-3xl mb-1">
                                        {college.nirfRank ? `#${college.nirfRank}` : 'N/A'}
                                    </div>
                                    <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold">NIRF Engineering</div>
                                </div>
                                <div className="p-4 rounded-xl bg-background-light text-center border border-gray-100">
                                    <div className="text-primary font-bold text-3xl mb-1">
                                        {college.facultyCount || college.totalFaculty ? `${college.facultyCount || college.totalFaculty}+` : 'N/A'}
                                    </div>
                                    <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold">Faculty Members</div>
                                </div>
                                <div className="p-4 rounded-xl bg-background-light text-center border border-gray-100">
                                    <div className="text-primary font-bold text-3xl mb-1">
                                        {college.studentCount ? `${college.studentCount}+` : 'N/A'}
                                    </div>
                                    <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold">Students Enrolled</div>
                                </div>
                                <div className="p-4 rounded-xl bg-background-light text-center border border-gray-100">
                                    <div className="text-primary font-bold text-3xl mb-1">
                                        {college.placements?.averagePackage || college.placementStats?.averagePackage || 'N/A'}
                                    </div>
                                    <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold">Avg Package (INR)</div>
                                </div>
                            </div>
                        </div>

                        {/* COURSES SECTION */}
                        <div 
                            ref={sectionRefs.courses}
                            id="courses"
                            className="bg-surface-light rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-colors duration-300"
                        >
                            <div className="p-6 lg:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light">
                                    Courses, Fees &amp; Eligibility
                                </h2>
                                <button 
                                    onClick={() => scrollToSection('admission')}
                                    className="text-xs font-bold text-primary hover:text-secondary uppercase tracking-wide flex items-center gap-1"
                                >
                                    View All Courses <FaArrowRight className="text-xs" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-xs uppercase text-text-muted-light font-bold tracking-wider">
                                        <tr>
                                            <th className="p-5 pl-8">Course</th>
                                            <th className="p-5">Total Tuition Fees</th>
                                            <th className="p-5">Eligibility Criteria</th>
                                            <th className="p-5 pr-8 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {college.coursesOffered && college.coursesOffered.length > 0 ? (
                                            college.coursesOffered.slice(0, 5).map((course: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-5 pl-8">
                                                        <div className="font-bold text-base text-text-main-light mb-1">{course.courseName}</div>
                                                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                                                            {course.duration || '4 Years'} | Full Time
                                                        </div>
                                                    </td>
                                                    <td className="p-5 font-medium text-text-main-light">
                                                        ₹ {course.fee ? course.fee.toLocaleString() : 'N/A'}
                                                    </td>
                                                    <td className="p-5 text-text-muted-light max-w-xs leading-snug">
                                                        {course.eligibility || 'Check eligibility'}
                                                    </td>
                                                    <td className="p-5 pr-8 text-right">
                                                        <button 
                                                            onClick={() => scrollToSection('admission')}
                                                            className="text-primary font-bold hover:text-secondary text-xs uppercase border border-primary/20 hover:border-primary px-3 py-1.5 rounded transition-all"
                                                        >
                                                            Apply Now
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <>
                                                <tr className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-5 pl-8">
                                                        <div className="font-bold text-base text-text-main-light mb-1">B.Tech</div>
                                                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">4 Years | Full Time</div>
                                                    </td>
                                                    <td className="p-5 font-medium text-text-main-light">₹ 8.00 Lakhs</td>
                                                    <td className="p-5 text-text-muted-light max-w-xs leading-snug">10+2 with 75% aggregate + JEE Advanced Rank</td>
                                                    <td className="p-5 pr-8 text-right"><button onClick={() => scrollToSection('admission')} className="text-primary font-bold hover:text-secondary text-xs uppercase border border-primary/20 hover:border-primary px-3 py-1.5 rounded transition-all">Apply Now</button></td>
                                                </tr>
                                                <tr className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-5 pl-8">
                                                        <div className="font-bold text-base text-text-main-light mb-1">MBA</div>
                                                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">2 Years | Full Time</div>
                                                    </td>
                                                    <td className="p-5 font-medium text-text-main-light">₹ 4.50 Lakhs</td>
                                                    <td className="p-5 text-text-muted-light max-w-xs leading-snug">Graduation with 60% + CAT Score</td>
                                                    <td className="p-5 pr-8 text-right"><button onClick={() => scrollToSection('admission')} className="text-primary font-bold hover:text-secondary text-xs uppercase border border-primary/20 hover:border-primary px-3 py-1.5 rounded transition-all">Apply Now</button></td>
                                                </tr>
                                                <tr className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-5 pl-8">
                                                        <div className="font-bold text-base text-text-main-light mb-1">M.Tech</div>
                                                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">2 Years | Full Time</div>
                                                    </td>
                                                    <td className="p-5 font-medium text-text-main-light">₹ 1.20 Lakhs</td>
                                                    <td className="p-5 text-text-muted-light max-w-xs leading-snug">Graduation + GATE Score</td>
                                                    <td className="p-5 pr-8 text-right"><button onClick={() => scrollToSection('admission')} className="text-primary font-bold hover:text-secondary text-xs uppercase border border-primary/20 hover:border-primary px-3 py-1.5 rounded transition-all">Apply Now</button></td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ADMISSION 2026 SECTION */}
                        <div 
                            ref={sectionRefs.admission}
                            id="admission"
                            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
                        >
                            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-linear-to-b from-primary to-blue-500 rounded-full"></span>
                                Admission 2026
                            </h2>
                            
                            {/* Important Dates */}
                            <div className="mb-8">
                                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                                    <FaCalendarAlt className="text-primary" /> Important Dates
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                        <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Application Opens</div>
                                        <div className="font-bold text-text-main-light">January 2026</div>
                                    </div>
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                        <div className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Application Deadline</div>
                                        <div className="font-bold text-text-main-light">March 2026</div>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                        <div className="text-xs text-orange-600 font-medium uppercase tracking-wide mb-1">Entrance Exam</div>
                                        <div className="font-bold text-text-main-light">April 2026</div>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                                        <div className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">Counselling Starts</div>
                                        <div className="font-bold text-text-main-light">June 2026</div>
                                    </div>
                                </div>
                            </div>

                            {/* Admission Process */}
                            <div className="mb-8">
                                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                                    <FaClipboardList className="text-primary" /> Admission Process
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { step: 1, title: 'Register Online', desc: 'Create an account on the official admission portal' },
                                        { step: 2, title: 'Fill Application Form', desc: 'Complete the application with personal & academic details' },
                                        { step: 3, title: 'Appear for Entrance Exam', desc: 'Take the required entrance examination (JEE/CAT/GATE)' },
                                        { step: 4, title: 'Document Verification', desc: 'Submit required documents for verification' },
                                        { step: 5, title: 'Counselling & Seat Allotment', desc: 'Participate in counselling and accept seat offer' },
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                                            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                                                {item.step}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-text-main-light">{item.title}</h4>
                                                <p className="text-sm text-text-muted-light">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Required Documents */}
                            <div>
                                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                                    <FaFileAlt className="text-primary" /> Required Documents
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        '10th & 12th Marksheets',
                                        'Entrance Exam Scorecard',
                                        'Identity Proof (Aadhar/PAN)',
                                        'Passport Size Photos',
                                        'Category Certificate (if applicable)',
                                        'Migration Certificate',
                                        'Transfer Certificate',
                                        'Gap Certificate (if applicable)'
                                    ].map((doc, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-text-muted-light">
                                            <FaCheckCircle className="text-green-500" />
                                            {doc}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* PLACEMENTS SECTION */}
                        <div 
                            ref={sectionRefs.placement}
                            id="placement"
                            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
                        >
                            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-linear-to-b from-green-500 to-emerald-600 rounded-full"></span>
                                Placements
                            </h2>
                            
                            {/* Placement Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 text-center">
                                    <FaRupeeSign className="text-2xl text-green-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-text-main-light">
                                        {college.placements?.highestPackage || college.placementStats?.highestPackage || '2.1 Cr'}
                                    </div>
                                    <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Highest Package</div>
                                </div>
                                <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 text-center">
                                    <FaRupeeSign className="text-2xl text-blue-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-text-main-light">
                                        {college.placements?.averagePackage || college.placementStats?.averagePackage || '45 LPA'}
                                    </div>
                                    <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Average Package</div>
                                </div>
                                <div className="bg-linear-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-5 text-center">
                                    <FaUserGraduate className="text-2xl text-purple-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-text-main-light">
                                        {college.placements?.placedPercentage || college.placementStats?.placedPercentage || '95%'}
                                    </div>
                                    <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Students Placed</div>
                                </div>
                                <div className="bg-linear-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-5 text-center">
                                    <FaCompany className="text-2xl text-orange-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-text-main-light">
                                        {college.placements?.recruitersCount || college.placementStats?.recruitersCount || '500+'}
                                    </div>
                                    <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Recruiters</div>
                                </div>
                            </div>

                            {/* Top Recruiters */}
                            <div className="mb-8">
                                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                                    <FaBriefcase className="text-primary" /> Top Recruiters
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Goldman Sachs', 'McKinsey', 'BCG', 'Uber', 'Adobe', 'Flipkart', 'Qualcomm'].map((company, idx) => (
                                        <span 
                                            key={idx} 
                                            className="bg-gray-100 border border-gray-200 text-text-main-light px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                                        >
                                            {company}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Placement Trends */}
                            <div>
                                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                                    <FaChartLine className="text-primary" /> Placement Trends (Last 3 Years)
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 text-xs uppercase text-text-muted-light font-bold tracking-wider">
                                            <tr>
                                                <th className="p-4">Year</th>
                                                <th className="p-4">Highest (LPA)</th>
                                                <th className="p-4">Average (LPA)</th>
                                                <th className="p-4">Placement %</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {college.placementHistory && college.placementHistory.length > 0 ? (
                                                college.placementHistory.slice(0, 3).map((record, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="p-4 font-medium">{record.year}</td>
                                                        <td className="p-4 text-green-600 font-bold">{record.highestPackage}</td>
                                                        <td className="p-4">{record.averagePackage}</td>
                                                        <td className="p-4">{record.placedPercentage}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="p-4 text-center text-text-muted-light">
                                                        Placement data not available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* SCHOLARSHIPS SECTION */}
                        <div 
                            ref={sectionRefs.scholarship}
                            id="scholarship"
                            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
                        >
                            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-linear-to-b from-secondary to-pink-500 rounded-full"></span>
                                Scholarships &amp; Financial Aid
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {scholarships.map((scholarship, idx) => {
                                    const Icon = scholarship.icon;
                                    const colorClasses = scholarship.color === 'green' 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-blue-100 text-blue-600';
                                    const badgeClasses = scholarship.color === 'green'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-blue-100 text-blue-700';
                                    
                                    return (
                                        <div 
                                            key={idx}
                                            className="border border-gray-200 rounded-2xl p-6 hover:border-primary/50 hover:bg-gray-50 transition-all group"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`${colorClasses} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                                                    <Icon className="text-xl" />
                                                </div>
                                                <span className={`${badgeClasses} text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide`}>
                                                    {scholarship.type}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg text-text-main-light mb-2">{scholarship.title}</h3>
                                            <p className="text-sm text-text-muted-light mb-4 leading-relaxed">{scholarship.description}</p>
                                            <button 
                                                onClick={() => scrollToSection('admission')}
                                                className="text-primary text-xs font-bold uppercase tracking-wide hover:text-secondary flex items-center gap-1"
                                            >
                                                View Eligibility <FaArrowRight className="text-xs" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* GALLERY SECTION */}
                        <div 
                            ref={sectionRefs.gallery}
                            id="gallery"
                            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
                        >
                            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-linear-to-b from-pink-500 to-rose-600 rounded-full"></span>
                                Campus Gallery
                            </h2>
                            
                            {college.gallery && college.gallery.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {college.gallery.map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer border border-gray-200"
                                        >
                                            <img 
                                                src={img} 
                                                alt={`Campus ${idx + 1}`} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <FaImage className="text-white text-3xl" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { title: 'Main Building', color: 'from-blue-400 to-indigo-600' },
                                        { title: 'Library', color: 'from-green-400 to-emerald-600' },
                                        { title: 'Sports Complex', color: 'from-orange-400 to-red-500' },
                                        { title: 'Auditorium', color: 'from-purple-400 to-violet-600' },
                                        { title: 'Labs', color: 'from-cyan-400 to-blue-600' },
                                        { title: 'Hostel', color: 'from-pink-400 to-rose-600' },
                                    ].map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`relative aspect-video rounded-xl overflow-hidden group cursor-pointer bg-linear-to-br ${item.color}`}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <FaUniversity className="text-white/30 text-6xl" />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3">
                                                <span className="text-white text-sm font-medium">{item.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button 
                                onClick={() => {
                                    if (college.gallery && college.gallery.length > 0) {
                                        setIsGalleryOpen(true);
                                        setSelectedImageIndex(0);
                                    }
                                }}
                                className="mt-6 text-primary font-bold text-sm uppercase tracking-wide hover:text-secondary flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!college.gallery || college.gallery.length === 0}
                            >
                                View All Photos <FaArrowRight />
                            </button>
                        </div>

                        {/* REVIEWS SECTION */}
                        <div 
                            ref={sectionRefs.reviews}
                            id="reviews"
                            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
                        >
                            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-linear-to-b from-yellow-500 to-orange-500 rounded-full"></span>
                                Student Reviews
                            </h2>

                            {/* Rating Overview */}
                            <div className="flex flex-col md:flex-row gap-6 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-center md:border-r md:pr-6 border-gray-200">
                                    <div className="text-5xl font-bold text-text-main-light mb-1">
                                        {college.rating || 'N/A'}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                                        {[1,2,3,4,5].map(i => (
                                            <FaStar key={i} className={i <= Math.floor(Number(college.rating || 0)) ? '' : 'text-gray-300'} />
                                        ))}
                                    </div>
                                    <div className="text-sm text-text-muted-light">
                                        Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {[
                                        { label: 'Academics', rating: 4.7 },
                                        { label: 'Placements', rating: 4.8 },
                                        { label: 'Infrastructure', rating: 4.3 },
                                        { label: 'Campus Life', rating: 4.5 },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <span className="text-sm text-text-muted-light w-28">{item.label}</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-linear-to-r from-primary to-secondary h-2 rounded-full" 
                                                    style={{ width: `${(item.rating / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-text-main-light w-8">{item.rating}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Individual Reviews */}
                            <div className="space-y-6">
                                {isLoadingReviews && reviews.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-2"></div>
                                        <p className="text-text-muted-light text-sm">Loading reviews...</p>
                                    </div>
                                ) : reviews.length > 0 ? (
                                    reviews.map((review, idx) => (
                                        <div key={idx} className="border border-gray-100 rounded-xl p-5 hover:border-primary/30 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                                        {(review.authorName || review.user?.name || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-text-main-light">{review.authorName || review.user?.name || 'Anonymous'}</h4>
                                                        <p className="text-xs text-text-muted-light">
                                                            {review.courseName ? `${review.courseName}${review.graduationYear ? `, ${review.graduationYear}` : ''}` : 'Student'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    {[1,2,3,4,5].map(i => (
                                                        <FaStar key={i} className={`text-sm ${i <= (review.overallRating || 0) ? '' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 mb-4">
                                                <FaQuoteLeft className="text-gray-200 text-xl shrink-0 mt-1" />
                                                <p className="text-sm text-text-muted-light leading-relaxed">{review.reviewText || review.comment}</p>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-text-muted-light">
                                                <span>{review.date || new Date(review.createdAt).toLocaleDateString()}</span>
                                                <div className="flex items-center gap-4">
                                                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                                        <FaThumbsUp /> {review.helpfulCount || 0} helpful
                                                    </button>
                                                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                                        <FaThumbsDown /> Report
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-text-muted-light">
                                        <p>No reviews available for this college yet.</p>
                                    </div>
                                )}
                            </div>

                            {hasMoreReviews && (
                                <button 
                                    onClick={loadMoreReviews}
                                    disabled={isLoadingReviews}
                                    className="mt-6 w-full py-3 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoadingReviews ? 'Loading...' : 'Load More Reviews'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR COLUMN */}
                    <div className="lg:col-span-4">
                        <div className="space-y-6">
                            
                            {/* KEY HIGHLIGHTS CARD */}
                            <div className="bg-surface-light rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-200">
                                <h3 className="font-display font-bold text-lg mb-6 text-text-main-light flex items-center gap-2">
                                    <FaStar className="text-yellow-500" /> Key Highlights
                                </h3>
                                <ul className="space-y-5">
                                    {keyHighlights.map((item, idx) => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={idx} className="flex items-start gap-4">
                                                <div className={`p-2.5 rounded-xl ${item.colorClass}`}>
                                                    <Icon className="text-lg" />
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-medium text-text-muted-light uppercase tracking-wide mb-0.5">
                                                        {item.label}
                                                    </span>
                                                    <span className="font-bold text-sm text-text-main-light">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                                
                                {/* Action Buttons */}
                                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                                    <button 
                                        onClick={() => college.website ? window.open(college.website, '_blank') : scrollToSection('overview')}
                                        className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                                    >
                                        <FaDownload className="text-xl group-hover:scale-110 transition-transform" /> Download Brochure
                                    </button>
                                    <button 
                                        onClick={() => setIsShortlisted(!isShortlisted)}
                                        className="w-full bg-white border border-gray-200 text-text-main-light font-bold py-3.5 px-4 rounded-xl transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
                                    >
                                        <FaHeart className={`text-xl ${isShortlisted ? 'text-red-500' : 'text-gray-400'}`} /> 
                                        {isShortlisted ? 'Saved to Shortlist' : 'Save to Shortlist'}
                                    </button>
                                </div>
                            </div>

                            {/* ADMISSION HELP DESK CARD */}
                            <div className="bg-linear-to-br from-gray-900 to-indigo-900 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-colors"></div>
                                
                                <h3 className="font-display font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                                    <FaPhone className="text-2xl" /> Admission Help Desk
                                </h3>
                                <p className="text-indigo-200 text-xs mb-6 relative z-10">
                                    Have queries about admission process? Contact our expert counselors.
                                </p>
                                
                                <div className="space-y-4 relative z-10">
                                    {college.phone && (
                                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                                            <div className="bg-white/20 p-2 rounded-full">
                                                <FaPhone className="text-white text-sm" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-indigo-200 uppercase tracking-wide">Call Us</div>
                                                <span className="text-sm font-bold">
                                                    {college.phone}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                                        <div className="bg-white/20 p-2 rounded-full">
                                            <FaEnvelope className="text-white text-sm" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-indigo-200 uppercase tracking-wide">Email Us</div>
                                            <span className="text-sm font-bold">
                                                {college.email || 'support@collegedost.com'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Lightbox Modal */}
            {isGalleryOpen && college.gallery && college.gallery.length > 0 && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setIsGalleryOpen(false)}
                >
                    <button
                        onClick={() => setIsGalleryOpen(false)}
                        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors z-10"
                    >
                        ×
                    </button>
                    
                    <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={college.gallery[selectedImageIndex]} 
                            alt={`Gallery ${selectedImageIndex + 1}`}
                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />
                        
                        {college.gallery.length > 1 && (
                            <>
                                <button
                                    onClick={() => setSelectedImageIndex((prev) => 
                                        prev === 0 ? college.gallery!.length - 1 : prev - 1
                                    )}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => setSelectedImageIndex((prev) => 
                                        prev === college.gallery!.length - 1 ? 0 : prev + 1
                                    )}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                                >
                                    →
                                </button>
                                
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                                    {selectedImageIndex + 1} / {college.gallery.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default CollegeViewer;
