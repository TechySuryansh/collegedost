import React from 'react';
import { FaSearch, FaUniversity, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Hero = ({ 
  title = <>Empowering Students. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-mint">Building Futures.</span></>,
  subtitle = "Explore 30,000+ Colleges, exams, and courses to make the informed career choice.",
  bgImage = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85",
  trending = [
    { text: "JEE Main 2026", link: "#" },
    { text: "NEET PG", link: "#" },
    { text: "IIT Bombay", link: "#" },
    { text: "Computer Science", link: "#" }
  ]
}) => {

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="relative h-[650px] flex items-center justify-center text-center text-white overflow-hidden mb-12 pt-20">
       {/* Background Element */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 motion-safe:animate-kenburns"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/95 via-brand-dark/90 to-brand-indigo/80"></div>
      </div>

      {/* Floating Blobs/Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-32 h-32 bg-brand-violet/30 rounded-full blur-3xl z-10"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-48 h-48 bg-brand-cyan/20 rounded-full blur-3xl z-10"
      />

      <div className="relative z-20 container mx-auto px-4">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge/Pill */}


          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto font-light leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Glassmorphic Card */}
            <div className="glass p-3 md:p-4 rounded-2xl shadow-2xl relative overflow-hidden group">
               {/* Shine Effect */}
               <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine pointer-events-none"></div>

              <div className="bg-white rounded-xl p-2 shadow-inner flex items-center transform transition-transform focus-within:scale-[1.01]">
                <div className="pl-4 text-brand-indigo/60 text-xl">
                  <FaSearch />
                </div>
                <input 
                  type="text" 
                  className="flex-1 w-full border-none py-3 md:py-4 px-4 text-base md:text-lg outline-none font-sans text-gray-800 placeholder-gray-400 bg-transparent" 
                  placeholder="Search for Colleges, Exams, Courses..." 
                />
                <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-brand-indigo to-brand-violet text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:shadow-lg hover:shadow-brand-indigo/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                  Search
                </button>
              </div>
            </div>
            
            {/* Trending Tags */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/90">
               <span className="text-blue-200 font-medium mr-1 flex items-center gap-1"><FaChartLine /> Trending:</span> 
               {trending.map((item, index) => (
                  <motion.a 
                    key={index} 
                    href={item.link} 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="glass px-4 py-1.5 rounded-full text-white/90 hover:text-white transition-all border border-white/10 cursor-pointer"
                  >
                    {item.text}
                  </motion.a>
               ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Strip (Optional floating strip at bottom) */}
        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1, duration: 0.8 }}
           className="absolute -bottom-16 left-0 right-0 hidden lg:flex justify-center gap-12 text-white/80"
        >
             <div className="flex items-center gap-3"><div className="p-3 bg-white/10 rounded-full"><FaUniversity /></div> <div><div className="font-bold text-lg text-white">5000+</div><div className="text-xs text-blue-200">Colleges</div></div></div>
             <div className="flex items-center gap-3"><div className="p-3 bg-white/10 rounded-full"><FaGraduationCap /></div> <div><div className="font-bold text-lg text-white">200+</div><div className="text-xs text-blue-200">Exams</div></div></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
