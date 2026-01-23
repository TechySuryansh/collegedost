import React from 'react';
import { latestNews } from '../data';
import { FaBolt } from 'react-icons/fa';

const NewsSection = () => {
  return (
    <div className="bg-brand-dark border-y border-white/5 py-3 overflow-hidden relative">
      <div className="container mx-auto px-4 flex items-center">
        <div className="bg-gradient-to-r from-brand-orange to-brand-orange-light text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2 mr-6 flex-shrink-0 shadow-lg shadow-brand-orange/20 z-10 relative">
          <FaBolt className="animate-pulse" /> LATEST UPDATES
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-12 animate-scroll w-max hover:paused">
            {[...latestNews, ...latestNews].map((news, idx) => (
              <a href="#" key={idx} className="text-sm text-gray-400 font-medium flex items-center gap-3 hover:text-white transition-colors whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
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
