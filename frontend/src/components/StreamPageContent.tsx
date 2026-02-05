"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import { useUI } from '@/context/UIContext';

// Types for stream page configuration
export interface TrendingItem {
    text: string;
    link: string;
}

export interface RankingItem {
    name: string;
    link: string;
}

export interface CollegeItem {
    id: string;
    name: string;
    location: string;
    rating: string;
    logo?: string;
    tags?: string[];
    fees?: string;
    placement?: string;
    link: string;
    title?: string;
    href?: string;
}

export interface CounsellingItem {
    title: string;
    description: string;
    image: string;
    cta: string;
    link?: string;
    color?: string;
}

export interface CourseGroup {
    title: string;
    items: { name: string; link: string }[];
}

export interface StreamPageConfig {
    // Hero section
    heroTitle: React.ReactNode;
    heroSubtitle: string;
    heroBgImage: string;
    heroTrending?: TrendingItem[];
    showHeroBadge?: boolean;

    // Content sections
    rankings: RankingItem[];
    rankingsTitle?: string;
    
    featuredColleges: CollegeItem[];
    featuredCollegesTitle?: string;
    
    counselling: CounsellingItem[];
    
    cities?: RankingItem[];
    citiesTitle?: string;
    
    exams: RankingItem[];
    examsTitle?: string;
    
    courses: CourseGroup[];
    coursesConfig?: {
        title?: string;
        mainTitle?: string;
        subText?: string;
        illustration?: string;
    };
}

interface StreamPageContentProps {
    config: StreamPageConfig;
}

/**
 * Shared client component for stream pages (Engineering, Medicine, Law, etc.)
 * Renders the common layout with stream-specific data.
 * 
 * This component handles the UI rendering while the parent page.tsx
 * handles SEO metadata (server component).
 */
const StreamPageContent: React.FC<StreamPageContentProps> = ({ config }) => {
    const { openAskModal } = useUI();

    return (
        <>
            <Hero
                title={config.heroTitle}
                subtitle={config.heroSubtitle}
                bgImage={config.heroBgImage}
                trending={config.heroTrending || []}
                showBadge={config.showHeroBadge ?? true}
            />

            <div className="container mx-auto px-4 py-12 grow flex flex-col gap-16">
                <PillSection 
                    title={config.rankingsTitle || "Top Rankings"} 
                    items={config.rankings} 
                    color="border-gray-200" 
                />

                <GenericCardGrid
                    title={config.featuredCollegesTitle || "Featured Colleges"}
                    items={config.featuredColleges}
                    type="card"
                />

                <Counselling 
                    items={config.counselling} 
                    onOpenAskModal={openAskModal} 
                />

                {config.cities && config.cities.length > 0 && (
                    <PillSection 
                        title={config.citiesTitle || "Top Cities"} 
                        items={config.cities} 
                        color="border-gray-200" 
                    />
                )}
            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 grow flex flex-col gap-16">
                    <PillSection 
                        title={config.examsTitle || "Entrance Exams"} 
                        items={config.exams} 
                        color="border-gray-200" 
                    />

                    <PredictorsSection
                        title={config.coursesConfig?.title || "Courses"}
                        mainTitle={config.coursesConfig?.mainTitle || "Explore Specializations"}
                        subText={config.coursesConfig?.subText || "Find the right program for your career."}
                        data={config.courses}
                        illustration={config.coursesConfig?.illustration}
                    />
                </div>
            </div>
        </>
    );
};

export default StreamPageContent;
