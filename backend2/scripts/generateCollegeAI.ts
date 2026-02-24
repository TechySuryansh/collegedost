import dotenv from 'dotenv';
import mongoose from 'mongoose';
import College from '../src/models/College';
import { generateCollegeContent, validatePlacementStats } from '../src/services/collegeAI';

dotenv.config();

const BATCH_SIZE = 20;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB.');

        if (!process.env.OPENAI_API_KEY) {
            console.error('ERROR: OPENAI_API_KEY is not set in .env');
            process.exit(1);
        }

        const total = await College.countDocuments({ $or: [{ aiGenerated: { $ne: true } }, { aiGenerated: { $exists: false } }] });
        console.log(`Found ${total} colleges without AI content.\n`);

        if (total === 0) {
            console.log('All colleges already have AI content. Exiting.');
            process.exit(0);
        }

        let processed = 0;
        let failed = 0;

        // Process in batches
        while (processed + failed < total) {
            const colleges = await College.find({
                $or: [{ aiGenerated: { $ne: true } }, { aiGenerated: { $exists: false } }]
            }).limit(BATCH_SIZE);

            if (colleges.length === 0) break;

            console.log(`\n--- Processing batch (${processed + 1} to ${processed + colleges.length} of ${total}) ---\n`);

            for (const college of colleges) {
                try {
                    console.log(`Generating AI content for: ${college.name}...`);

                    const aiContent = await generateCollegeContent(college);
                    aiContent.placementStats = validatePlacementStats(aiContent.placementStats);

                    await College.findByIdAndUpdate(college._id, {
                        aiContent,
                        aiGenerated: true,
                        aiGeneratedAt: new Date()
                    });

                    processed++;
                    console.log(`  ✅ Done (${processed}/${total})`);

                    // Small delay between requests to avoid rate limits
                    await sleep(500);
                } catch (error: any) {
                    failed++;
                    console.error(`  ❌ Failed for "${college.name}": ${error.message}`);
                }
            }
        }

        console.log(`\n========================================`);
        console.log(`Batch generation complete.`);
        console.log(`  ✅ Processed: ${processed}`);
        console.log(`  ❌ Failed: ${failed}`);
        console.log(`  📊 Total: ${total}`);
        console.log(`========================================\n`);

        process.exit(0);
    } catch (error: any) {
        console.error(`Fatal error: ${error.message}`);
        process.exit(1);
    }
};

run();
