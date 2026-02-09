import React from 'react';
import { FaUniversity, FaImage, FaArrowRight } from 'react-icons/fa';
import { CollegeData } from './types';

interface GallerySectionProps {
    college: CollegeData;
    sectionRef: React.RefObject<HTMLDivElement | null>;
    onOpenLightbox: (index: number) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ college, sectionRef, onOpenLightbox }) => {
    return (
        <div 
            ref={sectionRef}
            id="gallery"
            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
        >
            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-linear-to-b from-pink-500 to-rose-600 rounded-full"></span>
                Campus Gallery
            </h2>
            
            {college.gallery && college.gallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {college.gallery.map((img, idx) => (
                        <div 
                            key={idx} 
                            className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer border border-gray-200"
                            onClick={() => onOpenLightbox(idx)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onOpenLightbox(idx);
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`View campus image ${idx + 1}`}
                        >
                            <img 
                                src={img} 
                                alt={`Campus ${idx + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FaImage className="text-white text-3xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { title: 'Main Building', color: 'from-blue-400 to-indigo-600' },
                        { title: 'Library', color: 'from-green-400 to-emerald-600' },
                        { title: 'Sports Complex', color: 'from-orange-400 to-red-500' },
                        { title: 'Auditorium', color: 'from-purple-400 to-violet-600' },
                        { title: 'Labs', color: 'from-cyan-400 to-blue-600' },
                        { title: 'Hostel', color: 'from-pink-400 to-rose-600' },
                    ].map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`relative aspect-video rounded-xl overflow-hidden group bg-linear-to-br ${item.color}`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaUniversity className="text-white/30 text-6xl" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3">
                                <span className="text-white text-sm font-medium">{item.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button 
                onClick={() => {
                    if (college.gallery && college.gallery.length > 0) {
                        onOpenLightbox(0);
                    }
                }}
                className="mt-6 text-primary font-bold text-sm uppercase tracking-wide hover:text-secondary flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!college.gallery || college.gallery.length === 0}
            >
                View All Photos <FaArrowRight />
            </button>
        </div>
    );
};

export default GallerySection;
