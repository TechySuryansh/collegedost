import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as XLSX from 'xlsx';
import path from 'path';
import College from './models/College';
import connectDB from './config/db';

dotenv.config();

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CollegeRow {
    aisheCode: string;
    name: string;
    state: string;
    district: string;
    website?: string;
    yearOfEstablishment?: string;
    locationType?: string;
    collegeType?: string;
    management?: string;
    universityAisheCode?: string;
    universityName?: string;
    universityType?: string;
}

interface StandaloneRow {
    aisheCode: string;
    name: string;
    state: string;
    district: string;
    yearOfEstablishment?: string;
    locationType?: string;
    standaloneType?: string;
    management?: string;
}

interface UniversityRow {
    aisheCode: string;
    name: string;
    state: string;
    district: string;
    website?: string;
    yearOfEstablishment?: string;
    locationType?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 120);
}

function cleanName(raw: string): string {
    if (!raw) return '';
    // Remove AISHE code prefix patterns like "100001-" or "061-PT."
    let name = raw.replace(/^\d{1,6}-\s*/, '').trim();
    // Normalize spaces and backticks
    name = name.replace(/\s+/g, ' ').replace(/`/g, "'").trim();
    return name;
}

function inferType(management: string | undefined): string {
    if (!management || management === '-') return 'Private';
    const mgmt = management.toLowerCase();
    if (mgmt.includes('central government')) return 'Government';
    if (mgmt.includes('state government')) return 'Government';
    if (mgmt.includes('local body')) return 'Government';
    if (mgmt.includes('government aided') || mgmt.includes('private aided')) return 'Private Aided';
    if (mgmt.includes('university')) return 'University';
    return 'Private';
}

function normalizeWebsite(url: string | undefined): string {
    if (!url || url === '-' || url === 'NA' || url === 'N/A') return '';
    let site = url.trim();
    if (site && !site.startsWith('http://') && !site.startsWith('https://')) {
        site = 'https://' + site;
    }
    return site;
}

function str(val: any): string {
    if (val === null || val === undefined || val === '-') return '';
    return String(val).trim();
}

// ─── Parse Excel Files ──────────────────────────────────────────────────────────

function parseCollegeFile(filePath: string): CollegeRow[] {
    console.log(`📥 Reading ${path.basename(filePath)}...`);
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    // Headers are on row 3, data starts at row 4
    const allRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
    // Row index 2 = header row (0-indexed)
    const rows: CollegeRow[] = [];
    for (let i = 3; i < allRows.length; i++) {
        const r = allRows[i];
        if (!r || !r[0] || !r[1]) continue; // Skip empty rows
        rows.push({
            aisheCode: str(r[0]),
            name: str(r[1]),
            state: str(r[2]),
            district: str(r[3]),
            website: str(r[4]),
            yearOfEstablishment: str(r[5]),
            locationType: str(r[6]),
            collegeType: str(r[7]),
            management: str(r[8]),
            universityAisheCode: str(r[9]),
            universityName: str(r[10]),
            universityType: str(r[11]),
        });
    }
    console.log(`   → ${rows.length} rows parsed`);
    return rows;
}

function parseStandaloneFile(filePath: string): StandaloneRow[] {
    console.log(`📥 Reading ${path.basename(filePath)}...`);
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const allRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const rows: StandaloneRow[] = [];
    for (let i = 3; i < allRows.length; i++) {
        const r = allRows[i];
        if (!r || !r[0] || !r[1]) continue;
        rows.push({
            aisheCode: str(r[0]),
            name: str(r[1]),
            state: str(r[2]),
            district: str(r[3]),
            yearOfEstablishment: str(r[4]),
            locationType: str(r[5]),
            standaloneType: str(r[6]),
            management: str(r[7]),
        });
    }
    console.log(`   → ${rows.length} rows parsed`);
    return rows;
}

function parseUniversityFile(filePath: string): UniversityRow[] {
    console.log(`📥 Reading ${path.basename(filePath)}...`);
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const allRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const rows: UniversityRow[] = [];
    for (let i = 3; i < allRows.length; i++) {
        const r = allRows[i];
        if (!r || !r[0] || !r[1]) continue;
        rows.push({
            aisheCode: str(r[0]),
            name: str(r[1]),
            state: str(r[2]),
            district: str(r[3]),
            website: str(r[4]),
            yearOfEstablishment: str(r[5]),
            locationType: str(r[6]),
        });
    }
    console.log(`   → ${rows.length} rows parsed`);
    return rows;
}

// ─── Build Documents ────────────────────────────────────────────────────────────

function buildDocuments(): any[] {
    const basePath = path.join(__dirname, '..');

    // Parse all files
    const colleges = parseCollegeFile(path.join(basePath, 'College-ALL COLLEGE.xlsx'));
    const standalones = parseStandaloneFile(path.join(basePath, 'Standalone-ALL STANDALONE.xlsx'));
    const universities = parseUniversityFile(path.join(basePath, 'University-ALL UNIVERSITIES.xlsx'));

    const usedSlugs = new Set<string>();
    const documents: any[] = [];

    function getUniqueSlug(name: string, district: string): string {
        let slug = generateSlug(name);
        if (!slug) slug = 'institution';
        if (usedSlugs.has(slug)) {
            const distSlug = generateSlug(district);
            slug = distSlug ? `${slug}-${distSlug}` : `${slug}-${Date.now()}`;
        }
        if (usedSlugs.has(slug)) {
            slug = `${slug}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        }
        usedSlugs.add(slug);
        return slug;
    }

    // 1. Process Colleges
    console.log('\n🏫 Processing colleges...');
    for (const c of colleges) {
        const name = cleanName(c.name);
        if (!name) continue;
        const slug = getUniqueSlug(name, c.district);
        documents.push({
            name,
            slug,
            logo: '',
            backgroundImg: '',
            location: {
                city: c.district || '',
                state: c.state || '',
                country: 'India',
            },
            type: inferType(c.management),
            website: normalizeWebsite(c.website),
            description: `${name} is located in ${c.district}, ${c.state}, India.${c.management ? ` Management: ${c.management}.` : ''}${c.collegeType ? ` Type: ${c.collegeType}.` : ''}`,
            aisheCode: c.aisheCode,
            yearOfEstablishment: c.yearOfEstablishment || '',
            collegeType: c.collegeType || '',
            management: c.management || '',
            universityName: c.universityName || '',
            universityType: c.universityType || '',
            institutionCategory: 'College',
            locationType: c.locationType || '',
            coursesOffered: [],
            placements: { averagePackage: 0, highestPackage: 0, placementPercentage: 0 },
            gallery: [],
            images: [],
            cutoffs: [],
            facilities: [],
            scholarships: [],
            importantDates: [],
            admissionProcess: [],
            requiredDocuments: [],
        });
    }
    console.log(`   ✅ ${colleges.length} college documents built`);

    // 2. Process Standalones
    console.log('\n🏛️ Processing standalone institutions...');
    for (const s of standalones) {
        const name = cleanName(s.name);
        if (!name) continue;
        const slug = getUniqueSlug(name, s.district);
        documents.push({
            name,
            slug,
            logo: '',
            backgroundImg: '',
            location: {
                city: s.district || '',
                state: s.state || '',
                country: 'India',
            },
            type: inferType(s.management),
            description: `${name} is located in ${s.district}, ${s.state}, India.${s.management ? ` Management: ${s.management}.` : ''}${s.standaloneType ? ` Type: ${s.standaloneType}.` : ''}`,
            aisheCode: s.aisheCode,
            yearOfEstablishment: s.yearOfEstablishment || '',
            collegeType: s.standaloneType || '',
            management: s.management || '',
            institutionCategory: 'Standalone',
            locationType: s.locationType || '',
            coursesOffered: [],
            placements: { averagePackage: 0, highestPackage: 0, placementPercentage: 0 },
            gallery: [],
            images: [],
            cutoffs: [],
            facilities: [],
            scholarships: [],
            importantDates: [],
            admissionProcess: [],
            requiredDocuments: [],
        });
    }
    console.log(`   ✅ ${standalones.length} standalone documents built`);

    // 3. Process Universities
    console.log('\n🎓 Processing universities...');
    for (const u of universities) {
        const name = cleanName(u.name);
        if (!name) continue;
        const slug = getUniqueSlug(name, u.district);
        documents.push({
            name,
            slug,
            logo: '',
            backgroundImg: '',
            location: {
                city: u.district || '',
                state: u.state || '',
                country: 'India',
            },
            type: 'University',
            website: normalizeWebsite(u.website),
            description: `${name} is a university located in ${u.district}, ${u.state}, India.`,
            aisheCode: u.aisheCode,
            yearOfEstablishment: u.yearOfEstablishment || '',
            institutionCategory: 'University',
            locationType: u.locationType || '',
            coursesOffered: [],
            placements: { averagePackage: 0, highestPackage: 0, placementPercentage: 0 },
            gallery: [],
            images: [],
            cutoffs: [],
            facilities: [],
            scholarships: [],
            importantDates: [],
            admissionProcess: [],
            requiredDocuments: [],
        });
    }
    console.log(`   ✅ ${universities.length} university documents built`);

    return documents;
}

