"use client";

import React from 'react';
import { FaCheckCircle, FaApple, FaGooglePlay } from 'react-icons/fa';

interface AppDownloadProps {
    features?: string[];
}

const defaultFeatures = [
    'Regular Exam Updates',
    'Q&A with Experts',
    'College Reviews'
];

const AppDownload: React.FC<AppDownloadProps> = ({ features = defaultFeatures }) => {
    return (
        <section className="bg-surface-dark relative overflow-hidden py-16 lg:py-24">
            <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-secondary/20"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
                            Student Community: Where Questions Find Answers
                        </h2>
                        <p className="text-gray-300 text-lg">
                            Join 10M+ students. Ask questions, get expert advice, and stay updated on the go with the CollegeDost App.
                        </p>
                        
                        <div className="flex flex-wrap gap-6 pt-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-400 text-xl" />
                                    <span className="text-gray-200">{feature}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                            <a 
                                href="https://apps.apple.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Download on the App Store"
                                className="bg-white text-surface-dark hover:bg-gray-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
                            >
                                <FaApple className="text-xl" /> App Store
                            </a>
                            <a 
                                href="https://play.google.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Get it on Google Play"
                                className="bg-transparent border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
                            >
                                <FaGooglePlay className="text-xl" /> Play Store
                            </a>
                        </div>
                    </div>
                    
                    <div className="shrink-0 relative">
                        <div className="absolute inset-0 bg-primary/50 blur-[60px] rounded-full"></div>
                        <div className="relative bg-white p-4 rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="w-40 h-40 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="text-3xl font-bold mb-1">CD</div>
                                    <div className="text-xs">CollegeDost</div>
                                </div>
                            </div>
                            <p className="text-center text-xs font-bold mt-2 text-gray-800">Download Now</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownload;
