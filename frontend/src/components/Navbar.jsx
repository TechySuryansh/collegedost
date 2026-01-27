import React, { useState, useEffect } from 'react';
import { navLinks, browseByStreamData, testPrepData, collegesData, examsData, coursesData, predictorsData, rankingsData, counsellingData, careersData, moreData } from '../data';
import { FaSearch, FaUser, FaBars, FaTh, FaChevronDown, FaAngleRight, FaQuestion, FaShareAlt, FaBookOpen, FaChartPie, FaUniversity, FaNewspaper, FaUserShield, FaArrowLeft, FaTimes, FaGraduationCap, FaTrophy, FaBriefcase, FaEllipsisH, FaComments, FaHome, FaCompass, FaChartLine, FaStethoscope, FaLaptopCode, FaBalanceScale, FaPalette, FaMicrophone, FaCoins, FaDesktop, FaFlask, FaPlane, FaSchool, FaGlobeAmericas, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenAskModal, onOpenShareModal, onOpenAuthModal }) => {
  const { user, logout, protectAction } = useAuth(); // Context Hook
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminMode = location.pathname.startsWith('/admin');
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null); // Mobile Accordion State (Level 2)
  const [expandedSection, setExpandedSection] = useState(null); // Mobile Main Section State (Level 1)
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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const handleLogout = () => {
      logout();
      setIsUserDropdownOpen(false);
  };

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

  const adminLinks = [
    { title: 'Dashboard', href: '/admin', icon: FaChartPie },
    { title: 'Colleges', href: '/admin/colleges', icon: FaUniversity },
    { title: 'Articles', href: '/admin/articles', icon: FaNewspaper },
    { title: 'Users', href: '/admin/users', icon: FaUserShield },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isAdminMode ? 'bg-gray-900 border-b border-gray-800' : (scrolled ? 'glass' : 'bg-white/90 backdrop-blur-md')}`}>
      <div className={`py-3 ${isAdminMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-gray-700 text-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars />
            </button>

            <Link to={isAdminMode ? "/" : "/"} className="flex items-center gap-3">
              {isAdminMode ? (
                  <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 group-hover:bg-brand-orange group-hover:text-white transition-all">
                          <FaArrowLeft />
                      </div>
                      <div className="flex flex-col">
                          <span className="font-heading font-bold text-xl text-white leading-tight tracking-tight">Admin Panel</span>
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider group-hover:text-brand-orange transition-colors">Back to Site</span>
                      </div>
                  </div>
              ) : (
                  <>
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-orange text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                        <span className="text-lg">CD</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-heading font-bold text-xl text-brand-indigo leading-tight tracking-tight">Collegedost</span>
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">The Education Hub</span>
                    </div>
                  </>
              )}
            </Link>
          </div>



          <div className="flex items-center gap-4">
            {!isAdminMode && (
                <div className="hidden md:flex items-center gap-6 text-gray-600">
                <button onClick={onOpenAskModal} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors font-medium text-sm">
                    <FaQuestion className="text-gray-400" /> <span>Ask</span>
                </button>
                <button onClick={onOpenShareModal} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors font-medium text-sm">
                    <FaShareAlt className="text-gray-400" /> <span>Share</span>
                </button>
                </div>
            )}
            {/* User Profile Logic */}
            <div className={`relative ${isUserDropdownOpen ? 'z-50' : ''}`}> 
              {!user ? (
                <button onClick={onOpenAuthModal} className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300">
                  <FaUser className="text-xs" /> <span className="hidden sm:inline">Login / Signup</span>
                </button>
              ) : (
                <div className="relative">
                    <button 
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[100px] truncate">{user.name}</span>
                        <FaChevronDown className="text-xs text-gray-400" />
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {isUserDropdownOpen && (
                            <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)}></div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right"
                            >
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-orange transition-colors">
                                    Profile Settings
                                </a>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-orange transition-colors">
                                        Admin Panel
                                    </Link>
                                )}
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`relative h-[52px] hidden lg:block ${isAdminMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white'}`}>
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <ul className="flex items-center gap-1 h-full">
            {isAdminMode ? (
                // ADMIN LINKS
                adminLinks.map((link, index) => (
                    <li key={index} className="h-full">
                        <Link to={link.href} className={`flex items-center gap-2 h-full px-4 text-sm font-medium border-b-2 border-transparent transition-all duration-200 ${
                            (link.href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.href))
                            ? 'text-brand-orange border-brand-orange bg-gray-900/30' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}>
                            <link.icon className="text-lg" />
                            {link.title}
                        </Link>
                    </li>
                ))
            ) : (
                // PUBLIC LINKS
                navLinks.map((link, index) => (
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
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
                        {browseByStreamData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer ${activeStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveStream(stream.id)}
                            onClick={() => {
                                if (stream.link) {
                                  navigate(stream.link);
                                  setActiveDropdown(null);
                                }
                              }}
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col1 || 'Exams'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentStreamContent.exams.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col3_1 || 'Predictors'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentStreamContent.predictors.map((item, idx) => (
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col2 || 'Colleges'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentStreamContent.colleges.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col3_2 || 'Resources'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentStreamContent.resources.map((item, idx) => (
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

                {/* Test Prep Mega Menu */}
                <AnimatePresence>
                  {link.title === 'Test Prep' && activeDropdown === 'Test Prep' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentTestPrepDataObj.titles?.col1 || 'Exam Prep'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentTestPrepDataObj.titles?.col3_1 || 'Previous Papers'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentTestPrepDataObj.titles?.col2 || 'Mock Tests'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentTestPrepDataObj.titles?.col3_2 || 'Resources'}</h4>
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
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCollegeDataObj.titles?.col1 || 'Section 1'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCollegeDataObj.titles?.col3_1 || 'Section 3'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCollegeDataObj.titles?.col2 || 'Section 2'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCollegeDataObj.titles?.col3_2 || 'Section 4'}</h4>
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
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentExamDataObj.titles?.col1 || 'Section 1'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentExamDataObj.titles?.col3_1 || 'Section 3'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentExamDataObj.titles?.col2 || 'Section 2'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentExamDataObj.titles?.col3_2 || 'Section 4'}</h4>
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
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCourseDataObj.titles?.col1 || 'Section 1'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCourseDataObj.titles?.col3_1 || 'Section 3'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCourseDataObj.titles?.col2 || 'Section 2'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCourseDataObj.titles?.col3_2 || 'Section 4'}</h4>
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
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentPredictorDataObj.titles?.col1 || 'Section 1'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentPredictorDataObj.titles?.col3_1 || 'Section 3'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentPredictorDataObj.titles?.col2 || 'Section 2'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentPredictorDataObj.titles?.col3_2 || 'Section 4'}</h4>
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
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCounsellingDataObj.titles?.col1 || 'Section 1'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCounsellingDataObj.titles?.col3_1 || 'Section 3'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCounsellingDataObj.titles?.col2 || 'Section 2'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentCounsellingDataObj.titles?.col3_2 || 'Section 4'}</h4>
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
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentRankingDataObj.titles?.col1 || 'Section 1'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentRankingDataObj.titles?.col3_1 || 'Section 3'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentRankingDataObj.titles?.col2 || 'Section 2'}</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentRankingDataObj.titles?.col3_2 || 'Section 4'}</h4>
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
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">By Stream / Option</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Resources</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Other Options</h4>
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
                      className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[60] overflow-hidden flex max-h-[600px] mt-1"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Learn & Study</h4>
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
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Services</h4>
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
            )))}

          </ul>
        </div>
      </div>
      {/* Mobile Menu Sidebar (Careers360 Style) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[999] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-screen w-[85%] max-w-[400px] bg-white z-[1000] overflow-y-auto lg:hidden shadow-2xl flex flex-col"
            >
              
              {/* 1. Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-orange text-white font-bold text-xs shadow-md shadow-orange-500/20">
                        CD
                    </div>
                    <span className="font-heading font-bold text-xl text-gray-800 tracking-tight">CollegeDost</span>
                 </div>
                 <button 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                 >
                   <FaTimes className="text-lg" />
                 </button>
              </div>

              <div className="p-4 space-y-6 pb-20">
                
                


                {/* 3. Categories List */}
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Browse Categories</h4>
                   <div className="flex flex-col pb-24">
                      {[
                        { name: 'Browse by Stream', data: browseByStreamData, icon: FaTh },
                        { name: 'Test Prep', data: testPrepData, icon: FaLaptopCode },
                        { name: 'Colleges', data: collegesData, icon: FaUniversity },
                        { name: 'Exams', data: examsData, icon: FaNewspaper },
                        { name: 'Courses', data: coursesData, icon: FaBookOpen },
                        { name: 'News', link: '/news', icon: FaNewspaper },
                        { name: 'Rankings', data: rankingsData, icon: FaTrophy },
                        { name: 'International', link: '/international-colleges', icon: FaGlobeAmericas },
                        { name: 'Counselling', data: counsellingData, icon: FaUserShield },
                        { name: 'Careers', data: careersData, icon: FaBriefcase },
                        { name: 'More', data: moreData, icon: FaEllipsisH },
                      ].map((section, idx) => {
                         const isSectionExpanded = expandedSection === section.name;
                         
                         return (
                            <div key={idx} className="border-b border-gray-50 last:border-0">
                                {/* Level 1: Main Section */}
                                {section.data ? (
                                    <button 
                                       onClick={() => setExpandedSection(isSectionExpanded ? null : section.name)}
                                       className={`w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors ${isSectionExpanded ? 'bg-orange-50/50' : ''}`}
                                    >
                                       <div className="flex items-center gap-3">
                                           <span className={`text-lg transition-colors ${isSectionExpanded ? 'text-brand-orange' : 'text-gray-400'}`}><section.icon /></span>
                                           <span className={`font-bold text-sm ${isSectionExpanded ? 'text-brand-orange' : 'text-gray-700'}`}>{section.name}</span>
                                       </div>
                                       {isSectionExpanded ? <FaChevronDown className="text-brand-orange text-xs" /> : <FaChevronRight className="text-gray-300 text-xs" />}
                                    </button>
                                ) : (
                                    <Link to={section.link} onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                           <span className="text-gray-400 text-lg"><section.icon /></span>
                                           <span className="font-bold text-sm text-gray-700">{section.name}</span>
                                        </div>
                                    </Link>
                                )}

                                {/* Level 2: Sub Items (Accordion) */}
                                <AnimatePresence>
                                    {isSectionExpanded && section.data && (
                                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-gray-50">
                                           {section.data.map((subItem, subIdx) => {
                                                if (!subItem.label) return null;
                                                const isCategoryExpanded = expandedCategory === subItem.label;
                                                
                                                return (
                                                    <div key={subIdx} className="border-t border-gray-100">
                                                        <button 
                                                           onClick={() => setExpandedCategory(isCategoryExpanded ? null : subItem.label)}
                                                           className="w-full flex items-center justify-between py-3 px-8 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <span className={`text-sm ${isCategoryExpanded ? 'text-brand-orange font-medium' : 'text-gray-600'}`}>{subItem.label}</span>
                                                            {isCategoryExpanded ? <FaChevronDown className="text-[10px] text-brand-orange" /> : <FaChevronRight className="text-[10px] text-gray-300" />}
                                                        </button>
                                                        
                                                        {/* Level 3: Details */}
                                                        <AnimatePresence>
                                                            {isCategoryExpanded && (
                                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white/80 pl-4 border-l-2 border-orange-200 ml-8 my-1">
                                                                    <div className="p-3 space-y-4">
                                                                        {subItem.titles && Object.entries(subItem.titles).map(([key, title]) => {
                                                                            let contentKey = '';
                                                                            if (key === 'col1') contentKey = 'exams'; 
                                                                            else if (key === 'col2') contentKey = 'colleges';
                                                                            else if (key === 'col3_1') contentKey = 'predictors';
                                                                            else if (key === 'col3_2') contentKey = 'resources';
                                                                            
                                                                            const items = subItem.content?.[contentKey];
                                                                            if (!items || items.length === 0) return null;
                                                                            
                                                                            return (
                                                                                <div key={key}>
                                                                                    <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h6>
                                                                                    <ul className="space-y-2">
                                                                                        {items.slice(0, 5).map((l, i) => (
                                                                                            <li key={i}>
                                                                                                <Link 
                                                                                                    to={l.href || '#'} 
                                                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                                                    className={`text-[13px] block hover:text-brand-orange transition-colors ${l.isLink ? 'text-brand-orange font-bold' : 'text-gray-600'}`}
                                                                                                >
                                                                                                    {l.title}
                                                                                                </Link>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                           })}
                                       </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                         );
                      })}
                   </div>
                </div>
                
                {/* 4. Bottom User Section */}
                <div className="pt-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">You</h4>
                    {user ? (
                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-2 py-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">
                                {user.name?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-800 text-sm">{user.name}</span>
                                <span className="text-xs text-gray-500">View Profile</span>
                            </div>
                        </Link>
                    ) : (
                        <button onClick={() => { onOpenAuthModal(); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-3 rounded-lg font-bold shadow-lg shadow-orange-500/30 active:scale-95 transition-transform">
                             <FaUser /> Login / Register
                        </button>
                    )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </nav>
  );
};


export default Navbar;
// HMR Trigger
