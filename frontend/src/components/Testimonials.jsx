import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "IIT Bombay, CSE",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Collegedost's College Predictor was spot on! It helped me shortlist the right NITs based on my rank, and the counselling resources were a lifesaver.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "NEET Rank 1500",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "The mock tests were incredibly close to the actual exam pattern. I improved my speed and accuracy significantly.",
    rating: 5
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "CAT 99.8%ile",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    quote: "Comprehensive study material and the community support kept me motivated throughout my preparation journey.",
    rating: 4
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-brand-light">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-indigo/10 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] -z-10 animate-float"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-indigo font-bold tracking-wider uppercase text-sm mb-3 block">Student Success</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Hear from our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Achievers</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Join thousands of students who have found their dream college and career path with Collegedost.
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto relative px-8 md:px-20">
            {/* Navigation Buttons - Absolute positioned outside the card */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass border border-white/40 flex items-center justify-center text-gray-700 hover:text-brand-orange hover:bg-white transition-all shadow-lg hover:shadow-xl z-20 group hidden md:flex"
            >
              <FaChevronLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass border border-white/40 flex items-center justify-center text-gray-700 hover:text-brand-orange hover:bg-white transition-all shadow-lg hover:shadow-xl z-20 group hidden md:flex"
            >
              <FaChevronRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>

          <div className="relative min-h-[450px] md:min-h-[400px]">
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="w-full absolute inset-0"
              >
                {/* Main Card */}
                <div className="glass-card p-8 md:p-14 rounded-[2.5rem] relative mx-auto backdrop-blur-2xl bg-white/40 border-t border-white/60 shadow-2xl h-full flex flex-col md:flex-row items-center gap-10">
                  
                  {/* Decorative Quote Icon behind */}
                  <div className="absolute top-10 right-10 text-9xl text-brand-indigo/5 font-serif pointer-events-none leading-none select-none">"</div>

                  {/* Left Side: Image & Profile */}
                  <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left z-10 w-full md:w-auto">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10">
                            <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} className="w-full h-full object-cover" />
                        </div>
                        {/* Decorative circle behind image */}
                        <div className="absolute -top-3 -right-3 w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white text-xl border-4 border-white shadow-lg z-20">
                            <FaQuoteLeft className="w-4 h-4" />
                        </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-gray-900 font-heading mb-1">{testimonials[currentIndex].name}</h4>
                    <p className="text-brand-indigo font-semibold text-sm mb-4 uppercase tracking-wide bg-brand-indigo/5 px-3 py-1 rounded-full">{testimonials[currentIndex].role}</p>
                    
                    <div className="flex gap-1 text-brand-orange text-sm bg-white/50 px-3 py-1.5 rounded-full border border-white/40">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < testimonials[currentIndex].rating ? "drop-shadow-sm" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>

                  {/* Right Side: content */}
                  <div className="flex-1 z-10 text-center md:text-left">
                     <p className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed tracking-wide">
                       "{testimonials[currentIndex].quote}"
                     </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-500 ease-out rounded-full ${
                  index === currentIndex 
                    ? 'w-10 h-3 bg-gradient-to-r from-brand-orange to-red-500 shadow-md scale-110' 
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
