"use client";

import React, { useState, useEffect, useRef } from 'react';
import api from '@/api/axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaUniversity } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

import { CollegeData } from './types';
import CollegeHero from './CollegeHero';
import OverviewSection from './OverviewSection';
import CoursesSection from './CoursesSection';
import AdmissionSection from './AdmissionSection';
import PlacementsSection from './PlacementsSection';
import ScholarshipsSection from './ScholarshipsSection';
import GallerySection from './GallerySection';
import ReviewsSection from './ReviewsSection';
import CollegeSidebar from './CollegeSidebar';
import GalleryLightbox from './GalleryLightbox';

interface CollegeViewerProps {
    initialData?: CollegeData;
}

const CollegeViewer: React.FC<CollegeViewerProps> = ({ initialData }) => {
    const params = useParams();

    // Safely handle slug param (can be string | string[] | undefined)
    const rawSlug = params?.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || '';

    const [college, setCollege] = useState<CollegeData | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isShortlisted, setIsShortlisted] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // Use AuthContext for user state and protection
    const { user, protectAction } = useAuth();

    // Check if college is in user's shortlist on load/user change
    useEffect(() => {
        if (user && college?._id) {
            const savedColleges = user.savedColleges || [];
            const isSaved = savedColleges.some((c: any) =>
                (typeof c === 'string' ? c : c._id) === college._id
            );
            setIsShortlisted(isSaved);
        } else {
            setIsShortlisted(false);
        }
    }, [user, college?._id]);

    const handleToggleShortlist = async () => {
        if (!college?._id) return;

        protectAction(async () => {
            try {
                const res = await api.post('/users/bookmark', {
                    type: 'college',
                    id: college._id
                });
                if (res.data.success) {
                    setIsShortlisted(res.data.isBookmarked);
                }
            } catch (err: any) {
                console.error('Bookmark toggle failed:', err);
            }
        });
    };
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [totalReviewCount, setTotalReviewCount] = useState<number>(0);

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

    // Fetch college data
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
                if (res.data.success && res.data.data) {
                    setCollege(res.data.data);
                } else {
                    setError(res.data.message || 'College not found');
                }
            } catch (err: any) {
                const isCanceled = err?.name === 'AbortError' || err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED';
                if (isCanceled) return; // Don't update state for aborted requests
                console.error('Error fetching college:', err);
                setError(err.response?.data?.message || 'Failed to load college data');
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        if (slug) {
            fetchCollege();
        }

        return () => {
            abortController.abort();
        };
    }, [slug, initialData]);

    // Fetch reviews for the college (only once when reviews tab is first visited)
    useEffect(() => {
        if (college?._id && activeTab === 'reviews' && reviews.length === 0 && !isLoadingReviews) {
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
            const totalCount = Number(response.data?.total || 0);
            setHasMoreReviews(totalPages > 0 ? page < totalPages : false);
            setReviewsPage(page);
            if (totalCount > 0) {
                setTotalReviewCount(totalCount);
            }
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

    // --- Loading / Error / Not Found states ---
    if (loading) {
        return (
            <div className="min-h-screen bg-background-light">
                {/* Hero Banner Skeleton */}
                <div className="relative h-120 w-full bg-gray-800">
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/40 to-gray-700/30" />
                    <div className="absolute bottom-0 left-0 w-full z-10 p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl border border-white/10">
                                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        {/* Badges */}
                                        <div className="flex gap-3">
                                            <div className="h-7 w-28 bg-white/20 rounded-full animate-pulse" />
                                            <div className="h-7 w-36 bg-white/15 rounded-full animate-pulse" />
                                            <div className="h-7 w-24 bg-white/15 rounded-full animate-pulse" />
                                        </div>
                                        {/* Title */}
                                        <div className="h-10 lg:h-14 bg-white/20 rounded-xl animate-pulse w-4/5" />
                                        {/* Description */}
                                        <div className="space-y-2">
                                            <div className="h-4 bg-white/15 rounded-lg animate-pulse w-full max-w-3xl" />
                                            <div className="h-4 bg-white/10 rounded-lg animate-pulse w-3/5 max-w-2xl" />
                                        </div>
                                    </div>
                                    {/* CTA Buttons */}
                                    <div className="flex gap-4 shrink-0 w-full lg:w-auto">
                                        <div className="h-12 w-36 bg-white/15 rounded-xl animate-pulse" />
                                        <div className="h-12 w-36 bg-white/20 rounded-xl animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Tabs Skeleton */}
                <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 h-14">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded-md animate-pulse" style={{ width: `${60 + (i % 3) * 16}px` }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                        {/* Left Column */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Overview Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 space-y-5">
                                <div className="h-7 bg-gray-200 rounded-lg animate-pulse w-40" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-100 rounded-md animate-pulse w-full" />
                                    <div className="h-4 bg-gray-100 rounded-md animate-pulse w-11/12" />
                                    <div className="h-4 bg-gray-100 rounded-md animate-pulse w-4/5" />
                                    <div className="h-4 bg-gray-100 rounded-md animate-pulse w-9/12" />
                                </div>
                                {/* Key highlights grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
                                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Courses Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 space-y-5">
                                <div className="h-7 bg-gray-200 rounded-lg animate-pulse w-44" />
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="space-y-2 flex-1">
                                                <div className="h-5 bg-gray-200 rounded animate-pulse w-48" />
                                                <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
                                            </div>
                                            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Placements Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 space-y-5">
                                <div className="h-7 bg-gray-200 rounded-lg animate-pulse w-36" />
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="bg-gray-50 rounded-xl p-5 space-y-2">
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                            <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Quick Info Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-32" />
                                <div className="space-y-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                                            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                                <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
                                <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                            </div>
                            {/* Ad / CTA Card */}
                            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-3">
                                <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                                <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse mt-2" />
                            </div>
                        </div>
                    </div>
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
        { id: 'admission', label: 'Admissions' },
        { id: 'placement', label: 'Placements' },
        { id: 'scholarship', label: 'Scholarships' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'reviews', label: 'Reviews' },
    ];

    return (
        <main className="min-h-screen pb-20 bg-background-light">
            {/* Hero Banner */}
            <CollegeHero college={college} scrollToSection={scrollToSection} />

            {/* Sticky Navigation Tabs */}
            <div className="sticky top-16 z-30 bg-surface-light border-b border-gray-200 shadow-sm transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar h-14">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                className={`h-full flex items-center px-4 text-sm whitespace-nowrap font-medium transition-all ${activeTab === tab.id
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

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                    {/* Left Content Column */}
                    <div className="lg:col-span-8 space-y-10">
                        <OverviewSection college={college} sectionRef={sectionRefs.overview} />
                        <CoursesSection college={college} sectionRef={sectionRefs.courses} scrollToSection={scrollToSection} />
                        <AdmissionSection college={college} sectionRef={sectionRefs.admission} />
                        <PlacementsSection college={college} sectionRef={sectionRefs.placement} />
                        <ScholarshipsSection sectionRef={sectionRefs.scholarship} scrollToSection={scrollToSection} />
                        <GallerySection
                            college={college}
                            sectionRef={sectionRefs.gallery}
                            onOpenLightbox={(index) => {
                                setIsGalleryOpen(true);
                                setSelectedImageIndex(index);
                            }}
                        />
                        <ReviewsSection
                            college={college}
                            sectionRef={sectionRefs.reviews}
                            reviews={reviews}
                            isLoadingReviews={isLoadingReviews}
                            hasMoreReviews={hasMoreReviews}
                            onLoadMore={loadMoreReviews}
                            totalReviewCount={totalReviewCount}
                        />
                    </div>

                    {/* Right Sidebar Column */}
                    <div className="lg:col-span-4">
                        <CollegeSidebar
                            college={college}
                            isShortlisted={isShortlisted}
                            onToggleShortlist={handleToggleShortlist}
                            scrollToSection={scrollToSection}
                        />
                    </div>
                </div>
            </div>

            {/* Gallery Lightbox Modal */}
            {isGalleryOpen && college.gallery && college.gallery.length > 0 && (
                <GalleryLightbox
                    images={college.gallery}
                    selectedIndex={selectedImageIndex}
                    onClose={() => setIsGalleryOpen(false)}
                    onChangeIndex={setSelectedImageIndex}
                />
            )}
        </main>
    );
};

export default CollegeViewer;
