import React from 'react';
import { FaUserMd, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';

const Counselling = ({ items, onOpenAskModal }) => {
  return (
    <section className="mb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100 ${item.color}`}
            >
              <div className="flex-1 z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-6">{item.description}</p>
                {item.cta === "Ask Now" ? (
                  <button 
                    onClick={onOpenAskModal}
                    className="inline-flex items-center gap-2 font-bold text-brand-orange hover:gap-3 transition-all"
                  >
                    {item.cta} <FaArrowRight />
                  </button>
                ) : (
                  <a 
                    href={item.link} 
                    className="inline-flex items-center gap-2 font-bold text-brand-orange hover:gap-3 transition-all"
                  >
                    {item.cta} <FaArrowRight />
                  </a>
                )}
              </div>
              <div className="w-full md:w-1/3 h-40 md:h-auto relative z-10 flex items-center justify-center">
                 {/* Placeholder for image or icon if actual image fails */}
                 <div className="text-6xl text-brand-blue opacity-20">
                    {index === 0 ? <FaUserMd /> : <FaQuestionCircle />}
                 </div>
                 <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-80 mix-blend-multiply"
                 />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counselling;
