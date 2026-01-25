
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { 
  managementRankings, 
  managementExams, 
  featuredManagementColleges, 
  managementCounsellingData, 
  managementCoursesData,
  managementCities
} from '../data/managementData';

const ManagementPage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Management & B-Schools" 
        description="Explore top MBA colleges, IIMs, entrance exams like CAT/XAT, and management careers in India."
        keywords="MBA colleges, IIM, CAT exam, XAT, B-Schools, Management"
      />
      <Hero 
        title={
          <>
            Lead with Vision. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Pursue Management.</span>
          </>
        }
        subtitle="Discover India's top B-Schools, MBA exams, and leadership programs."
        bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "CAT 2024", link: "#" },
          { text: "IIM Ahmedabad", link: "#" },
          { text: "MBA Placements", link: "#" },
          { text: "XAT 2025", link: "#" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top MBA Rankings" items={managementRankings} color="border-gray-200" />
        
        <Section 
          title="Featured Business Schools" 
          items={featuredManagementColleges} 
          type="card" 
        />

        <Counselling items={managementCounsellingData} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Study in Top Cities" items={managementCities} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="Management Entrance Exams" items={managementExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Management Courses" 
              mainTitle="MBA Specializations"
              subText="Explore trending domains like Analytics, Finance, and Marketing."
              data={managementCoursesData}
              illustration="https://img.freepik.com/free-vector/business-team-discussing-ideas-startup_74855-4380.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default ManagementPage;
