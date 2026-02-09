import React from 'react';
import DOMPurify from 'dompurify';
import { CollegeData } from './types';

interface OverviewSectionProps {
    college: CollegeData;
    sectionRef: React.RefObject<HTMLDivElement | null>;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ college, sectionRef }) => {
    return (
        <div 
            ref={sectionRef}
            id="overview"
            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
        >
            <h2 className="text-2xl font-display font-bold text-text-main-light mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-linear-to-b from-primary to-secondary rounded-full"></span>
                About {college.name.split(',')[0]}
            </h2>
            <div className="prose max-w-none text-text-muted-light text-sm leading-7">
                {college.overview ? (
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(college.overview) }} />
                ) : (
                    <p>
                        {college.name} is one of the foremost institutes of national importance in higher technological education, 
                        basic and applied research. The Institute has academic departments and advanced research centres in various 
                        disciplines of engineering and pure sciences.
                    </p>
                )}
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="p-4 rounded-xl bg-background-light text-center border border-gray-100">
                    <div className="text-primary font-bold text-3xl mb-1">
                        {college.nirfRank ? `#${college.nirfRank}` : 'N/A'}
                    </div>
                    <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold">NIRF Engineering</div>
                </div>
                <div className="p-4 rounded-xl bg-background-light text-center border border-gray-100">
                    <div className="text-primary font-bold text-3xl mb-1">
                        {college.facultyCount || college.totalFaculty ? `${college.facultyCount || college.totalFaculty}+` : 'N/A'}
                    </div>
                    <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold">Faculty Members</div>
                </div>
                <div className="p-4 rounded-xl bg-background-light text-center border border-gray-100">
                    <div className="text-primary font-bold text-3xl mb-1">
                        {college.studentCount ? `${college.studentCount}+` : 'N/A'}
                    </div>
                    <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold">Students Enrolled</div>
                </div>
                <div className="p-4 rounded-xl bg-background-light text-center border border-gray-100">
                    <div className="text-primary font-bold text-3xl mb-1">
                        {college.placements?.averagePackage || college.placementStats?.averagePackage || 'N/A'}
                    </div>
                    <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold">Avg Package (INR)</div>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
