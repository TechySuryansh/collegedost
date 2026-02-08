"use client";

import React, { useEffect, useState } from 'react';

interface CollegeImage {
    src: string;
    alt: string;
}

const defaultCollegeImages: CollegeImage[] = [
    { src: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80", alt: "University Campus" },
    { src: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1920&q=80", alt: "College Library" },
    { src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80", alt: "Graduation Ceremony" },
    { src: "https://images.unsplash.com/flagged/photo-1554473675-d0904f3cbf38?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Modern University Building" },
    { src: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1920&q=80", alt: "College Campus Aerial" },
    { src: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1920&q=80", alt: "University Hallway" },
];

const CollegeCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % defaultCollegeImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Images */}
            {defaultCollegeImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={image.src}
                        alt={image.alt}
                        className={`w-full h-full object-cover transition-transform duration-8000 ease-linear ${
                            index === currentIndex ? 'scale-110' : 'scale-100'
                        }`}
                    />
                </div>
            ))}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-background-light/95 z-1"></div>
            <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-secondary/20 mix-blend-overlay z-2"></div>

            {/* Slide indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-3">
                {defaultCollegeImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CollegeCarousel;
