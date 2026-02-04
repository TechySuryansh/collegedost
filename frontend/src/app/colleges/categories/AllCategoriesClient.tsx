"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { allExamCategories } from '@/data';

const AllCategoriesClient = () => {

    return (
        <div className="pt-32 pb-16 min-h-screen bg-slate-50 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">Explore All Categories</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Find the best colleges, exams, and resources across various streams and disciplines.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {allExamCategories.map((item: any, index: number) => {
                        const isLink = !!item.link;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {isLink ? (
                                    <Link
                                        href={item.link}
                                        className="glass-card rounded-2xl p-6 text-center h-full flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 min-h-[180px]"
                                        style={{ '--hover-color': item.color } as React.CSSProperties}
                                    >
                                        <InnerCard item={item} />
                                    </Link>
                                ) : (
                                    <div
                                        className="glass-card rounded-2xl p-6 text-center h-full flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 min-h-[180px]"
                                        style={{ '--hover-color': item.color } as React.CSSProperties}
                                    >
                                        <InnerCard item={item} />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const InnerCard = ({ item }: { item: any }) => (
    <>
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-[var(--hover-color)] opacity-0 group-hover:opacity-5 transition-opacity duration-500 z-0"></div>

        {/* Animated Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--hover-color)]/30 rounded-2xl transition-colors duration-300 pointer-events-none z-10"></div>

        <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm relative z-10 bg-white"
            style={{ color: item.color, boxShadow: `0 10px 30px -10px ${item.color}40` }}
        >
            <item.icon />
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-1 relative z-10 group-hover:text-[var(--hover-color)] transition-colors">{item.title}</h3>
        {item.subtext && <p className="text-xs text-gray-500 relative z-10">{item.subtext}</p>}

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <FaArrowRight className="text-[var(--hover-color)]/50 text-sm" />
        </div>
    </>
);

export default AllCategoriesClient;
