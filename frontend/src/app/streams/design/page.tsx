import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Design stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Design Colleges in India 2025 | Top NIFT, NID & Fashion Design Colleges | CollegeDost',
    description: 'Explore top Design colleges in India. Compare NIFT, NID, and private design schools. Get NIFT, NID DAT, UCEED exam guidance, portfolio tips, and career paths.',
    keywords: [
        'design colleges in India',
        'NIFT colleges',
        'NID colleges',
        'fashion design colleges',
        'UCEED exam',
        'NID DAT',
        'best design colleges 2025',
        'B.Des colleges',
        'interior design courses',
        'graphic design colleges'
    ],
    openGraph: {
        title: 'Design Colleges in India 2025 | CollegeDost',
        description: 'Find the best Design colleges in India. Compare NIFT, NID with fees, placements, and portfolio requirements.',
        type: 'website',
        url: 'https://collegedost.com/design',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1558655146-d09347e0b7a8?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Design Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Design Colleges in India 2025 | CollegeDost',
        description: 'Find the best Design colleges in India. Compare NIFT, NID with fees and portfolio requirements.'
    },
    alternates: {
        canonical: 'https://collegedost.com/design'
    }
};

/**
 * Design stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function DesignPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
