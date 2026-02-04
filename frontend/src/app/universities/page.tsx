"use client";

import React from 'react';
import { browseByStreamData } from '@/data';
import Hero from '@/components/Hero';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import { useUI } from '@/context/UIContext';

const UniversitiesPage = () => {
    const data = browseByStreamData.find(d => d.id === 'university');
    const { openAskModal } = useUI();

    if (!data) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <>
            <Hero
                title={<>Higher Learning. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">Centers of Excellence.</span></>}
                subtitle="Discover India's top Universities, Admission Process (CUET), and Courses."
                bgImage="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[
                    { text: "CUET 2026", link: "#" },
                    { text: "Delhi University", link: "#" },
                    { text: "JNU Admission", link: "#" },
                    { text: "BHU Cutoff", link: "#" }
                ]}
                showBadge={true}
            />

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">

                <PillSection title="Entrance Exams" items={data.content.exams} color="border-gray-200" />

                <PillSection
                    title="Top Universities"
                    items={data.content.colleges}
                    color="border-gray-200"
                />

                <Counselling
                    items={[
                        {
                            title: "Admission Support 2026",
                            description: "Confused about CUET and University registration? Our experts help you navigate the entire admission lifecycle.",
                            cta: "Get Started",
                            link: "/counselling/university",
                            image: "https://img.freepik.com/free-photo/university-students-learning-together-campus_23-2148950548.jpg"
                        },
                        {
                            title: "CUET Prep & Strategy",
                            description: "Master the CUET 2026 exam with personalized preparation strategies and college mapping.",
                            cta: "Ask Now",
                            image: "https://img.freepik.com/free-photo/medium-shot-student-reading-indoors_23-2148950486.jpg"
                        }
                    ]}
                    onOpenAskModal={openAskModal}
                />

                <PillSection title="University Predictors" items={data.content.predictors} color="border-gray-200" />

                <PillSection title="News & Updates" items={data.content.resources} color="border-gray-200" />

            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
                    <PredictorsSection
                        title="University Courses"
                        mainTitle="Undergraduate & Postgraduate"
                        subText="Explore degrees across Arts, Science, Commerce, and more."
                        data={[
                            {
                                title: "Popular Degree Courses",
                                items: [
                                    { name: "Bachelor of Arts (BA)", link: "#" },
                                    { name: "Bachelor of Science (B.Sc)", link: "#" },
                                    { name: "Bachelor of Commerce (B.Com)", link: "#" },
                                    { name: "Master of Science (M.Sc)", link: "#" },
                                    { name: "Master of Arts (MA)", link: "#" },
                                    { name: "PhD Programs", link: "#" }
                                ]
                            },
                            {
                                title: "Specialized Programs",
                                items: [
                                    { name: "B.Voc Courses", link: "#" },
                                    { name: "Integrated Law (BA LLB)", link: "#" },
                                    { name: "Bachelor of Social Work", link: "#" },
                                    { name: "Library Science", link: "#" },
                                    { name: "Journalism & Mass Comm", link: "#" }
                                ]
                            }
                        ]}
                        illustration="https://img.freepik.com/free-vector/happy-student-holding-diploma-university-campus_74855-5296.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default UniversitiesPage;
