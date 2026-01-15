import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import OtherProducts from './components/OtherProducts';
import Section from './components/Section';
import Footer from './components/Footer';
import Counselling from './components/Counselling';
import StatsSection from './components/StatsSection';
import PillSection from './components/PillSection';
import PredictorsSection from './components/PredictorsSection';
import CommunityBanner from './components/CommunityBanner';
import AskModal from './components/AskModal';
import ShareModal from './components/ShareModal';
import { featuredColleges, examCategories, homeCounsellingData, homeStatsData, homeRankingsData, homeExamsData, homePredictorsData, homeCoursesData } from './data';

import { useState } from 'react';

function App() {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Navbar 
        onOpenAskModal={() => setIsAskModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />
      <Hero />
      <NewsSection />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        <Section 
          title="Explore by Category" 
          items={examCategories} 
          type="category" 
        />
        
        <Counselling items={homeCounsellingData} onOpenAskModal={() => setIsAskModalOpen(true)} />
        
        <Section 
          title="Featured Colleges" 
          items={featuredColleges} 
          type="card" 
        />
      </div>

      <StatsSection items={homeStatsData} />

      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col gap-16">
        <PillSection title="Top Rankings" items={homeRankingsData} color="border-gray-200" />
        <PillSection title="Popular Exams" items={homeExamsData} color="border-gray-200" />
        
        <PredictorsSection data={homePredictorsData} />
        
        <PredictorsSection 
          title="Online Courses" 
          mainTitle="Boost Your Career"
          subText="Learn from the best. Trending courses and certifications."
          data={homeCoursesData}
          illustration="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg"
        />
      </div>

      <CommunityBanner />
      
      <OtherProducts />
      
      <Footer />
      <AskModal isOpen={isAskModalOpen} onClose={() => setIsAskModalOpen(false)} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  )
}

export default App
