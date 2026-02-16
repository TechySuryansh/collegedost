import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './models/College';
import Article from './models/Article';
import Exam from './models/Exam';
import Course from './models/Course';
import connectDB from './config/db';

dotenv.config();

// ─── GitHub Data Files ──────────────────────────────────────────────────────────
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Clueless-Community/collegeAPI/main/data';

interface RawCollege {
    name: string;
    city: string;
    state: string;
    rank?: number;
}

interface MergedCollege {
    name: string;
    city: string;
    state: string;
    nirfRank?: number;
    categories: string[];
}

// All data files to fetch
const DATA_FILES: { file: string; category: string; hasRank: boolean }[] = [
    // Ranking files (have NIRF rank)
    { file: 'engineering_ranking.json', category: 'Engineering', hasRank: true },
    { file: 'medical_ranking.json', category: 'Medical', hasRank: true },
    { file: 'management_ranking.json', category: 'Management', hasRank: true },
    { file: 'pharmacy_ranking.json', category: 'Pharmacy', hasRank: true },
    { file: 'dental_ranking.json', category: 'Dental', hasRank: true },
    { file: 'law_ranking.json', category: 'Law', hasRank: true },
    { file: 'architecture_ranking.json', category: 'Architecture', hasRank: true },
    { file: 'research_ranking.json', category: 'Research', hasRank: true },
    { file: 'university_ranking.json', category: 'University', hasRank: true },
    { file: 'overall_ranking.json', category: 'Overall', hasRank: true },
    { file: 'college_ranking.json', category: 'College', hasRank: true },

    // Participated files (no rank, more colleges)
    { file: 'engineering_participated.json', category: 'Engineering', hasRank: false },
    { file: 'medical_participated.json', category: 'Medical', hasRank: false },
    { file: 'management_participated.json', category: 'Management', hasRank: false },
    { file: 'pharmacy_participated.json', category: 'Pharmacy', hasRank: false },
    { file: 'dental_participated.json', category: 'Dental', hasRank: false },
    { file: 'law_participated.json', category: 'Law', hasRank: false },
    { file: 'architecture_participated.json', category: 'Architecture', hasRank: false },
    { file: 'overall_participated.json', category: 'Overall', hasRank: false },
    { file: 'college_participated.json', category: 'College', hasRank: false },
    { file: 'allAgriculture.json', category: 'Agriculture', hasRank: false },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')   // Remove special characters
        .replace(/\s+/g, '-')            // Replace spaces with hyphens
        .replace(/-+/g, '-')             // Collapse multiple hyphens
        .replace(/^-|-$/g, '')           // Trim leading/trailing hyphens
        .substring(0, 120);               // Cap length
}

function inferCollegeType(name: string): string {
    const nameLower = name.toLowerCase();

    // Government patterns
    const govtPatterns = [
        'indian institute of technology',
        'national institute of technology',
        'indian institute of information technology',
        'indian institute of science',
        'indian institute of engineering',
        'indian institute of space',
        'all india institute',
        'aiims',
        'government college',
        'government engineering',
        'government institute',
        'central university',
        'central institute',
        'jawaharlal nehru',
        'maulana azad',
        'delhi technological university',
        'netaji subhas',
        'indira gandhi',
        'mahatma gandhi',
        'national institute of food',
        'national institute of advanced',
        'national engineering college',
        'defence institute',
        'army institute',
        'rajiv gandhi institute of petroleum',
        'institute of chemical technology',
        'sant longowal',
        'harcourt butler',
        'dr. b r ambedkar national',
        'motilal nehru',
        'sardar vallabhbhai',
        'indraprastha institute',
        'guru gobind singh indraprastha',
        'panjab university',
        'anna university',
        'jadavpur university',
        'college of engineering, pune',
        'college of engineering, trivandrum',
        'visvesvaraya national',
    ];

    for (const pattern of govtPatterns) {
        if (nameLower.includes(pattern)) return 'Government';
    }

    // Deemed university patterns
    const deemedPatterns = [
        'deemed to be university',
        'deemed university',
        'vellore institute of technology',
        'manipal institute',
        'birla institute of technology',
        'shanmugha arts science',
        'amrita vishwa',
        'siksha \'o\' anusandhan',
        'kalasalingam',
        'sathyabama',
    ];

    for (const pattern of deemedPatterns) {
        if (nameLower.includes(pattern)) return 'Deemed';
    }

    // State university
    if (nameLower.includes('university') && !nameLower.includes('private')) {
        return 'University';
    }

    return 'Private';
}

