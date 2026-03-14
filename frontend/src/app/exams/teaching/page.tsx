import { Metadata } from 'next';
import TeachingExamsContent from './content';

export const metadata: Metadata = {
    title: 'Top Teaching Exams in India 2026 - Dates, Syllabus, Pattern',
    description: 'Get latest information on Teaching exams in India for 2026. Find dates, syllabus, eligibility, and preparation guides for CTET, UPTET, KVS, NVS and more.',
};

export default function TeachingExamsPage() {
    return <TeachingExamsContent />;
}
