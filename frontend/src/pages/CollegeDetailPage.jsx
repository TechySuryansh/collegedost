import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaUniversity, FaAward, FaRupeeSign, FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const CollegeDetailPage = () => {
    const { slug } = useParams();
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/colleges/${slug}`);
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

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin h-10 w-10 border-2 border-brand-blue rounded-full border-t-transparent"></div></div>;
    if (!college) return <div className="min-h-screen pt-24 text-center">College Not Found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header / Banner */}
            <div className="bg-white border-b border-gray-200">
                <div className="h-48 bg-gradient-to-r from-blue-900 to-brand-blue relative">
                     {/* Cover Image Placeholder */}
                </div>
                <div className="container mx-auto px-4 relative">
                    <div className="flex flex-col md:flex-row items-end -mt-10 mb-6 gap-6">
                         <div className="w-32 h-32 bg-white rounded-xl shadow-lg border-4 border-white flex items-center justify-center text-4xl font-bold text-brand-blue">
                             {/* Logo */}
                             {college.name.charAt(0)}
                         </div>
                         <div className="flex-1 pb-2">
                             <h1 className="text-3xl font-bold text-gray-900 leading-tight">{college.name}</h1>
                             <div className="flex flex-wrap gap-4 mt-2 text-gray-600 font-medium">
                                 <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-gray-400" /> {college.location.city}, {college.location.state}</span>
                                 <span className="flex items-center gap-1"><FaUniversity className="text-gray-400" /> {college.type} Institute</span>
                                 <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Est. {college.estYear}</span>
                             </div>
                         </div>
                         <div className="mb-4">
                             <div className="text-right">
                                 <span className="block text-sm text-gray-500">NIRF Ranking</span>
                                 <span className="text-3xl font-bold text-brand-blue">#{college.nirfRank}</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Courses */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FaGraduationCap className="text-brand-orange" /> Courses & Fees</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">Course</th>
                                        <th className="px-4 py-3">Duration</th>
                                        <th className="px-4 py-3">Annual Fee</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {college.coursesOffered.map((course, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3 font-medium text-gray-800">{course.courseName}</td>
                                            <td className="px-4 py-3 text-gray-600">{course.duration}</td>
                                            <td className="px-4 py-3 text-gray-800 font-bold">₹ {course.fee.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Cutoffs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FaAward className="text-brand-cyan" /> Admission Cutoffs (2024)</h2>
                        <div className="grid gap-4">
                            {college.cutoff.map((cut, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{cut.exam} - {cut.branch}</h4>
                                        <div className="text-xs text-gray-500 mt-1">Category: {cut.category} | Round {cut.round || 1}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Closing Rank</div>
                                        <div className="text-xl font-bold text-brand-blue">{cut.closing}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                         <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FaBriefcase className="text-green-500" /> Placements</h3>
                         <div className="space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                  <span className="text-gray-600">Highest Package</span>
                                  <span className="font-bold text-green-600">{college.placements.highestPackage}</span>
                              </div>
                              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                  <span className="text-gray-600">Average Package</span>
                                  <span className="font-bold text-gray-800">{college.placements.averagePackage}</span>
                              </div>
                         </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                         <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FaRupeeSign className="text-brand-orange" /> Fee Structure</h3>
                         <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Tuition (Annual)</span>
                                  <span className="font-medium">₹ {college.fees.tuition.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Hostel (Annual)</span>
                                  <span className="font-medium">₹ {college.fees.hostel.toLocaleString()}</span>
                              </div>
                              <div className="pt-2 border-t border-gray-100 flex justify-between items-center font-bold">
                                  <span className="text-gray-800">Total / Year</span>
                                  <span className="text-brand-blue">₹ {(college.fees.tuition + college.fees.hostel).toLocaleString()}</span>
                              </div>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CollegeDetailPage;
