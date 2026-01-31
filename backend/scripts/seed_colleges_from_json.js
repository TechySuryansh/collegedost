/**
 * Seed Colleges from careers360_data.json
 * Run: node scripts/seed_colleges_from_json.js
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const College = require(path.resolve(__dirname, '../src/models/College.model'));

const JSON_FILE = path.join(__dirname, '../src/automation/careers360_data.json');

const seedColleges = async () => {
    try {
        // Check if file exists
        if (!fs.existsSync(JSON_FILE)) {
            console.error('❌ careers360_data.json not found at:', JSON_FILE);
            process.exit(1);
        }

        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Read JSON data
        console.log('Reading careers360_data.json...');
        const rawData = fs.readFileSync(JSON_FILE, 'utf-8');
        const data = JSON.parse(rawData);
        
        console.log(`📊 Found ${data.totalColleges} colleges in JSON file`);
        console.log(`📅 Scraped at: ${data.scrapedAt}`);

        const allColleges = data.colleges;
        let savedCount = 0;
        let errorCount = 0;

        console.log('\n🚀 Starting database ingestion...\n');

        for (const col of allColleges) {
            try {
                // Parse location
                let state = null;
                let city = null;
                if (col.location) {
                    const parts = col.location.split(',').map(s => s.trim());
                    if (parts.length > 1) {
                        state = parts[parts.length - 1];
                        city = parts[0];
                    }
                }

                // Parse Fees
                let feeAmount = 0;
                if (col.fees) {
                    const match = col.fees.replace(/,/g, '').match(/(\d+)/);
                    if (match) feeAmount = parseInt(match[1]);
                }

                // Parse Streams from courses
                const streams = new Set();
                if (col.courses && Array.isArray(col.courses)) {
                    col.courses.forEach(c => {
                        const ln = c.toLowerCase();
                        if (ln.includes('tech') || ln.includes('eng') || ln.includes('b.e')) streams.add('Engineering');
                        if (ln.includes('medical') || ln.includes('mbbs') || ln.includes('nursing')) streams.add('Medical');
                        if (ln.includes('management') || ln.includes('mba') || ln.includes('bba')) streams.add('Management');
                        if (ln.includes('arts') || ln.includes('ba ')) streams.add('Arts');
                        if (ln.includes('science') || ln.includes('bsc') || ln.includes('b.sc')) streams.add('Science');
                        if (ln.includes('law') || ln.includes('llb')) streams.add('Law');
                        if (ln.includes('commerce') || ln.includes('bcom') || ln.includes('b.com')) streams.add('Commerce');
                        if (ln.includes('design') || ln.includes('fashion')) streams.add('Design');
                        if (ln.includes('pharmacy') || ln.includes('pharm')) streams.add('Pharmacy');
                        if (ln.includes('hotel') || ln.includes('hospitality')) streams.add('Hotel Management');
                    });
                }

                // Generate slug from name
                const slug = col.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');

                await College.findOneAndUpdate(
                    { 
                        $or: [
                            { name: col.name },
                            { slug: slug }
                        ]
                    },
                    {
                        $set: {
                            name: col.name,
                            slug: slug,
                            type: col.ownership || 'Private',
                            'location.address': col.location,
                            'location.city': city,
                            'location.state': state,
                            'location.country': 'India',
                            website: col.url,
                            streams: Array.from(streams),
                            coursesOffered: col.courses ? col.courses.map(c => ({
                                courseName: c,
                                fee: feeAmount,
                                duration: "Check Website",
                                eligibility: "Check Website"
                            })) : [],
                            ingestionMetadata: {
                                lastEnrichedAt: new Date(),
                                source: 'careers360_json'
                            }
                        }
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                
                savedCount++;
                
                // Progress indicator
                if (savedCount % 100 === 0) {
                    process.stdout.write(`\r⏳ Processed: ${savedCount}/${allColleges.length}`);
                }
                
            } catch (err) {
                errorCount++;
                if (errorCount <= 5) {
                    console.error(`\n⚠️ Error saving ${col.name}:`, err.message);
                }
            }
        }

        console.log(`\n\n✅ Successfully seeded ${savedCount} colleges!`);
        if (errorCount > 0) {
            console.log(`⚠️ Errors: ${errorCount}`);
        }

        // Verify count
        const totalInDb = await College.countDocuments();
        console.log(`📊 Total colleges now in database: ${totalInDb}`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

seedColleges();