function deriveRating(nirfRank?: number): number | undefined {
    if (!nirfRank) return undefined;
    if (nirfRank <= 5) return 4.8;
    if (nirfRank <= 10) return 4.7;
    if (nirfRank <= 25) return 4.5;
    if (nirfRank <= 50) return 4.3;
    if (nirfRank <= 100) return 4.0;
    if (nirfRank <= 150) return 3.7;
    if (nirfRank <= 200) return 3.5;
    return 3.2;
}

function normalizeName(name: string | undefined | null): string {
    if (!name) return '';
    return name
        .replace(/\s+/g, ' ')
        .replace(/`/g, "'")
        .trim();
}

// ─── Fetch Data from GitHub ─────────────────────────────────────────────────────

async function fetchJsonFile(fileName: string): Promise<RawCollege[]> {
    const url = `${GITHUB_RAW_BASE}/${fileName}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`  ⚠ Failed to fetch ${fileName}: ${response.status}`);
            return [];
        }
        const data = await response.json() as RawCollege[];
        return data;
    } catch (err) {
        console.warn(`  ⚠ Error fetching ${fileName}:`, err);
        return [];
    }
}

async function fetchAllCollegeData(): Promise<MergedCollege[]> {
    const collegeMap = new Map<string, MergedCollege>();

    for (const { file, category, hasRank } of DATA_FILES) {
        console.log(`  📥 Fetching ${file}...`);
        const colleges = await fetchJsonFile(file);
        console.log(`     → ${colleges.length} entries`);

        for (const raw of colleges) {
            const name = normalizeName(raw.name);
            if (!name) continue; // Skip entries with no name
            const key = name.toLowerCase();

            if (collegeMap.has(key)) {
                const existing = collegeMap.get(key)!;
                // Merge categories
                if (!existing.categories.includes(category)) {
                    existing.categories.push(category);
                }
                // Use rank from ranking file if we don't have one yet, or if this one is better
                if (hasRank && raw.rank) {
                    if (!existing.nirfRank || raw.rank < existing.nirfRank) {
                        existing.nirfRank = raw.rank;
                    }
                }
                // Update city/state if missing
                if (!existing.city && raw.city) existing.city = raw.city.trim();
                if (!existing.state && raw.state) existing.state = raw.state.trim();
            } else {
                collegeMap.set(key, {
                    name,
                    city: (raw.city || '').trim(),
                    state: (raw.state || '').trim(),
                    nirfRank: hasRank ? raw.rank : undefined,
                    categories: [category],
                });
            }
        }
    }

    return Array.from(collegeMap.values());
}

