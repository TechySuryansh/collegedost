import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Science stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Science Colleges in India 2025 | Top B.Sc & Research Institutes | CollegeDost',
    description: 'Explore top Science colleges in India. Compare IISc, IISERs, and B.Sc colleges. Get NEST, IIT JAM exam guidance, fees, and placement details.',
    keywords: [
        'science colleges in India',
        'top B.Sc colleges',
        'IISc Bangalore',
        'IISER colleges',
        'NEST exam',
        'IIT JAM',
        'best science colleges 2025',
        'research institutes India',
        'pure science courses',
        'physics chemistry biology'
    ],
    openGraph: {
        title: 'Science Colleges in India 2025 | CollegeDost',
        description: 'Find the best Science colleges in India. Compare IISc, IISERs with fees, placements, and research opportunities.',
        type: 'website',
        url: 'https://collegedost.com/science',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Science Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Science Colleges in India 2025 | CollegeDost',
        description: 'Find the best Science colleges in India. Compare IISc, IISERs with fees and research opportunities.'
    },
    alternates: {
        canonical: 'https://collegedost.com/science'
    }
};

/**
 * Science stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function SciencePage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
