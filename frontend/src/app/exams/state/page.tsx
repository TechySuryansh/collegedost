import { Metadata } from 'next';
import StateExamsContent from './content';

export const metadata: Metadata = {
    title: 'State-Level Government Exams 2026 - Notifications & Dates',
    description: 'Find information on various state government recruitment exams beyond PSC. Get updates on state-level Teacher, Police, and Clerk recruitment for 2026.',
};

export default function StateExamsPage() {
    return <StateExamsContent />;
}
