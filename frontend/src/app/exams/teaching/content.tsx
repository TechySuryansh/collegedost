"use client";

import React from 'react';
import ExamsListingContent from '@/components/ExamsListingContent';

const TeachingExamsContent: React.FC = () => {
    return (
        <ExamsListingContent
            category="Teaching"
            title="Top Teaching Exams In India"
            description="Stay updated with the latest Teaching exam dates, syllabus, notification releases, and eligibility criteria for CTET, state TETs, KVS, NVS, and more for 2026."
        />
    );
};

export default TeachingExamsContent;
