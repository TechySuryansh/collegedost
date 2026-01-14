import React, { useState, useEffect } from 'react';
import { navLinks, browseByStreamData, testPrepData } from '../data';
import { FaSearch, FaUser, FaTh, FaChevronDown, FaAngleRight, FaDownload } from 'react-icons/fa';
import './Navbar.css';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {

  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeStream, setActiveStream] = useState('engineering'); // Default active stream
  const [activeTestPrepStream, setActiveTestPrepStream] = useState('engineering-prep');

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

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-top">
        <div className="container flex items-center justify-between">
          <div className="navbar-brand">
            <div className="brand-logo-wrapper">
              <span className="brand-logo">CD</span>
            </div>
            <div className="brand-info">
              <span className="brand-text">Collegedost</span>
              <span className="tagline">The Education Hub</span>
            </div>
          </div>
          <div className="navbar-actions flex items-center gap-md">
            <a href="#" className="btn-login flex items-center gap-sm">
              <FaUser /> <span>Login / Register</span>
            </a>
          </div>
        </div>
      </div>

      <div className="navbar-main">
        <div className="container">


          <ul className="nav-menu flex items-center">
            {navLinks.map((link, index) => (
              <li
                key={index}
                className="nav-item"
                onMouseEnter={() => handleMouseEnter(link.title)}
                onMouseLeave={handleMouseLeave}
              >
                <a href={link.href} className="nav-link">
                  {link.title}
                  {link.hasDropdown && <FaChevronDown className="dropdown-arrow" />}
                </a>

                {/* Specific Layout for "Browse by Stream" */}
                <AnimatePresence>
                  {link.title === 'Browse by Stream' && activeDropdown === 'Browse by Stream' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="mega-menu split-layout"
                    >
                      <div className="mega-menu-sidebar">
                        {browseByStreamData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`sidebar-item ${activeStream === stream.id ? 'active' : ''}`}
                            onMouseEnter={() => setActiveStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="sidebar-arrow" />
                          </div>
                        ))}
                      </div>

                      <div className="mega-menu-content">
                        <div className="content-grid-2">
                          {/* Column 1: Exams & Predictors */}
                          <div className="content-col">
                            <div className="content-section mb-6">
                              <h4 className="col-heading">{currentStreamDataObj.titles?.col1 || 'Exams'}</h4>
                              <ul className="content-list">
                                {currentStreamContent.exams.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`content-link ${item.isLink ? 'highlight' : ''}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="col-heading">{currentStreamDataObj.titles?.col3_1 || 'Predictors'}</h4>
                              <ul className="content-list">
                                {currentStreamContent.predictors.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className={`content-link ${item.isLink ? 'highlight' : ''}`}>
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Column 2: Colleges & Resources */}
                          <div className="content-col">
                            <div className="content-section mb-6">
                              <h4 className="col-heading">{currentStreamDataObj.titles?.col2 || 'Colleges'}</h4>
                              <ul className="content-list">
                                {currentStreamContent.colleges.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="content-link">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="content-section">
                              <h4 className="col-heading">{currentStreamDataObj.titles?.col3_2 || 'Resources'}</h4>
                              <ul className="content-list">
                                {currentStreamContent.resources.map((item, idx) => (
                                  <li key={idx}>
                                    <a href={item.href} className="content-link">
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="app-download-banner mt-6">
                              <FaDownload /> Download App
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
                      className="mega-menu split-layout"
                    >
                      <div className="mega-menu-sidebar">
                        {testPrepData.map((stream) => (
                          <div
                            key={stream.id}
                            className={`sidebar-item ${activeTestPrepStream === stream.id ? 'active' : ''}`}
                            onMouseEnter={() => setActiveTestPrepStream(stream.id)}
                          >
                            {stream.label}
                            <FaAngleRight className="sidebar-arrow" />
                          </div>
                        ))}
                      </div>

                      <div className="mega-menu-content">
                        <div className="content-grid-3">
                          <div className="content-col">
                            <h4 className="col-heading">{currentTestPrepDataObj.titles?.col1 || 'Exam Prep'}</h4>
                            <ul className="content-list">
                              {currentTestPrepContent.exams?.map((item, idx) => (
                                <li key={idx}>
                                  <a href={item.href} className={`content-link ${item.isLink ? 'highlight' : ''}`}>
                                    {item.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="content-col">
                            <h4 className="col-heading">{currentTestPrepDataObj.titles?.col2 || 'Mock Tests'}</h4>
                            <ul className="content-list">
                              {currentTestPrepContent.colleges?.map((item, idx) => (
                                <li key={idx}>
                                  <a href={item.href} className="content-link">
                                    {item.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="content-col">
                            <h4 className="col-heading">{currentTestPrepDataObj.titles?.col3_1 || 'Previous Papers'}</h4>
                            <ul className="content-list mb-4">
                              {currentTestPrepContent.predictors?.map((item, idx) => (
                                <li key={idx}>
                                  <a href={item.href} className={`content-link ${item.isLink ? 'highlight' : ''}`}>
                                    {item.title}
                                  </a>
                                </li>
                              ))}
                            </ul>

                            <h4 className="col-heading">{currentTestPrepDataObj.titles?.col3_2 || 'Resources'}</h4>
                            <ul className="content-list">
                              {currentTestPrepContent.resources?.map((item, idx) => (
                                <li key={idx}>
                                  <a href={item.href} className="content-link">
                                    {item.title}
                                  </a>
                                </li>
                              ))}
                            </ul>

                            <div className="app-download-banner">
                              <FaDownload /> Download App
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Generic Dropdown for others (simpler) */}
                {link.title !== 'Browse by Stream' && link.hasDropdown && activeDropdown === link.title && (
                  <div className="simple-dropdown">
                    {/* ... other dropdowns can be implemented similarly ... */}
                  </div>
                )}
              </li>
            ))}
            <li className="nav-item more-item">
              <a href="#" className="nav-link flex items-center gap-sm">
                <FaTh /> More
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
