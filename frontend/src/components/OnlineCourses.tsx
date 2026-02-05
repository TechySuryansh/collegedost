"use client";

import React from 'react';
import { FaLaptop, FaShieldAlt, FaBrain, FaCloud, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface Course {
    title: string;
    count: string;
    icon: IconType;
    color: string;
    bgColor: string;
    progressColor: string;
    progress: number;
    href: string;
}

interface OnlineCoursesProps {
    courses?: Course[];
}

const defaultCourses: Course[] = [
    { 
        title: 'Digital Marketing', 
        count: '450+ Courses', 
        icon: FaLaptop, 
        color: 'text-pink-600',
        bgColor: 'bg-pink-100',
        progressColor: '#ec4899',
        progress: 75,
        href: '/courses/digital-marketing'
    },
    { 
        title: 'Cyber Security', 
        count: '200+ Courses', 
        icon: FaShieldAlt, 
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-100',
        progressColor: '#06b6d4',
        progress: 50,
        href: '/courses/cyber-security'
    },
    { 
        title: 'Data Science', 
        count: '600+ Courses', 
        icon: FaBrain, 
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        progressColor: '#f97316',
        progress: 80,
        href: '/courses/data-science'
    },
    { 
        title: 'Cloud Computing', 
        count: '150+ Courses', 
        icon: FaCloud, 
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        progressColor: '#22c55e',
        progress: 66,
        href: '/courses/cloud-computing'
    },
];

const OnlineCourses: React.FC<OnlineCoursesProps> = ({ courses = defaultCourses }) => {
    return (
        <div className="bg-surface-light rounded-3xl p-8 lg:p-12 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold font-display text-text-main-light mb-2">
                        Upskill with Online Courses
                    </h3>
                    <p className="text-text-muted-light">
                        Professional certifications to amplify your employability.
                    </p>
                </div>
                <Link
                    href="/courses"
                    className="text-primary font-semibold hover:text-secondary flex items-center text-sm"
                >
                    View all courses <FaArrowRight className="ml-1" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course, index) => {
                    const Icon = course.icon;
                    return (
                        <Link
                            key={index}
                            href={course.href}
                            className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                        >
                            <div className={`h-10 w-10 rounded-lg ${course.bgColor} ${course.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon className="text-xl" />
                            </div>
                            <h4 className="font-bold text-text-main-light mb-1">{course.title}</h4>
                            <p className="text-xs text-text-muted-light mb-4">{course.count}</p>
                            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full"
                                    style={{ 
                                        width: `${course.progress}%`,
                                        backgroundColor: course.progressColor
                                    }}
                                ></div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default OnlineCourses;
