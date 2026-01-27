const axios = require('axios');
const cheerio = require('cheerio');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');
const cron = require('node-cron');
const stringSimilarity = require('string-similarity');
require('dotenv').config({ path: '../.env' }); 

const NirfRanking = require('../models/NirfRanking.model');
const College = require('../models/College.model'); 

// --- CONFIGURATION ---
const BASE_URL = 'https://www.nirfindia.org';
const CATEGORIES = [
  'Engineering',
  'Management',
  'Medical',
  'Law',
  'Pharmacy',
  'Overall'
];

// --- HELPER: Detect Latest Year ---
const detectLatestYear = async () => {
    try {
        const { data } = await axios.get(BASE_URL);
        const $ = cheerio.load(data);
        // Look for links like "India Rankings 2024"
        let latestYear = new Date().getFullYear();
        
        $('a').each((i, el) => {
            const text = $(el).text().trim();
            const yearMatch = text.match(/India Rankings (\d{4})/i);
            if (yearMatch) {
                const year = parseInt(yearMatch[1]);
                if (year > latestYear || year === latestYear || year === latestYear - 1) {
                     latestYear = year; 
                }
            }
        });
        
        console.log(`[NIRF] Detected Year: ${latestYear}`);
        return latestYear;
    } catch (err) {
        console.error('[NIRF] Failed to detect year. Defaulting to current.', err.message);
        return new Date().getFullYear();
    }
};

// --- HELPER: College Matcher ---
const matchCollege = (nirfName, dbColleges) => {
    const collegeNames = dbColleges.map(c => c.name);
    
    // 1. Exact Match
    const exact = dbColleges.find(c => c.name.toLowerCase() === nirfName.toLowerCase());
    if (exact) return exact;

    // 2. Fuzzy Match
    const matches = stringSimilarity.findBestMatch(nirfName, collegeNames);
    const best = matches.bestMatch;

    if (best.rating > 0.75) { 
        return dbColleges.find(c => c.name === best.target);
    }
    
    return null;
};

// --- CORE: Ingest Category ---
const ingestCategory = async (year, category, dbColleges) => {
    console.log(`[NIRF] Processing ${category} - ${year}...`);
    
    try {
        const landingUrl = `${BASE_URL}/${year}/${category}Ranking.html` 
        
        let rankings = [];

        // --- RELIABLE PARSING (HTML) ---
        const { data: pageHtml } = await axios.get(landingUrl);
        const $ = cheerio.load(pageHtml);
        
        $('table tbody tr').each((i, row) => {
            const cols = $(row).find('td');
            if(cols.length > 0) {
                 const name = $(cols[1]).text().trim(); 
                 const score = parseFloat($(cols[4]).text().trim());
                 const rankVal = $(cols[5]).text().trim(); 
                 const rank = parseInt(rankVal.replace(/\D/g, '')); 

                 if (name && rank) {
                     rankings.push({
                         instituteName: name,
                         rank: rank,
                         score: score || 0
                     });
                 }
            }
        });

        console.log(`[NIRF] Extracted ${rankings.length} rankings for ${category}. Processing DB...`);
        
        for (const record of rankings) {
            const matchedCollege = matchCollege(record.instituteName, dbColleges);
            
            if (matchedCollege) {
                await NirfRanking.findOneAndUpdate(
                    { 
                        collegeSlug: matchedCollege.slug, 
                        category: category, 
                        year: year 
                    },
                    {
                        collegeSlug: matchedCollege.slug,
                        instituteName: record.instituteName,
                        category: category,
                        year: year,
                        rank: record.rank,
                        score: record.score,
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );
            }
        }

    } catch (err) {
        console.error(`[NIRF] Error processing ${category}:`, err.message);
    }
};

// --- MAIN RUNNER ---
const runIngestion = async () => {
    console.log('=== STARTING NIRF INGESTION ===');
    
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegedost');
    }

    const year = await detectLatestYear();
    console.log(`[NIRF] Target Year: ${year}`);

    const dbColleges = await College.find({}).select('name slug location').lean();
    console.log(`[NIRF] Loaded ${dbColleges.length} colleges for matching.`);

    for (const category of CATEGORIES) {
        await ingestCategory(year, category, dbColleges);
    }

    console.log('=== NIRF INGESTION COMPLETE ===');
};

// --- CRON SETUP ---
const initCron = () => {
    cron.schedule('0 0 1 8 *', () => {
        console.log('[CRON] Triggering Annual NIRF Ingestion');
        runIngestion();
    });
    console.log('[CRON] NIRF Ingestion Scheduled (Annual)');
};

if (require.main === module) {
    runIngestion().then(() => {
        console.log("Done.");
        process.exit(0);
    });
}

module.exports = { initCron, runIngestion };
