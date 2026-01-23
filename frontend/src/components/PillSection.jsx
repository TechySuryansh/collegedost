import React from 'react';
import { FaArrowRight, FaChevronRight } from 'react-icons/fa';

const PillSection = ({ title, items, color = "border-gray-200" }) => {
  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold font-heading text-gray-900 pl-3 border-l-4 border-brand-orange">{title}</h2>
        <a href="#" className="flex items-center gap-2 text-sm font-bold text-brand-indigo hover:text-brand-orange transition-colors group">
          View All <span className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all"><FaArrowRight className="text-xs" /></span>
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <a 
            key={index} 
            href={item.link}
            className="group relative flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-premium hover:border-brand-indigo/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-indigo opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="relative z-10 font-bold text-gray-700 group-hover:text-brand-indigo transition-colors text-sm md:text-[15px] pr-4">
              {item.name}
            </span>
            
            <span className="relative z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:bg-brand-indigo group-hover:text-white transition-all duration-300 shadow-sm border border-gray-50">
               <FaChevronRight className="text-xs" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PillSection;
