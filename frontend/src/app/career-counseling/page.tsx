import type { Metadata } from 'next';
import CareerCounselingClient from './CareerCounselingClient';

export const metadata: Metadata = {
  title: 'AI Career Counseling | CollegeDost',
  description:
    'Get personalized AI-powered career guidance based on your academic profile, interests, and goals. Discover the best career paths, colleges, and entrance exams tailored for you.',
  keywords:
    'career counseling, AI career guidance, college admission, career path, entrance exams, JEE, NEET, CUET, career options after 12th',
};

export default function CareerCounselingPage() {
  return <CareerCounselingClient />;
}
