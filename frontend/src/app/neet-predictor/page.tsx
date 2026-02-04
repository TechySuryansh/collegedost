
import React, { Suspense } from 'react';
import NEETPredictorContent from './NEETPredictorContent';

export const metadata = {
    title: 'NEET College Predictor 2026 | CollegeDost',
    description: 'Predict your NEET college chances for AIIMS, JIPMER, Government and Private Medical Colleges.',
};

export default function NEETPredictorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-green-600 border-t-transparent"></div></div>}>
            <NEETPredictorContent />
        </Suspense>
    );
}
