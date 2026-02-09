import React from 'react';
import { FaGraduationCap, FaUsers, FaArrowRight } from 'react-icons/fa';

interface ScholarshipsSectionProps {
    sectionRef: React.RefObject<HTMLDivElement | null>;
    scrollToSection: (sectionId: string) => void;
}

const scholarships = [
    {
        type: 'Merit Based',
        title: 'Institute Merit-cum-Means',
        description: 'Awarded to 25% of students admitted. Exemption from tuition fees and pocket allowance of ₹1000/month.',
        icon: FaGraduationCap,
        color: 'green'
    },
    {
        type: 'Category Based',
        title: 'SC/ST Scholarship',
        description: 'Free messing and pocket allowance of ₹250/month over and above tuition fee exemption.',
        icon: FaUsers,
        color: 'blue'
    }
];

const ScholarshipsSection: React.FC<ScholarshipsSectionProps> = ({ sectionRef, scrollToSection }) => {
    return (
        <div 
            ref={sectionRef}
            id="scholarship"
            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
        >
            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-linear-to-b from-secondary to-pink-500 rounded-full"></span>
                Scholarships &amp; Financial Aid
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {scholarships.map((scholarship, idx) => {
                    const Icon = scholarship.icon;
                    const colorClasses = scholarship.color === 'green' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600';
                    const badgeClasses = scholarship.color === 'green'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700';
                    
                    return (
                        <div 
                            key={idx}
                            className="border border-gray-200 rounded-2xl p-6 hover:border-primary/50 hover:bg-gray-50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${colorClasses} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                                    <Icon className="text-xl" />
                                </div>
                                <span className={`${badgeClasses} text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide`}>
                                    {scholarship.type}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-text-main-light mb-2">{scholarship.title}</h3>
                            <p className="text-sm text-text-muted-light mb-4 leading-relaxed">{scholarship.description}</p>
                            <button 
                                type="button"
                                onClick={() => scrollToSection('admission')}
                                className="text-primary text-xs font-bold uppercase tracking-wide hover:text-secondary flex items-center gap-1"
                            >
                                View Eligibility <FaArrowRight className="text-xs" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ScholarshipsSection;
