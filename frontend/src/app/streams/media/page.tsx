import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Media stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Mass Communication Colleges in India 2025 | Top Journalism & Media Schools | CollegeDost',
    description: 'Explore top Mass Communication and Journalism colleges in India. Compare IIMC, AJK MCRC, and private media schools. Get admission guidance and career paths.',
    keywords: [
        'mass communication colleges',
        'journalism colleges India',
        'media schools',
        'IIMC admission',
        'best journalism colleges 2025',
        'digital media courses',
        'film school India',
        'advertising courses',
        'PR colleges',
        'media career paths'
    ],
    openGraph: {
        title: 'Mass Communication Colleges in India 2025 | CollegeDost',
        description: 'Find the best Journalism and Media colleges in India. Compare IIMC, private schools with fees and placements.',
        type: 'website',
        url: 'https://collegedost.com/media',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Media Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mass Communication Colleges in India 2025 | CollegeDost',
        description: 'Find the best Journalism and Media colleges in India. Compare IIMC with fees and placements.'
    },
    alternates: {
        canonical: 'https://collegedost.com/media'
    }
};

/**
 * Media stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function MediaPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
