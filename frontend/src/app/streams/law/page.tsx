import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageContent from "./content";
import { PageLoader } from '@/components/ui';

/**
 * SEO Metadata for Law stream page.
 * Server component pattern allows proper metadata export.
 */
export const metadata: Metadata = {
    title: 'Law Colleges in India 2025 | Top LLB, BA LLB & NLU Colleges | CollegeDost',
    description: 'Explore top Law colleges in India. Compare NLUs, government & private law colleges. Get CLAT cutoffs, admission process, fees, and placement details.',
    keywords: [
        'law colleges in India',
        'top LLB colleges',
        'NLU colleges',
        'CLAT colleges 2025',
        'best law colleges',
        'BA LLB admission',
        'LLM colleges',
        'CLAT cutoff',
        'government law colleges',
        'private law colleges'
    ],
    openGraph: {
        title: 'Law Colleges in India 2025 | CollegeDost',
        description: 'Find the best Law colleges in India. Compare NLUs, government & private colleges with fees, placements, and CLAT cutoffs.',
        type: 'website',
        url: 'https://collegedost.com/law',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Law Colleges in India'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Law Colleges in India 2025 | CollegeDost',
        description: 'Find the best Law colleges in India. Compare NLUs with fees, placements, and CLAT cutoffs.'
    },
    alternates: {
        canonical: 'https://collegedost.com/law'
    }
};

/**
 * Law stream page - Server Component wrapper.
 * Renders client component inside Suspense boundary for proper hydration.
 */
export default function LawPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PageContent />
        </Suspense>
    );
}
