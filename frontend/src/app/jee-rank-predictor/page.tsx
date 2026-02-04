
import React, { Suspense } from 'react';
import JEERankPredictorContent from './JEERankPredictorContent';

export const metadata = {
    title: 'JEE Rank Predictor 2026 | CollegeDost',
    description: 'Predict your All India Rank (AIR) based on your percentile or marks.',
};

export default function JEERankPredictorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>}>
            <JEERankPredictorContent />
        </Suspense>
    );
}
