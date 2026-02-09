import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { CollegeData } from './types';

interface CoursesSectionProps {
    college: CollegeData;
    sectionRef: React.RefObject<HTMLDivElement | null>;
    scrollToSection: (sectionId: string) => void;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ college, sectionRef, scrollToSection }) => {
    return (
        <div 
            ref={sectionRef}
            id="courses"
            className="bg-surface-light rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-colors duration-300"
        >
            <div className="p-6 lg:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light">
                    Courses, Fees &amp; Eligibility
                </h2>
                <button 
                    onClick={() => scrollToSection('admission')}
                    className="text-xs font-bold text-primary hover:text-secondary uppercase tracking-wide flex items-center gap-1"
                >
                    View All Courses <FaArrowRight className="text-xs" />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase text-text-muted-light font-bold tracking-wider">
                        <tr>
                            <th className="p-5 pl-8">Course</th>
                            <th className="p-5">Total Tuition Fees</th>
                            <th className="p-5">Eligibility Criteria</th>
                            <th className="p-5 pr-8 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {college.coursesOffered && college.coursesOffered.length > 0 ? (
                            college.coursesOffered.slice(0, 5).map((course: any, idx: number) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-5 pl-8">
                                        <div className="font-bold text-base text-text-main-light mb-1">{course.courseName}</div>
                                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                                            {course.duration || '4 Years'} | Full Time
                                        </div>
                                    </td>
                                    <td className="p-5 font-medium text-text-main-light">
                                        ₹ {course.fee ? course.fee.toLocaleString() : 'N/A'}
                                    </td>
                                    <td className="p-5 text-text-muted-light max-w-xs leading-snug">
                                        {course.eligibility || 'Check eligibility'}
                                    </td>
                                    <td className="p-5 pr-8 text-right">
                                        <button 
                                            onClick={() => scrollToSection('admission')}
                                            className="text-primary font-bold hover:text-secondary text-xs uppercase border border-primary/20 hover:border-primary px-3 py-1.5 rounded transition-all"
                                        >
                                            Apply Now
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-text-muted-light">
                                    <p className="text-base font-medium">Course details not available</p>
                                    <p className="text-sm mt-2">Please contact the admission office for course information</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CoursesSection;
