"use client";

import React from 'react';
import ExamsListingContent from '@/components/ExamsListingContent';

const SSCExamsContent: React.FC = () => {
    return (
        <ExamsListingContent
            category="SSC"
            title="Top SSC Exams In India"
            description="Comprehensive guide to SSC CGL, CHSL, MTS, CPO, and other Staff Selection Commission exams for 2026. Find exam dates, syllabus, pattern, and notification details."
        />
    );
};

export default SSCExamsContent;
