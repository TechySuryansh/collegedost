import React from 'react';
import './Section.css';
import { FaStar, FaMapMarkerAlt, FaLocationArrow, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Section = ({ title, items, type = 'card' }) => {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header flex items-center justify-between">
          <h2 className="section-title">{title}</h2>
          <a href="#" className="view-all-link flex items-center gap-sm">
            View All <FaArrowRight />
          </a>
        </div>
        
        <div className={`section-grid ${type === 'category' ? 'category-grid' : ''}`}>
          {items.map((item, index) => (
            <motion.div 
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`card-item ${type}`}
            >
              {type === 'category' ? (
                <div 
                  className="category-card" 
                  style={{ '--hover-color': item.color }}
                >
                  <div className="cat-icon-wrapper" style={{ background: `${item.color}15`, color: item.color }}>
                    <item.icon />
                  </div>
                  <h3 className="cat-title">{item.title}</h3>
                  {item.subtext && <p className="cat-subtext">{item.subtext}</p>}
                </div>
              ) : (
                <div className="college-card shadow-card-hover">
                  <div className="college-header">
                    <img src={item.logo} alt={item.name} className="college-logo" />
                    <div>
                      <h3 className="college-name">{item.name}</h3>
                      <div className="college-location text-secondary">
                        <FaMapMarkerAlt /> {item.location}
                      </div>
                    </div>
                    <span className="rating-badge"><FaStar /> {item.rating}</span>
                  </div>
                  
                  <div className="college-body">
                    <div className="college-info-row flex justify-between">
                       <div className="info-item">
                          <span className="label">Fees</span>
                          <span className="value">{item.fees}</span>
                       </div>
                       <div className="info-item text-right">
                          <span className="label">Avg Package</span>
                          <span className="value success">{item.placement}</span>
                       </div>
                    </div>
                    
                    <div className="divider"></div>
                    
                    <div className="college-tags">
                      {item.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="college-footer">
                    <button className="btn-outline">Download Brochure</button>
                    <button className="btn-primary">Apply Now</button>
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
