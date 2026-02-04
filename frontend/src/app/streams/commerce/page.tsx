import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Commerce stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Commerce Colleges in India 2025 | Top B.Com, CA, CS Colleges | CollegeDost',
    description: 'Explore top Commerce colleges in India. Get guidance for CA, CS, CMA exams. Compare B.Com colleges with fees, placements, and admission process.',
    keywords: [
        'commerce colleges in India',
        'top B.Com colleges',
        'CA coaching',
        'CS colleges',
        'best commerce colleges 2025',
        'chartered accountant',
        'company secretary',
        'commerce entrance exams',
        'accounting colleges',
        'finance courses'
    ],
    openGraph: {
        title: 'Commerce Colleges in India 2025 | CollegeDost',
        description: 'Find the best Commerce colleges in India. Get CA, CS exam guidance with fees, placements.',
        type: 'website',
        url: 'https://collegedost.com/commerce',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Commerce Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Commerce Colleges in India 2025 | CollegeDost',
        description: 'Find the best Commerce colleges in India. Get CA, CS exam guidance.'
    },
    alternates: {
        canonical: 'https://collegedost.com/commerce'
    }
};

/**
 * Commerce stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function CommercePage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
