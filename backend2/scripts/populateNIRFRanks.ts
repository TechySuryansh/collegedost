import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import College from '../src/models/College';

dotenv.config();

// Fuzzy matching function
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const s2 = str2.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  let matchCount = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.some(w => w.includes(word) || word.includes(w))) {
      matchCount++;
    }
  }
  
  return matchCount / Math.max(words1.length, words2.length);
}

async function main() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/collegedost';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected!\n');

    // Load NIRF data
    const jsonPath = path.join(__dirname, '../data/nirf-2025-top-100.json');
    const nirfData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    console.log(`Loaded ${nirfData.length} NIRF rankings\n`);

    // Get all colleges
    const colleges = await College.find({}).select('_id name').lean();
    console.log(`Found ${colleges.length} colleges in database\n`);

    let matched = 0;
    let updated = 0;
    const unmatched: string[] = [];

    for (const nirf of nirfData) {
      let bestMatch: any = null;
      let bestScore = 0;

      for (const college of colleges) {
        const score = calculateSimilarity(nirf.name, college.name);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = college;
        }
      }

      if (bestScore >= 0.6) {
        matched++;
        try {
          await College.updateOne(
            { _id: bestMatch._id },
            { $set: { nirfRank: nirf.rank } }
          );
          updated++;
          console.log(`✓ Rank ${nirf.rank}: ${nirf.name} → ${bestMatch.name} (${(bestScore * 100).toFixed(0)}%)`);
        } catch (error) {
          console.error(`✗ Failed to update ${bestMatch.name}:`, error);
        }
      } else {
        unmatched.push(`${nirf.rank}. ${nirf.name}`);
        console.log(`✗ Rank ${nirf.rank}: ${nirf.name} - No match found`);
      }
    }

    console.log('\n========== Summary ==========');
    console.log(`Total NIRF institutions: ${nirfData.length}`);
    console.log(`Matched: ${matched}`);
    console.log(`Updated: ${updated}`);
    console.log(`Unmatched: ${unmatched.length}`);
    
    if (unmatched.length > 0) {
      console.log('\nUnmatched institutions:');
      unmatched.forEach(inst => console.log(`  ${inst}`));
    }
    
    console.log('=============================\n');
    console.log('✓ NIRF ranks populated successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
