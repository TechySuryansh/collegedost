import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { browseByStreamData } from '../data';

const DesignPage = ({ onOpenAskModal }) => {
  const data = browseByStreamData.find(d => d.id === 'animation');

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <SEO 
        title="Design & Animation" 
        description="Explore top Design colleges, NIFT/NID exams, and creative careers in India."
        keywords="Design colleges, NIFT, NID, Fashion Design, Graphic Design, Animation"
      />
      <Hero 
        title={<>Thinking Design. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Creating the Future.</span></>}
        subtitle="Discover India's top Design Schools, Entrance Exams, and Creative Portfolios."
        bgImage="https://images.unsplash.com/photo-1558655146-d09347e0b7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[]}
        showBadge={false}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Design Entrance Exams" items={data.content.exams} color="border-gray-200" />
        
        <Section 
          title="Featured Design Colleges" 
          items={data.content.colleges} 
          type="card" 
        />

        <Counselling items={[]} onOpenAskModal={onOpenAskModal} /> {/* Empty items for now or add generic */}
        
        <PillSection title="Predictors & Resources" items={data.content.predictors} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
             <PredictorsSection 
              title="Design Courses" 
              mainTitle="Fashion & Industrial Design"
              subText="Explore specializations like Fashion, Interior, Product, and Graphic Design."
              data={[]} 
              illustration="https://img.freepik.com/free-vector/creative-team-working-project_74855-4813.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default DesignPage;
