
import React, { Suspense } from 'react';
import ExamsContent from './ExamsContent';

export const metadata = {
    title: 'Entrance Exams | CollegeDost',
    description: 'Explore top entrance exams in India.',
};

export default function ExamsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>}>
            <ExamsContent />
        </Suspense>
    );
}
