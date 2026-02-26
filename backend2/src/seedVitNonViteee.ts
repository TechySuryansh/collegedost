import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './models/College';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/collegedost';

/**
 * Non-VITEEE programs offered by VIT campuses.
 * These include M.Tech, MBA, BCA, MCA, B.Des, B.Arch, Ph.D etc.
 * Cutoffs are stored as closing ranks (for rank-based) or score (for score-based).
 * We use closingRank as a generic admission difficulty number.
 */
const vitNonViteeePrograms = [
    {
        slug: 'vit-vellore',
        programs: [
            // M.Tech (GATE based) - GATE score cutoff stored as closingRank (GATE score out of 100)
            { branch: 'M.Tech Computer Science and Engineering', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 450 },
            { branch: 'M.Tech Electronics and Communication Engineering', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 380 },
            { branch: 'M.Tech Electrical Engineering', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 320 },
            { branch: 'M.Tech Mechanical Engineering', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 280 },
            { branch: 'M.Tech Data Science and Artificial Intelligence', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 480 },

            // MBA (CAT/MAT/VITMEE based) - closingRank = percentile * 10 for comparability
            { branch: 'MBA Business Administration', exam: 'VIT_NON_VITEEE', category: 'CAT/MAT', closingRank: 700 },
            { branch: 'MBA Business Analytics', exam: 'VIT_NON_VITEEE', category: 'CAT/MAT', closingRank: 680 },

            // BCA/MCA (direct admission)
            { branch: 'BCA Computer Applications', exam: 'VIT_NON_VITEEE', category: 'Direct', closingRank: 35000 },
            { branch: 'MCA Computer Applications', exam: 'VIT_NON_VITEEE', category: 'Direct', closingRank: 28000 },

            // B.Des (Entrance exam)
            { branch: 'B.Des Design', exam: 'VIT_NON_VITEEE', category: 'Design Aptitude', closingRank: 5000 },

            // B.Arch (JEE/NATA based)
            { branch: 'B.Arch Architecture', exam: 'VIT_NON_VITEEE', category: 'NATA/JEE', closingRank: 8000 },

            // Ph.D
            { branch: 'Ph.D Computer Science', exam: 'VIT_NON_VITEEE', category: 'Research', closingRank: 600 },
            { branch: 'Ph.D Engineering', exam: 'VIT_NON_VITEEE', category: 'Research', closingRank: 500 },
        ]
    },
    {
        slug: 'vit-chennai',
        programs: [
            { branch: 'M.Tech Computer Science and Engineering', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 380 },
            { branch: 'M.Tech Electronics and Communication Engineering', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 320 },
            { branch: 'M.Tech Data Science and Artificial Intelligence', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 420 },
            { branch: 'MBA Business Administration', exam: 'VIT_NON_VITEEE', category: 'CAT/MAT', closingRank: 620 },
            { branch: 'BCA Computer Applications', exam: 'VIT_NON_VITEEE', category: 'Direct', closingRank: 55000 },
            { branch: 'MCA Computer Applications', exam: 'VIT_NON_VITEEE', category: 'Direct', closingRank: 45000 },
        ]
    },
    {
        slug: 'vit-ap-university',
        programs: [
            { branch: 'M.Tech Computer Science and Engineering', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 320 },
            { branch: 'M.Tech Electronics and Communication Engineering', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 280 },
            { branch: 'MBA Business Administration', exam: 'VIT_NON_VITEEE', category: 'CAT/MAT', closingRank: 550 },
            { branch: 'BCA Computer Applications', exam: 'VIT_NON_VITEEE', category: 'Direct', closingRank: 75000 },
        ]
    },
    {
        slug: 'vit-bhopal-university',
        programs: [
            { branch: 'M.Tech Computer Science and Engineering', exam: 'VIT_NON_VITEEE', category: 'GATE', closingRank: 290 },
            { branch: 'MBA Business Administration', exam: 'VIT_NON_VITEEE', category: 'CAT/MAT', closingRank: 480 },
            { branch: 'BCA Computer Applications', exam: 'VIT_NON_VITEEE', category: 'Direct', closingRank: 80000 },
        ]
    }
];

async function seedVitNonViteee() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        for (const campus of vitNonViteeePrograms) {
            const college = await College.findOne({ slug: campus.slug });
            if (!college) {
                console.log(`College not found: ${campus.slug}, skipping.`);
                continue;
            }

            // Remove old non-viteee cutoffs and replace
            const otherCutoffs = college.cutoffs.filter((c: any) => c.exam !== 'VIT_NON_VITEEE');
            const newCutoffs = campus.programs.map(p => ({
                exam: p.exam,
                branch: p.branch,
                category: p.category,
                closingRank: p.closingRank,
                year: 2025,
                quota: 'Non-VITEEE'
            }));

            college.cutoffs = [...otherCutoffs, ...newCutoffs] as any;
            await college.save();
            console.log(`✓ Seeded ${newCutoffs.length} non-VITEEE programs for ${college.name}`);
        }

        console.log('\nNon-VITEEE programs seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding non-VITEEE programs:', error);
        process.exit(1);
    }
}

seedVitNonViteee();
