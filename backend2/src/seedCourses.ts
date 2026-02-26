import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import Course from './models/Course';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const apiKey = process.env.OPENAI_API_KEY || '';
const isGroq = apiKey.startsWith('gsk_');

const openai = new OpenAI({
    apiKey,
    ...(isGroq ? { baseURL: 'https://api.groq.com/openai/v1' } : {}),
});

const MODEL = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

// ═══════════════════════════════════════════════════════
// Course names to generate — add/remove as needed
// ═══════════════════════════════════════════════════════
const COURSE_NAMES: string[] = [
    // MBA & Management
    'MBA/PGDM', 'Executive MBA', 'Distance MBA', 'Online MBA', 'Part-Time MBA',
    'MBA in Finance', 'MBA in Marketing', 'MBA in HR',
    'MBA in IT', 'MBA in Operations Management', 'MBA in International Business',
    'MBA in Healthcare Management', 'MBA in Digital Marketing',
    'MBA in Data Analytics', 'MBA in Data Science', 'MBA in Entrepreneurship',
    'MBA in General Management', 'MBA in Product Management',
    'MBA in Agriculture', 'MBA in Pharmaceutical Management',
    'BBA', 'BBA LL.B.',

    // Engineering
    'B.E/B.Tech', 'M.E/M.Tech', 'Diploma in Engineering',
    'Computer Science Engineering', 'Mechanical Engineering', 'Civil Engineering',
    'Electronics & Communication Engineering', 'Electrical Engineering',
    'Information Technology', 'Chemical Engineering',
    'Aeronautical Engineering', 'Aerospace Engineering',
    'Biomedical Engineering', 'Biotechnology Engineering',
    'Automobile Engineering', 'Marine Engineering',
    'Robotics Engineering', 'Nanotechnology',
    'Food Technology', 'Petroleum Engineering',
    'Environmental Engineering', 'Metallurgical Engineering',
    'Mining Engineering', 'Textile Engineering',

    // Medical
    'MBBS', 'MD', 'BMLT', 'MPH', 'B.Sc Nursing', 'M.Sc Nursing',

    // Pharmacy
    'B.Pharm', 'M.Pharm', 'D.Pharm',

    // Law
    'B.A. LL.B.', 'LL.B.', 'LL.M.', 'B.Sc. LL.B', 'B.Com LL.B',

    // Design
    'B.Des', 'M.Des', 'B.Des in Fashion Design', 'B.Des in Interior Design',

    // Commerce & Accounting
    'B.Com.', 'M.Com.', 'CA', 'CS', 'CMA',

    // IT & Computer Application
    'BCA', 'MCA', 'B.Sc. in IT & Software',

    // Arts & Humanities
    'B.A.', 'M.A.', 'B.S.W.', 'MSW',

    // Science
    'B.Sc.', 'M.Sc.', 'Ph.D.',

    // Architecture
    'B.Arch.', 'M.Arch.', 'B.Plan',

    // Education
    'B.Ed.', 'M.Ed.', 'D.Ed.',

    // Hospitality
    'BHM', 'B.Sc. in Hotel Management',

    // Media
    'B.J.M.C.', 'B.A. in Mass Communication',

    // Aviation
    'BBA Aviation', 'B.Sc. Aviation', 'Commercial Pilot License',

    // Animation
    'B.Sc. in Animation', 'B.Des Animation',

    // Arts (Fine/Visual)
    'BFA', 'MFA',
];

function makeSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

async function generateCourseData(courseName: string): Promise<{
    description: string;
    eligibility: string;
    duration: string;
    feesRange: string;
    careerScope: string[];
}> {
    const prompt = `You are an expert Indian education consultant. Generate detailed information for the following course offered in Indian colleges.

COURSE NAME: ${courseName}

OUTPUT ONLY VALID JSON with these exact fields:
{
  "description": "A 2-3 paragraph description of the course, what it covers, and why students choose it",
  "eligibility": "Eligibility criteria (e.g., '10+2 with PCM, minimum 60%' or 'Graduation in any discipline')",
  "duration": "Course duration (e.g., '4 Years', '2 Years', '3 Years')",
  "feesRange": "Typical fee range in Indian colleges (e.g., '₹2-15 Lakhs', '₹50K-5 Lakhs')",
  "careerScope": ["5-8 career options or job roles after completing this course"]
}

Be factual and specific to the Indian education context. Output ONLY the JSON.`;

    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await openai.chat.completions.create({
                model: MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You output only valid JSON. No markdown, no commentary.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 1000,
                ...(isGroq ? {} : { response_format: { type: 'json_object' as const } }),
            });

            let content = response.choices[0]?.message?.content;
            if (!content) throw new Error('Empty response from AI');

            // Strip markdown fences if present
            content = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

            const parsed = JSON.parse(content);

            // Validate required fields
            if (!parsed.description || !parsed.eligibility || !parsed.duration || !parsed.careerScope) {
                throw new Error('Missing required fields in AI response');
            }

            return {
                description: parsed.description,
                eligibility: parsed.eligibility,
                duration: parsed.duration,
                feesRange: parsed.feesRange || 'Varies',
                careerScope: Array.isArray(parsed.careerScope) ? parsed.careerScope : [],
            };
        } catch (error: any) {
            lastError = error;
            console.error(`  ⚠ Attempt ${attempt + 1} failed: ${error.message}`);
            if (attempt < maxRetries) {
                await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
            }
        }
    }

    throw lastError || new Error('Failed after retries');
}

async function main() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📚 Processing ${COURSE_NAMES.length} courses using ${MODEL}...\n`);

    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < COURSE_NAMES.length; i++) {
        const name = COURSE_NAMES[i];
        const slug = makeSlug(name);

        console.log(`[${i + 1}/${COURSE_NAMES.length}] ${name} (${slug})`);

        // Check for duplicate
        const existing = await Course.findOne({ slug });
        if (existing) {
            console.log(`  ⏭ Already exists, skipping`);
            skipped++;
            continue;
        }

        try {
            const data = await generateCourseData(name);

            await Course.create({
                name,
                slug,
                description: data.description,
                eligibility: data.eligibility,
                duration: data.duration,
                feesRange: data.feesRange,
                careerScope: data.careerScope,
            });

            console.log(`  ✅ Created`);
            created++;

            // Rate limit: 500ms between requests
            await new Promise(r => setTimeout(r, 500));
        } catch (error: any) {
            console.error(`  ❌ Failed: ${error.message}`);
            failed++;
        }
    }

    console.log(`\n════════════════════════════════`);
    console.log(`📊 Results:`);
    console.log(`  ✅ Created: ${created}`);
    console.log(`  ⏭ Skipped (duplicates): ${skipped}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  📁 Total in DB: ${await Course.countDocuments()}`);
    console.log(`════════════════════════════════`);

    await mongoose.disconnect();
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
