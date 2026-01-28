import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaChartLine, FaArrowRight, FaMapMarkerAlt, FaUniversity } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Hero = ({ 
  title = "Empowering Students. Building Futures.",
  subtitle = "Explore 30,000+ Colleges, exams, and courses to make the informed career choice.",
  trending = [
    { text: "JEE Mains College Predictor", link: "/jee-main-predictor" },
    { text: "NEET College Predictor", link: "/predict-colleges?exam=NEET" },
    { text: "IIT Bombay", link: "/colleges/iit-bombay" },
    { text: "Computer Science", link: "/colleges?branch=Computer Science" }
  ],
  showBadge = true
}) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Search Suggestions Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
        if (search.length >= 2) {
            try {
                // Use full URL or import configured axios instance. Using direct URL for safety in component.
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/colleges/search?q=${search}`);
                if (res.data.success) {
                    setSuggestions(res.data.data);
                    setShowSuggestions(true);
                }
            } catch (err) {
                console.error("Search Error", err);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Click Outside to Close
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (searchRef.current && !searchRef.current.contains(event.target)) {
              setShowSuggestions(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
        navigate(`/colleges?search=${encodeURIComponent(search)}`);
        setShowSuggestions(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-[850px] flex items-center justify-center text-center text-white overflow-visible mb-20 pt-20 bg-brand-deep-bg">
       
       {/* Premium Gradient Background */}
       <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] z-0 overflow-hidden"></div>

       {/* Animated Mesh Gradients/Blobs */}
       <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <motion.div 
            animate={{ 
               scale: [1, 1.2, 1],
               opacity: [0.3, 0.5, 0.3],
               rotate: [0, 45, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-brand-violet/20 rounded-full blur-[100px]"
          />
          <motion.div 
             animate={{ 
               scale: [1, 1.1, 1],
               x: [0, 50, 0],
               opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-brand-cyan/20 rounded-full blur-[80px]"
          />
           <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[300px] bg-brand-blue-dark/30 rounded-full blur-[100px]"></div>
       </div>

       {/* Grid Pattern Overlay */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] z-0 pointer-events-none"></div>


      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-7xl mx-auto w-full flex flex-col items-center"
        >
            {showBadge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-neon">
                    <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse"></span>
                    <span className="text-xs font-medium tracking-wide text-blue-200 uppercase">Admissions 2026 Open</span>
                </div>
            )}

            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-2xl">
              {title}
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto font-light leading-relaxed mb-10">
              {subtitle}
            </p>

            {/* Premium Glass Search Bar with Autocomplete */}
            <div className="relative w-full max-w-3xl mx-auto group z-50 text-left" ref={searchRef}>
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
                
                <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-2xl transition-all focus-within:bg-white/15 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20">
                    
                    <div className="pl-6 pr-4 text-white/50 text-xl">
                        <FaSearch />
                    </div>
                    
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 w-full bg-transparent border-none py-4 text-lg text-white placeholder-blue-200/50 outline-none font-medium"
                        placeholder="Search specific colleges, exams, courses..." 
                    />
                    
                    <button 
                        onClick={handleSearch}
                        className="hidden md:flex items-center gap-2 bg-white text-brand-blue-dark px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-blue-50 transition-all shadow-lg transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        Search
                    </button>
                    
                    <button onClick={handleSearch} className="md:hidden p-3 bg-white text-brand-blue-dark rounded-full mr-1">
                        <FaArrowRight />
                    </button>
                </div>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden text-gray-800"
                    >
                        {suggestions.map((item) => (
                            <div 
                                key={item._id}
                                onClick={() => navigate(`/colleges/${item.slug}`)} 
                                className="px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-blue-50 cursor-pointer flex items-center gap-4 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-brand-blue-dark flex-shrink-0">
                                    <FaUniversity />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.name}</h4>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-gray-400" /> {item.location?.city} 
                                        {item.nirfRank && <span className="ml-2 text-green-600 font-bold">• NIRF #{item.nirfRank}</span>}
                                    </p>
                                </div>
                                <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 hidden sm:inline-block">{item.type}</span>
                            </div>
                        ))}
                        <div 
                            onClick={handleSearch}
                            className="px-6 py-3 bg-gray-50 text-center text-brand-blue font-bold text-sm cursor-pointer hover:bg-gray-100"
                        >
                            View all results for "{search}"
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Trending Tags */}
            {trending.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <span className="text-sm font-medium text-blue-200/70 mr-2 flex items-center gap-1.5 uppercase tracking-wider text-[10px]"><FaChartLine /> Trending searches:</span> 
                {trending.map((item, index) => (
                    <motion.a 
                        key={index} 
                        href={item.link} 
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-1.5 rounded-full text-xs font-medium text-blue-100 bg-white/5 border border-white/10 hover:border-white/30 transition-all cursor-pointer backdrop-blur-sm shadow-sm"
                    >
                        {item.text}
                    </motion.a>
                ))}
                </div>
            )}

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
