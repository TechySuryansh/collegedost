
import React, { Suspense } from 'react';
import CoursesContent from './CoursesContent';

export const metadata = {
    title: 'Courses | CollegeDost',
    description: 'Explore various courses and career options.',
};

export default function CoursesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-indigo border-t-transparent"></div></div>}>
            <CoursesContent />
        </Suspense>
    );
}
