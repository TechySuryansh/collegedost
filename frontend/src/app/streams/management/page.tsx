import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Management stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'MBA Colleges in India 2025 | Top IIMs, BBA & Management Colleges | CollegeDost',
    description: 'Explore top MBA & Management colleges in India. Compare IIMs, government & private B-schools. Get CAT cutoffs, admission process, fees, and placement details.',
    keywords: [
        'MBA colleges in India',
        'top IIM colleges',
        'BBA colleges',
        'CAT colleges 2025',
        'best management colleges',
        'MBA admission',
        'PGDM colleges',
        'CAT cutoff',
        'government MBA colleges',
        'private MBA colleges'
    ],
    openGraph: {
        title: 'MBA Colleges in India 2025 | CollegeDost',
        description: 'Find the best MBA colleges in India. Compare IIMs, government & private B-schools with fees, placements, and CAT cutoffs.',
        type: 'website',
        url: 'https://collegedost.com/management',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'MBA Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MBA Colleges in India 2025 | CollegeDost',
        description: 'Find the best MBA colleges in India. Compare IIMs with fees, placements, and CAT cutoffs.'
    },
    alternates: {
        canonical: 'https://collegedost.com/management'
    }
};

/**
 * Management stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function ManagementPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
