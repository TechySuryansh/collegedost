/**
 * Seed cutoff data for CAT, CLAT, and AIIMS/INI-CET.
 * Run: npx ts-node scripts/seedCatClatAiimsCutoffs.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';
if (!MONGO_URI) { console.error('❌ No MONGODB_URI'); process.exit(1); }

const YEAR = 2025;
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function round2(v: number) { return Math.round(v * 100) / 100; }

// ───────── CAT ─────────
const CAT_BRANCHES = ['General Management', 'Finance', 'Marketing', 'Business Analytics', 'Human Resource', 'Operations', 'IT & Systems', 'Supply Chain'];
const CAT_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const CAT_QUOTAS = ['General', 'Category'];

function catBase(name: string, nirf?: number): number {
    const n = name.toLowerCase();
    if (n.includes('indian institute of management') || n.includes(' iim')) return 97 + Math.random() * 2.5;
    if (/xlri|iift|fms|mdi|spjimr|iit/.test(n)) return 95 + Math.random() * 3;
    if (nirf && nirf <= 30) return 93 + Math.random() * 4;
    if (nirf && nirf <= 60) return 88 + Math.random() * 5;
    return 75 + Math.random() * 15;
}

async function seedCAT(col: any) {
    const base = catBase(col.name, col.nirfRank);
    const branchCount = 3 + Math.floor(Math.random() * 4);
    const branches = [...CAT_BRANCHES].sort(() => Math.random() - 0.5).slice(0, branchCount);
    const cutoffs: any[] = [];
    for (const b of branches) {
        const bShift = -CAT_BRANCHES.indexOf(b) * 0.5;
        for (const cat of CAT_CATEGORIES) {
            const cShift = { General: 0, OBC: -2, EWS: -1.5, SC: -5, ST: -7 }[cat] || 0;
            for (const q of CAT_QUOTAS) {
                cutoffs.push({
                    exam: 'CAT', branch: b, category: cat,
                    closingRank: round2(clamp(base + bShift + cShift + (Math.random() - 0.5) * 1.5, 50, 99.99)),
                    year: YEAR, quota: q,
                });
            }
        }
    }
    return cutoffs;
}

// ───────── CLAT ─────────
const CLAT_BRANCHES = ['Constitutional Law', 'Criminal Law', 'Corporate Law', 'Human Rights', 'IPR', 'Environmental Law', 'International Law', 'Tax Law'];
const CLAT_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const CLAT_QUOTAS = ['AI', 'Domicile'];

function clatBase(name: string, nirf?: number): number {
    const n = name.toLowerCase();
    if (n.includes('national law school') && n.includes('bangalore')) return 50 + Math.random() * 50;
    if (n.includes('national law') || n.includes('nlu')) return 200 + Math.random() * 800;
    if (nirf && nirf <= 20) return 100 + Math.random() * 400;
    return 500 + Math.random() * 2000;
}

async function seedCLAT(col: any) {
    const base = clatBase(col.name, col.nirfRank);
    const branchCount = 3 + Math.floor(Math.random() * 3);
    const branches = [...CLAT_BRANCHES].sort(() => Math.random() - 0.5).slice(0, branchCount);
    const cutoffs: any[] = [];
    for (const b of branches) {
        for (const cat of CLAT_CATEGORIES) {
            const cShift = { General: 0, OBC: 100, EWS: 50, SC: 300, ST: 500 }[cat] || 0;
            for (const q of CLAT_QUOTAS) {
                cutoffs.push({
                    exam: 'CLAT', branch: b, category: cat,
                    closingRank: Math.round(clamp(base + cShift + (Math.random() - 0.5) * 100, 1, 5000)),
                    year: YEAR, quota: q,
                });
            }
        }
    }
    return cutoffs;
}

// ───────── AIIMS / INI-CET ─────────
const AIIMS_BRANCHES = ['MBBS', 'MD General Medicine', 'MD Dermatology', 'MD Paediatrics', 'MD Radiodiagnosis', 'MS General Surgery', 'MS Orthopaedics', 'MS Ophthalmology', 'MD Anaesthesiology', 'MD Community Medicine'];
const AIIMS_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const AIIMS_QUOTAS = ['AI', 'Internal'];

function aiimsBase(name: string): number {
    const n = name.toLowerCase();
    if (n.includes('aiims') && (n.includes('new delhi') || n.includes('delhi'))) return 30 + Math.random() * 50;
    if (n.includes('aiims')) return 100 + Math.random() * 200;
    if (n.includes('pgimer') || n.includes('pgi')) return 50 + Math.random() * 100;
    if (n.includes('jipmer')) return 80 + Math.random() * 100;
    if (n.includes('nimhans')) return 40 + Math.random() * 80;
    if (n.includes('sctimst')) return 60 + Math.random() * 100;
    return 150 + Math.random() * 300;
}

async function seedAIIMS(col: any) {
    const base = aiimsBase(col.name);
    const branchCount = 4 + Math.floor(Math.random() * 4);
    const branches = [...AIIMS_BRANCHES].sort(() => Math.random() - 0.5).slice(0, branchCount);
    const cutoffs: any[] = [];
    for (const b of branches) {
        const bShift = b === 'MBBS' ? 0 : 50 + Math.random() * 100;
        for (const cat of AIIMS_CATEGORIES) {
            const cShift = { General: 0, OBC: 50, EWS: 30, SC: 150, ST: 250 }[cat] || 0;
            for (const q of AIIMS_QUOTAS) {
                cutoffs.push({
                    exam: b === 'MBBS' ? 'AIIMS' : 'INI-CET',
                    branch: b, category: cat,
                    closingRank: Math.round(clamp(base + bShift + cShift + (Math.random() - 0.5) * 30, 1, 5000)),
                    year: YEAR, quota: q,
                });
            }
        }
    }
    return cutoffs;
}

// ───────── MAIN ─────────
async function main() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    const College = mongoose.connection.collection('colleges');

    // --- CAT: Management colleges ---
    const mbaColleges = await College.find({
        $or: [
            { name: { $regex: /Indian Institute of Management/i } },
            { name: { $regex: /\bIIM\b/i } },
            { name: { $regex: /XLRI|IIFT|FMS|MDI|SPJIMR|JBIMS|ISB/i } },
            { name: { $regex: /Management/i } },
            { name: { $regex: /Business/i } },
            { collegeType: { $regex: /Management/i } },
        ]
    }).toArray();
    console.log(`📚 CAT: Found ${mbaColleges.length} management colleges`);

    let catTotal = 0;
    for (const col of mbaColleges) {
        if ((col.cutoffs || []).some((c: any) => c.exam === 'CAT')) continue;
        const cuts = await seedCAT(col);
        await College.updateOne({ _id: col._id }, { $push: { cutoffs: { $each: cuts } } } as any);
        catTotal += cuts.length;
    }
    console.log(`  ✅ CAT: Seeded ${catTotal} cutoffs`);

    // --- CLAT: Law colleges ---
    const lawColleges = await College.find({
        $or: [
            { name: { $regex: /National Law/i } },
            { name: { $regex: /\bNLU\b/i } },
            { name: { $regex: /\bLaw\b/i } },
            { name: { $regex: /Legal/i } },
            { name: { $regex: /Jindal Global Law|ILS Pune/i } },
            { collegeType: { $regex: /Law/i } },
        ]
    }).toArray();
    console.log(`📚 CLAT: Found ${lawColleges.length} law colleges`);

    let clatTotal = 0;
    for (const col of lawColleges) {
        if ((col.cutoffs || []).some((c: any) => c.exam === 'CLAT')) continue;
        const cuts = await seedCLAT(col);
        await College.updateOne({ _id: col._id }, { $push: { cutoffs: { $each: cuts } } } as any);
        clatTotal += cuts.length;
    }
    console.log(`  ✅ CLAT: Seeded ${clatTotal} cutoffs`);

    // --- AIIMS/INI-CET: Medical colleges ---
    const medColleges = await College.find({
        $or: [
            { name: { $regex: /AIIMS/i } },
            { name: { $regex: /PGIMER|PGI Chandigarh/i } },
            { name: { $regex: /JIPMER/i } },
            { name: { $regex: /NIMHANS/i } },
            { name: { $regex: /SCTIMST/i } },
            { name: { $regex: /All India Institute of Medical/i } },
        ]
    }).toArray();
    console.log(`📚 AIIMS: Found ${medColleges.length} medical colleges`);

    let aiimsTotal = 0;
    for (const col of medColleges) {
        if ((col.cutoffs || []).some((c: any) => c.exam === 'AIIMS' || c.exam === 'INI-CET')) continue;
        const cuts = await seedAIIMS(col);
        await College.updateOne({ _id: col._id }, { $push: { cutoffs: { $each: cuts } } } as any);
        aiimsTotal += cuts.length;
    }
    console.log(`  ✅ AIIMS/INI-CET: Seeded ${aiimsTotal} cutoffs`);

    console.log(`\n✅ All done! CAT=${catTotal}, CLAT=${clatTotal}, AIIMS=${aiimsTotal}`);
    await mongoose.disconnect();
}

main().catch(err => { console.error('❌', err); process.exit(1); });
