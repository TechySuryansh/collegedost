"use client";

import React from 'react';
import CollegesListing from '@/components/CollegesListing';

/**
 * Client component for the Design stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    return (
        <CollegesListing
            initialStream="Design"
            title={
                <>
                    Creative Design. <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-500">
                        Shape the Future.
                    </span>
                </>
            }
            subtitle="Discover India's top Design Schools, NIFT/NID Exams, and Creative Portfolios."
        />
    );
};

export default PageContent;
