require('dotenv').config();
const mongoose = require('mongoose');
const College = require('./src/models/College.model');

async function checkColleges() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Search for "National Institute of Technology" (actual NITs)
    const nits = await College.find({ 
        name: { $regex: /National Institute of Technology/i } 
    }).select('name slug');
    
    console.log('\n=== ACTUAL NITs (National Institute of Technology) ===');
    console.log('Found:', nits.length);
    nits.forEach(c => console.log(`- ${c.name}`));

    // Search for colleges containing "NIT" in name (may include false positives)
    const nitPattern = await College.find({ 
        name: { $regex: /NIT/i } 
    }).limit(20).select('name');
    
    console.log('\n=== Colleges containing "NIT" (including false positives) ===');
    console.log('Found:', nitPattern.length);
    nitPattern.forEach(c => console.log(`- ${c.name}`));

    // Check IITs
    const iits = await College.find({ 
        name: { $regex: /Indian Institute of Technology/i } 
    }).select('name');
    
    console.log('\n=== ACTUAL IITs (Indian Institute of Technology) ===');
    console.log('Found:', iits.length);
    iits.forEach(c => console.log(`- ${c.name}`));

    process.exit(0);
}

checkColleges();
