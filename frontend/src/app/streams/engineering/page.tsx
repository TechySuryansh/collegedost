import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Engineering stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Engineering Colleges in India 2025 | Top B.Tech & B.E. Colleges | CollegeDost',
    description: 'Explore top Engineering colleges in India. Compare IITs, NITs, and private engineering colleges. Get JEE Main & Advanced cutoffs, placement data, fees, and admission guidance.',
    keywords: [
        'engineering colleges in India',
        'top B.Tech colleges',
        'IIT colleges',
        'NIT colleges',
        'JEE Main colleges',
        'best engineering colleges 2025',
        'B.Tech admission',
        'engineering entrance exams',
        'GATE colleges',
        'computer science engineering'
    ],
    openGraph: {
        title: 'Engineering Colleges in India 2025 | CollegeDost',
        description: 'Find the best Engineering colleges in India. Compare top IITs, NITs with fees, placements, and cutoffs.',
        type: 'website',
        url: 'https://collegedost.com/engineering',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Engineering Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Engineering Colleges in India 2025 | CollegeDost',
        description: 'Find the best Engineering colleges in India. Compare IITs, NITs with fees, placements, and cutoffs.'
    },
    alternates: {
        canonical: 'https://collegedost.com/engineering'
    }
};

/**
 * Engineering stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function EngineeringPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
