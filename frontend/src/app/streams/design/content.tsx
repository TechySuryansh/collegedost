"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import PredictorsSection from '@/components/PredictorsSection';
import { browseByStreamData } from '@/data/navigation';
import { featuredDesignColleges } from '@/data/designData';
import { useUI } from '@/context/UIContext';

/**
 * Client component for the Design stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    const data = browseByStreamData.find(d => d.id === 'animation');
    const { openAskModal } = useUI();

    if (!data) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <>
            <Hero
                title={
                    <>
                        Creative Design. <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-500">
                            Shape the Future.
                        </span>
                    </>
                }
                subtitle="Discover India's top Design Schools, NIFT/NID Exams, and Creative Portfolios."
                bgImage="https://images.unsplash.com/photo-1558655146-d09347e0b7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[
                    { text: 'NIFT 2026', link: '#' },
                    { text: 'NID DAT', link: '#' },
                    { text: 'Fashion Design', link: '#' },
                    { text: 'UCEED', link: '#' }
                ]}
                showBadge={true}
            />

            <div className="container mx-auto px-4 py-12 grow flex-col gap-16">
                <PillSection 
                    title="Design Entrance Exams" 
                    items={data.content.exams} 
                    color="border-gray-200" 
                />

                <GenericCardGrid
                    title="Featured Design Colleges"
                    items={featuredDesignColleges}
                    type="card"
                />

                <Counselling
                    items={[
                        {
                            title: "Portfolio Review",
                            description: "Get your design portfolio reviewed by NID/NIFT alumni. Improve your chances of selection in top design schools.",
                            cta: "Book Review",
                            link: "/counselling/design",
                            image: "https://img.freepik.com/free-photo/creative-design-process-brainstorming_23-2148817024.jpg"
                        },
                        {
                            title: "Design Career Roadmap",
                            description: "Explore opportunities in Fashion, UI/UX, and Product Design with personalized career mapping.",
                            cta: "Ask Now",
                            image: "https://img.freepik.com/free-photo/fashion-designer-working-sketch-home_23-2148817036.jpg"
                        }
                    ]}
                    onOpenAskModal={openAskModal}
                />

                <PillSection 
                    title="Predictors & Resources" 
                    items={data.content.predictors} 
                    color="border-gray-200" 
                />
            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 grow flex flex-col gap-16">
                    <PredictorsSection
                        title="Design Courses"
                        mainTitle="Fashion & Industrial Design"
                        subText="Explore specializations like Fashion, Interior, Product, and Graphic Design."
                        data={[
                            {
                                title: "Popular Design Degrees",
                                items: [
                                    { name: "Bachelor of Design (B.Des)", link: "#" },
                                    { name: "Master of Design (M.Des)", link: "#" },
                                    { name: "B.Sc in Fashion Design", link: "#" },
                                    { name: "B.F.Tech (Apparel Production)", link: "#" },
                                    { name: "Ph.D in Design", link: "#" },
                                    { name: "Diploma in Design", link: "#" },
                                    { name: "Certificate Courses", link: "#" },
                                    { name: "M.Arch (Related)", link: "#" }
                                ]
                            },
                            {
                                title: "Specializations",
                                items: [
                                    { name: "Fashion Design", link: "#" },
                                    { name: "Interior Design", link: "#" },
                                    { name: "Graphic Design", link: "#" },
                                    { name: "Product Design", link: "#" },
                                    { name: "UX/UI Design", link: "#" },
                                    { name: "Textile Design", link: "#" },
                                    { name: "Animation Film Design", link: "#" },
                                    { name: "Game Design", link: "#" },
                                    { name: "Automobile Design", link: "#" },
                                    { name: "Jewellery Design", link: "#" }
                                ]
                            }
                        ]}
                        illustration="https://img.freepik.com/free-vector/creative-team-working-project_74855-4813.jpg"
                    />
                </div>
            </div>
        </>
    );
};

export default PageContent;
