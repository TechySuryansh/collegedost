
import React, { Suspense } from 'react';
import PageContent from "./content";

export const metadata = {
    title: 'News | CollegeDost',
    description: 'Latest education news and updates.',
};

export default function NewsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>}>
            <PageContent />
        </Suspense>
    );
}
