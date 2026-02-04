"use client";

import React from 'react';
import { FaArrowRight, FaHeadset } from 'react-icons/fa';
import Link from 'next/link';

interface CounsellingItem {
    title: string;
    description: string;
    cta: string;
    link?: string;
    image: string;
}

interface CounsellingProps {
    items: CounsellingItem[];
    onOpenAskModal?: () => void;
}

const Counselling: React.FC<CounsellingProps> = ({ items, onOpenAskModal }) => {
    return (
        <section className="mb-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="glass-card rounded-[32px] p-0 flex flex-col items-center relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-premium border border-white/60"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/50 to-brand-indigo/5 z-0"></div>

                            <div className="flex w-full h-full relative z-10">
                                <div className="flex-1 p-10 flex flex-col justify-center">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center text-xl mb-6 shadow-sm">
                                        <FaHeadset />
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading text-gray-900 mb-3 group-hover:text-brand-indigo transition-colors leading-tight">{item.title}</h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed text-sm">{item.description}</p>
                                    {item.cta === "Ask Now" ? (
                                        <button
                                            onClick={onOpenAskModal}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-orange text-white text-sm font-bold shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 hover:-translate-y-0.5 transition-all w-fit"
                                        >
                                            {item.cta} <FaArrowRight />
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.link || '#'}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-gray-900 border border-gray-200 text-sm font-bold shadow-sm hover:border-brand-indigo hover:text-brand-indigo hover:-translate-y-0.5 transition-all w-fit"
                                        >
                                            {item.cta} <FaArrowRight />
                                        </Link>
                                    )}
                                </div>

                                <div className="w-2/5 relative overflow-hidden hidden md:block">
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/90 z-20"></div>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Counselling;
