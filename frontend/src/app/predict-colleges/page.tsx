
import React, { Suspense } from 'react';
import PredictCollegesContent from './PredictCollegesContent';

export const metadata = {
    title: 'Predict Colleges | CollegeDost',
    description: 'Predict colleges based on your rank.',
};

export default function CollegePredictorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>}>
            <PredictCollegesContent />
        </Suspense>
    );
}
