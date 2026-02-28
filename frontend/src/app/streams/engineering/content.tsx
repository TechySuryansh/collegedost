"use client";

import React from 'react';
import CollegesListing from '@/components/CollegesListing';

/**
 * Client component for the Engineering stream page.
 * Separated from page.tsx to allow server-side metadata export.
 * Uses useUI hook which requires client-side rendering.
 */
const PageContent: React.FC = () => {
    return (
        <CollegesListing
            initialStream="Engineering"
            title={
                <>
                    <span className="block whitespace-nowrap">Engineering the Impossible.</span>
                    <span className="block mt-3 text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-blue-500 whitespace-nowrap">
                        Designing the Extraordinary.
                    </span>
                </>
            }
            subtitle="Your gateway to top Engineering Colleges, JEE prep, and tech careers."
        />
    );
};

export default PageContent;
