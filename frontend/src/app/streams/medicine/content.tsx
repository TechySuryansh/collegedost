"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import {
    medicineRankings,
    medicineExams,
    featuredMedicineColleges,
    medicineCounsellingData,
    medicineCoursesData,
    medicineCities
} from '@/data/medicineData';
import { useUI } from '@/context/UIContext';

/**
 * Client component for the Medicine stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    const { openAskModal } = useUI();
    
    return (
        <>
            <Hero
                title={
                    <>
                        Heal the World. <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">
                            Study Medicine.
                        </span>
                    </>
                }
                subtitle="Your gateway to top Medical Colleges, NEET prep, and healthcare careers."
                bgImage="https://images.unsplash.com/photo-1576091160550-217358c7e618?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[
                    { text: "NEET UG 2025", link: "#" },
                    { text: "AIIMS Delhi", link: "#" },
                    { text: "MBBS Cutoff", link: "#" },
                    { text: "NEET PG", link: "#" }
                ]}
            />

            <div className="container mx-auto px-4 py-12 grow flex flex-col gap-16">
                <PillSection 
                    title="Top Medical Rankings" 
                    items={medicineRankings} 
                    color="border-gray-200" 
                />

                <GenericCardGrid
                    title="Featured Medical Colleges"
                    items={featuredMedicineColleges}
                    type="card"
                />

                <Counselling 
                    items={medicineCounsellingData} 
                    onOpenAskModal={openAskModal}
                />

                <PillSection 
                    title="Top Cities for Medical Studies" 
                    items={medicineCities} 
                    color="border-gray-200" 
                />
            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 grow flex flex-col gap-16">
                    <PillSection 
                        title="Medical Entrance Exams" 
                        items={medicineExams} 
                        color="border-gray-200" 
                    />

                    <PredictorsSection
                        title="Medical Courses"
                        mainTitle="Healthcare Specializations"
                        subText="From MBBS to specialized research programs."
                        data={medicineCoursesData}
                        illustration="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default PageContent;
