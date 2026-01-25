import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { browseByStreamData } from '../data';
import { Link } from 'react-router-dom';

const StudyAbroadPage = ({ onOpenAskModal }) => {
  const data = browseByStreamData.find(d => d.id === 'abroad');

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <SEO 
        title="Study Abroad" 
        description="Top international universities, study abroad exams like IELTS/GRE, and visa guidance."
        keywords="Study Abroad, International Universities, IELTS, GRE, TOEFL, Student Visa"
      />
      <Hero 
        title={<>Global Education. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Limitless Opportunities.</span></>}
        subtitle="Discover top Universities worldwide, Scholarship opportunities, and Exam Prep."
        bgImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[]}
        showBadge={false}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="International Exams" items={data.content.exams} color="border-gray-200" />
        
        <Section 
          title="Top Study Destinations" 
          items={data.content.colleges} // Using colleges list (contains Top University in USA etc.)
          type="card" 
        />
        
        <div className="text-center">
             <Link to="/international-colleges" className="inline-block px-8 py-3 bg-brand-orange text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-colors">
                 Find Universities by Country
             </Link>
        </div>

        <Counselling items={[]} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Study Guides" items={data.content.predictors} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
             <PredictorsSection 
              title="Global Careers" 
              mainTitle="International Degrees"
              subText="Prepare for a global career with degrees from world-renowned institutions."
              data={[]} 
              illustration="https://img.freepik.com/free-vector/travelers-concept-illustration_114360-2642.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default StudyAbroadPage;
