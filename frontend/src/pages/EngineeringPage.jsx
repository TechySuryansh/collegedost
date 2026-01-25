
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { 
  engineeringRankings, 
  engineeringExams, 
  featuredEngineeringColleges, 
  engineeringCounsellingData, 
  engineeringCoursesData,
  engineeringCities
} from '../data/engineeringData';

const EngineeringPage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Engineering & Architecture" 
        description="India's best portal for B.Tech admission, JEE Main info, top engineering colleges, and career counselling."
        keywords="Engineering colleges, B.Tech, JEE Main, IIT, NIT, B.Arch, Architecture"
      />
      <Hero 
        title={
          <>
            Build the Future. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Study Engineering.</span>
          </>
        }
        subtitle="Explore top Engineering colleges, exams, and admission guidance."
        bgImage="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "JEE Main 2025", link: "/exams/jee-main" },
          { text: "IIT Madras", link: "#" },
          { text: "Rank Predictor", link: "/jee-main-rank-predictor" },
          { text: "College Predictor", link: "/jee-main-predictor" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top Engineering Rankings" items={engineeringRankings} color="border-gray-200" />
        
        <Section 
          title="Featured Engineering Colleges" 
          items={featuredEngineeringColleges} 
          type="card" 
        />

        <Counselling items={engineeringCounsellingData} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Top Engineering Hubs" items={engineeringCities} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="Engineering Entrance Exams" items={engineeringExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Engineering Courses" 
              mainTitle="B.Tech & B.Arch Specializations"
              subText="Choose from diverse fields like CSE, ECE, Mechanical, and more."
              data={engineeringCoursesData}
              illustration="https://img.freepik.com/free-vector/engineer-developer-with-laptop-tablet-working_603843-524.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default EngineeringPage;
