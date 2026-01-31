require('dotenv').config();
const mongoose = require('mongoose');
const College = require('./src/models/College.model');

async function checkColleges() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Search for IITs
    const iits = await College.find({ 
        name: { $regex: 'IIT', $options: 'i' } 
    }).limit(15).select('name slug type');
    
    console.log('\n=== IITs Found:', iits.length, '===');
    iits.forEach(c => console.log(`- ${c.name}`));

    // Search for NITs
    const nits = await College.find({ 
        name: { $regex: 'NIT', $options: 'i' } 
    }).limit(15).select('name slug type');
    
    console.log('\n=== NITs Found:', nits.length, '===');
    nits.forEach(c => console.log(`- ${c.name}`));

    // Search for "Indian Institute of Technology"
    const fullIIT = await College.find({ 
        name: { $regex: 'Indian Institute of Technology', $options: 'i' } 
    }).limit(10).select('name');
    
    console.log('\n=== "Indian Institute of Technology" Found:', fullIIT.length, '===');
    fullIIT.forEach(c => console.log(`- ${c.name}`));

    // Total count
    const total = await College.countDocuments();
    console.log('\n=== Total Colleges:', total, '===');

    process.exit(0);
}

checkColleges();
