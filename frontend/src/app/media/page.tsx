"use client";

import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import { browseByStreamData } from '@/data';

const MediaPage = () => {
    const data = browseByStreamData.find(d => d.id === 'media');

    if (!data) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <>
            <Hero
                title={<>Voice of the World. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Mastering Media.</span></>}
                subtitle="Discover top Journalism Schools, Mass Comm Colleges, and Media Career Paths."
                bgImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[]}
                showBadge={false}
            />

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">

                <PillSection title="Media Entrance Exams" items={data.content.exams} color="border-gray-200" />

                <Section
                    title="Top Media Colleges"
                    items={data.content.colleges}
                    type="card"
                />

                <Counselling items={[]} />

                <PillSection title="Resources & Predictors" items={data.content.predictors} color="border-gray-200" />

            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
                    <PredictorsSection
                        title="Media Courses"
                        mainTitle="Journalism & Mass Comm"
                        subText="From Reporting to Digital Media, find the right course for you."
                        data={[]}
                        illustration="https://img.freepik.com/free-vector/press-conference-concept-illustration_114360-1033.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default MediaPage;
