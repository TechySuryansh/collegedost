import React from 'react';
import { motion } from 'framer-motion';
import {
  FaUniversity, FaBookOpen, FaLaptopCode, FaStethoscope,
  FaBalanceScale, FaChartLine, FaDraftingCompass, FaGlobeAmericas,
  FaListUl, FaRegComments
} from 'react-icons/fa';
import './OtherProducts.css';

const otherProducts = [
  { id: 1, title: 'College Compare', icon: <FaBalanceScale />, color: '#4a90e2' },
  { id: 2, title: 'College Reviews', icon: <FaRegComments />, color: '#f5a623' },
  { id: 3, title: 'B.Tech Companion', icon: <FaDraftingCompass />, color: '#7ed321' },
  { id: 4, title: 'NEET Companion', icon: <FaStethoscope />, color: '#bd10e0' },
  { id: 5, title: 'List of Courses', icon: <FaListUl />, color: '#50e3c2' },
  { id: 6, title: 'College Applications', icon: <FaLaptopCode />, color: '#9013fe' }
];

const OtherProducts = () => {
  return (
    <section className="other-products-section">
      <div className="container">
        <div className="section-header-center">
          <h2 className="section-title">Other Products</h2>
        </div>
        
        <div className="products-grid">
          {otherProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              className="product-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div 
                className="product-icon-wrapper" 
                style={{ color: product.color }}
              >
                {product.icon}
              </div>
              <h3 className="product-title">{product.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherProducts;
