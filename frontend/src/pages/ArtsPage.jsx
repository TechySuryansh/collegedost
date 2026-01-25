import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import SEO from '../components/SEO';

const ArtsPage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Arts & Humanities" 
        description="Top Arts colleges (BA, MA), Humanities courses, and career options."
        keywords="Arts, Humanities, BA, MA, Psychology, Sociology, History"
      />
      <Hero 
        title={<>Understanding Humanity. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Shaping Culture.</span></>}
        subtitle="Explore top Arts Colleges, Humanities Courses, and diverse Career Paths."
        bgImage="https://images.unsplash.com/photo-1460518451285-97b6aa326961?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[]}
        showBadge={false}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top Courses" items={[{title:"BA Economics", href:"#"}, {title:"BA Psychology", href:"#"}, {title:"BA English", href:"#"}]} color="border-gray-200" />
        
        <Section 
          title="Top Arts Colleges" 
          items={[{title:"Lady Shri Ram College", href:"#"}, {title:"Loyola College", href:"#"}, {title:"St. Xavier's Mumbai", href:"#"}]} 
          type="card" 
        />

        <Counselling items={[]} onOpenAskModal={onOpenAskModal} />
        
      </div>
    </>
  );
};

export default ArtsPage;
