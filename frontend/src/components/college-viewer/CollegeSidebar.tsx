import React from 'react';
import {
    FaStar, FaDownload, FaHeart, FaPhone, FaEnvelope,
    FaUniversity, FaChalkboardTeacher, FaMapMarkedAlt, FaTrophy
} from 'react-icons/fa';
import { CollegeData } from './types';

interface CollegeSidebarProps {
    college: CollegeData;
    isShortlisted: boolean;
    onToggleShortlist: () => void;
    scrollToSection: (sectionId: string) => void;
}

const CollegeSidebar: React.FC<CollegeSidebarProps> = ({
    college,
    isShortlisted,
    onToggleShortlist,
    scrollToSection,
}) => {
    const keyHighlights = [
        { label: 'Institute Type', value: college.type || 'N/A', icon: FaUniversity, colorClass: 'bg-indigo-50 text-primary' },
        { label: 'Total Faculty', value: college.totalFaculty || college.facultyCount ? `${college.totalFaculty || college.facultyCount}+ Faculty` : 'N/A', icon: FaChalkboardTeacher, colorClass: 'bg-violet-50 text-secondary' },
        { label: 'Campus Size', value: college.campusSize || college.landArea || 'N/A', icon: FaMapMarkedAlt, colorClass: 'bg-pink-50 text-pink-600' },
        { label: 'Accreditation', value: college.accreditation ? `${college.accreditation.body || 'NAAC'} '${college.accreditation.grade}'` : 'N/A', icon: FaTrophy, colorClass: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <div className="space-y-6">
            {/* KEY HIGHLIGHTS CARD */}
            <div className="bg-surface-light rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-200">
                <h3 className="font-display font-bold text-lg mb-6 text-text-main-light flex items-center gap-2">
                    <FaStar className="text-yellow-500" /> Key Highlights
                </h3>
                <ul className="space-y-5">
                    {keyHighlights.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <li key={idx} className="flex items-start gap-4">
                                <div className={`p-2.5 rounded-xl ${item.colorClass}`}>
                                    <Icon className="text-lg" />
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-text-muted-light uppercase tracking-wide mb-0.5">
                                        {item.label}
                                    </span>
                                    <span className="font-bold text-sm text-text-main-light">
                                        {item.value}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                
                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                    <button 
                        onClick={() => college.brochureUrl ? window.open(college.brochureUrl, '_blank') : scrollToSection('overview')}
                        className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                    >
                        <FaDownload className="text-xl group-hover:scale-110 transition-transform" /> Download Brochure
                    </button>
                    <button 
                        onClick={onToggleShortlist}
                        className="w-full bg-white border border-gray-200 text-text-main-light font-bold py-3.5 px-4 rounded-xl transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <FaHeart className={`text-xl ${isShortlisted ? 'text-red-500' : 'text-gray-400'}`} /> 
                        {isShortlisted ? 'Saved to Shortlist' : 'Save to Shortlist'}
                    </button>
                </div>
            </div>

            {/* ADMISSION HELP DESK CARD */}
            <div className="bg-linear-to-br from-gray-900 to-indigo-900 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-colors"></div>
                
                <h3 className="font-display font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                    <FaPhone className="text-2xl" /> Admission Help Desk
                </h3>
                <p className="text-indigo-200 text-xs mb-6 relative z-10">
                    Have queries about admission process? Contact our expert counselors.
                </p>
                
                <div className="space-y-4 relative z-10">
                    {college.phone && (
                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                            <div className="bg-white/20 p-2 rounded-full">
                                <FaPhone className="text-white text-sm" />
                            </div>
                            <div>
                                <div className="text-[10px] text-indigo-200 uppercase tracking-wide">Call Us</div>
                                <span className="text-sm font-bold">
                                    {college.phone}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                        <div className="bg-white/20 p-2 rounded-full">
                            <FaEnvelope className="text-white text-sm" />
                        </div>
                        <div>
                            <div className="text-[10px] text-indigo-200 uppercase tracking-wide">Email Us</div>
                            <span className="text-sm font-bold">
                                {college.email || 'support@collegedost.com'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeSidebar;
