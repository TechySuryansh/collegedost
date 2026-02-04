import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Education stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Schools & Education in India 2025 | CBSE, ICSE Board Resources | CollegeDost',
    description: 'Find top schools in India. Get CBSE, ICSE board exam resources, NCERT solutions, and school admission guidance for K-12 education.',
    keywords: [
        'schools in India',
        'CBSE schools',
        'ICSE schools',
        'NCERT solutions',
        'board exams 2025',
        'K-12 education',
        'best schools India',
        'school admission',
        'class 10 board',
        'class 12 board'
    ],
    openGraph: {
        title: 'Schools & Education in India 2025 | CollegeDost',
        description: 'Find top schools in India. Get CBSE, ICSE resources, NCERT solutions, and admission guidance.',
        type: 'website',
        url: 'https://collegedost.com/education',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Education in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Schools & Education in India 2025 | CollegeDost',
        description: 'Find top schools in India. Get CBSE, ICSE resources and NCERT solutions.'
    },
    alternates: {
        canonical: 'https://collegedost.com/education'
    }
};

/**
 * Education stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function EducationPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
