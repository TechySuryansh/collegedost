import { Metadata } from 'next';
import ScholarshipExamsContent from './content';

export const metadata: Metadata = {
    title: 'Top Scholarship Exams in India 2026 - NTSE, KVPY, Reliance Info',
    description: 'Comprehensive list of major scholarship exams for students in 2026. Get details on NTSE, INSPIRE, Reliance Foundation, and other prestigious scholarships.',
};

export default function ScholarshipExamsPage() {
    return <ScholarshipExamsContent />;
}