// ─── Seed Script ────────────────────────────────────────────────────────────────

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await College.deleteMany({});
        await Article.deleteMany({});
        await Exam.deleteMany({});
        await Course.deleteMany({});
        console.log('✅ Old data cleared.\n');

        // ─── 1. Fetch & Seed Colleges ─────────────────────────────────────
        console.log('🌐 Fetching college data from GitHub...\n');
        const mergedColleges = await fetchAllCollegeData();
        console.log(`\n📊 Total unique colleges: ${mergedColleges.length}\n`);

        // Track slugs to ensure uniqueness
        const usedSlugs = new Set<string>();

        const collegeDocuments = mergedColleges.map((college) => {
            let slug = generateSlug(college.name);
            // Ensure slug uniqueness
            if (usedSlugs.has(slug)) {
                const citySlug = generateSlug(college.city);
                slug = `${slug}-${citySlug}`;
            }
            if (usedSlugs.has(slug)) {
                slug = `${slug}-${Date.now()}`;
            }
            usedSlugs.add(slug);

            const type = inferCollegeType(college.name);
            const rating = deriveRating(college.nirfRank);

            return {
                name: college.name,
                slug,
                logo: '',
                backgroundImg: '',
                location: {
                    city: college.city,
                    state: college.state,
                    country: 'India',
                },
                type,
                nirfRank: college.nirfRank || undefined,
                rating,
                coursesOffered: [],
                placements: {
                    averagePackage: 0,
                    highestPackage: 0,
                    placementPercentage: 0,
                },
                gallery: [],
                images: [],
                brochureUrl: '',
                website: '',
                description: `${college.name} is located in ${college.city}, ${college.state}, India. Categories: ${college.categories.join(', ')}.`,
                cutoffs: [],
                facilities: [],
                scholarships: [],
                importantDates: [],
                admissionProcess: [],
                requiredDocuments: [],
            };
        });

        // Insert in batches of 500 to avoid overwhelming MongoDB
        const BATCH_SIZE = 500;
        let insertedCount = 0;
        for (let i = 0; i < collegeDocuments.length; i += BATCH_SIZE) {
            const batch = collegeDocuments.slice(i, i + BATCH_SIZE);
            try {
                const result = await College.insertMany(batch, { ordered: false });
                insertedCount += result.length;
                console.log(`  ✅ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${result.length} colleges`);
            } catch (err: any) {
                // Handle duplicate key errors gracefully
                if (err.insertedDocs) {
                    insertedCount += err.insertedDocs.length;
                    console.log(`  ⚠ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${err.insertedDocs.length} inserted (some duplicates skipped)`);
                } else {
                    console.error(`  ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, err.message);
                }
            }
        }
        console.log(`\n🎓 Total colleges seeded: ${insertedCount}\n`);

        // ─── 2. Seed Articles ─────────────────────────────────────────────
        await Article.create([
            {
                title: "JEE Main 2026 Strategy Guide",
                slug: "jee-main-2026-strategy",
                summary: "Learn how to crack the upcoming JEE Main with top strategy tips from toppers.",
                content: "<p>The JEE Main 2026 is approaching. Focus on Physics, Chemistry, and Mathematics...</p>",
                category: "Exam News",
                author: "Expert Counsel",
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            },
            {
                title: "Top 10 Engineering Colleges in 2026",
                slug: "top-10-engineering-colleges-2026",
                summary: "A comprehensive list of best engineering colleges based on NIRF 2026 rankings.",
                content: "<p>Choosing the right college depends on various factors...</p>",
                category: "College News",
                author: "Admin",
                image: "https://images.unsplash.com/photo-1523050335456-c737f14e4b78?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
        ]);
        console.log('📰 Articles seeded.');

        // ─── 3. Seed Exams ────────────────────────────────────────────────
        await Exam.create([
            {
                examName: "JEE Main",
                examSlug: "jee-main",
                conductingAuthority: "National Testing Agency (NTA)",
                examLevel: "National",
                description: "Entrance exam for NITs, IIITs and GFTIs.",
                importantDates: [{ event: "Registration Starts", date: new Date('2025-11-01') }],
                news: [{ title: "NTA releases JEE Main schedule", link: "#", pubDate: new Date() }]
            }
        ]);
        console.log('📝 Exams seeded.');

        // ─── 4. Seed Courses ──────────────────────────────────────────────
        await Course.create([
            {
                courseName: "Bachelor of Technology",
                shortName: "B.Tech",
                slug: "b-tech",
                degreeLevel: "Undergraduate",
                duration: "4 Years",
                overview: "Professional degree in engineering.",
                careerOptions: ["Software Developer", "Data Scientist", "Mechanical Engineer"]
            }
        ]);
        console.log('📚 Courses seeded.');

        console.log('\n🎉 Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
