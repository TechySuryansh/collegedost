"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import { browseByStreamData } from '@/data';
import { useUI } from '@/context/UIContext';

/**
 * Client component for the Commerce stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    const data = browseByStreamData.find(d => d.id === 'finance');
    const { openAskModal } = useUI();

    if (!data) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <>
            <Hero
                title={
                    <>
                        Mastering Numbers. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                            Leading Finance.
                        </span>
                    </>
                }
                subtitle="Explore top Commerce Colleges, Professional Exams like CA/CS, and Banking Careers."
                bgImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[]}
                showBadge={false}
            />

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
                <PillSection 
                    title="Professional Exams" 
                    items={data.content.exams} 
                    color="border-gray-200" 
                />

                <GenericCardGrid
                    title="Top Commerce Colleges"
                    items={data.content.resources}
                    type="card"
                />

                <Counselling 
                    items={[]}
                    onOpenAskModal={openAskModal}
                />

                <PillSection 
                    title="Career Profiles" 
                    items={data.content.predictors} 
                    color="border-gray-200" 
                />
            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
                    <PredictorsSection
                        title="Commerce Courses"
                        mainTitle="Accounting & Finance"
                        subText="Become a CA, CS, or Finance professional with the right guidance."
                        data={[]}
                        illustration="https://img.freepik.com/free-vector/investor-with-laptop-monitoring-growth-dividends-trader-sitting-stack-money-investing-fund-money-transferring-vector-illustration-finance-stock-market-investment_74855-8432.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default PageContent;
