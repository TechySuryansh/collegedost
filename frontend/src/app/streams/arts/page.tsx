import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Arts stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Arts & Humanities Colleges in India 2025 | Top BA Colleges | CollegeDost',
    description: 'Explore top Arts and Humanities colleges in India. Compare BA programs in Economics, Psychology, English, History. Get admission guidance and career paths.',
    keywords: [
        'arts colleges in India',
        'top BA colleges',
        'humanities colleges',
        'BA Economics colleges',
        'BA Psychology colleges',
        'liberal arts colleges',
        'CUET arts',
        'Delhi University arts',
        'best arts colleges 2025',
        'humanities courses'
    ],
    openGraph: {
        title: 'Arts & Humanities Colleges in India 2025 | CollegeDost',
        description: 'Find the best Arts colleges in India. Compare BA programs with fees, placements, and admission process.',
        type: 'website',
        url: 'https://collegedost.com/arts',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Arts Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Arts & Humanities Colleges in India 2025 | CollegeDost',
        description: 'Find the best Arts colleges in India. Compare BA programs with fees and placements.'
    },
    alternates: {
        canonical: 'https://collegedost.com/arts'
    }
};

/**
 * Arts stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function ArtsPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
