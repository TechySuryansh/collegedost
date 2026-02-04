
import React, { Suspense } from 'react';
import CollegesContent from './CollegesContent';

export const metadata = {
    title: 'CollegeDost | Find Best Colleges in India 2026',
    description: 'Search top colleges, exams, and courses. compare fees, placements, and reviews for Engineering, Medical, MBA, and more.',
};

export default function CollegesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>}>
            <CollegesContent />
        </Suspense>
    );
}
