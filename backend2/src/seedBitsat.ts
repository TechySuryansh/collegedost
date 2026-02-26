import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './models/College';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/collegedost';

interface Cutoff {
    exam: string;
    branch: string;
    category: string;
    closingRank: number; // Using this as Score for BITSAT
    year: number;
    quota: string;
}

const bitsData = [
    {
        name: 'BITS Pilani',
        slug: 'bits-pilani',
        cutoffs: [
            { branch: 'B.E. Computer Science', score: 331 },
            { branch: 'B.E. Electronics and Communication', score: 299 },
            { branch: 'B.E. Electrical and Electronics', score: 282 },
            { branch: 'B.E. Electronics and Instrumentation', score: 271 },
            { branch: 'B.E. Mechanical Engineering', score: 244 },
            { branch: 'B.E. Chemical Engineering', score: 222 },
            { branch: 'B.E. Civil Engineering', score: 213 },
            { branch: 'B.Pharm', score: 165 },
            { branch: 'M.Sc. Economics', score: 284 },
            { branch: 'M.Sc. Physics', score: 260 },
            { branch: 'M.Sc. Mathematics', score: 250 },
            { branch: 'M.Sc. Chemistry', score: 232 },
            { branch: 'M.Sc. Biological Sciences', score: 220 },
        ]
    },
    {
        name: 'BITS Pilani Goa Campus',
        slug: 'bits-pilani-goa-campus',
        cutoffs: [
            { branch: 'B.E. Computer Science', score: 304 },
            { branch: 'B.E. Electronics and Communication', score: 275 },
            { branch: 'B.E. Electrical and Electronics', score: 254 },
            { branch: 'B.E. Electronics and Instrumentation', score: 243 },
            { branch: 'B.E. Mechanical Engineering', score: 219 },
            { branch: 'B.E. Chemical Engineering', score: 205 },
            { branch: 'M.Sc. Economics', score: 255 },
            { branch: 'M.Sc. Physics', score: 235 },
            { branch: 'M.Sc. Mathematics', score: 225 },
            { branch: 'M.Sc. Chemistry', score: 215 },
            { branch: 'M.Sc. Biological Sciences', score: 210 },
        ]
    },
    {
        name: 'BITS Pilani Hyderabad Campus',
        slug: 'bits-pilani-hyderabad-campus',
        cutoffs: [
            { branch: 'B.E. Computer Science', score: 298 },
            { branch: 'B.E. Electronics and Communication', score: 268 },
            { branch: 'B.E. Electrical and Electronics', score: 249 },
            { branch: 'B.E. Electronics and Instrumentation', score: 240 },
            { branch: 'B.E. Mechanical Engineering', score: 215 },
            { branch: 'B.E. Chemical Engineering', score: 202 },
            { branch: 'B.E. Civil Engineering', score: 201 },
            { branch: 'B.Pharm', score: 161 },
            { branch: 'M.Sc. Economics', score: 250 },
            { branch: 'M.Sc. Physics', score: 232 },
            { branch: 'M.Sc. Mathematics', score: 222 },
            { branch: 'M.Sc. Chemistry', score: 212 },
            { branch: 'M.Sc. Biological Sciences', score: 208 },
        ]
    }
];

async function seedBitsat() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        for (const bitsInfo of bitsData) {
            const college = await College.findOne({ slug: bitsInfo.slug });

            if (!college) {
                console.log(`College not found: ${bitsInfo.name}, creating...`);
                // Create if not exists with basic data
                await College.create({
                    name: bitsInfo.name,
                    slug: bitsInfo.slug,
                    type: 'Private',
                    location: {
                        city: bitsInfo.name.includes('Goa') ? 'Goa' : (bitsInfo.name.includes('Hyderabad') ? 'Hyderabad' : 'Pilani'),
                        state: bitsInfo.name.includes('Goa') ? 'Goa' : (bitsInfo.name.includes('Hyderabad') ? 'Telangana' : 'Rajasthan'),
                        country: 'India'
                    },
                    cutoffs: bitsInfo.cutoffs.map(c => ({
                        exam: 'BITSAT',
                        branch: c.branch,
                        category: 'General',
                        closingRank: c.score,
                        year: 2025,
                        quota: 'AI'
                    }))
                });
            } else {
                console.log(`Updating cutoffs for: ${bitsInfo.name}`);

                // Clear existing BITSAT cutoffs if any and add new ones
                const nonBitsatCutoffs = college.cutoffs.filter(c => c.exam !== 'BITSAT');
                const newBitsatCutoffs = bitsInfo.cutoffs.map(c => ({
                    exam: 'BITSAT',
                    branch: c.branch,
                    category: 'General',
                    closingRank: c.score, // Score as rank
                    year: 2025,
                    quota: 'AI'
                }));

                college.cutoffs = [...nonBitsatCutoffs, ...newBitsatCutoffs] as any;
                await college.save();
            }
        }

        console.log('BITSAT cutoffs seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding BITSAT cutoffs:', error);
        process.exit(1);
    }
}

seedBitsat();
