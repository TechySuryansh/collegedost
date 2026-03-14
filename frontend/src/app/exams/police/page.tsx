import { Metadata } from 'next';
import PoliceExamsContent from './content';

export const metadata: Metadata = {
    title: 'Top Police & Paramilitary Exams 2026 - SSC CPO, State Police Info',
    description: 'Complete guide to police recruitment exams in India for 2026. Find dates and notifications for SSC CPO, State Police SI, Constables, and Paramilitary forces.',
};

export default function PoliceExamsPage() {
    return <PoliceExamsContent />;
}
