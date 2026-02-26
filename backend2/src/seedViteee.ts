import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './models/College';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/collegedost';

const vitCampuses = [
    {
        name: 'VIT Vellore',
        slug: 'vit-vellore',
        location: { city: 'Vellore', state: 'Tamil Nadu' },
        nirfRank: 12,
        branches: [
            { name: 'Computer Science and Engineering', cats: [8000, 15000, 22000, 31000, 42000] },
            { name: 'Computer Science and Engineering (AI and ML)', cats: [10000, 18000, 25000, 35000, 48000] },
            { name: 'Information Technology', cats: [12000, 22000, 30000, 40000, 55000] },
            { name: 'Electronics and Communication Engineering', cats: [18000, 28000, 40000, 55000, 75000] },
            { name: 'Electrical and Electronics Engineering', cats: [25000, 40000, 60000, 85000, 110000] },
            { name: 'Mechanical Engineering', cats: [35000, 55000, 80000, 110000, 150000] },
            { name: 'Biotechnology', cats: [45000, 70000, 100000, 130000, 180000] },
        ]
    },
    {
        name: 'VIT Chennai',
        slug: 'vit-chennai',
        location: { city: 'Chennai', state: 'Tamil Nadu' },
        nirfRank: 18,
        branches: [
            { name: 'Computer Science and Engineering', cats: [15000, 25000, 35000, 50000, 65000] },
            { name: 'Computer Science and Engineering (Artificial Intelligence and Robotics)', cats: [18000, 28000, 40000, 55000, 72000] },
            { name: 'Electronics and Communication Engineering', cats: [28000, 45000, 65000, 85000, 110000] },
            { name: 'Mechanical Engineering', cats: [50000, 80000, 110000, 150000, 200000] },
        ]
    },
    {
        name: 'VIT-AP University',
        slug: 'vit-ap-university',
        location: { city: 'Amaravati', state: 'Andhra Pradesh' },
        nirfRank: 28,
        branches: [
            { name: 'Computer Science and Engineering', cats: [35000, 60000, 85000, 110000, 140000] },
            { name: 'Electronics and Communication Engineering', cats: [55000, 85000, 120000, 160000, 200000] },
        ]
    },
    {
        name: 'VIT Bhopal University',
        slug: 'vit-bhopal-university',
        location: { city: 'Bhopal', state: 'Madhya Pradesh' },
        nirfRank: 35,
        branches: [
            { name: 'Computer Science and Engineering', cats: [45000, 75000, 100000, 130000, 160000] },
            { name: 'Electronics and Communication Engineering', cats: [65000, 100000, 140000, 180000, 220000] },
        ]
    }
];

async function seedViteee() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        for (const campus of vitCampuses) {
            let college = await College.findOne({ slug: campus.slug });

            if (!college) {
                console.log(`College not found: ${campus.name}, creating...`);
                college = await College.create({
                    name: campus.name,
                    slug: campus.slug,
                    type: 'Private',
                    location: { ...campus.location, country: 'India' },
                    nirfRank: campus.nirfRank,
                    cutoffs: []
                });
            }

            console.log(`Updating cutoffs for: ${campus.name}`);
            const nonViteeeCutoffs = college.cutoffs.filter(c => c.exam !== 'VITEEE');
            const newViteeeCutoffs: any[] = [];

            for (const branch of campus.branches) {
                branch.cats.forEach((rank, index) => {
                    newViteeeCutoffs.push({
                        exam: 'VITEEE',
                        branch: branch.name,
                        category: `Category ${index + 1}`,
                        closingRank: rank,
                        year: 2025,
                        quota: 'AI'
                    });
                });
            }

            college.cutoffs = [...nonViteeeCutoffs, ...newViteeeCutoffs] as any;
            await college.save();
        }

        console.log('VITEEE cutoffs seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding VITEEE cutoffs:', error);
        process.exit(1);
    }
}

seedViteee();
