"use client";

import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import { browseByStreamData } from '@/data';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

const StudyAbroadPage = () => {
    const data = browseByStreamData.find(d => d.id === 'abroad');
    const { openAskModal } = useUI();

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Hero
                title={<><span className="block whitespace-nowrap">Global Education.</span> <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 whitespace-nowrap">Limitless Opportunities.</span></>}
                subtitle="Discover top Universities worldwide, Scholarship opportunities, and Exam Prep."
                bgImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[
                    { text: "IELTS 2026", link: "#" },
                    { text: "Study in UK", link: "#" },
                    { text: "USA Visa", link: "#" },
                    { text: "GRE Prep", link: "#" }
                ]}
                showBadge={true}
            />

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">

                <PillSection title="International Exams" items={data.content.exams} color="border-gray-200" />

                <PillSection
                    title="Top Study Destinations"
                    items={data.content.colleges}
                    color="border-gray-200"
                />

                <div className="text-center">
                    <Link href="/international-colleges" className="inline-block px-8 py-3 bg-brand-orange text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-colors">
                        Find Universities by Country
                    </Link>
                </div>

                <Counselling
                    items={[
                        {
                            title: "Free Study Abroad Counselling",
                            description: "Get expert guidance on Country selection, Visa process, and Scholarships from our international education experts.",
                            cta: "Talk to Expert",
                            link: "/counselling/abroad",
                            image: "https://img.freepik.com/free-photo/focused-girl-with-map-points-distance_23-2148286940.jpg"
                        },
                        {
                            title: "Scholarship Assistance",
                            description: "Explore 1000+ global scholarships. Our team helps you apply for fully funded and partial grants for your higher studies.",
                            cta: "Apply Now",
                            link: "/scholarships",
                            image: "https://img.freepik.com/free-photo/graduates-holding-their-diplomas-with-pride_23-2148950541.jpg"
                        }
                    ]}
                    onOpenAskModal={openAskModal}
                />

                <PillSection title="Study Guides" items={data.content.predictors} color="border-gray-200" />

            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
                    <PredictorsSection
                        title="Global Careers"
                        mainTitle="International Degrees"
                        subText="Prepare for a global career with degrees from world-renowned institutions."
                        data={[
                            {
                                title: "Popular International Degrees",
                                items: [
                                    { name: "MS in Computer Science", link: "#" },
                                    { name: "MBA (Global)", link: "#" },
                                    { name: "Masters in Data Science", link: "#" },
                                    { name: "MS in Engineering Management", link: "#" },
                                    { name: "MPH (Public Health)", link: "#" },
                                    { name: "PhD Scholarships", link: "#" },
                                    { name: "Executive MBA", link: "#" },
                                    { name: "MSc in Finance", link: "#" }
                                ]
                            },
                            {
                                title: "Global Career Paths",
                                items: [
                                    { name: "Software Engineering (USA/Europe)", link: "#" },
                                    { name: "Investment Banking (London/NY)", link: "#" },
                                    { name: "Data Analytics (Global)", link: "#" },
                                    { name: "Biotechnology & Research", link: "#" },
                                    { name: "International Law", link: "#" },
                                    { name: "Management Consulting", link: "#" },
                                    { name: "Sustainable Development", link: "#" },
                                    { name: "AI & Machine Learning", link: "#" },
                                    { name: "Supply Chain Management", link: "#" },
                                    { name: "Digital Marketing (Remote)", link: "#" }
                                ]
                            }
                        ]}
                        illustration="https://img.freepik.com/free-vector/travelers-concept-illustration_114360-2642.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default StudyAbroadPage;
