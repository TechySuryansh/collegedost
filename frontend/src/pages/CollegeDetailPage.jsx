import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
    FaMapMarkerAlt, FaUniversity, FaAward, FaRupeeSign, FaBriefcase, 
    FaGraduationCap, FaCheckCircle, FaStar, FaBuilding, FaInfoCircle, 
    FaDownload, FaGlobe, FaYoutube, FaImages, FaBed, FaBook, FaRunning, FaHospital, FaMicrochip,
    FaCommentAlt, FaThumbsUp, FaUser, FaEdit, FaTrash 
} from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

const CollegeDetailPage = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Review state
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [reviewForm, setReviewForm] = useState({
        overallRating: 5,
        academicsRating: 5,
        facultyRating: 5,
        infrastructureRating: 5,
        placementsRating: 5,
        campusLifeRating: 5,
        title: '',
        reviewText: '',
        pros: '',
        cons: '',
        courseName: '',
        graduationYear: new Date().getFullYear()
    });

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
        fetchCollege();
    }, [slug]);

    // Fetch reviews when reviews tab is active
    useEffect(() => {
        if (activeTab === 'reviews' && college?._id) {
            fetchReviews(college._id);
        }
    }, [activeTab, college?._id]);

    const fetchReviews = async (collegeId) => {
        if (!collegeId) return;
        setReviewLoading(true);
        try {
            const res = await api.get(`/reviews/college/${collegeId}`);
            if (res.data.success) {
                setReviews(res.data.data);
                setReviewStats(res.data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setReviewLoading(false);
        }
    };


    if (loading) return (
        <div className="min-h-screen pt-24 flex justify-center items-center">
            <div className="animate-spin h-10 w-10 border-2 border-brand-blue rounded-full border-t-transparent"></div>
        </div>
    );
    
    if (!college) return (
        <div className="min-h-screen pt-32 text-center bg-gray-50 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">College Not Found</h2>
            <p className="text-gray-500 mb-6">The college you are looking for does not exist or has been moved.</p>
            <Link to="/colleges" className="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition">Browse Colleges</Link>
        </div>
    );

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert('Please login to submit a review');
            return;
        }
        setReviewSubmitting(true);
        try {
            const res = await api.post('/reviews', {
                collegeId: college._id,
                ...reviewForm
            });
            if (res.data.success) {
                setShowReviewForm(false);
                setReviewForm({
                    overallRating: 5,
                    academicsRating: 5,
                    facultyRating: 5,
                    infrastructureRating: 5,
                    placementsRating: 5,
                    campusLifeRating: 5,
                    title: '',
                    reviewText: '',
                    pros: '',
                    cons: '',
                    courseName: '',
                    graduationYear: new Date().getFullYear()
                });
                fetchReviews(college._id);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewSubmitting(false);
        }
    };

    const handleHelpful = async (reviewId) => {
        if (!isAuthenticated) {
            alert('Please login to mark as helpful');
            return;
        }
        try {
            await api.post(`/reviews/${reviewId}/helpful`);
            fetchReviews(college._id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review._id);
        setReviewForm({
            overallRating: review.overallRating,
            academicsRating: review.academicsRating,
            facultyRating: review.facultyRating,
            infrastructureRating: review.infrastructureRating,
            placementsRating: review.placementsRating,
            campusLifeRating: review.campusLifeRating,
            title: review.title,
            reviewText: review.reviewText,
            pros: review.pros || '',
            cons: review.cons || '',
            courseName: review.courseName || '',
            graduationYear: review.graduationYear || new Date().getFullYear()
        });
        setShowReviewForm(true);
    };

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        setReviewSubmitting(true);
        try {
            const res = await api.put(`/reviews/${editingReview}`, reviewForm);
            if (res.data.success) {
                setShowReviewForm(false);
                setEditingReview(null);
                setReviewForm({
                    overallRating: 5,
                    academicsRating: 5,
                    facultyRating: 5,
                    infrastructureRating: 5,
                    placementsRating: 5,
                    campusLifeRating: 5,
                    title: '',
                    reviewText: '',
                    pros: '',
                    cons: '',
                    courseName: '',
                    graduationYear: new Date().getFullYear()
                });
                fetchReviews(college._id);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update review');
        } finally {
            setReviewSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return;
        }
        try {
            const res = await api.delete(`/reviews/${reviewId}`);
            if (res.data.success) {
                fetchReviews(college._id);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete review');
        }
    };

    const cancelEdit = () => {
        setEditingReview(null);
        setShowReviewForm(false);
        setReviewForm({
            overallRating: 5,   
            academicsRating: 5,
            facultyRating: 5,
            infrastructureRating: 5,
            placementsRating: 5,
            campusLifeRating: 5,
            title: '',
            reviewText: '',
            pros: '',
            cons: '',
            courseName: '',
            graduationYear: new Date().getFullYear()
        });
    };

    const renderStars = (rating, size = 'text-sm') => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} className={`${size} ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FaInfoCircle },
        { id: 'courses', label: 'Courses & Fees', icon: FaGraduationCap },
        { id: 'cutoffs', label: 'Cutoffs', icon: FaAward },
        { id: 'placements', label: 'Placements', icon: FaBriefcase },
        { id: 'infrastructure', label: 'Facilities', icon: FaBuilding },
        { id: 'reviews', label: 'Reviews', icon: FaCommentAlt },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-[72px]">
            <Helmet>
                <title>{`${college.name} - Ranking, Fees, Courses, Placements 2026 | CollegeDost`}</title>
                <meta name="description" content={`Get detailed info about ${college.name} including Admission 2026, Fees, Cutoff, Placements, Ranking, and Campus Infrastructure.`} />
            </Helmet>

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
                                className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
                                    activeTab === tab.id 
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
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FaImages className="text-purple-500"/> Campus Gallery</h3>
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
                                        {college.coursesOffered?.map((course, idx) => (
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
                                        <FaRupeeSign className="text-green-600"/> Detailed Fee Breakdown
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
                                                {college.detailedFees.map((fee, idx) => (
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
                                           {college.placementStats?.topRecruiters?.map((rec, i) => (
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
                                                {college.placementStats.sectorWiseSplit.map((sec, i) => (
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
                                {college.infrastructure?.facilities?.map((fac, idx) => {
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
                                    {college.infrastructure.images.map((img, i) => (
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
                                {college.cutoff.map((cut, i) => (
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

                     {/* REVIEWS SECTION */}
                     {activeTab === 'reviews' && (
                         <div className="space-y-6 animate-fade-in">
                             {/* Review Stats */}
                             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                                 <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                                     <div>
                                         <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Reviews</h2>
                                         <p className="text-gray-500">See what students say about {college.name}</p>
                                     </div>
                                     <button
                                         onClick={() => setShowReviewForm(!showReviewForm)}
                                         className="px-6 py-3 bg-brand-orange text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition flex items-center gap-2"
                                     >
                                         <FaEdit /> Write a Review
                                     </button>
                                 </div>

                                 {/* Rating Summary */}
                                 {reviewStats && reviewStats.totalReviews > 0 && (
                                     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                         <div className="flex items-center gap-6">
                                             <div className="text-center">
                                                 <div className="text-5xl font-bold text-gray-900">{reviewStats.avgOverall?.toFixed(1) || '0'}</div>
                                                 <div className="flex justify-center mt-1">{renderStars(Math.round(reviewStats.avgOverall || 0), 'text-lg')}</div>
                                                 <div className="text-sm text-gray-500 mt-1">{reviewStats.totalReviews} reviews</div>
                                             </div>
                                             <div className="flex-1 space-y-2">
                                                 {[5,4,3,2,1].map(star => (
                                                     <div key={star} className="flex items-center gap-2">
                                                         <span className="text-sm w-3">{star}</span>
                                                         <FaStar className="text-yellow-400 text-xs" />
                                                         <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                             <div 
                                                                 className="bg-yellow-400 h-2 rounded-full" 
                                                                 style={{ width: `${reviewStats.totalReviews > 0 ? ((reviews.filter(r => Math.round(r.overallRating) === star).length / reviewStats.totalReviews) * 100) : 0}%` }}
                                                             ></div>
                                                         </div>
                                                     </div>
                                                 ))}
                                             </div>
                                         </div>
                                         <div className="grid grid-cols-2 gap-4">
                                             <div className="bg-gray-50 p-3 rounded-lg">
                                                 <div className="text-xs text-gray-500 uppercase font-bold">Academics</div>
                                                 <div className="flex items-center gap-2 mt-1">
                                                     <span className="font-bold text-gray-900">{reviewStats.avgAcademics?.toFixed(1) || '-'}</span>
                                                     {renderStars(Math.round(reviewStats.avgAcademics || 0))}
                                                 </div>
                                             </div>
                                             <div className="bg-gray-50 p-3 rounded-lg">
                                                 <div className="text-xs text-gray-500 uppercase font-bold">Faculty</div>
                                                 <div className="flex items-center gap-2 mt-1">
                                                     <span className="font-bold text-gray-900">{reviewStats.avgFaculty?.toFixed(1) || '-'}</span>
                                                     {renderStars(Math.round(reviewStats.avgFaculty || 0))}
                                                 </div>
                                             </div>
                                             <div className="bg-gray-50 p-3 rounded-lg">
                                                 <div className="text-xs text-gray-500 uppercase font-bold">Infrastructure</div>
                                                 <div className="flex items-center gap-2 mt-1">
                                                     <span className="font-bold text-gray-900">{reviewStats.avgInfrastructure?.toFixed(1) || '-'}</span>
                                                     {renderStars(Math.round(reviewStats.avgInfrastructure || 0))}
                                                 </div>
                                             </div>
                                             <div className="bg-gray-50 p-3 rounded-lg">
                                                 <div className="text-xs text-gray-500 uppercase font-bold">Placements</div>
                                                 <div className="flex items-center gap-2 mt-1">
                                                     <span className="font-bold text-gray-900">{reviewStats.avgPlacements?.toFixed(1) || '-'}</span>
                                                     {renderStars(Math.round(reviewStats.avgPlacements || 0))}
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 )}
                             </div>

                             {/* Review Form */}
                             {showReviewForm && (
                                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                                     <div className="flex justify-between items-center mb-6">
                                         <h3 className="text-xl font-bold text-gray-900">
                                             {editingReview ? 'Edit Your Review' : 'Write Your Review'}
                                         </h3>
                                         {editingReview && (
                                             <button
                                                 type="button"
                                                 onClick={cancelEdit}
                                                 className="text-gray-500 hover:text-gray-700"
                                             >
                                                 Cancel
                                             </button>
                                         )}
                                     </div>
                                     {!isAuthenticated ? (
                                         <div className="text-center py-8">
                                             <FaUser className="text-4xl text-gray-300 mx-auto mb-4" />
                                             <p className="text-gray-500 mb-4">Please login to write a review</p>
                                             <Link to="/login" className="px-6 py-2 bg-brand-blue text-white rounded-lg">Login</Link>
                                         </div>
                                     ) : (
                                         <form onSubmit={editingReview ? handleUpdateReview : handleReviewSubmit} className="space-y-6">
                                             {/* Ratings */}
                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                 {[
                                                     { key: 'overallRating', label: 'Overall' },
                                                     { key: 'academicsRating', label: 'Academics' },
                                                     { key: 'facultyRating', label: 'Faculty' },
                                                     { key: 'infrastructureRating', label: 'Infrastructure' },
                                                     { key: 'placementsRating', label: 'Placements' },
                                                     { key: 'campusLifeRating', label: 'Campus Life' }
                                                 ].map(rating => (
                                                     <div key={rating.key} className="bg-gray-50 p-4 rounded-lg">
                                                         <label className="block text-sm font-bold text-gray-700 mb-2">{rating.label}</label>
                                                         <div className="flex gap-1">
                                                             {[1,2,3,4,5].map(star => (
                                                                 <button
                                                                     type="button"
                                                                     key={star}
                                                                     onClick={() => setReviewForm({...reviewForm, [rating.key]: star})}
                                                                     className={`text-2xl transition ${star <= reviewForm[rating.key] ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                                                                 >
                                                                     <FaStar />
                                                                 </button>
                                                             ))}
                                                         </div>
                                                     </div>
                                                 ))}
                                             </div>

                                             {/* Title */}
                                             <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Review Title *</label>
                                                 <input
                                                     type="text"
                                                     required
                                                     maxLength={100}
                                                     value={reviewForm.title}
                                                     onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                                                     placeholder="Summarize your experience"
                                                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                                                 />
                                             </div>

                                             {/* Review Text */}
                                             <div>
                                                 <label className="block text-sm font-bold text-gray-700 mb-2">Your Review *</label>
                                                 <textarea
                                                     required
                                                     maxLength={2000}
                                                     rows={5}
                                                     value={reviewForm.reviewText}
                                                     onChange={(e) => setReviewForm({...reviewForm, reviewText: e.target.value})}
                                                     placeholder="Share your experience at this college..."
                                                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                                                 ></textarea>
                                             </div>

                                             {/* Pros & Cons */}
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <div>
                                                     <label className="block text-sm font-bold text-green-600 mb-2">Pros</label>
                                                     <textarea
                                                         maxLength={500}
                                                         rows={3}
                                                         value={reviewForm.pros}
                                                         onChange={(e) => setReviewForm({...reviewForm, pros: e.target.value})}
                                                         placeholder="What did you like?"
                                                         className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50/50"
                                                     ></textarea>
                                                 </div>
                                                 <div>
                                                     <label className="block text-sm font-bold text-red-600 mb-2">Cons</label>
                                                     <textarea
                                                         maxLength={500}
                                                         rows={3}
                                                         value={reviewForm.cons}
                                                         onChange={(e) => setReviewForm({...reviewForm, cons: e.target.value})}
                                                         placeholder="What could be improved?"
                                                         className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50/50"
                                                     ></textarea>
                                                 </div>
                                             </div>

                                             {/* User Info */}
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <div>
                                                     <label className="block text-sm font-bold text-gray-700 mb-2">Course Studied</label>
                                                     <input
                                                         type="text"
                                                         value={reviewForm.courseName}
                                                         onChange={(e) => setReviewForm({...reviewForm, courseName: e.target.value})}
                                                         placeholder="e.g. B.Tech CSE"
                                                         className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                                                     />
                                                 </div>
                                                 <div>
                                                     <label className="block text-sm font-bold text-gray-700 mb-2">Graduation Year</label>
                                                     <select
                                                         value={reviewForm.graduationYear}
                                                         onChange={(e) => setReviewForm({...reviewForm, graduationYear: parseInt(e.target.value)})}
                                                         className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                                                     >
                                                         {Array.from({length: 10}, (_, i) => new Date().getFullYear() + 4 - i).map(year => (
                                                             <option key={year} value={year}>{year}</option>
                                                         ))}
                                                     </select>
                                                 </div>
                                             </div>

                                             <button
                                                 type="submit"
                                                 disabled={reviewSubmitting}
                                                 className="w-full py-3 bg-brand-orange text-white font-bold rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                                             >
                                                 {reviewSubmitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
                                             </button>
                                         </form>
                                     )}
                                 </div>
                             )}

                             {/* Reviews List */}
                             <div className="space-y-4">
                                 {reviewLoading ? (
                                     <div className="text-center py-12">
                                         <div className="animate-spin h-8 w-8 border-2 border-brand-blue rounded-full border-t-transparent mx-auto"></div>
                                     </div>
                                 ) : reviews.length === 0 ? (
                                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                                         <FaCommentAlt className="text-5xl text-gray-200 mx-auto mb-4" />
                                         <h3 className="text-xl font-bold text-gray-800 mb-2">No reviews yet</h3>
                                         <p className="text-gray-500">Be the first to share your experience!</p>
                                     </div>
                                 ) : (
                                     reviews.map((review) => (
                                         <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                             <div className="flex justify-between items-start mb-4">
                                                 <div>
                                                     <div className="flex items-center gap-2 mb-1">
                                                         <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">
                                                             {review.authorName?.charAt(0) || 'U'}
                                                         </div>
                                                         <div>
                                                             <div className="font-bold text-gray-900">{review.authorName}</div>
                                                             <div className="text-xs text-gray-500">
                                                                 {review.courseName && `${review.courseName} • `}
                                                                 {review.graduationYear && `Class of ${review.graduationYear}`}
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                                 <div className="flex items-center gap-1">
                                                     {renderStars(review.overallRating)}
                                                 </div>
                                             </div>
                                             
                                             <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
                                             <p className="text-gray-600 mb-4 leading-relaxed">{review.reviewText}</p>
                                             
                                             {(review.pros || review.cons) && (
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                     {review.pros && (
                                                         <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                                             <div className="text-xs font-bold text-green-700 uppercase mb-1">Pros</div>
                                                             <p className="text-sm text-green-800">{review.pros}</p>
                                                         </div>
                                                     )}
                                                     {review.cons && (
                                                         <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                                             <div className="text-xs font-bold text-red-700 uppercase mb-1">Cons</div>
                                                             <p className="text-sm text-red-800">{review.cons}</p>
                                                         </div>
                                                     )}
                                                 </div>
                                             )}

                                             <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                 <div className="flex items-center gap-4">
                                                     <button
                                                         onClick={() => handleHelpful(review._id)}
                                                         className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue transition"
                                                     >
                                                         <FaThumbsUp /> Helpful ({review.helpfulCount})
                                                     </button>
                                                     {/* Edit/Delete buttons for owner or admin */}
                                                     {user && (
                                                         <div className="flex items-center gap-3 ml-2">
                                                             {/* Only owner can edit */}
                                                             {(String(review.user?._id || review.user) === String(user._id)) && (
                                                                 <button
                                                                     onClick={() => handleEditReview(review)}
                                                                     className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600 transition"
                                                                 >
                                                                     <FaEdit /> Edit
                                                                 </button>
                                                             )}
                                                             
                                                             {/* Owner OR Admin can delete */}
                                                             {(user.role === 'admin' || String(review.user?._id || review.user) === String(user._id)) && (
                                                                 <button
                                                                     onClick={() => handleDeleteReview(review._id)}
                                                                     className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition bg-red-50 px-2 py-1 rounded"
                                                                     title="Delete Review"
                                                                 >
                                                                     <FaTrash /> Delete
                                                                 </button>
                                                             )}
                                                         </div>
                                                     )}
                                                 </div>
                                                 <span className="text-xs text-gray-400">
                                                     {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                 </span>
                                             </div>
                                         </div>
                                     ))
                                 )}
                             </div>
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
                                {college.admissionProcess.importantDates.map((date, i) => (
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
