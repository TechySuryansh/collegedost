
import React from 'react';
import Hero from '../components/Hero';
import NewsSection from '../components/NewsSection';
import OtherProducts from '../components/OtherProducts';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import StatsSection from '../components/StatsSection';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import Testimonials from '../components/Testimonials';
import { motion } from 'framer-motion';

import { featuredColleges, examCategories, homeCounsellingData, homeStatsData, homeRankingsData, homeExamsData, homePredictorsData, homeCoursesData } from '../data';

const HomePage = ({ onOpenAskModal }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="overflow-x-hidden"
    >
      <Hero />
      <NewsSection />
      
      <div className="container mx-auto px-4 py-8 md:py-16 flex-grow flex flex-col gap-10 md:gap-20">
        <motion.div variants={itemVariants}>
          <Section 
            title="Explore by Category" 
            items={examCategories} 
            type="category" 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <OtherProducts />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Section 
            title="Featured Colleges" 
            items={featuredColleges} 
            type="card" 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <PredictorsSection 
            data={homePredictorsData} 
            illustration="/predictor-illustration-v2.png"
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <StatsSection items={homeStatsData} />
      </motion.div>

      <div className="container mx-auto px-4 py-8 md:py-16 flex-grow flex flex-col gap-10 md:gap-20">
        <motion.div variants={itemVariants}>
          <Counselling items={homeCounsellingData} onOpenAskModal={onOpenAskModal} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <PillSection title="Top Rankings" items={homeRankingsData} color="border-gray-200" />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <PillSection title="Popular Exams" items={homeExamsData} color="border-gray-200" />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <PredictorsSection 
            title="Online Courses" 
            mainTitle="Boost Your Career"
            subText="Learn from the best. Trending courses and certifications."
            data={homeCoursesData}
            illustration="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg"
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Testimonials />
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
