"use client";

import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import { browseByStreamData } from '@/data';

const ComputerApplicationsPage = () => {
    const data = browseByStreamData.find(d => d.id === 'computer');

    if (!data) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <>
            <Hero
                title={<>Coding the Future. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Innovating with Tech.</span></>}
                subtitle="Explore top BCA/MCA Colleges, IT Certifications, and Tech Careers."
                bgImage="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[]}
                showBadge={false}
            />

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">

                <PillSection title="IT Entrance Exams" items={data.content.exams} color="border-gray-200" />

                <Section
                    title="Top IT Colleges"
                    items={data.content.colleges}
                    type="card"
                />

                <Counselling items={[]} />

                <PillSection title="IT Courses" items={data.content.resources} color="border-gray-200" />

            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
                    <PredictorsSection
                        title="Computer Applications"
                        mainTitle="Software & Development"
                        subText="Launch your career in Software Engineering, Data Science, and AI."
                        data={[]}
                        illustration="https://img.freepik.com/free-vector/programmer-working-web-development-code-engineer-programming-python-php-java-script-computer_90220-251.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default ComputerApplicationsPage;
