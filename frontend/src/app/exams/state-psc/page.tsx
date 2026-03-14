import { Metadata } from 'next';
import StatePSCExamsContent from './content';

export const metadata: Metadata = {
    title: 'Top State PSC Exams in India 2026 - UPPCS, BPSC, MPSC Dates',
    description: 'Latest information on state-level civil service exams for 2026. Find dates and notifications for UPPCS, BPSC, MPSC, RPSC, and other State Public Service Commissions.',
};

export default function StatePSCExamsPage() {
    return <StatePSCExamsContent />;
}
