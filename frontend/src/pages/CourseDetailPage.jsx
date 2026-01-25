import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaGraduationCap, FaClock, FaCheckCircle, FaMoneyBillWave, FaBuilding, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

const CourseDetailPage = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/courses/${slug}`);
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

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-12">
                     <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-brand-indigo font-bold text-xs uppercase mb-4 tracking-wider">
                        {course.degreeLevel}
                     </span>
                     <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.courseName} <span className="text-gray-400">({course.shortName})</span></h1>
                     <div className="flex flex-wrap gap-6 text-gray-600 font-medium">
                         <span className="flex items-center gap-2"><FaClock className="text-brand-orange" /> {course.duration}</span>
                         <span className="flex items-center gap-2"><FaMoneyBillWave className="text-green-500" /> Avg Salary: {course.averageStartingSalary}</span>
                     </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* Overview */}
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Course</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {course.overview}
                        </p>
                    </div>

                    {/* Eligibility & Career */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FaCheckCircle className="text-brand-cyan" /> Eligibility</h3>
                             <p className="text-gray-600">{course.eligibility}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FaBriefcase className="text-brand-violet" /> Career Options</h3>
                             <div className="flex flex-wrap gap-2">
                                {course.careerOptions.map((opt, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">{opt}</span>
                                ))}
                             </div>
                        </div>
                    </div>

                    {/* Top Colleges Offering this Course */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Colleges for {course.shortName}</h2>
                        {colleges.length > 0 ? (
                            <div className="space-y-4">
                                {colleges.map(college => (
                                    <div key={college._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:scale-[1.01] transition-transform">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-gray-300 text-xl">
                                                {college.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 hover:text-brand-blue transition-colors">
                                                    <Link to={`/colleges/${college.slug}`}>{college.name}</Link>
                                                </h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FaMapMarkerAlt /> {college.location.city}, {college.location.state}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">NIRF #{college.nirfRank}</span>
                                            <Link to={`/colleges/${college.slug}`} className="text-sm font-bold text-brand-indigo hover:underline">
                                                View College
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                                No specific colleges tagged with this course in our database yet.
                            </div>
                        )}
                    </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-indigo-900 text-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold text-xl mb-4">Need Help with {course.shortName} Admissions?</h3>
                        <p className="text-indigo-200 mb-6 text-sm">
                            Talk to our expert counsellors to find the best college for {course.courseName} based on your rank and budget.
                        </p>
                        <button className="w-full bg-white text-indigo-900 font-bold py-3 rounded-lg hover:bg-indigo-50 transition-colors">
                            Request Call Back
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseDetailPage;
