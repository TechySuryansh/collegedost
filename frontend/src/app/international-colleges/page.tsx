
import React, { Suspense } from 'react';
import InternationalCollegesContent from './InternationalCollegesContent';

export const metadata = {
    title: 'Study Abroad | CollegeDost',
    description: 'Find international colleges for higher education.',
};

export default function InternationalCollegesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>}>
            <InternationalCollegesContent />
        </Suspense>
    );
}
