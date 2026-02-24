"use client";

import React, { useState } from 'react';
import { CollegeData } from './types';

interface AIContentSectionProps {
    college: CollegeData;
    sectionRef: React.RefObject<HTMLDivElement | null>;
}

const AIContentSection: React.FC<AIContentSectionProps> = ({ college, sectionRef }) => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const ai = college.aiContent;

    if (!ai) return null;

    const hasFacilities = ai.facilities && ai.facilities.length > 0;
    const hasFaqs = ai.faqs && ai.faqs.length > 0;
    const hasCoursesSummary = ai.coursesSummary;

    if (!hasFacilities && !hasFaqs && !hasCoursesSummary) return null;

    return (
        <div
            ref={sectionRef}
            id="ai-content"
            className="space-y-8"
        >
            {/* Facilities */}
            {hasFacilities && (
                <div className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200">
                    <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-linear-to-b from-cyan-500 to-blue-600 rounded-full"></span>
                        Campus Facilities
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {ai.facilities.map((facility, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 hover:shadow-md transition-shadow"
                            >
                                <span className="text-cyan-600 text-lg">🏛️</span>
                                <span className="text-sm font-medium text-text-main-light">{facility}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Courses Summary */}
            {hasCoursesSummary && (
                <div className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200">
                    <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-4 flex items-center gap-3">
                        <span className="w-2 h-8 bg-linear-to-b from-violet-500 to-purple-600 rounded-full"></span>
                        Academic Programs
                    </h2>
                    <p className="text-sm text-text-muted-light leading-7">{ai.coursesSummary}</p>
                </div>
            )}

            {/* FAQs */}
            {hasFaqs && (
                <div className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200">
                    <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-linear-to-b from-amber-500 to-orange-600 rounded-full"></span>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {ai.faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-200 rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-sm font-semibold text-text-main-light pr-4">{faq.question}</span>
                                    <span className={`text-primary text-lg shrink-0 transition-transform duration-200 ${openFaqIndex === idx ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>
                                {openFaqIndex === idx && (
                                    <div className="px-4 pb-4 pt-0">
                                        <p className="text-sm text-text-muted-light leading-6 border-t border-gray-100 pt-3">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIContentSection;
