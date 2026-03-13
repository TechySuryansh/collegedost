import React from 'react';
import PageContent from './content';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const displayName = slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return {
        title: `${displayName} 2026: Subjects, Fees, Admission, Career Options`,
        description: `Get detailed information about ${displayName} engineering specialization, including core subjects, eligibility, top colleges, career scope, and average salary in India for 2026.`,
    };
}

export default async function SpecializationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <PageContent />;
}
