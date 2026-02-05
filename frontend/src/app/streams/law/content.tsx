"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import {
    lawRankings,
    lawExams,
    featuredLawColleges,
    lawCounsellingData,
    lawCoursesData,
    lawCities
} from '@/data/lawData';
import { useUI } from '@/context/UIContext';

/**
 * Client component for the Law stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    const { openAskModal } = useUI();
    
    return (
        <>
            <Hero
                title={
                    <>
                        Defend Justice. <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-700 to-yellow-600">
                            Study Law.
                        </span>
                    </>
                }
                subtitle="Top Law Schools, CLAT preparation, and legal career paths."
                bgImage="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[
                    { text: "CLAT 2025", link: "#" },
                    { text: "NLUs", link: "#" },
                    { text: "LLB Admission", link: "#" }
                ]}
            />

            <div className="container mx-auto px-4 py-12 grow flex flex-col gap-16">
                <PillSection 
                    title="Top Law Rankings" 
                    items={lawRankings} 
                    color="border-gray-200" 
                />

                <GenericCardGrid
                    title="Featured Law Colleges"
                    items={featuredLawColleges}
                    type="card"
                />

                <Counselling 
                    items={lawCounsellingData}
                    onOpenAskModal={openAskModal}
                />

                <PillSection 
                    title="Top Cities for Legal Studies" 
                    items={lawCities} 
                    color="border-gray-200" 
                />
            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 grow flex flex-col gap-16">
                    <PillSection 
                        title="Law Entrance Exams" 
                        items={lawExams} 
                        color="border-gray-200" 
                    />

                    <PredictorsSection
                        title="Law Courses"
                        mainTitle="Legal Specializations"
                        subText="Pursue BA LLB, LLM, and specialized law degrees."
                        data={lawCoursesData}
                        illustration="https://img.freepik.com/free-vector/law-firm-concept-illustration_114360-1533.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default PageContent;
