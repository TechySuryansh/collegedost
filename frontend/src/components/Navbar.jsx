import React, { useState, useEffect } from 'react';
import { navLinks, browseByStreamData, testPrepData, collegesData, examsData, coursesData, predictorsData, rankingsData, counsellingData, careersData, moreData } from '../data';
import { FaSearch, FaUser, FaBars, FaTh, FaChevronDown, FaAngleRight, FaQuestion, FaShareAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';


import AuthModal from './AuthModal';

const Navbar = ({ onOpenAskModal, onOpenShareModal }) => {

  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeStream, setActiveStream] = useState('engineering'); // Default active stream
  const [activeTestPrepStream, setActiveTestPrepStream] = useState('engineering-prep');
  const [activeCollegeStream, setActiveCollegeStream] = useState('top-colleges');
  const [activeExamStream, setActiveExamStream] = useState('engineering');
  const [activeCourseStream, setActiveCourseStream] = useState('degree');
  const [activePredictorStream, setActivePredictorStream] = useState('engineering');
  const [activeRankingStream, setActiveRankingStream] = useState('engineering');
  const [activeCounsellingStream, setActiveCounsellingStream] = useState('engineering');
  const [activeCareerStream, setActiveCareerStream] = useState('stream');
  const [activeMoreStream, setActiveMoreStream] = useState('learn');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (title) => {
    setActiveDropdown(title);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
  // ... rest of stream logic ...

  // Find the active stream data
  const currentStreamDataObj = browseByStreamData.find(s => s.id === activeStream) || {};
  const currentStreamContent = currentStreamDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  // Find active Test Prep data
  const currentTestPrepDataObj = testPrepData.find(s => s.id === activeTestPrepStream) || {};
  const currentTestPrepContent = currentTestPrepDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  // Find active College data
  const currentCollegeDataObj = collegesData.find(s => s.id === activeCollegeStream) || {};
  const currentCollegeContent = currentCollegeDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  // Find active Exam data
  const currentExamDataObj = examsData.find(s => s.id === activeExamStream) || {};
  const currentExamContent = currentExamDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  // Find active Course data
  const currentCourseDataObj = coursesData.find(s => s.id === activeCourseStream) || {};
  const currentCourseContent = currentCourseDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  // Find active Predictor data
  const currentPredictorDataObj = predictorsData.find(s => s.id === activePredictorStream) || {};
  const currentPredictorContent = currentPredictorDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  // Find active Ranking data
  const currentRankingDataObj = rankingsData.find(s => s.id === activeRankingStream) || {};
  const currentRankingContent = currentRankingDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  // Find active Counselling data
  const currentCounsellingDataObj = counsellingData.find(s => s.id === activeCounsellingStream) || {};
  const currentCounsellingContent = currentCounsellingDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  // Find active Career data
  const currentCareerDataObj = careersData.find(s => s.id === activeCareerStream) || {};
  const currentCareerContent = currentCareerDataObj.content || { col1: [], col2: [], col3_1: [] };

  // Find active More data
  const currentMoreDataObj = moreData.find(s => s.id === activeMoreStream) || {};
  const currentMoreContent = currentMoreDataObj.content || { col1: [], col2: [], col3_1: [] };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 ${scrolled ? 'glass' : 'bg-white/90 backdrop-blur-md shadow-sm'}`}>
      <div className="py-3 border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-gray-700 text-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-orange text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                <span className="text-lg">CD</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl text-brand-indigo leading-tight tracking-tight">Collegedost</span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">The Education Hub</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-gray-600">
              <button onClick={onOpenAskModal} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors font-medium text-sm">
                <FaQuestion className="text-gray-400" /> <span>Ask</span>
              </button>
              <button onClick={onOpenShareModal} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors font-medium text-sm">
                <FaShareAlt className="text-gray-400" /> <span>Share</span>
              </button>
            </div>
            <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300">
              <FaUser className="text-xs" /> <span className="hidden sm:inline">Login / Signup</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative bg-white h-[52px] hidden lg:block">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <ul className="flex items-center gap-1 h-full">
            {navLinks.map((link, index) => (
              <li
                key={index}
                className="h-full group"
                onMouseEnter={() => handleMouseEnter(link.title)}
                onMouseLeave={handleMouseLeave}
              >
                <a href={link.href} className="flex items-center gap-1.5 h-full px-4 text-sm font-medium text-slate-600 border-b-2 border-transparent hover:text-brand-indigo hover:bg-slate-50/50 hover:border-brand-orange transition-all duration-200">
                  {link.title}
                  {link.hasDropdown && <FaChevronDown className="text-[10px] opacity-60 group-hover:opacity-100 transition-opacity" />}
                </a>

                {/* Specific Layout for "Browse by Stream" */}
                <AnimatePresence>
                  {link.title === 'Browse by Stream' && activeDropdown === 'Browse by Stream' && (
                    <>
                      {/* Backdrop - Visual only, allows hover-out to underlying elements to trigger close */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-[110px] bg-black/40 backdrop-blur-[2px] z-[55]"
                        style={{ height: 'calc(100vh - 110px)' }}
                      />

                      {/* Pop-up Menu Container */}
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.99 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl shadow-premium-hover rounded-b-2xl border-t border-white/20 z-[60] overflow-hidden flex"
                        style={{ height: 'calc(100vh - 120px)' }}
                      >
                        {/* Sidebar */}
                        <div className="w-80 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-200">
                          {browseByStreamData.map((stream) => (
                            <div
                              key={stream.id}
                              className={`flex items-center justify-between px-6 py-3.5 text-[15px] transition-all cursor-pointer relative ${activeStream === stream.id ? 'text-brand-orange font-bold bg-orange-50/50' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                              onMouseEnter={() => setActiveStream(stream.id)}
                            >
                              {activeStream === stream.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange"></div>
                              )}
                              {stream.label}
                              <FaAngleRight className={`text-xs transition-opacity ${activeStream === stream.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                            </div>
                          ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 bg-white p-10 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-200">
                          <div className="grid grid-cols-2 gap-x-20 gap-y-12 pb-20">
                            {/* Column 1: Exams & Predictors */}
                            <div className="flex flex-col gap-10">
                              <div>
                                <h4 className="text-base font-bold text-gray-900 mb-5 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col1 || 'Exams'}</h4>
                                <ul className="flex flex-col gap-3.5">
                                  {currentStreamContent.exams.map((item, idx) => (
                                    <li key={idx}>
                                      <a href={item.href} className={`text-[14px] transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold mt-1' : 'text-slate-600 hover:text-brand-orange'}`}>
                                        {item.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="content-section">
                                <h4 className="text-base font-bold text-gray-900 mb-5 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col3_1 || 'Predictors'}</h4>
                                <ul className="flex flex-col gap-3.5">
                                  {currentStreamContent.predictors.map((item, idx) => (
                                    <li key={idx}>
                                      <a href={item.href} className={`text-[14px] transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold mt-1' : 'text-slate-600 hover:text-brand-orange'}`}>
                                        {item.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Column 2: Colleges & Resources */}
                            <div className="flex flex-col gap-10">
                              <div>
                                <h4 className="text-base font-bold text-gray-900 mb-5 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col2 || 'Colleges'}</h4>
                                <ul className="flex flex-col gap-3.5">
                                  {currentStreamContent.colleges.map((item, idx) => (
                                    <li key={idx}>
                                      <a href={item.href} className="text-[14px] transition-colors block text-gray-600 hover:text-brand-orange">
                                        {item.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="content-section">
                                <h4 className="text-base font-bold text-gray-900 mb-5 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col3_2 || 'Resources'}</h4>
                                <ul className="flex flex-col gap-3.5">
                                  {currentStreamContent.resources.map((item, idx) => (
                                    <li key={idx}>
                                      <a href={item.href} className="text-[14px] transition-colors block text-gray-600 hover:text-brand-orange">
                                        {item.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Test Prep Mega Menu */}
                <AnimatePresence>
                  {link.title === 'Test Prep' && activeDropdown === 'Test Prep' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-[60] overflow-hidden flex"
                    >
                      <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto">
                        {testPrepData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activeTestPrepStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveTestPrepStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-16">
                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentTestPrepDataObj.titles?.col1 || 'Exam Prep'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentTestPrepContent.exams?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentTestPrepDataObj.titles?.col3_1 || 'Previous Papers'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentTestPrepContent.predictors?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentTestPrepDataObj.titles?.col2 || 'Mock Tests'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentTestPrepContent.colleges?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentTestPrepDataObj.titles?.col3_2 || 'Resources'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentTestPrepContent.resources?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>


                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Colleges Mega Menu */}
                <AnimatePresence>
                  {link.title === 'Colleges' && activeDropdown === 'Colleges' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-[60] overflow-hidden flex"
                    >
                      <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto">
                        {collegesData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activeCollegeStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveCollegeStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-16">
                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCollegeDataObj.titles?.col1 || 'Section 1'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCollegeContent.exams?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCollegeDataObj.titles?.col3_1 || 'Section 3'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCollegeContent.predictors?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCollegeDataObj.titles?.col2 || 'Section 2'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCollegeContent.colleges?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCollegeDataObj.titles?.col3_2 || 'Section 4'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCollegeContent.resources?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>


                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Exams Mega Menu */}
                <AnimatePresence>
                  {link.title === 'Exams' && activeDropdown === 'Exams' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-[60] overflow-hidden flex"
                    >
                      <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto">
                        {examsData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activeExamStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveExamStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-16">
                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentExamDataObj.titles?.col1 || 'Section 1'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentExamContent.exams?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentExamDataObj.titles?.col3_1 || 'Section 3'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentExamContent.predictors?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentExamDataObj.titles?.col2 || 'Section 2'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentExamContent.colleges?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentExamDataObj.titles?.col3_2 || 'Section 4'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentExamContent.resources?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>


                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Courses Mega Menu */}
                <AnimatePresence>
                  {link.title === 'Courses' && activeDropdown === 'Courses' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-[60] overflow-hidden flex"
                    >
                      <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto">
                        {coursesData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activeCourseStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveCourseStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-16">
                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCourseDataObj.titles?.col1 || 'Section 1'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCourseContent.exams?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCourseDataObj.titles?.col3_1 || 'Section 3'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCourseContent.predictors?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCourseDataObj.titles?.col2 || 'Section 2'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCourseContent.colleges?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCourseDataObj.titles?.col3_2 || 'Section 4'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCourseContent.resources?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>


                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Predictors Mega Menu */}
                <AnimatePresence>
                  {link.title === 'Predictors' && activeDropdown === 'Predictors' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-[60] overflow-hidden flex"
                    >
                      <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto">
                        {predictorsData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activePredictorStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActivePredictorStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-16">
                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentPredictorDataObj.titles?.col1 || 'Section 1'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentPredictorContent.exams?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentPredictorDataObj.titles?.col3_1 || 'Section 3'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentPredictorContent.predictors?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentPredictorDataObj.titles?.col2 || 'Section 2'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentPredictorContent.colleges?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentPredictorDataObj.titles?.col3_2 || 'Section 4'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentPredictorContent.resources?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>


                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Counselling Mega Menu */}
                <AnimatePresence>
                  {link.title === 'Counselling' && activeDropdown === 'Counselling' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-[60] overflow-hidden flex"
                    >
                      <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto">
                        {counsellingData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activeCounsellingStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveCounsellingStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-16">
                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCounsellingDataObj.titles?.col1 || 'Section 1'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCounsellingContent.exams?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCounsellingDataObj.titles?.col3_1 || 'Section 3'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCounsellingContent.predictors?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCounsellingDataObj.titles?.col2 || 'Section 2'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCounsellingContent.colleges?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentCounsellingDataObj.titles?.col3_2 || 'Section 4'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCounsellingContent.resources?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>


                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Rankings Mega Menu */}
                <AnimatePresence>
                  {link.title === 'Rankings' && activeDropdown === 'Rankings' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-[60] overflow-hidden flex"
                    >
                      <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto">
                        {rankingsData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activeRankingStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveRankingStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-16">
                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentRankingDataObj.titles?.col1 || 'Section 1'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentRankingContent.exams?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-blue font-semibold' : 'text-gray-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentRankingDataObj.titles?.col3_1 || 'Section 3'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentRankingContent.predictors?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-blue font-semibold' : 'text-gray-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentRankingDataObj.titles?.col2 || 'Section 2'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentRankingContent.colleges?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{currentRankingDataObj.titles?.col3_2 || 'Section 4'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentRankingContent.resources?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>


                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Careers Mega Menu */}
                <AnimatePresence>
                  {link.title === 'Careers' && activeDropdown === 'Careers' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-[60] overflow-hidden flex"
                    >
                      <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto">
                        {careersData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activeCareerStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveCareerStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-16">
                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">By Stream / Option</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCareerContent.col1?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-blue font-semibold' : 'text-gray-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Resources</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCareerContent.col3_1?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-blue font-semibold' : 'text-gray-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Other Options</h4>
                              <ul className="flex flex-col gap-3">
                                {currentCareerContent.col2?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* More Mega Menu */}
                <AnimatePresence>
                  {link.title === 'More' && activeDropdown === 'More' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl border-t border-gray-100 z-[60] overflow-hidden flex"
                    >
                      <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 py-4 overflow-y-auto">
                        {moreData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activeMoreStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveMoreStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-16">
                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Learn & Study</h4>
                              <ul className="flex flex-col gap-3">
                                {currentMoreContent.col1?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-blue font-semibold' : 'text-gray-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Services</h4>
                              <ul className="flex flex-col gap-3">
                                {currentMoreContent.col3_1?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-blue font-semibold' : 'text-gray-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Resources</h4>
                              <ul className="flex flex-col gap-3">
                                {currentMoreContent.col2?.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Generic Dropdown for others (simpler) */}
                {link.title !== 'Browse by Stream' && link.title !== 'Test Prep' && link.title !== 'Colleges' && link.title !== 'Exams' && link.title !== 'Courses' && link.title !== 'Rankings' && link.title !== 'Predictors' && link.title !== 'Counselling' && link.title !== 'Careers' && link.title !== 'More' && link.hasDropdown && activeDropdown === link.title && (
                  <div className="simple-dropdown">
                    {/* ... other dropdowns can be implemented similarly ... */}
                  </div>
                )}
              </li>
            ))}

          </ul>
        </div>
      </div>
      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="font-heading font-bold text-xl text-brand-blue">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="p-4">
                <div className="flex gap-4 mb-6">
                  <button onClick={onOpenAskModal} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-50 text-gray-700 font-medium text-sm hover:bg-slate-100 border border-gray-200">
                    <FaQuestion className="text-brand-orange" /> Ask
                  </button>
                  <button onClick={onOpenShareModal} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-50 text-gray-700 font-medium text-sm hover:bg-slate-100 border border-gray-200">
                    <FaShareAlt className="text-brand-orange" /> Share
                  </button>
                </div>

                <ul className="flex flex-col space-y-2">
                  {navLinks.map((link, index) => (
                    <li key={index} className="border-b border-gray-50 last:border-0">
                      <div className="py-3">
                        <a
                          href={link.href}
                          className="flex items-center justify-between text-gray-700 font-medium hover:text-brand-orange"
                          onClick={() => !link.hasDropdown && setIsMobileMenuOpen(false)}
                        >
                          {link.title}
                          {link.hasDropdown && <FaChevronDown className="text-xs text-gray-400" />}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};


export default Navbar;
