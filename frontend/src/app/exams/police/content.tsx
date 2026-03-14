"use client";

import React from 'react';
import ExamsListingContent from '@/components/ExamsListingContent';

const PoliceExamsContent: React.FC = () => {
    return (
        <ExamsListingContent
            category="Police"
            title="Top Police Exams In India"
            description="Stay updated with recruitment notifications for Delhi Police, State Police forces, and Central Armed Police Forces (CAPF). Find exam dates and eligibility for 2026."
        />
    );
};

export default PoliceExamsContent;
