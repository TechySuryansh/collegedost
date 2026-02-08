"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaChartLine, FaArrowRight, FaMapMarkerAlt, FaUniversity, FaBellSlash, FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import api from '../api/axios';
import Link from 'next/link';
import CollegeCarousel from './CollegeCarousel';

interface HeroProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    trending?: { text: string; link: string }[];
    showBadge?: boolean;
}

const HeroNew: React.FC<HeroProps> = ({
    title,
    subtitle = "Navigate your career path with personalized insights, real-time data, and expert counseling. Discover colleges, exams, and courses tailored for your success.",
    trending = [
        { text: "JEE Main Predictor", link: "/predictors/jee-main" },
        { text: "NEET 2026", link: "/exams/neet" },
        { text: "MBA Rankings", link: "/streams/management" }
    ],
    showBadge = true
}) => {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Search Suggestions Logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (search.length >= 2) {
                try {
                    const res = await api.get(`/colleges/search?q=${encodeURIComponent(search)}`);
                    if (res.data.success) {
                        setSuggestions(res.data.data);
                        setShowSuggestions(true);
                    }
                } catch (err) {
                    console.error("Search Error", err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    // Click Outside to Close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        if (search.trim()) {
            router.push(`/tools/colleges?search=${encodeURIComponent(search)}`);
            setShowSuggestions(false);
        }
    };

    return (
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-background-light min-h-[90vh] flex items-center">
            {/* College Images Carousel Background */}
            <CollegeCarousel />

            {/* Additional overlay for readability */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="blob bg-primary/10 w-96 h-96 rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="blob bg-secondary/10 w-125 h-125 rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left space-y-8">
                        {showBadge && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wide uppercase mb-2 border border-white/30">
                                <span className="mr-2 h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                                Trusted by 10M+ Students
                            </div>
                        )}

                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-lg">
                            {title || (
                                <>
                                    Empowering Your <br/>
                                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-purple-300">Academic Journey</span>
                                </>
                            )}
                        </h1>

                        <p className="text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 drop-shadow">
                            {subtitle}
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto lg:mx-0 group" ref={searchRef}>
                            <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                            <div className="relative flex items-center bg-white rounded-full shadow-xl p-2 border border-gray-100">
                                <FaSearch className="text-xl text-text-muted-light ml-4" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full bg-transparent border-0 focus:ring-0 text-text-main-light placeholder-gray-400 h-12 px-4 outline-none"
                                    placeholder="Search Colleges, Exams, Courses & more..."
                                />
                                <button 
                                    onClick={handleSearch}
                                    className="bg-primary hover:bg-secondary text-white rounded-full p-3 px-6 font-medium transition-colors shadow-lg"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Autocomplete Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                        {suggestions.map((item) => (
                                            <div
                                                key={item._id}
                                                onClick={() => router.push(`/colleges/${item.slug}`)}
                                                className="px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-primary/5 cursor-pointer flex items-center gap-4 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                    <FaUniversity />
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-bold text-text-main-light text-sm">{item.name}</h4>
                                                    <p className="text-xs text-text-muted-light flex items-center gap-1">
                                                        <FaMapMarkerAlt className="text-gray-400" /> {item.location?.city}
                                                        {item.nirfRank && <span className="ml-2 text-green-600 font-bold">• NIRF #{item.nirfRank}</span>}
                                                    </p>
                                                </div>
                                                <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">{item.type}</span>
                                            </div>
                                        ))}
                                    <div
                                        onClick={handleSearch}
                                        className="px-6 py-3 bg-gray-50 text-center text-primary font-bold text-sm cursor-pointer hover:bg-gray-100"
                                    >
                                        View all results for "{search}"
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Trending Tags */}
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                            <span className="text-sm font-medium text-white/70 self-center">Trending:</span>
                            {trending.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.link}
                                    className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-sm font-medium text-white hover:bg-white/30 hover:border-white/50 transition-colors shadow-sm"
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Feature Card */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-linear-to-r from-primary/30 to-secondary/30 rounded-4xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
                        <div className="relative glass-card rounded-4xl p-6 lg:p-8 transform transition-transform duration-500 hover:scale-[1.02]">
                            {/* Featured Image */}
                            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
                                <img 
                                    alt="Students collaborating" 
                                    className="w-full h-full object-cover transform hover:scale-110 transition duration-700" 
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <span className="bg-primary text-xs font-bold px-2 py-1 rounded mb-2 inline-block">FEATURED STORY</span>
                                    <h3 className="font-display font-bold text-xl leading-tight">Every Student Matters: Driving the Future of Education</h3>
                                </div>
                                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md rounded-full p-4 hover:bg-white/50 transition-colors group">
                                    <FaPlay className="text-2xl text-white" />
                                </button>
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-4">
                                <Link href="/tools/colleges" className="flex items-center justify-between border-b border-gray-200 pb-4 hover:border-primary transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <FaBellSlash className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-main-light">Admissions Open</p>
                                            <p className="text-xs text-text-muted-light">Check deadline for top unis</p>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-text-muted-light" />
                                </Link>
                                <Link href="/predictors" className="flex items-center justify-between hover:text-primary transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <FaChartLine className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-main-light">Rank Predictor</p>
                                            <p className="text-xs text-text-muted-light">Updated for 2026 Season</p>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-text-muted-light" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroNew;
