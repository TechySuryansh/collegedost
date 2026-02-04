import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Pharmacy stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Pharmacy Colleges in India 2025 | Top B.Pharm, D.Pharm & Pharm.D Colleges | CollegeDost',
    description: 'Explore top Pharmacy colleges in India. Compare NIPER, government & private pharmacy colleges. Get GPAT cutoffs, admission process, fees, and placement details.',
    keywords: [
        'pharmacy colleges in India',
        'top B.Pharm colleges',
        'NIPER colleges',
        'GPAT colleges 2025',
        'best pharmacy colleges',
        'D.Pharm admission',
        'Pharm.D colleges',
        'GPAT cutoff',
        'government pharmacy colleges',
        'private pharmacy colleges'
    ],
    openGraph: {
        title: 'Pharmacy Colleges in India 2025 | CollegeDost',
        description: 'Find the best Pharmacy colleges in India. Compare NIPER, government & private colleges with fees, placements, and GPAT cutoffs.',
        type: 'website',
        url: 'https://collegedost.com/pharmacy',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Pharmacy Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pharmacy Colleges in India 2025 | CollegeDost',
        description: 'Find the best Pharmacy colleges in India. Compare NIPER with fees, placements, and GPAT cutoffs.'
    },
    alternates: {
        canonical: 'https://collegedost.com/pharmacy'
    }
};

/**
 * Pharmacy stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function PharmacyPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
