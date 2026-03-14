"use client";

import React from 'react';
import ExamsListingContent from '@/components/ExamsListingContent';

const UPSCExamsContent: React.FC = () => {
    return (
        <ExamsListingContent
            category="UPSC"
            title="Top UPSC Exams In India"
            description="Complete guide to all Civil Services and Defence recruitment exams conducted by UPSC. Stay updated with 2026 dates for IAS, IFS, NDA, and other Prestigious UPSC exams."
        />
    );
};

export default UPSCExamsContent;
