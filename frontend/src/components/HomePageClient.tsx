"use client";

import React from 'react';
import HomeHero from './HomeHero';
import FeaturedColleges from './FeaturedColleges';
import HomeCounselling from './HomeCounselling';
import DataRankings from './DataRankings';
import OnlineCourses from './OnlineCourses';
import AppDownload from './AppDownload';
import { useUI } from '@/context/UIContext';

const HomePage = () => {
    const { openAskModal } = useUI();

    return (
        <div className="overflow-x-hidden bg-background-light">
            {/* Hero Section */}
            <HomeHero />

            {/* Featured Colleges */}
            <FeaturedColleges />

            {/* Main Content Section */}
            <main className="py-20 lg:py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-main-light mb-4">
                            Everything you need to succeed
                        </h2>
                        <p className="text-text-muted-light text-lg">
                            We&apos;ve reimagined the way you discover your potential. Explore our tools designed to guide you from decision to admission.
                        </p>
                    </div>

                    {/* Personalized Counselling */}
                    <HomeCounselling onOpenAskModal={openAskModal} />

                    {/* Data & Rankings + Smart Predictors */}
                    <DataRankings />

                    {/* Online Courses */}
                    <OnlineCourses />
                </div>
            </main>

            {/* App Download / Community Section */}
            <AppDownload />
        </div>
    );
};

export default HomePage;
