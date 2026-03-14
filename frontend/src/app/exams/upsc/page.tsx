import { Metadata } from 'next';
import UPSCExamsContent from './content';

export const metadata: Metadata = {
    title: 'Top UPSC Exams in India 2026 - IAS, IFS, NDA, CDS Dates',
    description: 'Find comprehensive details on all Union Public Service Commission (UPSC) exams for 2026. Get latest updates on IAS, IFS, NDA, CDS, and more.',
};

export default function UPSCExamsPage() {
    return <UPSCExamsContent />;
}
