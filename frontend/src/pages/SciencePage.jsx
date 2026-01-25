import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import SEO from '../components/SEO';

const SciencePage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Science" 
        description="Top Science colleges (B.Sc, M.Sc), Research Institutes, and career in Science."
        keywords="Science, B.Sc, M.Sc, Research, IISc, IISER"
      />
      <Hero 
        title={<>Exploring the Unknown. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Discovering Truth.</span></>}
        subtitle="Find top Science Colleges, Research Institutes, and Entrance Exams like NEST/KVPY."
        bgImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[]}
        showBadge={false}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Entrance Exams" items={[{title:"NEST", href:"#"}, {title:"IIT JAM", href:"#"}, {title:"CUET Science", href:"#"}]} color="border-gray-200" />
        
        <Section 
          title="Top Science Colleges" 
          items={[{title:"St. Stephen's College", href:"#"}, {title:"Miranda House", href:"#"}, {title:"IISc Bangalore", href:"#"}]} 
          type="card" 
        />

        <Counselling items={[]} onOpenAskModal={onOpenAskModal} />
        
      </div>
    </>
  );
};

export default SciencePage;
