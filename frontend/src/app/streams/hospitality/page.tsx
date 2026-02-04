import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Hospitality stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Hotel Management Colleges in India 2025 | Top Hospitality Institutes | CollegeDost',
    description: 'Explore top Hotel Management colleges in India. Compare IHMs, private hospitality institutes. Get admission guidance, fees, and global career opportunities.',
    keywords: [
        'hotel management colleges',
        'hospitality colleges India',
        'IHM colleges',
        'NCHMCT JEE',
        'best hotel management 2025',
        'culinary arts colleges',
        'tourism management',
        'hospitality courses',
        'hotel industry careers',
        'travel and tourism'
    ],
    openGraph: {
        title: 'Hotel Management Colleges in India 2025 | CollegeDost',
        description: 'Find the best Hotel Management colleges in India. Compare IHMs with fees, placements, and career paths.',
        type: 'website',
        url: 'https://collegedost.com/hospitality',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Hotel Management Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Hotel Management Colleges in India 2025 | CollegeDost',
        description: 'Find the best Hotel Management colleges in India. Compare IHMs with fees and placements.'
    },
    alternates: {
        canonical: 'https://collegedost.com/hospitality'
    }
};

/**
 * Hospitality stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function HospitalityPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
