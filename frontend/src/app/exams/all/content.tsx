"use client";

import React from 'react';
import ExamsListingContent from '@/components/ExamsListingContent';

const AllExamsContent: React.FC = () => {
    return (
        <ExamsListingContent
            category="All"
            title="All Competitive Exams In India"
            description="Explore all major government and competitive exams in India for 2026. Stay ahead with the latest dates, notifications, and guides for all career paths."
        />
    );
};

export default AllExamsContent;
