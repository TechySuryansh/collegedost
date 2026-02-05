"use client";

import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TestPrepExamsSection = () => {
    const exams = [
        "JEE Main", "GATE", "CAT", "CLAT", "NEET",
        "BITSAT", "SRMJEEE", "NIFT Entrance Exam",
        "VITEEE", "MET", "CUET", "LPU-NEST"
    ];

    const getLink = (exam: string) => {
        if (exam === "JEE Main") {
            return "/exams/jee-main";
        }
        const slug = exam.toLowerCase().replace(/ /g, '-');
        // Default to engineering prep if generic
        return `/test-prep/engineering/${slug}/preparation`;
    };

    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-brand-blue text-2xl shrink-0">
                    <FaEdit />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Exams</h2>
                    <p className="text-gray-500 mt-1 max-w-2xl">
                        Easy Information and downloads on Exam preparation, dates, counselling, syllabus and more
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {exams.map((exam, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href={getLink(exam)}
                            className="px-6 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition cursor-pointer block"
                        >
                            {exam}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default TestPrepExamsSection;
