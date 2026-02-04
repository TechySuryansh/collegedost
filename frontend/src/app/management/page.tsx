"use client";

import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import {
    managementRankings,
    managementExams,
    featuredManagementColleges,
    managementCounsellingData,
    managementCoursesData,
    managementCities
} from '@/data/managementData';

const ManagementPage = () => {
    return (
        <>
            <Hero
                title={
                    <>
                        Lead the Future. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Master Management.</span>
                    </>
                }
                subtitle="Explore top MBA colleges, entrance exams like CAT/MAT, and executive programs."
                bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[
                    { text: "CAT 2024", link: "#" },
                    { text: "IIM Ahmedabad", link: "#" },
                    { text: "MBA vs PGDM", link: "#" }
                ]}
            />

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">

                <PillSection title="Top Management Rankings" items={managementRankings} color="border-gray-200" />

                <Section
                    title="Featured MBA Colleges"
                    items={featuredManagementColleges}
                    type="card"
                />

                <Counselling items={managementCounsellingData} />

                <PillSection title="Top Management Hubs" items={managementCities} color="border-gray-200" />

            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
                    <PillSection title="Management Entrance Exams" items={managementExams} color="border-gray-200" />

                    <PredictorsSection
                        title="Management Programs"
                        mainTitle="MBA & BBA Specializations"
                        subText="From Finance and Marketing to HR and Operations."
                        data={managementCoursesData}
                        illustration="https://img.freepik.com/free-vector/business-team-discussing-ideas-startup_74855-4380.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default ManagementPage;
