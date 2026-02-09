import React from 'react';
import {
    FaUniversity, FaMapMarkerAlt, FaBuilding, FaDownload, FaArrowRight
} from 'react-icons/fa';
import { CollegeData } from './types';

interface CollegeHeroProps {
    college: CollegeData;
    scrollToSection: (sectionId: string) => void;
}

const CollegeHero: React.FC<CollegeHeroProps> = ({ college, scrollToSection }) => {
    return (
        <div className="relative h-120 w-full group">
            {/* Banner Image */}
            <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                {college.bannerImage ? (
                    <img 
                        src={college.bannerImage} 
                        alt={`${college.name} Campus`} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                        <FaUniversity className="text-white/20 text-9xl" />
                    </div>
                )}
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-full z-10 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Glass Card */}
                    <div className="glass-card bg-white/20 rounded-2xl p-6 lg:p-8 border-white/20 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                        {/* Top gradient line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-secondary to-primary"></div>
                        
                        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                            {/* College Info */}
                            <div className="text-white space-y-3">
                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="bg-white text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        NIRF RANK #{college.nirfRank || 'N/A'}
                                    </span>
                                    <span className="bg-black/30 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-xs" /> {college.location?.city || 'City'}, {college.location?.state || 'State'}
                                    </span>
                                    <span className="bg-black/30 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <FaBuilding className="text-xs" /> Estd. {college.estYear || 'N/A'}
                                    </span>
                                </div>
                                
                                {/* Title */}
                                <h1 className="text-3xl lg:text-5xl font-display font-bold tracking-tight text-white drop-shadow-sm">
                                    {college.name}
                                </h1>
                                
                                {/* Description */}
                                <p className="text-white/90 max-w-3xl text-sm lg:text-base font-medium leading-relaxed drop-shadow-sm line-clamp-2">
                                    {college.overview 
                                        ? college.overview.replace(/<[^>]*>/g, '')
                                        : 'A premier institution offering undergraduate, postgraduate and doctoral programs.'}
                                </p>
                            </div>
                            
                            {/* CTA Buttons */}
                            <div className="flex gap-4 shrink-0 w-full lg:w-auto">
                                <button 
                                    onClick={() => college.brochureUrl ? window.open(college.brochureUrl, '_blank') : scrollToSection('overview')}
                                    className="flex-1 lg:flex-none bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg backdrop-blur-md flex items-center justify-center gap-2"
                                >
                                    <FaDownload className="text-lg" /> Brochure
                                </button>
                                <button 
                                    onClick={() => scrollToSection('admission')}
                                    className="flex-1 lg:flex-none bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                                >
                                    Apply Now <FaArrowRight className="font-bold" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeHero;
