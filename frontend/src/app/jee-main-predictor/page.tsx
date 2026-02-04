
import React, { Suspense } from 'react';
import JEEMainPredictorContent from './JEEMainPredictorContent';

export const metadata = {
    title: 'JEE Main College Predictor 2026 | CollegeDost',
    description: 'Predict your admission chances in NITs, IIITs, GFTIs and Private Colleges based on JEE Main Percentile.',
};

export default function JEEMainPredictorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>}>
            <JEEMainPredictorContent />
        </Suspense>
    );
}
