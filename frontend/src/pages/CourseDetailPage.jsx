import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { FaGraduationCap, FaClock, FaCheckCircle, FaMoneyBillWave, FaBuilding, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

const CourseDetailPage = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${slug}`);
                if (res.data.success) {
                    setCourse(res.data.data);
                    setColleges(res.data.colleges || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [slug]);

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin h-10 w-10 border-2 border-brand-indigo rounded-full border-t-transparent"></div></div>;
    if (!course) return <div className="min-h-screen pt-24 text-center">Course Not Found</div>;

    const tabs = ['Overview', 'Syllabus', 'Career Scope', 'Top Colleges'];

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            {/* Hero Section */}
            <div className="bg-brand-indigo text-white py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container mx-auto px-4 relative z-10">
                     <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs uppercase mb-4 tracking-wider border border-white/30">
                        {course.degreeLevel}
                     </span>
                     <h1 className="text-3xl md:text-5xl font-bold mb-4">{course.courseName} <span className="opacity-80 font-normal">({course.shortName})</span></h1>
                     <div className="flex flex-wrap gap-6 text-indigo-100 font-medium text-sm md:text-base">
                         <span className="flex items-center gap-2"><FaClock className="text-brand-orange" /> {course.duration}</span>
                         <span className="flex items-center gap-2"><FaMoneyBillWave className="text-green-400" /> Avg Salary: {course.averageStartingSalary || 'N/A'}</span>
                     </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-3">
                    
                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 sticky top-20 z-20 overflow-x-auto selection-none">
                        <div className="flex">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
                                        activeTab === tab 
                                        ? 'border-brand-indigo text-brand-indigo bg-indigo-50/50' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
                        {activeTab === 'Overview' && (
                            <div className="space-y-8 animate-fade-in">
                                {/* Highlights */}
                                {course.highlights && Object.keys(course.highlights).length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FaBriefcase className="text-brand-orange" /> {course.shortName} Highlights
                                        </h2>
                                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                                            <table className="w-full text-sm text-left">
                                                <tbody className="divide-y divide-gray-200">
                                                    {Object.entries(course.highlights).map(([key, val]) => (
                                                        <tr key={key} className="bg-white hover:bg-gray-50">
                                                            <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/3">{key}</td>
                                                            <td className="px-4 py-3 text-gray-600">{val}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* About */}
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">About the Course</h2>
                                    <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: course.overview }} />
                                </div>

                                {/* Eligibility */}
                                {course.eligibility && (
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                        <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                                            <FaCheckCircle /> Eligibility Criteria
                                        </h3>
                                        <div className="prose prose-sm max-w-none text-blue-800" dangerouslySetInnerHTML={{ __html: course.eligibility }} />
                                    </div>
                                )}

                                {/* Admission Process */}
                                {course.admissionProcess && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">Admission Process</h2>
                                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: course.admissionProcess }} />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Syllabus' && (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Course Syllabus</h2>
                                {course.syllabus && course.syllabus.length > 0 ? (
                                    <div className="grid gap-4">
                                        {course.syllabus.map((sem, idx) => (
                                            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 font-bold text-gray-800 border-b border-gray-200">
                                                    {sem.semester}
                                                </div>
                                                <div className="p-4 flex flex-wrap gap-2">
                                                    {sem.subjects.map((sub, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-sm rounded-full shadow-sm">
                                                            {sub}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Syllabus details coming soon.</p>
                                )}

                                {course.subjects && course.subjects.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Key Subjects</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {course.subjects.map((sub, i) => (
                                                <span key={i} className="px-3 py-1 bg-brand-indigo/10 text-brand-indigo text-sm font-medium rounded-lg">
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Career Scope' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Job Roles & Salary</h2>
                                    {course.jobRoles && course.jobRoles.length > 0 ? (
                                        <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 text-gray-700 font-bold">
                                                    <tr>
                                                        <th className="px-4 py-3">Job Profile</th>
                                                        <th className="px-4 py-3">Average Annual Salary</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {course.jobRoles.map((role, idx) => (
                                                        <tr key={idx} className="bg-white">
                                                            <td className="px-4 py-3 font-medium text-gray-900">{role.role}</td>
                                                            <td className="px-4 py-3 text-green-600 font-bold">{role.avgSalary}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p className="text-gray-500 mb-4">Detailed salary data updating soon.</p>}
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Top Recruiters</h2>
                                    <div className="flex flex-wrap gap-4">
                                        {course.topRecruiters && course.topRecruiters.map((rec, i) => (
                                            <div key={i} className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm font-medium text-gray-700 flex items-center gap-2">
                                                <FaBuilding className="text-gray-400" /> {rec}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Top Colleges' && (
                            <div className="animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Top Colleges for {course.shortName}</h2>
                                {colleges.length > 0 ? (
                                    <div className="space-y-4">
                                        {colleges.map(college => (
                                            <div key={college._id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition">
                                                 <div className="w-16 h-16 bg-brand-indigo/10 rounded-lg flex items-center justify-center font-bold text-brand-indigo text-xl flex-shrink-0">
                                                    {college.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-900">
                                                        <Link to={`/colleges/${college.slug}`} className="hover:text-brand-indigo transition">
                                                            {college.name}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                                        <FaMapMarkerAlt /> {college.location.city}, {college.location.state}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                         {college.nirfRank && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">NIRF #{college.nirfRank}</span>}
                                                         <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-bold">Best Rated</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Link to={`/colleges/${college.slug}`} className="px-4 py-2 bg-brand-indigo text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <p className="text-gray-500">College list updating...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Trending Bachelors</h3>
                        <ul className="space-y-3">
                            {[
                                { name: "B.Tech", link: "/courses/btech-bachelor-of-technology" },
                                { name: "B.Sc", link: "/courses/bsc-bachelor-of-science" },
                                { name: "B.Com", link: "/courses/bcom-bachelor-of-commerce" },
                                { name: "B.A", link: "/courses/ba-bachelor-of-arts" },
                                { name: "MBBS", link: "/courses/mbbs-bachelor-of-medicine-and-bachelor-of-surgery" }
                            ].map((c, i) => (
                                <li key={i}>
                                    <Link to={c.link} className="flex items-center justify-between text-gray-600 hover:text-brand-indigo transition group">
                                        <span className="text-sm font-medium">{c.name}</span>
                                        <span className="text-xs text-gray-400 group-hover:translate-x-1 transition">→</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold text-xl mb-2">Admission 2026?</h3>
                        <p className="text-indigo-100 text-sm mb-4">
                            Get free counselling and college predictions based on your merit.
                        </p>
                        <button className="w-full bg-white text-indigo-700 font-bold py-2 rounded-lg hover:bg-indigo-50 transition shadow-md">
                            Apply Now
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseDetailPage;
