import React from 'react';
import PageContent from './content';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const displayName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${displayName} 2026: Syllabus, Eligibility, Dates, Career Options`,
        description: `Complete guide for ${displayName} 2026. Get details on exam dates, eligibility criteria, syllabus, pattern, and career prospects.`
    };
}

const ExamPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    return <PageContent slug={slug} />;
};

export default ExamPage;
