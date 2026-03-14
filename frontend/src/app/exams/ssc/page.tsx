import { Metadata } from 'next';
import SSCExamsContent from './content';

export const metadata: Metadata = {
    title: 'Top SSC Exams in India 2026 - CGL, CHSL, MTS Dates & Info',
    description: 'Find comprehensive details on all SSC exams in India for 2026. Get latest updates on SSC CGL, CHSL, MTS, CPO, GD Constables notifications and dates.',
};

export default function SSCExamsPage() {
    return <SSCExamsContent />;
}
