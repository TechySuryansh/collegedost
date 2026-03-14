import React from 'react';
import BankingExamsContent from './content';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Banking Exams 2026: Complete List of Upcoming Sarkari Banking Exams in India',
    description: 'Get the complete list of Banking exams in India for 2026. Find exam dates, syllabus, eligibility, application form, admit card, and result for IBPS PO, SBI Clerk, RBI Grade B and more.'
};

const BankingExamsPage = () => {
    return <BankingExamsContent />;
};

export default BankingExamsPage;
