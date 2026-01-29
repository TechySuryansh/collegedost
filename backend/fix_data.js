const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User.model');
const Article = require('./src/models/Article.model');

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegedost');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const fixData = async () => {
    await connectDB();

    console.log("--- Fixing Articles ---");
    // 1. Ensure all articles are published
    const updateResult = await Article.updateMany({}, { isPublished: true });
    console.log(`Updated ${updateResult.modifiedCount} articles to isPublished: true`);

    // 2. Ensure we have enough articles
    const articleCount = await Article.countDocuments();
    if (articleCount < 5) {
        console.log(`Only found ${articleCount} articles. creating more...`);
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
        
        // Loop and upsert based on title to avoid duplicates if they exist but were deleted/re-added slightly diff
        for(let a of articles) {
            await Article.findOneAndUpdate({ title: a.title }, a, { upsert: true, new: true, setDefaultsOnInsert: true });
        }
        console.log("Articles replenished.");
    }

    console.log("--- Fixing Users ---");
    const userCount = await User.countDocuments();
    if (userCount < 2) {
        console.log("Creating dummy users...");
        const users = [
             {
                 name: 'Student One',
                 email: 'student1@test.com',
                 mobile: '9999999991',
                 password: 'password123',
                 role: 'user'
             },
             {
                 name: 'Student Two',
                 email: 'student2@test.com',
                 mobile: '9999999992',
                 password: 'password123',
                 role: 'user'
             },
             {
                 name: 'Admin User',
                 email: 'admin@collegedost.com',
                 mobile: '9999999990',
                 password: 'password123',
                 role: 'admin'
             }
        ];
        
        for(let u of users) {
             try {
                // Check exist by email OR mobile
                const exist = await User.findOne({ $or: [{ email: u.email }, { mobile: u.mobile }] });
                if(!exist) {
                    await User.create(u);
                    console.log(`Created ${u.name}`);
                }
             } catch(e) { console.log(`Skipping ${u.name}: ${e.message}`); }
        }
    } else {
        console.log(`Found ${userCount} users. No action needed.`);
    }

    process.exit();
};

fixData();
