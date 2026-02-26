import React, { Suspense } from 'react';
import PageContent from "./content";

export const metadata = {
    title: 'BITSAT College Predictor 2026 | CollegeDost',
    description: 'Predict your admission chances in BITS Pilani, Goa, and Hyderabad campuses based on your BITSAT score.',
};

export default function BitsatPredictorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent" /></div>}>
            <PageContent />
        </Suspense>
    );
}
