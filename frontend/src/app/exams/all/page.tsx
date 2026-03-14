import { Metadata } from 'next';
import AllExamsContent from './content';

export const metadata: Metadata = {
    title: 'All Competitive Exams in India 2026 - Complete List & Dates',
    description: 'Comprehensive list of all major competitive exams in India for 2026. Browse exams by category: Banking, SSC, Railway, Defence, Teaching, and more.',
};

export default function AllExamsPage() {
    return <AllExamsContent />;
}
