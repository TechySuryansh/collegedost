"use client";

import React from 'react';
import ExamsListingContent from '@/components/ExamsListingContent';

const StatePSCExamsContent: React.FC = () => {
    return (
        <ExamsListingContent
            category="State PSC"
            title="State PSC Exams In India"
            description="Track upcoming State Civil Services (PSC) notifications and exam dates for 2026. Get details for UPPCS, BPSC, MPSC, RAS, and other major state commissions."
        />
    );
};

export default StatePSCExamsContent;
