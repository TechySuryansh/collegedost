import type { Metadata } from 'next';
import PredictorsPageContent from './content';

export const metadata: Metadata = {
    title: 'Rank Predictors | CollegeDost',
    description: 'Predict your admission chances with AI-powered rank & college predictors. Enter your rank or score to find out the best colleges you can get into.',
};

export default function PredictorsPage() {
    return <PredictorsPageContent />;
}
