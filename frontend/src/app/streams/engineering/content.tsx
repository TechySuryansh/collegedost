"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import {
    engineeringRankings,
    engineeringExams,
    featuredEngineeringColleges,
    engineeringCounsellingData,
    engineeringCoursesData,
    engineeringCities
} from '@/data/engineeringData';
import { useUI } from '@/context/UIContext';

/**
 * Client component for the Engineering stream page.
 * Separated from page.tsx to allow server-side metadata export.
 * Uses useUI hook which requires client-side rendering.
 */
const PageContent: React.FC = () => {
    const { openAskModal } = useUI();
    
    return (
        <>
            <Hero
                title={
                    <>
                        <span className="block whitespace-nowrap">Engineering the Impossible.</span>
                        <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 whitespace-nowrap">
                            Designing the Extraordinary.
                        </span>
                    </>
                }
                subtitle="Your gateway to top Engineering Colleges, JEE prep, and tech careers."
                showBadge={true}
                bgImage="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[
                    { text: "JEE Main 2026", link: "#" },
                    { text: "IIT Delhi", link: "#" },
                    { text: "B.Tech Cutoff", link: "#" },
                    { text: "GATE 2026", link: "#" }
                ]}
            />

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
                <PillSection 
                    title="Top Engineering Rankings" 
                    items={engineeringRankings} 
                    color="border-gray-200" 
                />

                <GenericCardGrid
                    title="Featured Engineering Colleges"
                    items={featuredEngineeringColleges}
                    type="card"
                />

                <Counselling 
                    items={engineeringCounsellingData} 
                    onOpenAskModal={openAskModal} 
                />

                <PillSection 
                    title="Top Engineering Hubs" 
                    items={engineeringCities} 
                    color="border-gray-200" 
                />
            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
                    <PillSection 
                        title="Engineering Entrance Exams" 
                        items={engineeringExams} 
                        color="border-gray-200" 
                    />

                    <PredictorsSection
                        title="Engineering Courses"
                        mainTitle="B.Tech & B.Arch Specializations"
                        subText="Choose from diverse fields like CSE, ECE, Mechanical, and more."
                        data={engineeringCoursesData}
                        illustration="https://img.freepik.com/free-vector/engineer-developer-with-laptop-tablet-working_603843-524.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default PageContent;
