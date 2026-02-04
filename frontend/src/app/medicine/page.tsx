"use client";

import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
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

const MedicinePage = () => {
    return (
        <>
            <Hero
                title={
                    <>
                        Heal the World. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Study Medicine.</span>
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

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">

                <PillSection title="Top Medical Rankings" items={medicineRankings} color="border-gray-200" />

                <Section
                    title="Featured Medical Colleges"
                    items={featuredMedicineColleges}
                    type="card"
                />

                <Counselling items={medicineCounsellingData} />

                <PillSection title="Top Cities for Medical Studies" items={medicineCities} color="border-gray-200" />

            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
                    <PillSection title="Medical Entrance Exams" items={medicineExams} color="border-gray-200" />

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

export default MedicinePage;
