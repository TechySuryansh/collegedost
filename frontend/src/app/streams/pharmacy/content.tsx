"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import {
    pharmacyRankings,
    pharmacyExams,
    featuredPharmacyColleges,
    pharmacyCounsellingData,
    pharmacyCoursesData,
    pharmacyCities
} from '@/data/pharmacyData';
import { useUI } from '@/context/UIContext';

/**
 * Client component for the Pharmacy stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    const { openAskModal } = useUI();

    return (
        <>
            <Hero
                title={
                    <>
                        Innovate Healthcare. <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-green-600">
                            Study Pharmacy.
                        </span>
                    </>
                }
                subtitle="Explore B.Pharm, Pharm.D colleges, and pharmaceutical career opportunities."
                bgImage="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[
                    { text: "GPAT 2025", link: "#" },
                    { text: "NIPER", link: "#" },
                    { text: "B.Pharm Admission", link: "#" }
                ]}
            />

            <div className="container mx-auto px-4 py-12 grow flex flex-col gap-16">
                <PillSection
                    title="Top Pharmacy Rankings"
                    items={pharmacyRankings}
                    color="border-gray-200"
                />

                <GenericCardGrid
                    title="Featured Pharmacy Colleges"
                    items={featuredPharmacyColleges}
                    type="card"
                    viewAllLink="/tools/colleges?stream=Pharmacy"
                />

                <Counselling
                    items={pharmacyCounsellingData}
                    onOpenAskModal={openAskModal}
                />

                <PillSection
                    title="Top Cities for Pharmacy"
                    items={pharmacyCities}
                    color="border-gray-200"
                />
            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 grow flex flex-col gap-16">
                    <PillSection
                        title="Pharmacy Entrance Exams"
                        items={pharmacyExams}
                        color="border-gray-200"
                    />

                    <PredictorsSection
                        title="Pharmacy Courses"
                        mainTitle="Pharmaceutical Programs"
                        subText="Choose from B.Pharm, M.Pharm, and Pharm.D specializations."
                        data={pharmacyCoursesData}
                        illustration="https://img.freepik.com/free-vector/pharmacist-concept-illustration_114360-3236.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default PageContent;
