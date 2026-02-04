import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Medicine stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Medical Colleges in India 2025 | Top MBBS, BDS, BAMS Colleges | CollegeDost',
    description: 'Explore top Medical colleges in India. Compare AIIMS, government & private medical colleges. Get NEET cutoffs, admission process, fees, and placement details.',
    keywords: [
        'medical colleges in India',
        'top MBBS colleges',
        'AIIMS colleges',
        'NEET colleges 2025',
        'best medical colleges',
        'MBBS admission',
        'BDS colleges',
        'NEET UG cutoff',
        'government medical colleges',
        'private medical colleges'
    ],
    openGraph: {
        title: 'Medical Colleges in India 2025 | CollegeDost',
        description: 'Find the best Medical colleges in India. Compare AIIMS, government & private colleges with fees, placements, and NEET cutoffs.',
        type: 'website',
        url: 'https://collegedost.com/medicine',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1576091160550-217358c7e618?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Medical Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Medical Colleges in India 2025 | CollegeDost',
        description: 'Find the best Medical colleges in India. Compare AIIMS with fees, placements, and NEET cutoffs.'
    },
    alternates: {
        canonical: 'https://collegedost.com/medicine'
    }
};

/**
 * Medicine stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function MedicinePage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
