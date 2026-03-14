import { Metadata } from 'next';
import RailwayExamsContent from './content';

export const metadata: Metadata = {
    title: 'Latest Railway Exams 2026 - RRB NTPC, Group D, ALP Info',
    description: 'Stay updated with all Railway Recruitment Board (RRB) exams for 2026. Get latest info on NTPC, Group D, ALP, JE, and RPF recruitment.',
};

export default function RailwayExamsPage() {
    return <RailwayExamsContent />;
}
