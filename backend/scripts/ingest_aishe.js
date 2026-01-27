/**
 * ingest_aishe.js
 * 
 * Ingestion script for INDIA (AISHE Data).
 * Supports CSV files: 
 * 1. College-ALL COLLEGE.csv
 * 2. University-ALL UNIVERSITIES.csv
 * 
 * Handles preamble lines (garbage at top of file).
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const slugify = require('slugify'); 
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Logger
function log(msg) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${msg}`);
}

process.on('uncaughtException', (err) => {
    log(`UNCAUGHT EXCEPTION: ${err.message}\n${err.stack}`);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    log(`UNHANDLED REJECTION: ${reason}`);
    process.exit(1);
});

const College = require('../src/models/College.model');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegedost';
const BATCH_SIZE = 500;

async function connectDB() {
    try {
        log(`Connecting to MongoDB...`);
        await mongoose.connect(MONGO_URI);
        log("✅ MongoDB Connected");
    } catch (err) {
        log(`❌ DB Connection Error: ${err.message}`);
        process.exit(1);
    }
}

function toTitleCase(str) {
    if (!str) return "";
    return str.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ').trim();
}

async function processFile(filePath, fileType) {
    log(`\n🚀 Starting Ingestion for: ${path.basename(filePath)} (${fileType})`);
    
    if (!fs.existsSync(filePath)) {
        log(`❌ File not found: ${filePath}`);
        return;
    }

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let headers = [];
    let batch = [];
    let savedCount = 0;
    let lineCount = 0;

    for await (const line of rl) {
        let cleanLine = line.trim();
        if (lineCount === 0 && cleanLine.charCodeAt(0) === 0xFEFF) {
            cleanLine = cleanLine.slice(1);
        }
        if (!cleanLine) {
            lineCount++;
            continue;
        }

        // Split while handling quoted fields correctly
        const values = cleanLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, '').trim());

        // --- HEADER DETECTION ---
        if (headers.length === 0) {
            const potentialHeaders = values.map(h => h.toUpperCase());
            // Check for key columns to identify header row
            if (potentialHeaders.includes('AISHE CODE') || potentialHeaders.includes('AISHECODE')) {
                headers = potentialHeaders;
                log(`✅ Headers found on line ${lineCount + 1}: ${headers.join(', ')}`);
                lineCount++;
                continue; // Move to next line (data)
            } else {
                if (lineCount < 5) log(`Skipping preamble line ${lineCount + 1}: ${cleanLine.substring(0, 50)}...`);
            }
            lineCount++;
            continue; 
        }
        
        lineCount++;

        const row = {};
        headers.forEach((h, i) => {
            if (i < values.length) row[h] = values[i];
        });

        // --- MAPPING LOGIC ---
        const aisheCode = row['AISHE CODE'];
        const name = row['NAME'] || row['COLLEGE NAME'] || row['INSTITUTION NAME'];
        
        if (!aisheCode || !name) continue;

        let collegeData = {
            name: toTitleCase(name),
            location: {
                city: toTitleCase(row['DISTRICT'] || row['DISTRICT NAME'] || ''),
                state: toTitleCase(row['STATE'] || row['STATE NAME'] || ''),
                country: 'India',
                address: row['ADDRESS'] 
                    ? toTitleCase(row['ADDRESS']) 
                    : `${toTitleCase(row['DISTRICT'] || '')}, ${toTitleCase(row['STATE'] || '')}`
            },
            website: (row['WEBSITE'] && row['WEBSITE'] !== '0') ? row['WEBSITE'].toLowerCase() : '',
            details: {
                establishedYear: row['YEAR OF ESTABLISHMENT'] ? parseInt(row['YEAR OF ESTABLISHMENT']) : null,
                locationType: row['LOCATION'], // Rural/Urban
            },
            dataSources: [{
                sourceName: 'AISHE_2024',
                sourceId: aisheCode,
                fetchedAt: new Date()
            }],
            fees: { currency: 'INR' }
        };

        // Specific Logic
        if (fileType === 'UNIVERSITY') {
            collegeData.type = 'University';
        } else {
            // College File
            collegeData.type = 'College';
            
            // Refine type if possible
            const cType = row['COLLEGE TYPE'];
            if (cType && cType.includes('University')) {
                 collegeData.type = 'University';
            }

            collegeData.affiliation = {
                universityName: toTitleCase(row['UNIVERSITY NAME'] || ''),
                universityId: row['UNIVERSITY AISHE CODE']
            };

            const mgmt = row['MANEGEMENT'] || row['MANAGEMENT'];
            if (mgmt) {
                if (mgmt.toLowerCase().includes('govt') || mgmt.toLowerCase().includes('university')) {
                    collegeData.ownership = 'Public';
                } else {
                    collegeData.ownership = 'Private';
                }
            }
        }

        // Generate Slug
        // Ensure slug is unique-ish by appending partial ID if needed, but AISHE code is best.
        // Actually, we upsert based on ID, so slug changes are fine.
        const slugBase = slugify(collegeData.name, { lower: true, strict: true });
        collegeData.slug = `${slugBase}-${aisheCode.toLowerCase()}`;

        // Upsert Operation (ID-based is safest)
        batch.push({
            updateOne: {
                filter: { 
                    "dataSources.sourceId": aisheCode,
                    "dataSources.sourceName": "AISHE_2024"
                },
                update: { $set: collegeData },
                upsert: true
            }
        });

        if (batch.length >= BATCH_SIZE) {
            try {
                const result = await College.bulkWrite(batch, { ordered: false });
                savedCount += result.modifiedCount + result.upsertedCount; 
                console.log(`Processed: ${savedCount} ${fileType}s...`);
            } catch (e) {
                // With ordered: false, 'e' is thrown if there are errors, but successful ops are committed.
                // We need to calculate how many succeeded.
                const successes = batch.length - (e.writeErrors ? e.writeErrors.length : 0);
                savedCount += successes;
                log(`Batch Error (Partial Success: ${successes}/${batch.length}): ${e.message}`);
                fs.appendFileSync('ingest_error.log', `Batch Error: ${e.message}\n${JSON.stringify(e.writeErrors || {}, null, 2)}\n`);
            }
            batch = [];
        }
    }

    if (batch.length > 0) {
        try {
            await College.bulkWrite(batch, { ordered: false });
            savedCount += batch.length;
        } catch (e) {
            log(`Final Batch Error: ${e.message}`);
             // If ordered:false, some might have succeeded.
             // writeErrors contains details.
             savedCount += (batch.length - (e.writeErrors ? e.writeErrors.length : 0));
             fs.appendFileSync('ingest_error.log', `Final Batch Error: ${e.message}\n`);
        }
    }

    log(`✅ Finished ${fileType}. Total: ${savedCount}`);
}

async function main() {
    log("Script Initialization...");
    await connectDB();

    const rawDir = path.join(__dirname, '../data/raw');
    
    // 1. Process Universities
    const uniFile = path.join(rawDir, 'University-ALL UNIVERSITIES.csv');
    if (fs.existsSync(uniFile)) {
        await processFile(uniFile, 'UNIVERSITY');
    } else {
        log(`⚠️ University file missing: ${uniFile}`);
    }

    // 2. Process Colleges
    const colFile = path.join(rawDir, 'College-ALL COLLEGE.csv');
    if (fs.existsSync(colFile)) {
        await processFile(colFile, 'COLLEGE');
    } else {
        log(`⚠️ College file missing: ${colFile}`);
    }

    log("Exiting...");
    process.exit(0);
}

main();
