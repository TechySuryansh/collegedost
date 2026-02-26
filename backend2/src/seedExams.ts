import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import Exam from './models/Exam';

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
// Exam names to generate — common Indian competitive exams
// ═══════════════════════════════════════════════════════
const EXAM_NAMES: string[] = [
    // Engineering
    'JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEEE', 'MET', 'COMEDK UGET', 'WBJEE', 'MHT CET', 'KCET',

    // Medical
    'NEET UG', 'NEET PG', 'AIIMS Nursing', 'JIPMER',

    // Management
    'CAT', 'XAT', 'MAT', 'CMAT', 'NMAT', 'SNAP', 'IIFT', 'MAH MBA CET', 'TISSNET',

    // Law
    'CLAT', 'AILET', 'LSAT India', 'MH CET Law',

    // Design & Fashion
    'NID DAT', 'UCEED', 'CEED', 'NIFT Entrance Exam',

    // Hotel Management
    'NCHMCT JEE',

    // Science & Research
    'NEST', 'IIT JAM', 'CUET UG', 'CUET PG', 'GATE',

    // Pharmacy
    'GPAT', 'NMIMS-NPAT',

    // Architecture
    'NATA',
];

function makeSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

async function generateExamData(examName: string): Promise<{
    conductingBody: string;
    examDates: string;
    eligibility: string;
    syllabus: string;
    pattern: string;
    prepTips: string[];
}> {
    const prompt = `You are an expert Indian education consultant. Generate detailed information for the following competitive exam in India.

EXAM NAME: ${examName}

OUTPUT ONLY VALID JSON with these exact fields:
{
  "conductingBody": "Name of the body that conducts the exam (e.g., 'NTA', 'IIT Madras')",
  "examDates": "Typical timeline or specific months for application and exam (e.g., 'Application in Dec-Jan, Exam in April')",
  "eligibility": "Basic eligibility criteria (e.g., '10+2 with 75% marks in PCM')",
  "syllabus": "Broad overview of subjects covered in the syllabus",
  "pattern": "Exam pattern (e.g., 'Computer Based Test, 3 hours, Multiple Choice Questions')",
  "prepTips": ["5-8 practical preparation tips for this specific exam"]
}

Be factual and specific to the Indian context. Output ONLY the JSON.`;

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

            content = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

            const parsed = JSON.parse(content);

            if (!parsed.conductingBody || !parsed.eligibility || !parsed.syllabus || !parsed.pattern || !parsed.prepTips) {
                throw new Error('Missing required fields in AI response');
            }

            return {
                conductingBody: parsed.conductingBody,
                examDates: parsed.examDates || 'Check official website',
                eligibility: parsed.eligibility,
                syllabus: parsed.syllabus,
                pattern: parsed.pattern,
                prepTips: Array.isArray(parsed.prepTips) ? parsed.prepTips : [],
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
    console.log(`📝 Processing ${EXAM_NAMES.length} exams using ${MODEL}...\n`);

    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < EXAM_NAMES.length; i++) {
        const name = EXAM_NAMES[i];
        const slug = makeSlug(name);

        console.log(`[${i + 1}/${EXAM_NAMES.length}] ${name} (${slug})`);

        const existing = await Exam.findOne({ slug });
        if (existing) {
            console.log(`  ⏭ Already exists, skipping`);
            skipped++;
            continue;
        }

        try {
            const data = await generateExamData(name);

            await Exam.create({
                name,
                slug,
                conductingBody: data.conductingBody,
                examDates: data.examDates,
                eligibility: data.eligibility,
                syllabus: data.syllabus,
                pattern: data.pattern,
                prepTips: data.prepTips,
            });

            console.log(`  ✅ Created`);
            created++;

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
    console.log(`  📁 Total in DB: ${await Exam.countDocuments()}`);
    console.log(`════════════════════════════════`);

    await mongoose.disconnect();
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
