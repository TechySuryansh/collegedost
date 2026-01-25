import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';

const UniversitiesPage = ({ onOpenAskModal }) => {
  // Static data or fetched if available
  const topUniversities = [
      { title: "University of Delhi", href: "#", image: "https://upload.wikimedia.org/wikipedia/commons/e/ed/University_of_Delhi_logo.svg?20220912165518" },
      { title: "Jawaharlal Nehru University", href: "#" },
      { title: "Banaras Hindu University", href: "#" },
      { title: "University of Mumbai", href: "#" }
  ];

  return (
    <>
      <SEO 
        title="Universities" 
        description="Explore top Central, State, and Deemed Universities in India. CUET Info."
        keywords="Universities, Central Universities, State Universities, CUET, UGC"
      />
      <Hero 
        title={<>Higher Learning. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">Centers of Excellence.</span></>}
        subtitle="Discover India's top Universities, Admission Process (CUET), and Courses."
        bgImage="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[]}
        showBadge={false}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Entrance Exams" items={[{title:"CUET UG", href:"#"}, {title:"CUET PG", href:"#"}]} color="border-gray-200" />
        
        <Section 
          title="Top Universities" 
          items={topUniversities} 
          type="card" 
        />

        <Counselling items={[]} onOpenAskModal={onOpenAskModal} />
        
      </div>
    </>
  );
};

export default UniversitiesPage;
