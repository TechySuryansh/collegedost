import React from 'react';
import { latestNews } from '../data';
import './NewsSection.css';
import { FaBolt } from 'react-icons/fa';

const NewsSection = () => {
  return (
    <div className="news-ticker-container">
      <div className="container flex items-center">
        <div className="ticker-label">
          <FaBolt style={{ marginRight: '6px' }} /> Latest News
        </div>
        <div className="ticker-wrapper">
          <div className="ticker-track">
            {latestNews.map((news, idx) => (
              <a href="#" key={idx} className="ticker-item">
                <span className="dot">•</span>
                {news}
              </a>
            ))}
            {/* Duplicate for infinite scroll */}
            {latestNews.map((news, idx) => (
              <a href="#" key={`dup-${idx}`} className="ticker-item">
                 <span className="dot">•</span>
                 {news}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
