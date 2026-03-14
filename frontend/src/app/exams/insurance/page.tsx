import { Metadata } from 'next';
import InsuranceExamsContent from './content';

export const metadata: Metadata = {
    title: 'Top Insurance Exams in India 2026 - LIC, NIACL, GIC Info',
    description: 'Latest information on insurance sector recruitment exams for 2026. Find dates, syllabus, and notifications for LIC AAO, ADO, NIACL, and other insurance exams.',
};

export default function InsuranceExamsPage() {
    return <InsuranceExamsContent />;
}
