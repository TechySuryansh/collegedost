// Shared types for the CollegeViewer component tree

export interface CollegeData {
    _id: string;
    slug: string;
    name: string;
    bannerImage?: string;
    logo?: string;
    nirfRank?: number;
    rating?: number | string;
    location?: { city: string; state: string; address?: string };
    type?: string;
    estYear?: string | number;
    accreditation?: { grade: string; body?: string };
    overview?: string;
    highlights?: string[];
    gallery?: string[];
    coursesOffered?: any[];
    detailedFees?: any[];
    placementStats?: any;
    placements?: any;
    infrastructure?: any;
    cutoff?: any[];
    admissionProcess?: any;
    website?: string;
    brochureUrl?: string;
    phone?: string;
    email?: string;
    streams?: string[];
    facilities?: string[];
    faqs?: any[];
    facultyCount?: number;
    totalFaculty?: number;
    studentCount?: number;
    campusSize?: string;
    landArea?: string;
    placementHistory?: Array<{
        year: number;
        highestPackage: string;
        averagePackage: string;
        placedPercentage: string;
    }>;
}
