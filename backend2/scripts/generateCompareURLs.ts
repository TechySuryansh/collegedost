import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import College from '../src/models/College';

dotenv.config();

const generateCompareURLs = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected.');

        console.log('Fetching top 20 colleges by NIRF rank...');
        const colleges = await College.find({
            nirfRank: { $ne: null, $gt: 0 }
        })
            .sort({ nirfRank: 1 })
            .limit(20)
            .select('name slug nirfRank');

        if (colleges.length < 2) {
            console.log('Not enough colleges found to compare.');
            process.exit(0);
        }

        console.log(`Found ${colleges.length} colleges.`);

        const comparisons: any[] = [];

        // Generate academic pairings (order doesn't strictly matter for URL, but we'll do unique pairs)
        for (let i = 0; i < colleges.length; i++) {
            for (let j = i + 1; j < colleges.length; j++) {
                const c1 = colleges[i];
                const c2 = colleges[j];

                comparisons.push({
                    college1: c1.slug,
                    college2: c2.slug,
                    names: `${c1.name} vs ${c2.name}`,
                    url: `/tools/compare-colleges?college1=${c1.slug}&college2=${c2.slug}`
                });
            }
        }

        const outputPath = path.join(__dirname, '..', 'collegedost_compares.json');
        fs.writeFileSync(outputPath, JSON.stringify(comparisons, null, 2));

        console.log(`Successfully generated ${comparisons.length} comparison URLs.`);
        console.log(`Saved to: ${outputPath}`);

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

generateCompareURLs();
