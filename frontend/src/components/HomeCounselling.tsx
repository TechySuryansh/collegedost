"use client";

import React from 'react';
import { FaUsers, FaComments, FaVideo, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface CounsellingNewProps {
    onOpenAskModal?: () => void;
}

const CounsellingNew: React.FC<CounsellingNewProps> = ({ onOpenAskModal }) => {
    return (
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 mb-12 hover:-translate-y-1 transition duration-300">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-indigo-50 to-transparent opacity-50"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Content Side */}
                <div className="p-10 lg:p-14 flex flex-col justify-center relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 text-primary">
                        <FaUsers className="text-3xl" />
                    </div>
                    
                    <h3 className="text-2xl font-bold font-display text-text-main-light mb-4">
                        Personalized Counselling
                    </h3>
                    
                    <p className="text-text-muted-light mb-8 leading-relaxed">
                        We ease your biggest doubts with personalized Video Counselling from our Curated Experts. Get answers from the student community within 24 hours.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onOpenAskModal}
                            className="p-4 rounded-xl bg-background-light border border-gray-200 flex items-center gap-3 hover:border-primary hover:shadow-lg transition-all"
                        >
                            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                                <FaComments className="text-xl" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-sm text-text-main-light">Ask QnA</h4>
                                <p className="text-xs text-text-muted-light">1M+ Answers</p>
                            </div>
                        </button>
                        
                        <Link
                            href="/counselling"
                            className="p-4 rounded-xl bg-background-light border border-gray-200 flex items-center gap-3 hover:border-primary hover:shadow-lg transition-all"
                        >
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                <FaVideo className="text-xl" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-sm text-text-main-light">Video Call</h4>
                                <p className="text-xs text-text-muted-light">Expert Connect</p>
                            </div>
                        </Link>
                    </div>
                    
                    <Link
                        href="/counselling"
                        className="inline-flex items-center mt-8 text-primary font-semibold hover:text-secondary transition-colors"
                    >
                        Start Your Counselling Journey <FaArrowRight className="ml-2" />
                    </Link>
                </div>
                
                {/* Image Side */}
                <div className="relative min-h-75 md:min-h-full bg-slate-100 flex items-center justify-center p-8">
                    <Image
                        alt="Counselling Illustration"
                        className="w-full max-w-md object-contain drop-shadow-xl relative z-10"
                        src="https://img.freepik.com/free-vector/online-consulting-concept-illustration_114360-1730.jpg"
                        width={400}
                        height={400}
                    />
                    <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
                </div>
            </div>
        </div>
    );
};

export default CounsellingNew;
