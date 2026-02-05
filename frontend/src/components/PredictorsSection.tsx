"use client";

import React from 'react';
import { FaChartLine, FaArrowRight, FaUniversity, FaTrophy, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PredictorItem {
    name: string;
    link: string;
}

interface PredictorGroup {
    title: string;
    items: PredictorItem[];
}

interface PredictorsSectionProps {
    data: PredictorGroup[];
    title?: string;
    mainTitle?: string;
    subText?: string;
    illustration?: string;
}

const PredictorsSection: React.FC<PredictorsSectionProps> = ({
    data,
    title = "Predictors",
    mainTitle = "Know Your Chances",
    subText = "Enter your rank or score to predict your college.",
    illustration = "https://img.freepik.com/free-vector/predictive-analytics-illustration_23-2149206689.jpg"
}) => {
    return (
        <section className="mb-20 relative">
            {/* Background blobs for this section */}
            <div className="absolute top-1/2 -left-20 w-72 h-72 bg-brand-indigo/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 -right-20 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-brand-orange/10 text-brand-orange"><FaChartLine /></span>
                        <h2 className="text-3xl font-heading font-bold text-gray-900">{title}</h2>
                    </div>
                    <Link href="#" className="flex items-center gap-2 text-sm font-bold text-brand-indigo bg-indigo-50 px-5 py-2.5 rounded-full hover:bg-brand-indigo hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group">
                        View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-card rounded-3xl p-1 shadow-2xl border border-white/40 overflow-hidden"
                >
                    <div className="flex flex-col lg:flex-row bg-white/50 backdrop-blur-sm rounded-5 overflow-hidden">
                        {/* Illustration Side */}
                        <div className="lg:w-[32%] bg-linear-to-br from-brand-indigo/5 via-brand-violet/5 to-brand-cyan/5 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>

                            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-8 shadow-premium shadow-brand-indigo/5 relative z-10 p-6 group-hover:scale-105 transition-transform duration-500">
                                <img
                                    src={illustration}
                                    alt={title}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10 font-heading">{mainTitle}</h3>
                            <p className="text-gray-600 max-w-55 leading-relaxed relative z-10">{subText}</p>

                            <button className="mt-8 px-8 py-3 bg-brand-orange text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 hover:-translate-y-1 transition-all">
                                Try Now
                            </button>
                        </div>

                        {/* Content Side */}
                        <div className="lg:w-[68%] p-10 lg:p-14 bg-white/40">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                                {data.map((group, idx) => (
                                    <div key={idx} className="group/section">
                                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-brand-dark/5 group-hover/section:border-brand-orange/20 transition-colors">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${idx === 0 ? 'bg-blue-50 text-brand-indigo' : 'bg-orange-50 text-brand-orange'}`}>
                                                {idx === 0 ? <FaUniversity /> : <FaTrophy />}
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-800 tracking-tight font-heading">
                                                {group.title}
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                            {group.items.map((item, index) => (
                                                <Link
                                                    key={index}
                                                    href={item.link}
                                                    className="flex items-center gap-3 text-[15px] font-medium text-gray-500 hover:text-brand-indigo transition-all group/link py-1.5 px-2 rounded-lg hover:bg-white/50"
                                                >
                                                    <FaChevronRight className="text-[10px] text-gray-300 group-hover/link:text-brand-orange transition-colors" />
                                                    <span className="group-hover/link:translate-x-1 transition-transform">{item.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PredictorsSection;
