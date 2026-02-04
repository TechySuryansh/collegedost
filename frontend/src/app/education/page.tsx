"use client";

import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import { browseByStreamData } from '@/data';

const EducationPage = () => {
    const data = browseByStreamData.find(d => d.id === 'school');

    if (!data) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <>
            <Hero
                title={<>Foundation of Knowledge. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Building Tomorrow.</span></>}
                subtitle="Find top Schools, Board Exam Resources, and NCERT Solutions."
                bgImage="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[]}
                showBadge={false}
            />

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">

                <PillSection title="Board Exams" items={data.content.exams} color="border-gray-200" />

                <Section
                    title="Top Schools"
                    items={data.content.colleges}
                    type="card"
                />

                <Counselling items={[]} />

                <PillSection title="NCERT Resources" items={data.content.resources} color="border-gray-200" />

            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
                    <PredictorsSection
                        title="School Education"
                        mainTitle="K-12 & Boards"
                        subText="Comprehensive resources for students from Class 1 to 12."
                        data={[]}
                        illustration="https://img.freepik.com/free-vector/kids-studying-from-home-concept-illustration_114360-1729.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default EducationPage;
