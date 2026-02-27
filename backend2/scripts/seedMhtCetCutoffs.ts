/**
 * Seed MHT CET cutoff data for Maharashtra engineering colleges.
 *
 * Generates realistic MHT CET percentile cutoffs based on college NIRF rank
 * and institution type. Run with:  npx ts-node scripts/seedMhtCetCutoffs.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ─── Mongo connection ─────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';
if (!MONGO_URI) {
    console.error('❌ No MONGODB_URI found in .env');
    process.exit(1);
}

// ─── Constants ────────────────────────────────────────────────────────
const EXAM = 'MHT CET';
const YEAR = 2025;

const BRANCHES = [
    'Computer Engineering',
    'Information Technology',
    'Electronics & Telecommunication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'AI & Data Science',
    'AI & Machine Learning',
];

const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'VJNT', 'SBC'];
const QUOTAS = ['HU', 'OHU']; // Home University, Other than Home University

// ─── Helpers ──────────────────────────────────────────────────────────

/** Generate a base percentile for a college based on its tier. */
function baseTierPercentile(nirfRank: number | undefined, collegeIndex: number): number {
    if (nirfRank && nirfRank <= 10) return 99.5 + Math.random() * 0.4;   // IIT Bombay tier
    if (nirfRank && nirfRank <= 30) return 98.5 + Math.random() * 1.0;
    if (nirfRank && nirfRank <= 60) return 96 + Math.random() * 2.5;
    if (nirfRank && nirfRank <= 100) return 93 + Math.random() * 3.0;
    if (nirfRank && nirfRank <= 200) return 88 + Math.random() * 5.0;
    // Non-NIRF colleges: spread between 50 and 92 based on index
    return 50 + Math.random() * 42;
}

/** Shift percentile by branch (CS highest, Civil lowest). */
function branchShift(branch: string): number {
    const shifts: Record<string, number> = {
        'Computer Engineering': 0,
        'AI & Data Science': -0.3,
        'AI & Machine Learning': -0.5,
        'Information Technology': -1.0,
        'Electronics & Telecommunication': -2.5,
        'Electrical Engineering': -3.5,
        'Mechanical Engineering': -4.5,
        'Chemical Engineering': -5.5,
        'Civil Engineering': -6.0,
    };
    return shifts[branch] ?? -3;
}

/** Shift percentile by category/quota. */
function categoryShift(cat: string): number {
    const shifts: Record<string, number> = {
        General: 0,
        OBC: -2,
        EWS: -1.5,
        VJNT: -3,
        SBC: -3.5,
        SC: -5,
        ST: -7,
    };
    return shifts[cat] ?? -2;
}

function quotaShift(q: string): number {
    return q === 'OHU' ? 1.5 : 0; // OHU (other university) cutoffs are higher
}

function clamp(v: number, lo: number, hi: number) {
    return Math.max(lo, Math.min(hi, v));
}

function round2(v: number) {
    return Math.round(v * 100) / 100;
}

// ─── Main ─────────────────────────────────────────────────────────────
async function main() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const College = mongoose.connection.collection('colleges');

    // Find all Maharashtra engineering-related colleges
    const colleges = await College.find({
        'location.state': { $regex: /maharashtra/i },
    }).toArray();

    console.log(`📚 Found ${colleges.length} Maharashtra colleges`);

    let totalCutoffs = 0;
    let updatedColleges = 0;

    for (let i = 0; i < colleges.length; i++) {
        const col = colleges[i];
        const existingCutoffs: any[] = col.cutoffs || [];

        // Skip if this college already has MHT CET cutoffs
        if (existingCutoffs.some((c: any) => c.exam === EXAM)) {
            continue;
        }

        const base = baseTierPercentile(col.nirfRank, i);

        // Pick 3-6 random branches for this college
        const branchCount = 3 + Math.floor(Math.random() * 4);
        const shuffled = [...BRANCHES].sort(() => Math.random() - 0.5);
        const selectedBranches = shuffled.slice(0, branchCount);

        const newCutoffs: any[] = [];

        for (const branch of selectedBranches) {
            for (const cat of CATEGORIES) {
                for (const quota of QUOTAS) {
                    const percentile = round2(
                        clamp(
                            base + branchShift(branch) + categoryShift(cat) + quotaShift(quota) + (Math.random() - 0.5) * 1.5,
                            10,
                            99.99
                        )
                    );

                    newCutoffs.push({
                        exam: EXAM,
                        branch,
                        category: cat,
                        closingRank: percentile, // stored as closingRank for backend uniformity
                        year: YEAR,
                        quota,
                    });
                }
            }
        }

        await College.updateOne(
            { _id: col._id },
            { $push: { cutoffs: { $each: newCutoffs } } } as any
        );

        totalCutoffs += newCutoffs.length;
        updatedColleges++;

        if (updatedColleges % 50 === 0) {
            console.log(`  → Processed ${updatedColleges} colleges (${totalCutoffs} cutoffs added)`);
        }
    }

    console.log(`\n✅ Done! Seeded ${totalCutoffs} MHT CET cutoffs across ${updatedColleges} colleges.`);
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
});
