import React, { useState } from 'react';
import { heroTabs } from '../data';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section className="hero-section">
       {/* Background Element */}
      <div className="hero-bg-image"></div>
      <div className="hero-overlay-gradient"></div>

      <div className="container hero-content">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text-center"
        >
          <h1 className="hero-title">
            Empowering Students. <br />
            <span className="hero-title-highlight">Building Futures.</span>
          </h1>
          <p className="hero-subtitle">
            Explore 30,000+ Colleges, exams, and courses to make the informed career choice.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="search-container glass-effect"
        >
          <div className="hero-tabs flex">
            {heroTabs.map(tab => (
              <button 
                key={tab.id}
                className={`hero-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="search-box-wrapper">
            <div className="search-box flex items-center">
              <FaSearch className="search-input-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search for Colleges, Exams, Courses and more..." 
              />
              <button className="search-btn">
                Search
              </button>
            </div>
          </div>
          
          <div className="popular-searches">
             <span className="pop-label">Trending:</span> 
             <a href="#">JEE Main 2026</a>
             <a href="#">NEET PG</a>
             <a href="#">IIM Ahmedabad</a>
             <a href="#">Computer Science</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
