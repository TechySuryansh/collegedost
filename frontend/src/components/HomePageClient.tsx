"use client";

import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import NewsSection from './NewsSection';
import OtherProducts from './OtherProducts';
import GenericCardGrid from './GenericCardGrid';
import Counselling from './Counselling';
import PillSection from './PillSection';
import PredictorsSection from './PredictorsSection';
import { motion } from 'framer-motion';
import api from '../api/axios';
import TestPrepExamsSection from './TestPrepExamsSection';
import { useUI } from '@/context/UIContext'; // Import useUI

import {
    examCategories,
    homeCounsellingData,
    // homeStatsData, // Not used in original code? Wait, looked like it was used in StatsSection?
    // Let's check original HomePage.jsx
    homeRankingsData,
    homeExamsData,
    homePredictorsData,
    homeCoursesData,
    featuredColleges as staticFeaturedColleges
} from '../data/navigation';

const HomePage = () => {
    const { openAskModal } = useUI(); // Use UI context
    const [featuredColleges, setFeaturedColleges] = useState(staticFeaturedColleges);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Colleges
                const collegesRes = await api.get('/colleges');
                if (collegesRes.data.success && collegesRes.data.data.length > 0) {
                    // Map to required format
                    const mappedColleges = collegesRes.data.data.slice(0, 8).map((col: any) => ({
                        id: col._id,
                        name: col.name,
                        location: `${col.location.city}, ${col.location.state}`,
                        rating: col.nirfRank ? `NIRF #${col.nirfRank}` : "AAAA",
                        logo: col.logo || "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", // Fallback
                        tags: [col.type, "Top Ranked"],
                        fees: col.fees?.tuition ? `₹ ${col.fees.tuition / 100000}L Total` : "Check Fee",
                        placement: col.placements?.averagePackage ? `₹ ${col.placements.averagePackage}` : "Best ROI",
                        link: `/colleges/${col.slug}`
                    }));
                    setFeaturedColleges(mappedColleges);
                }

                // Fetch News
                const newsRes = await api.get('/articles');
                if (newsRes.data.success) {
                    setNews(newsRes.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch homepage data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="overflow-x-hidden"
        >
            <Hero />
            <NewsSection items={news} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 grow flex flex-col gap-10 md:gap-20">
                <motion.div variants={itemVariants}>
                    <GenericCardGrid
                        title="Explore by Category"
                        items={examCategories}
                        type="category"
                        viewAllLink="/categories"
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <OtherProducts />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <GenericCardGrid
                        title="Featured Colleges"
                        items={featuredColleges}
                        type="card"
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <PredictorsSection
                        data={homePredictorsData}
                        illustration="/predictor-illustration-v2.png"
                    />
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 grow flex flex-col gap-10 md:gap-20">
                <motion.div variants={itemVariants}>
                    <Counselling items={homeCounsellingData} onOpenAskModal={openAskModal} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <PillSection title="Top Rankings" items={homeRankingsData} color="border-gray-200" />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <PillSection title="Popular Exams" items={homeExamsData} color="border-gray-200" />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <TestPrepExamsSection />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <PredictorsSection
                        data={homeCoursesData}
                        title="Online Courses"
                        mainTitle="Boost Your Career"
                        subText="Learn from the best. Trending courses and certifications."
                        illustration="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg"
                    />
                </motion.div>

            </div>
        </motion.div>
    );
};

export default HomePage;
