import React from 'react';
import DOMPurify from 'dompurify';
import { CollegeData } from './types';

interface OverviewSectionProps {
    college: CollegeData;
    sectionRef: React.RefObject<HTMLDivElement | null>;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ college, sectionRef }) => {
    // Build info items from available data
    const infoItems: { label: string; value: string }[] = [];
    if (college.yearOfEstablishment && college.yearOfEstablishment !== '-')
        infoItems.push({ label: 'Established', value: college.yearOfEstablishment });
    if (college.institutionCategory)
        infoItems.push({ label: 'Category', value: college.institutionCategory });
    if (college.management && college.management !== '-')
        infoItems.push({ label: 'Management', value: college.management });
    if (college.collegeType && college.collegeType !== '-')
        infoItems.push({ label: 'Type', value: college.collegeType });
    if (college.locationType && college.locationType !== '-')
        infoItems.push({ label: 'Location', value: college.locationType });
    if (college.universityName)
        infoItems.push({ label: 'University', value: college.universityName });
    if (college.universityType)
        infoItems.push({ label: 'University Type', value: college.universityType });
    if (college.aisheCode)
        infoItems.push({ label: 'AISHE Code', value: college.aisheCode });
    if (college.location?.city)
        infoItems.push({ label: 'District', value: college.location.city });
    if (college.location?.state)
        infoItems.push({ label: 'State', value: college.location.state });

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
                {college.aiContent?.description ? (
                    <p>{college.aiContent.description}</p>
                ) : college.overview ? (
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(college.overview) }} />
                ) : college.description ? (
                    <p>{college.description}</p>
                ) : (
                    <p>
                        {college.name} is located in {college.location?.city || 'India'}, {college.location?.state || ''}.
                        {college.management ? ` It is managed by ${college.management}.` : ''}
                        {college.yearOfEstablishment ? ` Established in ${college.yearOfEstablishment}.` : ''}
                    </p>
                )}
            </div>

            {/* AI Highlights */}
            {college.aiContent?.highlights && college.aiContent.highlights.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold text-text-main-light mb-3 flex items-center gap-2">
                        <span className="text-yellow-500">✨</span> Key Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {college.aiContent.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
                                <span className="text-primary font-bold text-sm mt-0.5">✓</span>
                                <span className="text-sm text-text-main-light">{highlight}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Website Link */}
            {college.website && (
                <div className="mt-4">
                    <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        Visit Official Website
                    </a>
                </div>
            )}

            {/* Key Info Grid */}
            {infoItems.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                    {infoItems.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-background-light border border-gray-100">
                            <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold mb-1.5">{item.label}</div>
                            <div className="text-primary font-bold text-sm leading-snug truncate" title={item.value}>{item.value}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Legacy Stats Grid - only show if there's NIRF/placement data */}
            {(college.nirfRank || college.placements?.averagePackage || college.placementStats?.averagePackage) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-background-light text-center border border-gray-100">
                        <div className="text-primary font-bold text-3xl mb-1">
                            {college.nirfRank ? `#${college.nirfRank}` : 'N/A'}
                        </div>
                        <div className="text-[10px] text-text-muted-light uppercase tracking-wider font-bold">NIRF Rank</div>
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
            )}
        </div>
    );
};

export default OverviewSection;
