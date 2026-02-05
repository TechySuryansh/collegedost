"use client";

import React from 'react';
import Hero from '@/components/Hero';
import GenericCardGrid from '@/components/GenericCardGrid';
import Counselling from '@/components/Counselling';
import PillSection from '@/components/PillSection';
import { useUI } from '@/context/UIContext';

/**
 * Client component for the Science stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    const { openAskModal } = useUI();
    
    return (
        <>
            <Hero
                title={
                    <>
                        Exploring the Unknown. <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-cyan-500">
                            Discovering Truth.
                        </span>
                    </>
                }
                subtitle="Find top Science Colleges, Research Institutes, and Entrance Exams like NEST/KVPY."
                bgImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
                trending={[]}
                showBadge={false}
            />

            <div className="container mx-auto px-4 py-12 grow flex flex-col gap-16">
                <PillSection 
                    title="Entrance Exams" 
                    items={[
                        { name: "NEST", link: "#" },
                        { name: "IIT JAM", link: "#" },
                        { name: "CUET Science", link: "#" }
                    ]} 
                    color="border-gray-200" 
                />

                <GenericCardGrid
                    title="Top Science Colleges"
                    items={[
                        { title: "St. Stephen's College", href: "#" },
                        { title: "Miranda House", href: "#" },
                        { title: "IISc Bangalore", href: "#" }
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
