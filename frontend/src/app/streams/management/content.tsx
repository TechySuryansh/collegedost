"use client";

import React from 'react';
import CollegesListing from '@/components/CollegesListing';

/**
 * Client component for the Management stream page.
 * Separated from page.tsx to allow server-side metadata export.
 */
const PageContent: React.FC = () => {
    return (
        <CollegesListing
            initialStream="Management"
            title={
                <>
                    Lead the Future. <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-600">
                        Master Management.
                    </span>
                </>
            }
            subtitle="Explore top MBA colleges, entrance exams like CAT/MAT, and executive programs."
        />
    );
};

export default PageContent;
