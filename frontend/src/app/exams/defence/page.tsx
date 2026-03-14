import { Metadata } from 'next';
import DefenceExamsContent from './content';

export const metadata: Metadata = {
    title: 'Top Defence Exams in India 2026 - NDA, CDS, AFCAT Info',
    description: 'Find complete details on Defence exams in India for 2026. Get latest updates on NDA, CDS, AFCAT, Air Force, and Navy recruitment notifications.',
};

export default function DefenceExamsPage() {
    return <DefenceExamsContent />;
}
