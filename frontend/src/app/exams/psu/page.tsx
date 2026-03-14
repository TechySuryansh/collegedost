import { Metadata } from 'next';
import PSUExamsContent from './content';

export const metadata: Metadata = {
    title: 'Top PSU Recruitment Exams 2026 - ONGC, NTPC, BHEL Info',
    description: 'Find all about recruitment in Public Sector Undertakings (PSUs) for 2026. Get updates on GATE-based recruitment and independent PSU exams.',
};

export default function PSUExamsPage() {
    return <PSUExamsContent />;
}
