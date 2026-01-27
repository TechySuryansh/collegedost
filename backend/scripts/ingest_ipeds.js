/**
 * ingest_ipeds.js
 * 
 * Ingestion script for USA (IPEDS Data).
 * Supports IPEDS CSV (hd2024.csv).
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

async function ingestUSData(filePath) {
    log(`🚀 Starting US Ingestion from: ${path.basename(filePath)}`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let headers = [];
    let batch = [];
    let lineCount = 0;
    let savedCount = 0;

    for await (const line of rl) {
        if (!line.trim()) continue; 

        // CSV Regex Split
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, '').trim());

        if (lineCount === 0) {
            headers = values.map(h => h.toUpperCase());
            log(`Headers found: ${headers.join(', ')}`);
            lineCount++;
            continue;
        }

        const row = {};
        headers.forEach((h, i) => row[h] = values[i]);

        // Mapping Logic
        const typeMap = { '1': 'Public', '2': 'Private', '3': 'Private' };
        
        // Safety checks for required fields
        const instNm = row['INSTNM'] || row['COLLEGE NAME'];
        if (!instNm) continue;

        const collegeData = {
            name: toTitleCase(instNm),
            location: {
                city: toTitleCase(row['CITY'] || ''),
                state: row['STABBR'] || '',
                zip: row['ZIP'] || '',
                country: 'USA',
                address: toTitleCase(row['ADDR'] || ''),
                coordinates: {
                    lat: parseFloat(row['LATITUDE'] || 0),
                    lng: parseFloat(row['LONGITUD'] || 0)
                }
            },
            type: typeMap[row['CONTROL']] || ((row['SECTOR'] && row['SECTOR'].includes('Public')) ? 'Public' : 'Private'),
            website: row['WEBADDR'] ? (row['WEBADDR'].startsWith('http') ? row['WEBADDR'] : `https://${row['WEBADDR']}`) : '',
            dataSources: [{
                sourceName: 'IPEDS_RAW',
                sourceId: row['UNITID'],
                fetchedAt: new Date()
            }],
            fees: { currency: 'USD' }
        };

        // Generate Slug
        const slugBase = slugify(collegeData.name, { lower: true, strict: true });
        collegeData.slug = `${slugBase}-${row['UNITID']}`;

        batch.push({
            updateOne: {
                filter: { 
                    "dataSources.sourceId": row['UNITID'], 
                    "dataSources.sourceName": "IPEDS_RAW" 
                },
                update: { $set: collegeData },
                upsert: true
            }
        });

        // Flush Batch
        if (batch.length >= BATCH_SIZE) {
            try {
                await College.bulkWrite(batch, { ordered: false });
                savedCount += batch.length;
                if (savedCount % 1000 === 0) console.log(`Processed: ${savedCount} US colleges...`);
            } catch (e) {
                // Ignore duplicates
                console.log(`Batch Error (US): ${e.message}`);
            }
            batch = [];
        }
        lineCount++;
    }

    // Final Flush
    if (batch.length > 0) {
        try {
            await College.bulkWrite(batch, { ordered: false });
            savedCount += batch.length;
        } catch (e) {
            console.log(`Final Batch Error: ${e.message}`);
        }
    }

    log(`✨ Ingestion Complete! Total US Colleges: ${savedCount}`);
}

async function main() {
    log("Script Initialization...");
    await connectDB();

    const targetFile = path.resolve(__dirname, '../data/raw/hd2024.csv');
    
    try {
        await ingestUSData(targetFile);
    } catch (error) {
        log(`FATAL SCRIPT ERROR: ${error.stack}`);
    }
    log("Exiting...");
    process.exit(0);
}

main();