// ─── Main Seed Function ─────────────────────────────────────────────────────────

const seedFromExcel = async () => {
    try {
        await connectDB();

        console.log('\n🗑️  Clearing existing college data...');
        await College.deleteMany({});
        console.log('✅ Old data cleared.\n');

        console.log('📊 Parsing Excel files...\n');
        const documents = buildDocuments();
        console.log(`\n📊 Total documents to insert: ${documents.length}\n`);

        // Insert in batches
        const BATCH_SIZE = 1000;
        let insertedCount = 0;
        for (let i = 0; i < documents.length; i += BATCH_SIZE) {
            const batch = documents.slice(i, i + BATCH_SIZE);
            try {
                const result = await College.insertMany(batch, { ordered: false });
                insertedCount += result.length;
                const batchNum = Math.floor(i / BATCH_SIZE) + 1;
                const totalBatches = Math.ceil(documents.length / BATCH_SIZE);
                console.log(`  ✅ Batch ${batchNum}/${totalBatches}: ${result.length} inserted (${insertedCount} total)`);
            } catch (err: any) {
                if (err.insertedDocs) {
                    insertedCount += err.insertedDocs.length;
                    console.log(`  ⚠ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${err.insertedDocs.length} inserted (some duplicates skipped)`);
                } else {
                    console.error(`  ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, err.message);
                }
            }
        }

        console.log(`\n🎉 Seeding completed! Total institutions inserted: ${insertedCount}`);
        console.log(`   📊 Breakdown: Colleges, Standalones, and Universities from AISHE data`);

        // Print stats
        const stats = await College.aggregate([
            { $group: { _id: '$institutionCategory', count: { $sum: 1 } } }
        ]);
        console.log('\n📈 Category breakdown:');
        for (const stat of stats) {
            console.log(`   ${stat._id}: ${stat.count}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedFromExcel();
