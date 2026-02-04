"use client";

import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    FaMapMarkerAlt, FaUniversity, FaAward, FaRupeeSign, FaBriefcase,
    FaGraduationCap, FaCheckCircle, FaStar, FaBuilding, FaInfoCircle,
    FaDownload, FaGlobe, FaImages, FaBed, FaBook, FaRunning, FaHospital, FaMicrochip
} from 'react-icons/fa';

// Define Types for College Data (Basic)
interface CollegeData {
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
    accreditation?: { grade: string };
    overview?: string;
    highlights?: string[];
    galleries?: string[];
    coursesOffered?: any[];
    detailedFees?: any[];
    placementStats?: any;
    infrastructure?: any;
    cutoff?: any[];
    admissionProcess?: any;
    website?: string;
}

const CollegeDetailPage = () => {
    const params = useParams();
    const slug = params.slug as string;

    const [college, setCollege] = useState<CollegeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const res = await api.get(`/colleges/${slug}`);
                if (res.data.success) {
                    setCollege(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchCollege();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen pt-24 flex justify-center items-center">
            <div className="animate-spin h-10 w-10 border-2 border-brand-blue rounded-full border-t-transparent"></div>
        </div>
    );

    if (!college) return (
        <div className="min-h-screen pt-32 text-center bg-gray-50 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">College Not Found</h2>
            <p className="text-gray-500 mb-6">The college you are looking for does not exist or has been moved.</p>
            <Link href="/colleges" className="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition">Browse Colleges</Link>
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FaInfoCircle },
        { id: 'courses', label: 'Courses & Fees', icon: FaGraduationCap },
        { id: 'cutoffs', label: 'Cutoffs', icon: FaAward },
        { id: 'placements', label: 'Placements', icon: FaBriefcase },
        { id: 'infrastructure', label: 'Facilities', icon: FaBuilding },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-[72px]">
            {/* SEO Metadata is usually handled by layout or generateMetadata in Next.js, but since this is client-side only 
                for now, we'll skip dynamic Head injection unless we move to Server Component wrapper. */}

            {/* --- HERO SECTION --- */}
            <div className="bg-white border-b border-gray-200">
                {/* Banner Image */}
                <div className="h-64 md:h-80 w-full relative bg-gray-200 overflow-hidden">
                    {college.bannerImage ? (
                        <img src={college.bannerImage} alt={`${college.name} Campus`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-900 to-brand-blue flex items-center justify-center">
                            <FaUniversity className="text-white/20 text-9xl" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Quick Stats Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {college.nirfRank && (
                            <span className="bg-white text-brand-blue font-bold px-3 py-1 rounded-full text-xs shadow-lg flex items-center gap-1">
                                <FaAward /> NIRF #{college.nirfRank}
                            </span>
                        )}
                        <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg flex items-center gap-1">
                            <FaStar /> {college.rating || '4.5'}/5
                        </span>
                    </div>
                </div>

                <div className="container mx-auto px-4 relative pb-6">
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        {/* Logo - Pulled up to overlap banner */}
                        <div className="-mt-16 md:-mt-20 w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-xl border-4 border-white flex items-center justify-center overflow-hidden flex-shrink-0 z-10 relative">
                            {college.logo ? (
                                <img src={college.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="text-5xl font-bold text-gray-300">{college.name.charAt(0)}</span>
                            )}
                        </div>

                        {/* Info - Stays in white area */}
                        <div className="flex-1 text-gray-900 md:mb-4 z-0">
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">{college.name}</h1>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm font-medium text-gray-600">
                                <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-gray-400" /> {college.location?.city ? `${college.location.city}, ` : ''}{college.location?.state}</span>
                                <span className="flex items-center gap-1"><FaBuilding className="text-gray-400" /> {college.type}</span>
                                {college.estYear && <span className="flex items-center gap-1">Est. {college.estYear}</span>}
                                {college.accreditation && <span className="bg-yellow-100 text-yellow-800 px-2 rounded text-xs py-0.5 border border-yellow-200">NAAC {college.accreditation.grade}</span>}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-3 mt-4 md:mt-0 md:mb-4 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-6 py-2.5 bg-brand-orange text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition active:scale-95 text-center">
                                Apply Now
                            </button>
                            <button className="flex-1 md:flex-none px-6 py-2.5 bg-white text-gray-800 font-bold rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
                                <FaDownload /> Brochure
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NAVIGATION TABS --- */}
            <div className="sticky top-[72px] z-40 bg-white shadow-sm border-b border-gray-200 overflow-x-auto hide-scrollbar">
                <div className="container mx-auto px-4">
                    <div className="flex gap-8 min-w-max">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-brand-blue text-brand-blue'
                                        : 'border-transparent text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                <tab.icon /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* LEFT CONTENT COLUMN */}
                <div className="lg:col-span-3 space-y-8">

                    {/* OVERVIEW SECTION */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {college.name}</h2>
                                <div
                                    className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: college.overview || '<p>No details available.</p>' }}
                                />
                            </div>

                            {/* Highlights Grid */}
                            {college.highlights && college.highlights.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Institute Highlights</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {college.highlights.map((point, idx) => (
                                            <div key={idx} className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                                                <FaCheckCircle className="text-brand-blue mt-1 flex-shrink-0" />
                                                <span className="text-gray-700 font-medium">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Gallery Preview */}
                            {college.galleries && college.galleries.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FaImages className="text-purple-500" /> Campus Gallery</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {college.galleries.map((img, i) => (
                                            <div key={i} className="aspect-video rounded-lg overflow-hidden relative group">
                                                <img src={img} alt="Campus" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* COURSES SECTION */}
                    {activeTab === 'courses' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses & Fee Structure</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                                            <th className="px-6 py-4 font-semibold">Course Name</th>
                                            <th className="px-6 py-4 font-semibold">Total Fees</th>
                                            <th className="px-6 py-4 font-semibold">Eligibility</th>
                                            <th className="px-6 py-4 font-semibold">Seats</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {college.coursesOffered?.map((course: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-800">{course.courseName}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{course.duration} • {course.examAccepted}</div>
                                                </td>
                                                <td className="px-6 py-4 text-brand-blue font-bold">
                                                    ₹ {course.fee.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-sm max-w-xs">{course.eligibility}</td>
                                                <td className="px-6 py-4 text-gray-600 italic">{course.seats}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* DETAILED FEE STRUCTURE (FROM Ingestion/JoSAA) */}
                            {college.detailedFees && college.detailedFees.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaRupeeSign className="text-green-600" /> Detailed Fee Breakdown
                                    </h3>
                                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                                                    <th className="px-6 py-3 font-semibold">Course / Category</th>
                                                    <th className="px-6 py-3 font-semibold">Year</th>
                                                    <th className="px-6 py-3 font-semibold">Amount</th>
                                                    <th className="px-6 py-3 font-semibold">Type</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                {college.detailedFees.map((fee: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="px-6 py-3 font-medium text-gray-800">
                                                            {fee.courseName} <span className="text-gray-400 text-xs">({fee.category})</span>
                                                        </td>
                                                        <td className="px-6 py-3 text-gray-600">{fee.year}</td>
                                                        <td className="px-6 py-3 font-bold text-green-600">₹ {fee.amount.toLocaleString()}</td>
                                                        <td className="px-6 py-3 text-gray-500 text-sm">{fee.type}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PLACEMENTS SECTION */}
                    {activeTab === 'placements' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Placement Highlights {college.placementStats?.year}</h2>
                                        <p className="text-gray-500">Exceptional career opportunities and recruitment stats.</p>
                                    </div>
                                    {college.placementStats?.placementRate && (
                                        <div className="text-center bg-green-50 p-2 rounded-lg border border-green-100">
                                            <div className="text-2xl font-bold text-green-600">{college.placementStats.placementRate}%</div>
                                            <div className="text-xs font-bold text-green-800 uppercase">Placement Rate</div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 text-center">
                                        <div className="text-gray-500 text-sm font-bold uppercase mb-2">Highest Package</div>
                                        <div className="text-2xl md:text-3xl font-bold text-brand-blue">{college.placementStats?.highestPackage || 'N/A'}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border border-orange-100 text-center">
                                        <div className="text-gray-500 text-sm font-bold uppercase mb-2">Average Package</div>
                                        <div className="text-2xl md:text-3xl font-bold text-brand-orange">{college.placementStats?.averagePackage || 'N/A'}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 text-center">
                                        <div className="text-gray-500 text-sm font-bold uppercase mb-2">Median Package</div>
                                        <div className="text-2xl md:text-3xl font-bold text-purple-600">{college.placementStats?.medianPackage || 'N/A'}</div>
                                    </div>
                                </div>

                                {/* Top Recruiters */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-800 mb-3">Top Recruiters</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {college.placementStats?.topRecruiters?.map((rec: string, i: number) => (
                                            <span key={i} className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 font-medium">
                                                {rec}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Sector Split */}
                                {college.placementStats?.sectorWiseSplit && (
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-4">Placement by Sector</h3>
                                        <div className="space-y-3">
                                            {college.placementStats.sectorWiseSplit.map((sec: any, i: number) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium text-gray-700">{sec.sector}</span>
                                                        <span className="text-gray-500">{sec.percentage}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div className="bg-brand-blue h-2 rounded-full" style={{ width: `${sec.percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* INFRASTRUCTURE SECTION */}
                    {activeTab === 'infrastructure' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Infrastructure & Facilities</h2>
                            <p className="text-gray-600 mb-8">{college.infrastructure?.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {college.infrastructure?.facilities?.map((fac: any, idx: number) => {
                                    // Dynamic Icon Mapping
                                    const IconComponent =
                                        fac.icon === 'FaBook' ? FaBook :
                                            fac.icon === 'FaBed' ? FaBed :
                                                fac.icon === 'FaRunning' ? FaRunning :
                                                    fac.icon === 'FaHospital' ? FaHospital :
                                                        fac.icon === 'FaMicrochip' ? FaMicrochip : FaBuilding;

                                    return (
                                        <div key={idx} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition bg-gray-50/50">
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-blue text-xl border border-gray-100 flex-shrink-0">
                                                <IconComponent />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{fac.name}</h4>
                                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{fac.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Infra Images */}
                            {college.infrastructure?.images && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                                    {college.infrastructure.images.map((img: string, i: number) => (
                                        <div key={i} className="aspect-video rounded-lg overflow-hidden">
                                            <img src={img} alt="Infrastructure" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    )}

                    {/* CUTOFFS SECTION */}
                    {activeTab === 'cutoffs' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Cutoffs</h2>
                            {college.cutoff && college.cutoff.length > 0 ? (
                                <div className="grid gap-4">
                                    {college.cutoff.map((cut: any, i: number) => (
                                        <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center group hover:border-brand-blue/30 transition">
                                            <div>
                                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                                    {cut.branch} <span className="text-xs bg-white border px-2 py-0.5 rounded text-gray-500">{cut.exam}</span>
                                                </h4>
                                                <div className="text-xs text-gray-500 mt-1 flex gap-3">
                                                    <span>Category: <span className="font-medium text-gray-700">{cut.category}</span></span>
                                                    <span>Year: <span className="font-medium text-gray-700">{cut.year}</span></span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Closing {cut.cutoffType}</div>
                                                <div className="text-xl font-bold text-brand-blue">{cut.closing}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm italic py-4">Cutoff data not available for this year.</div>
                            )}
                        </div>
                    )}

                </div>

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Admissions Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Admission Process</h3>
                        <p className="text-sm text-gray-600 mb-4">{college.admissionProcess?.description}</p>

                        {college.admissionProcess?.importantDates && (
                            <div className="space-y-3 mb-6">
                                {college.admissionProcess.importantDates.map((date: any, i: number) => (
                                    <div key={i} className="bg-yellow-50 p-3 rounded border border-yellow-100">
                                        <div className="text-xs font-bold text-yellow-800 uppercase">{date.label}</div>
                                        <div className="text-sm font-bold text-gray-800">{date.date}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2">
                            <a href={college.website} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-50 text-brand-blue font-bold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition">
                                <FaGlobe className="inline mr-2" /> Official Website
                            </a>
                            <button className="block w-full text-center bg-gray-800 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-900 transition">
                                Contact Admission Office
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CollegeDetailPage;
