const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// robust path resolution
const envPath = path.resolve(__dirname, '../.env');
const CollegeModelPath = path.resolve(__dirname, '../src/models/College.model');
const CourseModelPath = path.resolve(__dirname, '../src/models/Course.model');

console.log('Loading env from:', envPath);
dotenv.config({ path: envPath });

const College = require(CollegeModelPath);
const Course = require(CourseModelPath);

const seedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing from .env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Seed Courses
        const courses = [
            {
                courseName: 'Bachelor of Technology (Computer Science)',
                shortName: 'B.Tech',
                degreeLevel: 'Undergraduate',
                duration: '4 Years',
                overview: 'B.Tech in Computer Science is the most popular engineering course...',
                eligibility: 'Class 12th with PCM (75% for IIT/NITs)',
                careerOptions: ['Software Developer', 'Data Scientist', 'System Architect'],
                averageStartingSalary: '6-10 LPA'
            },
            {
                courseName: 'Bachelor of Medicine, Bachelor of Surgery',
                shortName: 'MBBS',
                degreeLevel: 'Undergraduate',
                duration: '5.5 Years',
                overview: 'MBBS is the primary medical qualification...',
                eligibility: 'Class 12th with PCB + NEET UG Qualified',
                careerOptions: ['Doctor', 'Surgeon', 'Medical Researcher'],
                averageStartingSalary: '8-12 LPA'
            },
            {
                courseName: 'Master of Business Administration',
                shortName: 'MBA',
                degreeLevel: 'Postgraduate',
                duration: '2 Years',
                overview: 'MBA develops business acumen and leadership skills...',
                eligibility: 'Bachelor Degree + CAT/XAT/GMAT',
                careerOptions: ['Manager', 'Consultant', 'Entrepreneur'],
                averageStartingSalary: '12-25 LPA'
            }
        ];

        try { await Course.collection.drop(); } catch(e) {}
        await Course.insertMany(courses);
        console.log('Courses Seeded');

        // 2. Seed Colleges
        const colleges = [
            // Engineering
            { name: 'Indian Institute of Technology Madras', slug: 'iit-madras', location: { city: 'Chennai', state: 'Tamil Nadu' }, type: 'Government', nirfRank: 1, fees: { tuition: 200000 }, website: 'https://www.iitm.ac.in' },
            { name: 'Indian Institute of Technology Delhi', slug: 'iit-delhi', location: { city: 'New Delhi', state: 'Delhi' }, type: 'Government', nirfRank: 2, fees: { tuition: 220000 }, website: 'https://home.iitd.ac.in' },
            { name: 'Indian Institute of Technology Bombay', slug: 'iit-bombay', location: { city: 'Mumbai', state: 'Maharashtra' }, type: 'Government', nirfRank: 3, fees: { tuition: 230000 }, website: 'https://www.iitb.ac.in' },
            { name: 'Indian Institute of Technology Kanpur', slug: 'iit-kanpur', location: { city: 'Kanpur', state: 'Uttar Pradesh' }, type: 'Government', nirfRank: 4, fees: { tuition: 215000 }, website: 'https://www.iitk.ac.in' },
            { name: 'Indian Institute of Technology Roorkee', slug: 'iit-roorkee', location: { city: 'Roorkee', state: 'Uttarakhand' }, type: 'Government', nirfRank: 5, fees: { tuition: 200000 }, website: 'https://www.iitr.ac.in' },
            { name: 'Indian Institute of Technology Kharagpur', slug: 'iit-kharagpur', location: { city: 'Kharagpur', state: 'West Bengal' }, type: 'Government', nirfRank: 6, fees: { tuition: 200000 }, website: 'http://www.iitkgp.ac.in' },
            
            // Management
            { name: 'Indian Institute of Management Ahmedabad', slug: 'iim-ahmedabad', location: { city: 'Ahmedabad', state: 'Gujarat' }, type: 'Government', nirfRank: 1, fees: { tuition: 2500000 }, website: 'https://www.iima.ac.in' },
            { name: 'Indian Institute of Management Bangalore', slug: 'iim-bangalore', location: { city: 'Bangalore', state: 'Karnataka' }, type: 'Government', nirfRank: 2, fees: { tuition: 2450000 }, website: 'https://www.iimb.ac.in' },
            { name: 'Indian Institute of Management Kozhikode', slug: 'iim-kozhikode', location: { city: 'Kozhikode', state: 'Kerala' }, type: 'Government', nirfRank: 3, fees: { tuition: 2000000 }, website: 'https://www.iimk.ac.in' },
            { name: 'Indian Institute of Management Calcutta', slug: 'iim-calcutta', location: { city: 'Kolkata', state: 'West Bengal' }, type: 'Government', nirfRank: 5, fees: { tuition: 2700000 }, website: 'https://www.iimcal.ac.in' },

            // Medical
            { name: 'All India Institute of Medical Sciences, Delhi', slug: 'aiims-delhi', location: { city: 'New Delhi', state: 'Delhi' }, type: 'Government', nirfRank: 1, fees: { tuition: 1628 }, website: 'https://www.aiims.edu' },
            { name: 'Christian Medical College', slug: 'cmc-vellore', location: { city: 'Vellore', state: 'Tamil Nadu' }, type: 'Private', nirfRank: 3, fees: { tuition: 50000 }, website: 'https://www.cmch-vellore.edu' },

            // Law
            { name: 'National Law School of India University', slug: 'nlsiu-bengaluru', location: { city: 'Bengaluru', state: 'Karnataka' }, type: 'Government', nirfRank: 1, fees: { tuition: 280000 }, website: 'https://www.nls.ac.in' },
            { name: 'National Law University', slug: 'nlu-delhi', location: { city: 'New Delhi', state: 'Delhi' }, type: 'Government', nirfRank: 2, fees: { tuition: 180000 }, website: 'https://nludelhi.ac.in' },

            // Pharmacy
            { name: 'Jamia Hamdard', slug: 'jamia-hamdard', location: { city: 'New Delhi', state: 'Delhi' }, type: 'Private', nirfRank: 1, fees: { tuition: 150000 }, website: 'http://jamiahamdard.edu' },
            
            // International
            { name: 'Massachusetts Institute of Technology (MIT)', slug: 'mit-usa', location: { city: 'Cambridge', state: 'Massachusetts', country: 'USA' }, type: 'Private', nirfRank: null, fees: { tuition: 4500000 }, website: 'https://web.mit.edu' },
            { name: 'Stanford University', slug: 'stanford-usa', location: { city: 'Stanford', state: 'California', country: 'USA' }, type: 'Private', nirfRank: null, fees: { tuition: 4600000 }, website: 'https://www.stanford.edu' },
            { name: 'Harvard University', slug: 'harvard-usa', location: { city: 'Cambridge', state: 'Massachusetts', country: 'USA' }, type: 'Private', nirfRank: null, fees: { tuition: 4700000 }, website: 'https://www.harvard.edu' },
            { name: 'University of Oxford', slug: 'oxford-uk', location: { city: 'Oxford', state: 'England', country: 'UK' }, type: 'Public', nirfRank: null, fees: { tuition: 3500000 }, website: 'https://www.ox.ac.uk' },
            { name: 'University of Cambridge', slug: 'cambridge-uk', location: { city: 'Cambridge', state: 'England', country: 'UK' }, type: 'Public', nirfRank: null, fees: { tuition: 3600000 }, website: 'https://www.cam.ac.uk' }
        ];

        try { await College.collection.drop(); } catch(e) {}
        await College.insertMany(colleges);
        console.log('Colleges Seeded');

        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();
