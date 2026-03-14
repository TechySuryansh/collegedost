"use client";

import React from 'react';
import ExamsListingContent from '@/components/ExamsListingContent';

const PSUExamsContent: React.FC = () => {
    return (
        <ExamsListingContent
            category="PSU"
            title="Top PSU Exams In India"
            description="Guide to career opportunities in India's top Public Sector Undertakings. Find latest recruitment notifications for ONGC, NTPC, IOCL, BHEL, and other Maharatna/Navratna companies."
        />
    );
};

export default PSUExamsContent;
