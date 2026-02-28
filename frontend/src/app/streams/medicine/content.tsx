"use client";

import React from 'react';
import CollegesListing from '@/components/CollegesListing';

/**
 * Client component for the Medicine stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    return (
        <CollegesListing
            initialStream="Medicine"
            title={
                <>
                    Heal the World. <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">
                        Study Medicine.
                    </span>
                </>
            }
            subtitle="Your gateway to top Medical Colleges, NEET prep, and healthcare careers."
        />
    );
};

export default PageContent;
