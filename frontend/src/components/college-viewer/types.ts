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
    cutoffs?: any[];
    website?: string;
    brochureUrl?: string;
    phone?: string;
    email?: string;
    streams?: string[];
    facilities?: string[];
    importantDates?: Array<{ event: string; date: string; status: 'upcoming' | 'ongoing' | 'completed' }>;
    admissionProcess?: Array<{ step: number; title: string; description: string }>;
    requiredDocuments?: string[];
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
    // New AISHE fields
    aisheCode?: string;
    yearOfEstablishment?: string;
    collegeType?: string;
    management?: string;
    universityName?: string;
    universityType?: string;
    institutionCategory?: string;
    locationType?: string;
    description?: string;
    city?: string;
    state?: string;
    // AI-generated content
    aiContent?: {
        description: string;
        highlights: string[];
        placements: string;
        placementStats: {
            averagePackage: number;
            medianPackage: number;
            highestPackage: number;
            placementRate: number;
        };
        facilities: string[];
        coursesSummary: string;
        faqs: { question: string; answer: string }[];
        seoTitle: string;
        seoDescription: string;
    };
    aiGenerated?: boolean;
    aiGeneratedAt?: string;
}
