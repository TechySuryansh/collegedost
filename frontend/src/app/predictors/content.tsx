"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FaSearch, FaUsers, FaStar, FaChevronRight } from 'react-icons/fa';

// ── All predictors in a flat list ──────────────────────────────────────
const allPredictors = [
    {
        id: 'jee-main',
        name: 'JEE Main',
        shortName: 'JEE',
        subtitle: 'National Level Exam',
        category: 'Engineering',
        usersCount: '2.5M+',
        rating: '4.8',
        href: '/predictors/jee-main-predictor',
        featured: true,
    },
    {
        id: 'bitsat',
        name: 'BITSAT',
        shortName: 'BIT',
        subtitle: 'Birla Institute of Tech',
        category: 'Engineering',
        usersCount: '450K+',
        rating: '4.6',
        href: '/predictors/bitsat-predictor',
        featured: false,
    },
    {
        id: 'viteee',
        name: 'VITEEE',
        shortName: 'VIT',
        subtitle: 'Vellore Institute of Tech',
        category: 'Engineering',
        usersCount: '320K+',
        rating: '4.5',
        href: '/predictors/viteee-predictor',
        featured: false,
    },
    {
        id: 'neet-ug',
        name: 'NEET UG',
        shortName: 'NEET',
        subtitle: 'National Eligibility Test',
        category: 'Medical',
        usersCount: '1.8M+',
        rating: '4.9',
        href: '/predictors/neet-predictor',
        featured: true,
    },
    {
        id: 'aiims',
        name: 'AIIMS INI-CET',
        shortName: 'AIIMS',
        subtitle: 'Postgraduate Medical',
        category: 'Medical',
        usersCount: '120K+',
        rating: '4.7',
        href: '/predictors/aiims-predictor',
        featured: false,
    },
    {
        id: 'cat',
        name: 'CAT',
        shortName: 'CAT',
        subtitle: 'Common Admission Test',
        category: 'Management',
        usersCount: '200K+',
        rating: '4.7',
        href: '/predictors/cat-predictor',
        featured: true,
    },
    {
        id: 'clat',
        name: 'CLAT',
        shortName: 'CLAT',
        subtitle: 'Common Law Admission',
        category: 'Law',
        usersCount: '80K+',
        rating: '4.6',
        href: '/predictors/clat-predictor',
        featured: false,
    },
    {
        id: 'gate',
        name: 'GATE',
        shortName: 'GATE',
        subtitle: 'Graduate Aptitude Test',
        category: 'Engineering',
        usersCount: '900K+',
        rating: '4.7',
        href: '/predictors/gate-predictor',
        featured: false,
    },
    {
        id: 'mht-cet',
        name: 'MHT CET',
        shortName: 'CET',
        subtitle: 'Maharashtra State Entrance',
        category: 'Engineering',
        usersCount: '1.2M+',
        rating: '4.8',
        href: '/predictors/mht-cet-predictor',
        featured: true,
    },
];

const categories = ['All', ...Array.from(new Set(allPredictors.map(p => p.category)))];

// ── Component ──────────────────────────────────────────────────────────
export default function PredictorsPageContent() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = useMemo(() => {
        return allPredictors.filter(p => activeCategory === 'All' || p.category === activeCategory);
    }, [activeCategory]);

    return (
        <>
            {/* ── Hero Section ─────────────────────────────────────────── */}
            <section className="relative bg-white border-b border-gray-200 overflow-hidden pt-16 pb-6">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-linear-to-br from-teal-50/50 to-amber-50/50 pointer-events-none" />
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold tracking-wide uppercase mb-6">
                        <span className="text-sm">✨</span>
                        AI-Powered Predictions
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-text-main-light mb-6 leading-tight">
                        Predict Your{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                            Admission Chances
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-muted-light max-w-2xl mx-auto mb-10">
                        Enter your rank or score to find out the best colleges you can get into. Updated with the latest 2026 cut-off data.
                    </p>
                </div>
            </section>

            {/* ── Main Content ─────────────────────────────────────────── */}
            <main className="py-16 bg-background-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-3 mb-10">
                        {categories.map(cat => (
                            <button
                                type="button"
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white text-text-muted-light border border-gray-200 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Flat Grid of All Predictors */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map(predictor => (
                                <div
                                    key={predictor.id}
                                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group relative overflow-hidden"
                                >
                                    {/* Badge */}
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            Updated 2026
                                        </span>
                                    </div>

                                    {/* Exam Info */}
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                                            <span className="font-display font-black text-2xl text-gray-700">
                                                {predictor.shortName}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-text-main-light group-hover:text-primary transition-colors">
                                                {predictor.name}
                                            </h3>
                                            <p className="text-sm text-text-muted-light">{predictor.subtitle}</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-sm text-text-muted-light mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <FaUsers className="text-lg" />
                                            <span>{predictor.usersCount} Used</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <div className="flex items-center gap-1.5">
                                            <FaStar className="text-lg text-yellow-500" />
                                            <span>{predictor.rating}/5</span>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href={predictor.href}
                                        className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all bg-primary text-white hover:bg-secondary shadow-lg shadow-primary/20"
                                    >
                                        Start Predicting <FaChevronRight className="text-xs" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                                <FaSearch className="text-3xl text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main-light mb-2">No predictors found</h3>
                            <p className="text-text-muted-light mb-6">
                                Try a different search term or clear your filters.
                            </p>
                            <button
                                type="button"
                                onClick={() => setActiveCategory('All')}
                                className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-secondary transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
