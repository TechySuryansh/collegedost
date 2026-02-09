"use client";

import React, { useEffect, useState, useRef } from 'react';
import { FaMapMarkerAlt, FaStar, FaArrowRight, FaChevronLeft, FaChevronRight, FaUniversity } from 'react-icons/fa';
import Link from 'next/link';
import api from '../api/axios';

interface FeaturedCollege {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    bannerImage?: string;
    gallery?: string[];
    location?: {
        city?: string;
        state?: string;
    };
    type?: string;
    nirfRank?: number;
    streams?: string[];
    placements?: {
        averagePackage?: string;
        highestPackage?: string;
    };
    accreditation?: {
        body?: string;
        grade?: string;
    };
}

const fallbackImages = [
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1550611343-63ba251eaeb1?q=80&w=3544&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=600&q=80",
];

const getCollegeImage = (college: FeaturedCollege, index: number): string => {
    if (college.bannerImage) return college.bannerImage;
    if (college.gallery && college.gallery.length > 0) return college.gallery[0];
    return fallbackImages[index % fallbackImages.length];
};

const FeaturedColleges: React.FC = () => {
    const [colleges, setColleges] = useState<FeaturedCollege[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const res = await api.get('/colleges?limit=12&sort=nirfRank');
                if (res.data.success) {
                    setColleges(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching featured colleges:", err);
                // Use empty array - component will show fallback
            } finally {
                setLoading(false);
            }
        };
        fetchColleges();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 380;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const SkeletonCard = () => (
        <div className="shrink-0 w-85 bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        </div>
    );

    return (
        <section className="relative bg-linear-to-b from-background-light to-white py-16 overflow-hidden z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-1 bg-primary rounded-full"></div>
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-text-main-light">
                                Featured Colleges
                            </h2>
                        </div>
                        <p className="text-text-muted-light text-sm ml-6">
                            Explore top-ranked institutions across India
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Scroll Arrows */}
                        <button
                            onClick={() => scroll('left')}
                            className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-text-muted-light hover:text-primary hover:border-primary transition-colors shadow-sm"
                            aria-label="Scroll left"
                        >
                            <FaChevronLeft className="text-sm" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-text-muted-light hover:text-primary hover:border-primary transition-colors shadow-sm"
                            aria-label="Scroll right"
                        >
                            <FaChevronRight className="text-sm" />
                        </button>
                        <Link
                            href="/tools/colleges"
                            className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors group ml-2"
                        >
                            View All
                            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <FaArrowRight className="text-xs" />
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Cards Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory"
                >
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                        : colleges.length === 0
                        ? (
                            <div className="w-full py-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <FaUniversity className="text-2xl text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-text-main-light mb-2">No Featured Colleges Available</h3>
                                <p className="text-text-muted-light text-sm mb-6">We're currently updating our featured colleges list. Check back soon!</p>
                                <Link
                                    href="/tools/colleges"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-colors shadow-md"
                                >
                                    Browse All Colleges <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        )
                        : colleges.map((college, index) => (
                            <Link
                                key={college._id}
                                href={`/colleges/${college.slug}`}
                                className="shrink-0 w-85 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-premium-hover border border-gray-100 group transition-all duration-300 snap-start"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={getCollegeImage(college, index)}
                                        alt={college.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                                    {/* NIRF Badge */}
                                    {college.nirfRank && (
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                            <FaStar className="text-yellow-500 text-xs" />
                                            <span className="text-xs font-bold text-text-main-light">
                                                NIRF #{college.nirfRank}
                                            </span>
                                        </div>
                                    )}

                                    {/* Type Badge */}
                                    {college.type && (
                                        <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            {college.type}
                                        </div>
                                    )}

                                    {/* College name overlay */}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="text-white font-display font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">
                                            {college.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5 space-y-3">
                                    {/* Location */}
                                    {college.location && (
                                        <div className="flex items-center gap-2 text-text-muted-light text-sm">
                                            <FaMapMarkerAlt className="text-primary text-xs shrink-0" />
                                            <span>
                                                {[college.location.city, college.location.state]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Tags - Streams */}
                                    {college.streams && college.streams.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {college.streams.slice(0, 3).map((stream, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium"
                                                >
                                                    {stream}
                                                </span>
                                            ))}
                                            {college.streams.length > 3 && (
                                                <span className="text-xs text-text-muted-light self-center">
                                                    +{college.streams.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Bottom row */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        {college.accreditation?.grade && (
                                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                {college.accreditation.body} {college.accreditation.grade}
                                            </span>
                                        )}
                                        {college.placements?.averagePackage && (
                                            <span className="text-xs text-text-muted-light">
                                                Avg: ₹{college.placements.averagePackage}
                                            </span>
                                        )}
                                        <span className="ml-auto text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Explore <FaArrowRight className="text-xs" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                </div>

                {/* Mobile View All */}
                <div className="sm:hidden text-center mt-6">
                    <Link
                        href="/tools/colleges"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
                    >
                        View All Colleges <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedColleges;
