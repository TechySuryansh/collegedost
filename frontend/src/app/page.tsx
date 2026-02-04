
import HomePageClient from '@/components/HomePageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | CollegeDost',
  description: 'India\'s leading education portal for college admissions, exams, results, and career counselling.',
  keywords: 'college admission, engineering, medical, mba, study abroad, entrance exams, university rankings'
};

export default function Home() {
  return (
    <main>
      <HomePageClient />
    </main>
  );
}
