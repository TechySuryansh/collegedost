"use client";

import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <footer className="bg-black text-gray-400 pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="font-display font-bold text-2xl text-white tracking-tight">
              CollegeDost
            </Link>
            <p className="text-sm leading-relaxed">
              A data-enabled and technology-driven Educational Products and Services Company.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" aria-label="Visit our Facebook page" className="text-gray-400 hover:text-white transition-colors"><FaFacebook className="text-2xl" /></a>
              <a href="#" aria-label="Visit our Twitter page" className="text-gray-400 hover:text-white transition-colors"><FaTwitter className="text-2xl" /></a>
              <a href="#" aria-label="Visit our Instagram page" className="text-gray-400 hover:text-white transition-colors"><FaInstagram className="text-2xl" /></a>
              <a href="#" aria-label="Visit our LinkedIn page" className="text-gray-400 hover:text-white transition-colors"><FaLinkedin className="text-2xl" /></a>
              <a href="#" aria-label="Visit our YouTube channel" className="text-gray-400 hover:text-white transition-colors"><FaYoutube className="text-2xl" /></a>
            </div>
          </div>

          {/* Top Exams */}
          <div>
            <h4 className="text-white font-bold mb-6">Top Exams</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/predictors/jee-main-predictor" className="hover:text-primary transition-colors">JEE Main 2026</Link></li>
              <li><Link href="/tools/exams/cat" className="hover:text-primary transition-colors">CAT 2025</Link></li>
              <li><Link href="/predictors/neet-predictor" className="hover:text-primary transition-colors">NEET 2026</Link></li>
              <li><Link href="/tools/exams/gate" className="hover:text-primary transition-colors">GATE 2026</Link></li>
              <li><Link href="/tools/exams/clat" className="hover:text-primary transition-colors">CLAT 2026</Link></li>
            </ul>
          </div>

          {/* Colleges */}
          <div>
            <h4 className="text-white font-bold mb-6">Colleges</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/tools/colleges?stream=Engineering" className="hover:text-primary transition-colors">Top Engineering in India</Link></li>
              <li><Link href="/tools/colleges?stream=Management" className="hover:text-primary transition-colors">Top MBA in India</Link></li>
              <li><Link href="/tools/colleges?stream=Medicine" className="hover:text-primary transition-colors">Top Medical in India</Link></li>
              <li><Link href="/tools/colleges?stream=Law" className="hover:text-primary transition-colors">Top Law in India</Link></li>
              <li><Link href="/tools/colleges?type=IIM" className="hover:text-primary transition-colors">IIMs in India</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/predictors" className="hover:text-primary transition-colors">College Predictors</Link></li>
              <li><Link href="/predictors/rank-predictor" className="hover:text-primary transition-colors">Rank Predictors</Link></li>
              <li><Link href="/qna" className="hover:text-primary transition-colors">CollegeDost Q&A</Link></li>
              <li><Link href="/reviews" className="hover:text-primary transition-colors">College Reviews</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold mb-6">Stay Updated</h4>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                placeholder="Your email address"
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2026 CollegeDost Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Use</Link>
            <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
