"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import { browseByStreamData } from '@/data/navigation';
import { useUI } from '@/context/UIContext';

/**
 * Client component for the Hospitality stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    const data = browseByStreamData.find(d => d.id === 'hospitality');
    const { openAskModal } = useUI();

    if (!data) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <>
            <Hero
                title={
                    <>
                        Service with a Smile. <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-yellow-500">
                            Leading in Hospitality.
                        </span>
                    </>
                }
                subtitle="Explore top Hotel Management Institutes, Exams, and Global Career Opportunities."
                bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[]}
                showBadge={false}
            />

            <div className="container mx-auto px-4 py-12 grow flex-col gap-16">
                <PillSection 
                    title="Hospitality Entrance Exams" 
                    items={data.content.exams} 
                    color="border-gray-200" 
                />

                <GenericCardGrid
                    title="Top Hotel Management Colleges"
                    items={data.content.colleges}
                    type="card"
                />

                <Counselling 
                    items={[]}
                    onOpenAskModal={openAskModal}
                />

                <PillSection 
                    title="Course Predictors" 
                    items={data.content.predictors} 
                    color="border-gray-200" 
                />
            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 grow flex flex-col gap-16">
                    <PredictorsSection
                        title="Hospitality Courses"
                        mainTitle="Hotel & Travel Management"
                        subText="Pursue degrees in Hotel Management, Culinary Arts, and Travel & Tourism."
                        data={[]}
                        illustration="https://img.freepik.com/free-vector/hotel-staff-concept-illustration_114360-12966.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default PageContent;
