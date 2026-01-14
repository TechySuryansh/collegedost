import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-brand">Collegedost</h4>
            <p className="footer-desc">
              The Education Hub. Helping students make informed career decisions.
            </p>
            <div className="social-links flex gap-md">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h5 className="footer-heading">Top Colleges</h5>
            <ul className="footer-links">
              <li><a href="#">MBA Colleges</a></li>
              <li><a href="#">Engineering Colleges</a></li>
              <li><a href="#">Medical Colleges</a></li>
              <li><a href="#">Law Colleges</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h5 className="footer-heading">Top Exams</h5>
            <ul className="footer-links">
              <li><a href="#">CAT 2025</a></li>
              <li><a href="#">JEE Main 2026</a></li>
              <li><a href="#">NEET 2026</a></li>
              <li><a href="#">GATE 2026</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h5 className="footer-heading">Resources</h5>
            <ul className="footer-links">
              <li><a href="#">College Predictors</a></li>
              <li><a href="#">Rank Predictors</a></li>
              <li><a href="#">QnA</a></li>
              <li><a href="#">E-Books</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Collegedost. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
