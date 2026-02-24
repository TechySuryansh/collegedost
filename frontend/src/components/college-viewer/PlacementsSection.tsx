import React from 'react';
import {
    FaRupeeSign, FaUserGraduate, FaBriefcase, FaChartLine,
    FaBuilding as FaCompany
} from 'react-icons/fa';
import { CollegeData } from './types';

interface PlacementsSectionProps {
    college: CollegeData;
    sectionRef: React.RefObject<HTMLDivElement | null>;
}

const PlacementsSection: React.FC<PlacementsSectionProps> = ({ college, sectionRef }) => {
    return (
        <div
            ref={sectionRef}
            id="placement"
            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
        >
            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-linear-to-b from-green-500 to-emerald-600 rounded-full"></span>
                Placements
            </h2>

            {/* Placement Stats Grid */}
            {college.aiContent?.placementStats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 text-center">
                        <FaRupeeSign className="text-2xl text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-main-light">
                            {college.aiContent.placementStats.highestPackage} LPA
                        </div>
                        <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Highest Package</div>
                    </div>
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 text-center">
                        <FaRupeeSign className="text-2xl text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-main-light">
                            {college.aiContent.placementStats.averagePackage} LPA
                        </div>
                        <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Average Package</div>
                    </div>
                    <div className="bg-linear-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-5 text-center">
                        <FaRupeeSign className="text-2xl text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-main-light">
                            {college.aiContent.placementStats.medianPackage} LPA
                        </div>
                        <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Median Package</div>
                    </div>
                    <div className="bg-linear-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-5 text-center">
                        <FaUserGraduate className="text-2xl text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-main-light">
                            {college.aiContent.placementStats.placementRate}%
                        </div>
                        <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Placement Rate</div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 text-center">
                        <FaRupeeSign className="text-2xl text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-main-light">
                            {college.placements?.highestPackage || college.placementStats?.highestPackage || 'N/A'}
                        </div>
                        <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Highest Package</div>
                    </div>
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 text-center">
                        <FaRupeeSign className="text-2xl text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-main-light">
                            {college.placements?.averagePackage || college.placementStats?.averagePackage || 'N/A'}
                        </div>
                        <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Average Package</div>
                    </div>
                    <div className="bg-linear-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-5 text-center">
                        <FaUserGraduate className="text-2xl text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-main-light">
                            {college.placements?.placedPercentage || college.placementStats?.placedPercentage || 'N/A'}
                        </div>
                        <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Students Placed</div>
                    </div>
                    <div className="bg-linear-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-5 text-center">
                        <FaCompany className="text-2xl text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-main-light">
                            {college.placements?.recruitersCount || college.placementStats?.recruitersCount || 'N/A'}
                        </div>
                        <div className="text-xs text-text-muted-light uppercase tracking-wide font-medium">Recruiters</div>
                    </div>
                </div>
            )}

            {/* AI Placement Summary */}
            {college.aiContent?.placements && (
                <div className="mb-8 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <p className="text-sm text-text-main-light leading-7">{college.aiContent.placements}</p>
                </div>
            )}

            {/* Top Recruiters */}
            <div className="mb-8">
                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                    <FaBriefcase className="text-primary" /> Top Recruiters
                </h3>
                {college.placements?.topRecruiters && college.placements.topRecruiters.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {college.placements.topRecruiters.map((company: string, idx: number) => (
                            <span
                                key={idx}
                                className="bg-gray-100 border border-gray-200 text-text-main-light px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all cursor-default"
                            >
                                {company}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-muted-light text-sm">Recruiter information not available</p>
                )}
            </div>

            {/* Placement Trends */}
            <div>
                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                    <FaChartLine className="text-primary" /> Placement Trends (Last 3 Years)
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-xs uppercase text-text-muted-light font-bold tracking-wider">
                            <tr>
                                <th className="p-4">Year</th>
                                <th className="p-4">Highest (LPA)</th>
                                <th className="p-4">Average (LPA)</th>
                                <th className="p-4">Placement %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {college.placementHistory && college.placementHistory.length > 0 ? (
                                college.placementHistory.slice(0, 3).map((record, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{record.year}</td>
                                        <td className="p-4 text-green-600 font-bold">{record.highestPackage}</td>
                                        <td className="p-4">{record.averagePackage}</td>
                                        <td className="p-4">{record.placedPercentage}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-text-muted-light">
                                        Placement data not available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlacementsSection;
