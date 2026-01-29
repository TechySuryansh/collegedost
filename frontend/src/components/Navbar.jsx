import React, { useState, useEffect } from 'react';
import { 
  navLinks, 
  browseByStreamData, 
  testPrepData, 
  collegesData, 
  examsData, 
  coursesData, 
  rankingsData, 
  counsellingData, 
  careersData, 
  moreData 
} from '../data';
import { FaSearch, FaUser, FaBars, FaTh, FaChevronDown, FaAngleRight, FaQuestion, FaShareAlt, FaBookOpen, FaChartPie, FaUniversity, FaNewspaper, FaUserShield, FaArrowLeft, FaTimes, FaGraduationCap, FaTrophy, FaBriefcase, FaEllipsisH, FaComments, FaHome, FaCompass, FaChartLine, FaStethoscope, FaLaptopCode, FaBalanceScale, FaPalette, FaMicrophone, FaCoins, FaDesktop, FaFlask, FaPlane, FaSchool, FaGlobeAmericas, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenAskModal, onOpenShareModal, onOpenAuthModal }) => {
  const { user, logout } = useAuth(); // Context Hook
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminMode = location.pathname.startsWith('/admin');
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null); // Mobile Accordion State (Level 2)
  const [expandedSection, setExpandedSection] = useState(null); // Mobile Main Section State (Level 1)
  const [activeStream, setActiveStream] = useState('engineering'); // Default active stream
  const [activeCollegeStream, setActiveCollegeStream] = useState('top-colleges'); 
  const [activeExamStream, setActiveExamStream] = useState('engineering'); 
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

  // Find active college data
  const currentCollegeDataObj = collegesData.find(s => s.id === activeCollegeStream) || {};
  const currentCollegeContent = currentCollegeDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  // Find active exam data
  const currentExamDataObj = examsData.find(s => s.id === activeExamStream) || {};
  const currentExamContent = currentExamDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

  const adminLinks = [
    { title: 'Dashboard', href: '/admin', icon: FaChartPie },
    { title: 'Colleges', href: '/admin/colleges', icon: FaUniversity },
    { title: 'Articles', href: '/admin/articles', icon: FaNewspaper },
    { title: 'Users', href: '/admin/users', icon: FaUserShield },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isAdminMode ? 'bg-slate-900 border-b border-slate-800 shadow-md' : (scrolled ? 'glass' : 'bg-white/90 backdrop-blur-md')}`}>
      <div className={`py-3 transition-colors duration-300 ${isAdminMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>
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
                  <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                           <FaUserShield className="text-lg" />
                      </div>
                      <div className="flex flex-col">
                          <span className="font-heading font-bold text-xl text-white leading-tight tracking-tight flex items-center gap-2">
                            Admin <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 font-mono">PANEL</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium tracking-wider group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                             <FaArrowLeft className="text-[8px]" /> Back to Main Site
                          </span>
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
                        className={`flex items-center gap-2 border px-3 py-1.5 rounded-full transition-all duration-200 ${
                            isAdminMode 
                            ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                            isAdminMode 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-brand-blue text-white'
                        }`}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className={`text-sm font-medium hidden md:block max-w-[100px] truncate ${isAdminMode ? 'text-slate-200' : 'text-gray-700'}`}>
                            {user.name}
                        </span>
                        <FaChevronDown className={`text-xs ${isAdminMode ? 'text-slate-400' : 'text-gray-400'}`} />
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
                                className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border py-2 z-50 origin-top-right overflow-hidden ${
                                    isAdminMode 
                                    ? 'bg-slate-800 border-slate-700 text-slate-200' 
                                    : 'bg-white border-gray-100 text-gray-700'
                                }`}
                            >
                                <div className={`px-4 py-3 border-b ${isAdminMode ? 'border-slate-700' : 'border-gray-100'}`}>
                                    <p className={`text-sm font-bold truncate ${isAdminMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                                    <p className={`text-xs truncate ${isAdminMode ? 'text-slate-400' : 'text-gray-500'}`}>{user.email}</p>
                                </div>
                                
                                <a href="/profile" className={`block px-4 py-2.5 text-sm transition-colors ${
                                    isAdminMode 
                                    ? 'hover:bg-slate-700 hover:text-white text-slate-300' 
                                    : 'hover:bg-gray-50 hover:text-brand-orange text-gray-700'
                                }`}>
                                    Profile Settings
                                </a>
                                
                                {user.role === 'admin' && (
                                    <Link to="/admin" className={`block px-4 py-2.5 text-sm transition-colors ${
                                        isAdminMode 
                                        ? 'hover:bg-slate-700 hover:text-white text-slate-300' 
                                        : 'hover:bg-gray-50 hover:text-brand-orange text-gray-700'
                                    }`}>
                                        Admin Panel
                                    </Link>
                                )}
                                
                                <button 
                                    onClick={handleLogout}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                        isAdminMode 
                                        ? 'text-red-400 hover:bg-slate-700 hover:text-red-300' 
                                        : 'text-red-600 hover:bg-red-50'
                                    }`}
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

      <div className={`relative h-[56px] hidden lg:block ${isAdminMode ? 'bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative">
          <ul className="flex items-center gap-1 h-full">
            {isAdminMode ? (
                // ADMIN LINKS
                adminLinks.map((link, index) => {
                    const isActive = (link.href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.href));
                    return (
                        <li key={index} className="h-full relative">
                            <Link to={link.href} className={`flex items-center gap-2 h-full px-5 text-sm font-medium transition-all duration-300 relative z-10 ${
                                isActive
                                ? 'text-white' 
                                : 'text-slate-400 hover:text-white'
                            }`}>
                                <link.icon className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-400' : 'group-hover:text-indigo-300'}`} />
                                {link.title}
                            </Link>
                            {isActive && (
                                <motion.div 
                                    layoutId="adminNavIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_-2px_8px_rgba(99,102,241,0.5)]"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-800/50 pointer-events-none" />
                            )}
                        </li>
                    );
                })
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
                      className="absolute top-full left-0 right-0 mx-auto w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[100] overflow-hidden flex max-h-[600px]"
                    >
                      <div className="w-72 bg-white flex-shrink-0 py-4 overflow-y-auto">
                        {browseByStreamData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all cursor-pointer text-left ${activeStream === stream.id ? 'bg-slate-50 text-brand-orange font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-brand-orange'}`}
                            onMouseEnter={() => setActiveStream(stream.id)}
                            onClick={() => {
                                if (stream.link) {
                                  navigate(stream.link);
                                  setActiveDropdown(null);
                                }
                              }}
                          >
                            <span className="flex-1 text-left pr-2">{stream.label}</span>
                            <FaAngleRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
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
                                    <Link to={item.href} onClick={() => setActiveDropdown(null)} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col3_1 || 'Predictors'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentStreamContent.predictors.map((item, idx) => (
                                  <li key={idx}>
                                    <Link to={item.href} onClick={() => setActiveDropdown(null)} className={`text-sm transition-colors block ${item.isLink ? 'text-brand-indigo font-semibold' : 'text-slate-600 hover:text-brand-orange'}`}>
                                      {item.title}
                                    </Link>
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
                                    <Link to={item.href} onClick={() => setActiveDropdown(null)} className="text-sm transition-colors block text-gray-600 hover:text-brand-orange">
                                      {item.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">{currentStreamDataObj.titles?.col3_2 || 'Resources'}</h4>
                              <ul className="flex flex-col gap-3">
                                {currentStreamContent.resources.map((item, idx) => (
                                  <li key={idx}>
                                    <Link to={item.href} onClick={() => setActiveDropdown(null)} className="text-sm transition-colors flex items-center gap-2 text-gray-600 hover:text-brand-orange group">
                                      <span>{item.title}</span>
                                      {item.isNew && <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">NEW</span>}
                                    </Link>
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
                      className="absolute top-full left-0 right-0 mx-auto w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[100] overflow-hidden flex max-h-[600px]"
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
                      className="absolute top-full left-0 right-0 mx-auto w-[900px] bg-white shadow-2xl rounded-xl border border-gray-100 z-[100] overflow-hidden flex max-h-[600px]"
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



                {/* Generic Dropdown for others (simpler) */}
                {link.title !== 'Browse by Stream' && link.title !== 'Test Prep' && link.title !== 'Colleges' && link.title !== 'Exams' && link.hasDropdown && activeDropdown === link.title && (
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
              className="fixed top-0 left-0 h-screen w-[85%] max-w-[400px] bg-white z-[1000] lg:hidden shadow-2xl flex flex-col"
            >
              
              {/* 1. Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-orange text-white font-bold text-xs shadow-md shadow-orange-500/20">
                        CD
                    </div>
                    <span className="font-heading font-bold text-xl text-gray-800 tracking-tight">
                        {isAdminMode ? 'Admin Panel' : 'CollegeDost'}
                    </span>
                 </div>
                 <button 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                 >
                   <FaTimes className="text-lg" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                


                {/* 3. Categories List */}
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                       {isAdminMode ? 'Menu' : 'Browse Categories'}
                   </h4>
                   <div className="flex flex-col pb-24">
                      {(isAdminMode ? adminLinks.map(link => ({
                          name: link.title,
                          link: link.href,
                          icon: link.icon
                      })) : [
                        { name: 'Browse by Stream', data: browseByStreamData, icon: FaTh },
                        { name: 'Colleges', data: collegesData, icon: FaUniversity },
                        { name: 'News', link: '/news', icon: FaNewspaper },
                      ]).map((section, idx) => {
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
                                                           className="w-full flex items-center justify-between py-3 px-8 hover:bg-gray-100 transition-colors text-left"
                                                        >
                                                            <span className={`text-sm flex-1 text-left pr-2 ${isCategoryExpanded ? 'text-brand-orange font-medium' : 'text-gray-600'}`}>{subItem.label}</span>
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
                
              </div>

              {/* 4. Bottom User Section - Fixed Bottom */}
              <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">You</h4>
                  {user ? (
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-2 py-3 bg-gray-50 rounded-lg border border-gray-100">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </nav>
  );
};


export default Navbar;
// HMR Trigger
