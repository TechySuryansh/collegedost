/**
 * Seed GATE cutoff data for IITs, NITs, IIITs, and GFTIs.
 *
 * Generates realistic GATE score cutoffs based on institution tier.
 * Run with:  npx ts-node scripts/seedGateCutoffs.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';
if (!MONGO_URI) { console.error('❌ No MONGODB_URI found in .env'); process.exit(1); }

const EXAM = 'GATE';
const YEAR = 2025;

const BRANCHES = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Data Science & AI',
    'Instrumentation Engineering',
    'Biotechnology',
    'Aerospace Engineering',
    'Mathematics',
    'Physics',
];

const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const QUOTAS = ['Open', 'Category'];

// GATE score ranges by tier
function baseTierScore(name: string, nirfRank?: number): number {
    const n = name.toLowerCase();
    if (n.includes('indian institute of technology') || n.includes(' iit')) return 750 + Math.random() * 200;
    if (n.includes('indian institute of science') || n.includes('iisc')) return 800 + Math.random() * 150;
    if (nirfRank && nirfRank <= 20) return 700 + Math.random() * 200;
    if (n.includes('national institute of technology') || n.includes(' nit')) return 550 + Math.random() * 200;
    if (n.includes('indian institute of information') || n.includes('iiit')) return 500 + Math.random() * 200;
    if (nirfRank && nirfRank <= 50) return 500 + Math.random() * 200;
    if (nirfRank && nirfRank <= 100) return 400 + Math.random() * 200;
    return 300 + Math.random() * 250;
}

function branchShift(branch: string): number {
    const s: Record<string, number> = {
        'Computer Science & Engineering': 0, 'Data Science & AI': -10,
        'Electronics & Communication': -30, 'Electrical Engineering': -50,
        'Mechanical Engineering': -70, 'Civil Engineering': -80,
        'Chemical Engineering': -90, 'Instrumentation Engineering': -60,
        'Biotechnology': -100, 'Aerospace Engineering': -40,
        'Mathematics': -110, 'Physics': -120,
    };
    return s[branch] ?? -50;
}

function catShift(cat: string): number {
    const s: Record<string, number> = { General: 0, OBC: -40, EWS: -30, SC: -80, ST: -120 };
    return s[cat] ?? -30;
}

function quotaShift(q: string): number { return q === 'Category' ? -30 : 0; }

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function round1(v: number) { return Math.round(v * 10) / 10; }

async function main() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    const College = mongoose.connection.collection('colleges');

    // Find IITs, NITs, IIITs, IISc, and top engineering institutes
    const colleges = await College.find({
        $or: [
            { name: { $regex: /Indian Institute of Technology/i } },
            { name: { $regex: /National Institute of Technology/i } },
            { name: { $regex: /Indian Institute of Information Technology/i } },
            { name: { $regex: /Indian Institute of Science/i } },
            { name: { $regex: /\bIIT\b/i } },
            { name: { $regex: /\bNIT\b/i } },
            { name: { $regex: /\bIIIT\b/i } },
            { name: { $regex: /\bIISc\b/i } },
        ]
    }).toArray();

    console.log(`📚 Found ${colleges.length} IIT/NIT/IIIT/IISc colleges`);

    let totalCutoffs = 0;
    let updatedColleges = 0;

    for (const col of colleges) {
        const existing: any[] = col.cutoffs || [];
        if (existing.some((c: any) => c.exam === EXAM)) continue;

        const base = baseTierScore(col.name, col.nirfRank);

        // Pick 4–7 branches
        const branchCount = 4 + Math.floor(Math.random() * 4);
        const shuffled = [...BRANCHES].sort(() => Math.random() - 0.5);
        const selectedBranches = shuffled.slice(0, branchCount);

        const newCutoffs: any[] = [];

        for (const branch of selectedBranches) {
            for (const cat of CATEGORIES) {
                for (const quota of QUOTAS) {
                    const score = round1(clamp(
                        base + branchShift(branch) + catShift(cat) + quotaShift(quota) + (Math.random() - 0.5) * 30,
                        50,
                        1000
                    ));

                    newCutoffs.push({
                        exam: EXAM,
                        branch,
                        category: cat,
                        closingRank: score, // stored as closingRank for backend uniformity
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

        if (updatedColleges % 20 === 0) {
            console.log(`  → Processed ${updatedColleges} colleges (${totalCutoffs} cutoffs added)`);
        }
    }

    console.log(`\n✅ Done! Seeded ${totalCutoffs} GATE cutoffs across ${updatedColleges} colleges.`);
    await mongoose.disconnect();
}

main().catch(err => { console.error('❌', err); process.exit(1); });
