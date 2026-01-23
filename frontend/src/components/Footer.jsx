import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-20 mt-20 relative overflow-hidden">
       {/* Decorative Elements */}
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-cyan"></div>
       <div className="absolute top-0 right-0 w-96 h-96 bg-brand-indigo/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-orange text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                 <span className="text-lg">CD</span>
               </div>
               <span className="font-heading font-bold text-2xl text-white leading-tight tracking-tight">Collegedost</span>
            </div>
            <p className="text-sm text-blue-100/70 mb-8 leading-relaxed max-w-xs font-light">
              The Education Hub. Helping students make informed career decisions with data-driven insights and premium tools.
            </p>
            <div className="flex gap-4 text-xl text-blue-200/80">
              <a href="#" className="hover:text-brand-orange hover:-translate-y-1 transition-all"><FaFacebook /></a>
              <a href="#" className="hover:text-brand-orange hover:-translate-y-1 transition-all"><FaTwitter /></a>
              <a href="#" className="hover:text-brand-orange hover:-translate-y-1 transition-all"><FaInstagram /></a>
              <a href="#" className="hover:text-brand-orange hover:-translate-y-1 transition-all"><FaLinkedin /></a>
              <a href="#" className="hover:text-brand-orange hover:-translate-y-1 transition-all"><FaYoutube /></a>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h5 className="text-base font-bold mb-6 text-white font-heading">Top Colleges</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">MBA Colleges</a></li>
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">Engineering Colleges</a></li>
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">Medical Colleges</a></li>
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">Law Colleges</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col">
            <h5 className="text-base font-bold mb-6 text-white font-heading">Top Exams</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">CAT 2025</a></li>
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">JEE Main 2026</a></li>
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">NEET 2026</a></li>
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">GATE 2026</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col">
            <h5 className="text-base font-bold mb-6 text-white font-heading">Resources</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">College Predictors</a></li>
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">Rank Predictors</a></li>
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">QnA</a></li>
              <li><a href="#" className="text-sm text-blue-100/60 hover:text-brand-orange hover:pl-1 transition-all">E-Books</a></li>
            </ul>
          </div>
        </div>
        
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-200/40">
          <p className="flex items-center gap-1">&copy; 2026 Collegedost. Made with <FaHeart className="text-red-500 animate-pulse" /> for Students.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
