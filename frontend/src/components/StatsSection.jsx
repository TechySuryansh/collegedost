import React from 'react';
import { FaUniversity, FaBookOpen, FaTabletAlt, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const iconMap = {
  FaUniversity: FaUniversity,
  FaBookOpen: FaBookOpen,
  FaTabletAlt: FaTabletAlt,
  FaUsers: FaUsers
};

const StatsSection = ({ items }) => {
  return (
    <section className="relative py-16 mb-20 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-indigo z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0 mix-blend-overlay animate-pulse"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-orange/20 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-cyan/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {items.map((item, index) => {
              const Icon = iconMap[item.icon] || FaUniversity;
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="flex flex-col items-center justify-center text-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl text-brand-orange shadow-lg shadow-black/10 group-hover:bg-white group-hover:text-brand-indigo transition-all duration-300 backdrop-blur-sm border border-white/10">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold leading-none mb-2 text-white font-heading tracking-tight">{item.count}</h3>
                    <p className="text-xs md:text-sm text-blue-200 uppercase tracking-widest font-semibold group-hover:text-white transition-colors">{item.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
