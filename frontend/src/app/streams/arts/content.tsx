"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import { useUI } from '@/context/UIContext';

/**
 * Client component for the Arts stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    const { openAskModal } = useUI();
    
    return (
        <>
            <Hero
                title={
                    <>
                        Understanding Humanity. <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-amber-600">
                            Shaping Culture.
                        </span>
                    </>
                }
                subtitle="Explore top Arts Colleges, Humanities Courses, and diverse Career Paths."
                bgImage="https://images.unsplash.com/photo-1460518451285-97b6aa326961?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[]}
                showBadge={false}
            />

            <div className="container mx-auto px-4 py-12 grow flex flex-col gap-16">
                <PillSection 
                    title="Top Courses" 
                    items={[
                        { name: "BA Economics", link: "#" },
                        { name: "BA Psychology", link: "#" },
                        { name: "BA English", link: "#" }
                    ]} 
                    color="border-gray-200" 
                />

                <GenericCardGrid
                    title="Top Arts Colleges"
                    items={[
                        { title: "Lady Shri Ram College", href: "#" },
                        { title: "Loyola College", href: "#" },
                        { title: "St. Xavier's Mumbai", href: "#" }
                    ]}
                    type="card"
                />

                <Counselling 
                    items={[]}
                    onOpenAskModal={openAskModal}
                />
            </div>
        </>
    );
};

export default PageContent;
