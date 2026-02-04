
import React, { Suspense } from 'react';
import PageContent from "./content";

export const metadata = {
    title: 'Compare Colleges | CollegeDost',
    description: 'Compare colleges to find the best one for you.',
};

export default function CompareCollegesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>}>
            <PageContent />
        </Suspense>
    );
}
