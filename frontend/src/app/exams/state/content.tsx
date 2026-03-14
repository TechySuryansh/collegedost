"use client";

import React from 'react';
import ExamsListingContent from '@/components/ExamsListingContent';

const StateExamsContent: React.FC = () => {
    return (
        <ExamsListingContent
            category="State"
            title="Top State Government Exams"
            description="Your hub for all state-level recruitment exams. Track notifications and dates for various state government jobs, including teaching, administrative, and technical roles in 2026."
        />
    );
};

export default StateExamsContent;
