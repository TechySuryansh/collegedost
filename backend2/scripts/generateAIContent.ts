import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from '../src/models/College';
import { generateCollegeContent, validatePlacementStats } from '../src/services/collegeAI';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/collegedost';

// Target specific slugs, or pass 'all' to generate for all colleges without AI content
const targetSlugs = process.argv[2] === 'all' ? null : (process.argv.slice(2).length > 0 ? process.argv.slice(2) : [
    'bits-pilani',
    'bits-pilani-goa-campus',
    'bits-pilani-hyderabad-campus',
    'vit-vellore',
    'vit-chennai',
    'vit-ap-university',
    'vit-bhopal-university',
]);

async function generateContent() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        console.log('API Key:', process.env.OPENAI_API_KEY?.slice(0, 8) + '...');

        let query: any = { aiGenerated: { $ne: true } };
        if (targetSlugs) {
            query = { slug: { $in: targetSlugs } };
        }

        const colleges = await College.find(query).select('name slug location type nirfRank coursesOffered aiGenerated');
        console.log(`Found ${colleges.length} colleges to process\n`);

        let success = 0;
        let failed = 0;

        for (const college of colleges) {
            try {
                console.log(`[${success + failed + 1}/${colleges.length}] Generating AI content for: ${college.name}...`);

                const fullCollege = await College.findById(college._id);
                if (!fullCollege) continue;

                const aiContent = await generateCollegeContent(fullCollege);

                // Validate placement stats
                if (aiContent.placementStats) {
                    aiContent.placementStats = validatePlacementStats(aiContent.placementStats);
                }

                // Update the college
                await College.findByIdAndUpdate(college._id, {
                    aiContent,
                    aiGenerated: true,
                    aiGeneratedAt: new Date(),
                    // Also update description if empty
                    ...(fullCollege.description ? {} : { description: aiContent.description }),
                    // Update facilities if empty
                    ...(fullCollege.facilities?.length ? {} : { facilities: aiContent.facilities }),
                    // Update placements if all zeros
                    ...(fullCollege.placements?.averagePackage ? {} : {
                        placements: {
                            averagePackage: aiContent.placementStats?.averagePackage || 0,
                            highestPackage: aiContent.placementStats?.highestPackage || 0,
                            placementPercentage: aiContent.placementStats?.placementRate || 0,
                        }
                    }),
                });

                console.log(`  ✓ Done! Highlights: ${aiContent.highlights?.length || 0}, FAQs: ${aiContent.faqs?.length || 0}, Facilities: ${aiContent.facilities?.length || 0}`);
                success++;

                // Rate limit: wait 1 second between requests
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error: any) {
                console.error(`  ✗ Failed: ${error.message}`);
                failed++;
            }
        }

        console.log(`\n=== Results ===`);
        console.log(`Success: ${success}`);
        console.log(`Failed: ${failed}`);
        console.log(`Total: ${colleges.length}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

generateContent();
