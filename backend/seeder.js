const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User.model');
const Article = require('./src/models/Article.model');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config({ path: './.env' }); // Assuming running from backend root

// Connect to DB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegedost');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        // --- ARTICLES ---
        const articleCount = await Article.countDocuments();
        if (articleCount === 0) {
            console.log('Seeding Articles...');
            const articles = [
                {
                    title: 'JEE Main 2026 Exam Dates Announced',
                    category: 'Exam News',
                    summary: 'NTA has released the official schedule for JEE Main 2026. Check the important dates here.',
                    content: 'The National Testing Agency (NTA) has officially announced the dates for JEE Main 2026. The first session will be held in January 2026...',
                    isPublished: true,
                    tags: ['JEE', 'Exam Dates', 'NTA']
                },
                {
                    title: 'Top 10 Engineering Colleges in India 2025',
                    category: 'College News',
                    summary: 'Check out the updated NIRF rankings for the best engineering institutes in India.',
                    content: 'IIT Madras continues to top the list in the latest NIRF rankings released by the Ministry of Education...',
                    isPublished: true,
                    tags: ['Engineering', 'NIRF', 'Rankings']
                },
                {
                    title: 'NEET 2026 Syllabus Updated',
                    category: 'Exam News',
                    summary: 'NMC has revised the syllabus for NEET UG 2026. Several topics have been added.',
                    content: 'The National Medical Commission (NMC) has notified changes in the NEET UG syllabus for the upcoming academic year...',
                    isPublished: true,
                    tags: ['NEET', 'Medical', 'Syllabus']
                },
                {
                    title: 'New Scholarship Scheme for Merit Students',
                    category: 'Admission Alert',
                    summary: 'Government launches a new specific scholarship to support meritorious students from EWS.',
                    content: 'A new scholarship program has been announced to provide financial aid to students securing top ranks in national entrance exams...',
                    isPublished: true,
                    tags: ['Scholarship', 'Financial Aid']
                },
                {
                    title: 'Tips to Crack CAT 2025 in First Attempt',
                    category: 'General',
                    summary: 'Expert advice and strategies to ace the Common Admission Test.',
                    content: 'Cracking CAT requires a strategic approach. Here are 5 tips from toppers that will help you boost your percentile...',
                    isPublished: true,
                    tags: ['CAT', 'MBA', 'Preparation']
                }
            ];
            await Article.create(articles);
            console.log('Articles Seeded!');
        } else {
            console.log('Articles already exist. Skipping.');
        }

        // --- USERS ---
        // Only seed users if we have very few (e.g., just the admin)
        const userCount = await User.countDocuments();
        if (userCount < 2) {
             console.log('Seeding Users...');
             const users = [
                 {
                     name: 'Student One',
                     email: 'student1@example.com',
                     mobile: '9988776655',
                     password: 'password123',
                     role: 'user',
                     isVerified: true
                 },
                 {
                     name: 'Student Two',
                     email: 'student2@example.com',
                     mobile: '9988776654',
                     password: 'password123',
                     role: 'user',
                     isVerified: true
                 },
                 {
                     name: 'Parent User',
                     email: 'parent@example.com',
                     mobile: '9988776653',
                     password: 'password123',
                     role: 'user',
                     isVerified: true
                 },
                  {
                     name: 'New Admin',
                     email: 'admin@collegedost.com',
                     mobile: '9988776650',
                     password: 'password123',
                     role: 'admin',
                     isVerified: true
                 }
             ];

             // Insert one by one to avoid unique constrained errors if one exists
             for (const u of users) {
                 try {
                    // Check if exists
                    const exists = await User.findOne({ $or: [{ email: u.email }, { mobile: u.mobile }] });
                    if (!exists) {
                         await User.create(u);
                         console.log(`Created user: ${u.name}`);
                    }
                 } catch (e) {
                     console.log(`Skipped duplicate or error: ${u.name} - ${e.message}`);
                 }
             }
             console.log('Users Seeded!');
        } else {
            console.log('Users already exist. Skipping.');
        }

        console.log('Data Import Completed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
