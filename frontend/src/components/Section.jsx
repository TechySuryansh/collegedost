import React from 'react';
import { FaStar, FaMapMarkerAlt, FaLocationArrow, FaArrowRight, FaDownload, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Section = ({ title, items, type = 'card' }) => {
  return (
    <section className="py-16 relative">
       {/* Decorative subtle background for sections */}
       {type === 'category' && (
         <div className="absolute inset-0 bg-brand-light/50 skew-y-1 -z-10"></div>
       )}

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <div className="h-8 w-1 bg-brand-orange rounded-full"></div>
             <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">{title}</h2>
          </div>
          <a href="#" className="flex items-center gap-2 text-sm font-bold text-brand-indigo hover:text-brand-orange transition-colors group">
            View All <span className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all"><FaArrowRight className="text-xs" /></span>
          </a>
        </div>
        
        <div className={`grid gap-6 ${type === 'category' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {items.map((item, index) => (
            <motion.div 
              key={item.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="h-full"
            >
              {type === 'category' ? (
                (() => {
                  const Component = item.link ? 'a' : 'div';
                  const props = item.link ? { href: item.link } : {};
                  return (
                    <Component 
                      className="glass-card rounded-2xl p-6 text-center h-full flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                      style={{ '--hover-color': item.color }}
                      {...props}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent z-0"></div>
                      <div className="absolute inset-0 bg-[var(--hover-color)] opacity-0 group-hover:opacity-5 transition-opacity duration-500 z-0"></div>
                      
                      {/* Animated Border */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--hover-color)]/30 rounded-2xl transition-colors duration-300 pointer-events-none z-10"></div>
                      
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm relative z-10 bg-white" 
                        style={{ color: item.color, boxShadow: `0 10px 30px -10px ${item.color}40` }}
                      >
                        <item.icon />
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-1 relative z-10 group-hover:text-[var(--hover-color)] transition-colors">{item.title}</h3>
                      {item.subtext && <p className="text-xs text-gray-500 relative z-10">{item.subtext}</p>}
                      
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                         <FaArrowRight className="text-[var(--hover-color)]/50 text-sm" />
                      </div>
                    </Component>
                  );
                })()
              ) : (
                <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-lg hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
                  <div className="p-5 flex gap-4 items-start relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-50"></div>
                    
                    <div className="w-16 h-16 rounded-xl p-1 bg-white shadow-sm border border-gray-100 flex-shrink-0 relative z-10">
                       <img src={item.logo} alt={item.name} className="w-full h-full rounded-lg object-contain" />
                    </div>
                    <div className="relative z-10 flex-1 min-w-0">
                      <h3 className="text-base font-bold mb-2 text-gray-900 line-clamp-2 leading-tight group-hover:text-brand-indigo transition-colors font-heading">{item.name}</h3>
                      <div className="text-xs flex items-center gap-1.5 text-gray-500 font-medium">
                        <FaMapMarkerAlt className="text-brand-orange/80" /> <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                    <span className="absolute top-4 right-4 bg-white text-brand-orange text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-orange-100 shadow-sm z-20">
                      <FaStar className="text-[9px]" /> {item.rating}
                    </span>
                  </div>
                  
                  <div className="px-5 pb-5 flex-1 flex flex-col relative z-10">
                    <div className="flex justify-between mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-brand-indigo/10 transition-colors">
                       <div className="flex flex-col">
                          <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider mb-1">Total Fees</span>
                          <span className="text-sm font-extrabold text-gray-800">{item.fees}</span>
                       </div>
                       <div className="flex flex-col text-right">
                          <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider mb-1">Avg Package</span>
                          <span className="text-sm font-extrabold text-brand-mint">{item.placement}</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-auto">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-white text-gray-600 text-[10px] px-2.5 py-1 rounded-full font-semibold border border-gray-200 group-hover:border-brand-indigo/20 transition-colors">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white border-t border-gray-100 flex gap-3 mt-auto relative z-10">
                    <button className="flex-1 py-3 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:text-brand-indigo hover:border-brand-indigo hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                       <FaDownload /> Brochure
                    </button>
                    <button className="flex-1 py-3 rounded-xl text-xs font-bold bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2">
                       Apply Now <FaPaperPlane />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section;
