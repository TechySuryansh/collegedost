"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FaBalanceScale, FaChartLine, FaDraftingCompass, FaListUl, FaRegComments, FaArrowRight, FaStethoscope, FaLaptopCode
} from 'react-icons/fa';

const otherProducts = [
    { id: 1, title: 'College Compare', icon: <FaBalanceScale />, color: '#4f46e5', desc: 'Compare colleges side by side.', link: '/compare-colleges' },
    { id: 2, title: 'College Reviews', icon: <FaRegComments />, color: '#f59e0b', desc: 'Real reviews from students.', link: '/colleges' },
    { id: 3, title: 'B.Tech Companion', icon: <FaDraftingCompass />, color: '#10b981', desc: 'Complete guide for Engineering.', link: '/engineering' },
    { id: 4, title: 'NEET Companion', icon: <FaStethoscope />, color: '#7c3aed', desc: 'Your medical entrance partner.', link: '/neet-predictor' },
    { id: 5, title: 'List of Courses', icon: <FaListUl />, color: '#06b6d4', desc: 'Explore thousands of courses.', link: '/courses' },
    { id: 6, title: 'College Applications', icon: <FaLaptopCode />, color: '#ec4899', desc: 'Simplify your application process.', link: '#' }
];

const OtherProducts = () => {
    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">Premium Tools</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to make the right career decision, all in one place.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full"
                        >
                            <Link href={product.link} className="block h-full">
                                <div className="glass-card bg-white p-8 rounded-2xl flex items-start gap-6 border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-300 cursor-pointer h-full group">
                                    <div
                                        className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center text-3xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-gray-50"
                                        style={{ color: product.color }}
                                    >
                                        {product.icon}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-indigo transition-colors">{product.title}</h3>
                                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{product.desc}</p>

                                        <div className="flex items-center text-sm font-bold text-brand-indigo opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            Explore <FaArrowRight className="ml-2 text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OtherProducts;
