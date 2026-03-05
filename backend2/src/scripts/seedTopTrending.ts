import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Exam from '../models/Exam';
import CourseEntity from '../models/Course';
import connectDB from '../config/db';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const topExamsData = [
    { name: 'CUET', slug: 'cuet' },
    { name: 'MHT CET', slug: 'mht-cet' },
    { name: 'RRB Group D', slug: 'rrb-group-d' },
    { name: 'MAT', slug: 'mat' },
    { name: 'NEET', slug: 'neet' },
    { name: 'MHCET Law', slug: 'mhcet-law' },
    { name: 'UP B.Ed JEE', slug: 'up-bed-jee' },
    { name: 'SAT India', slug: 'sat-india' },
    { name: 'AIIMS Nursing', slug: 'aiims-nursing' },
    { name: 'MAH MCA CET', slug: 'mah-mca-cet' },
    { name: 'CA Final', slug: 'ca-final' },
    { name: 'JEE Main', slug: 'jee-main' },
    { name: 'JMI Entrance Exam', slug: 'jmi-entrance-exam' },
    { name: 'CUET-PG', slug: 'cuet-pg' },
    { name: 'CFA Exam', slug: 'cfa-exam' },
    { name: 'CUCET Chandigarh University', slug: 'cucet' },
    { name: 'CTET', slug: 'ctet' },
    { name: 'MAH CET', slug: 'mah-cet' },
    { name: 'NEET SS', slug: 'neet-ss' },
    { name: 'TSLAWCET', slug: 'tslawcet' },
    { name: 'MAH B.Ed CET', slug: 'mah-bed-cet' },
    { name: 'NIFT Entrance Exam', slug: 'nift' },
    { name: 'YCMOU', slug: 'ycmou' },
    { name: 'UP CNET', slug: 'up-cnet' },
    { name: 'NATA', slug: 'nata' },
    { name: 'CT SET', slug: 'ct-set' },
    { name: 'PUBDET', slug: 'pubdet' },
    { name: 'AMU Entrance Exam', slug: 'amu' },
    { name: 'IISER Entrance Exam', slug: 'iiser' },
    { name: 'AP POLYCET', slug: 'ap-polycet' },
];

const trendingCoursesData = [
    { name: 'After 12th - Science', slug: 'after-12th-science' },
    { name: 'After 12th - Arts', slug: 'after-12th-arts' },
    { name: 'After 12th - Commerce', slug: 'after-12th-commerce' },
    { name: 'B.Ed', slug: 'bed' },
    { name: 'D.El.Ed (Diploma in Elementary Education)', slug: 'deled' },
    { name: 'Early Childhood Care & Education (ECCE)', slug: 'ecce' },
    { name: 'B Tech (Bachelor of Technology)', slug: 'btech' },
    { name: 'MBA (Masters of Business Administration)', slug: 'mba' },
    { name: 'Company Secretary', slug: 'cs' },
    { name: 'BCA (Bachelor of Computer Applications)', slug: 'bca' },
    { name: 'BBA (Bachelor of Business Administration)', slug: 'bba' },
    { name: 'B.Sc Nursing', slug: 'bsc-nursing' },
    { name: 'Nursery Teacher Training (NTT)', slug: 'ntt' },
    { name: 'B.A (Bachelor of Arts)', slug: 'ba' },
    { name: 'LL.B.', slug: 'llb' },
    { name: 'D.Ed (Diploma in Education)', slug: 'ded' },
    { name: 'BSc', slug: 'bsc' },
    { name: 'MSW (Master of Social Work)', slug: 'msw' },
    { name: 'Chartered Accountancy', slug: 'ca' },
    { name: 'B.P.Ed (Bachelor of Physical Education)', slug: 'bped' }
];

const seedData = async () => {
    try {
        await connectDB();

        console.log('Seeding Top Exams...');
        for (const item of topExamsData) {
            await Exam.findOneAndUpdate(
                { examSlug: item.slug },
                {
                    $set: {
                        isTop: true,
                        examName: item.name,
                        conductingAuthority: 'TBA' // Default if creating new
                    }
                },
                { upsert: true, new: true }
            );
        }

        console.log('Seeding Trending Courses...');
        for (const item of trendingCoursesData) {
            // Determine degree level based on name/slug
            let degreeLevel: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Doctorate' = 'Undergraduate';
            if (item.slug === 'mba' || item.slug === 'msw') degreeLevel = 'Postgraduate';
            if (item.slug === 'deled' || item.slug === 'ded' || item.slug === 'ecce' || item.slug === 'ntt') degreeLevel = 'Diploma';

            await CourseEntity.findOneAndUpdate(
                { slug: item.slug },
                {
                    $set: {
                        isTrending: true,
                        courseName: item.name,
                        shortName: item.name.split(' ')[0],
                        degreeLevel: degreeLevel,
                        duration: '4 Years', // Default
                        overview: 'Overview for ' + item.name
                    }
                },
                { upsert: true, new: true }
            );
        }

        console.log('Successfully seeded top exams and trending courses!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
