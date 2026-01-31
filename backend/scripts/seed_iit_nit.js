/**
 * Seed IITs, NITs, IIITs into the database
 * Run: node scripts/seed_iit_nit.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const College = require(path.resolve(__dirname, '../src/models/College.model'));

// IIT Data - All 23 IITs
const IITs = [
    { name: "Indian Institute of Technology Bombay", city: "Mumbai", state: "Maharashtra", type: "IIT" },
    { name: "Indian Institute of Technology Delhi", city: "New Delhi", state: "Delhi", type: "IIT" },
    { name: "Indian Institute of Technology Madras", city: "Chennai", state: "Tamil Nadu", type: "IIT" },
    { name: "Indian Institute of Technology Kanpur", city: "Kanpur", state: "Uttar Pradesh", type: "IIT" },
    { name: "Indian Institute of Technology Kharagpur", city: "Kharagpur", state: "West Bengal", type: "IIT" },
    { name: "Indian Institute of Technology Roorkee", city: "Roorkee", state: "Uttarakhand", type: "IIT" },
    { name: "Indian Institute of Technology Guwahati", city: "Guwahati", state: "Assam", type: "IIT" },
    { name: "Indian Institute of Technology Hyderabad", city: "Hyderabad", state: "Telangana", type: "IIT" },
    { name: "Indian Institute of Technology Indore", city: "Indore", state: "Madhya Pradesh", type: "IIT" },
    { name: "Indian Institute of Technology BHU Varanasi", city: "Varanasi", state: "Uttar Pradesh", type: "IIT" },
    { name: "Indian Institute of Technology Gandhinagar", city: "Gandhinagar", state: "Gujarat", type: "IIT" },
    { name: "Indian Institute of Technology Patna", city: "Patna", state: "Bihar", type: "IIT" },
    { name: "Indian Institute of Technology Ropar", city: "Rupnagar", state: "Punjab", type: "IIT" },
    { name: "Indian Institute of Technology Bhubaneswar", city: "Bhubaneswar", state: "Odisha", type: "IIT" },
    { name: "Indian Institute of Technology Jodhpur", city: "Jodhpur", state: "Rajasthan", type: "IIT" },
    { name: "Indian Institute of Technology Mandi", city: "Mandi", state: "Himachal Pradesh", type: "IIT" },
    { name: "Indian Institute of Technology Tirupati", city: "Tirupati", state: "Andhra Pradesh", type: "IIT" },
    { name: "Indian Institute of Technology Palakkad", city: "Palakkad", state: "Kerala", type: "IIT" },
    { name: "Indian Institute of Technology Bhilai", city: "Bhilai", state: "Chhattisgarh", type: "IIT" },
    { name: "Indian Institute of Technology Goa", city: "Ponda", state: "Goa", type: "IIT" },
    { name: "Indian Institute of Technology Jammu", city: "Jammu", state: "Jammu and Kashmir", type: "IIT" },
    { name: "Indian Institute of Technology Dharwad", city: "Dharwad", state: "Karnataka", type: "IIT" },
    { name: "Indian Institute of Technology (ISM) Dhanbad", city: "Dhanbad", state: "Jharkhand", type: "IIT" }
];

// NIT Data - All 31 NITs
const NITs = [
    { name: "National Institute of Technology Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", type: "NIT" },
    { name: "National Institute of Technology Surathkal", city: "Mangalore", state: "Karnataka", type: "NIT" },
    { name: "National Institute of Technology Warangal", city: "Warangal", state: "Telangana", type: "NIT" },
    { name: "National Institute of Technology Rourkela", city: "Rourkela", state: "Odisha", type: "NIT" },
    { name: "National Institute of Technology Calicut", city: "Kozhikode", state: "Kerala", type: "NIT" },
    { name: "National Institute of Technology Kurukshetra", city: "Kurukshetra", state: "Haryana", type: "NIT" },
    { name: "National Institute of Technology Durgapur", city: "Durgapur", state: "West Bengal", type: "NIT" },
    { name: "National Institute of Technology Allahabad", city: "Prayagraj", state: "Uttar Pradesh", type: "NIT" },
    { name: "National Institute of Technology Jamshedpur", city: "Jamshedpur", state: "Jharkhand", type: "NIT" },
    { name: "National Institute of Technology Silchar", city: "Silchar", state: "Assam", type: "NIT" },
    { name: "National Institute of Technology Hamirpur", city: "Hamirpur", state: "Himachal Pradesh", type: "NIT" },
    { name: "National Institute of Technology Jalandhar", city: "Jalandhar", state: "Punjab", type: "NIT" },
    { name: "National Institute of Technology Patna", city: "Patna", state: "Bihar", type: "NIT" },
    { name: "National Institute of Technology Raipur", city: "Raipur", state: "Chhattisgarh", type: "NIT" },
    { name: "National Institute of Technology Srinagar", city: "Srinagar", state: "Jammu and Kashmir", type: "NIT" },
    { name: "National Institute of Technology Nagpur", city: "Nagpur", state: "Maharashtra", type: "NIT" },
    { name: "National Institute of Technology Agartala", city: "Agartala", state: "Tripura", type: "NIT" },
    { name: "National Institute of Technology Arunachal Pradesh", city: "Yupia", state: "Arunachal Pradesh", type: "NIT" },
    { name: "National Institute of Technology Delhi", city: "New Delhi", state: "Delhi", type: "NIT" },
    { name: "National Institute of Technology Goa", city: "Farmagudi", state: "Goa", type: "NIT" },
    { name: "National Institute of Technology Manipur", city: "Imphal", state: "Manipur", type: "NIT" },
    { name: "National Institute of Technology Meghalaya", city: "Shillong", state: "Meghalaya", type: "NIT" },
    { name: "National Institute of Technology Mizoram", city: "Aizawl", state: "Mizoram", type: "NIT" },
    { name: "National Institute of Technology Nagaland", city: "Dimapur", state: "Nagaland", type: "NIT" },
    { name: "National Institute of Technology Puducherry", city: "Puducherry", state: "Puducherry", type: "NIT" },
    { name: "National Institute of Technology Sikkim", city: "Ravangla", state: "Sikkim", type: "NIT" },
    { name: "National Institute of Technology Surat", city: "Surat", state: "Gujarat", type: "NIT" },
    { name: "National Institute of Technology Uttarakhand", city: "Srinagar", state: "Uttarakhand", type: "NIT" },
    { name: "National Institute of Technology Andhra Pradesh", city: "Tadepalligudem", state: "Andhra Pradesh", type: "NIT" },
    { name: "Motilal Nehru National Institute of Technology Allahabad", city: "Prayagraj", state: "Uttar Pradesh", type: "NIT" },
    { name: "Maulana Azad National Institute of Technology Bhopal", city: "Bhopal", state: "Madhya Pradesh", type: "NIT" },
    { name: "Visvesvaraya National Institute of Technology Nagpur", city: "Nagpur", state: "Maharashtra", type: "NIT" },
    { name: "Sardar Vallabhbhai National Institute of Technology Surat", city: "Surat", state: "Gujarat", type: "NIT" }
];

// IIIT Data - Major IIITs
const IIITs = [
    { name: "Indian Institute of Information Technology Allahabad", city: "Prayagraj", state: "Uttar Pradesh", type: "IIIT" },
    { name: "Indian Institute of Information Technology Hyderabad", city: "Hyderabad", state: "Telangana", type: "IIIT" },
    { name: "Indian Institute of Information Technology Bangalore", city: "Bangalore", state: "Karnataka", type: "IIIT" },
    { name: "Indian Institute of Information Technology Delhi", city: "New Delhi", state: "Delhi", type: "IIIT" },
    { name: "Indian Institute of Information Technology Guwahati", city: "Guwahati", state: "Assam", type: "IIIT" },
    { name: "Indian Institute of Information Technology Pune", city: "Pune", state: "Maharashtra", type: "IIIT" },
    { name: "Indian Institute of Information Technology Lucknow", city: "Lucknow", state: "Uttar Pradesh", type: "IIIT" },
    { name: "Indian Institute of Information Technology Kota", city: "Kota", state: "Rajasthan", type: "IIIT" },
    { name: "Indian Institute of Information Technology Vadodara", city: "Vadodara", state: "Gujarat", type: "IIIT" },
    { name: "Indian Institute of Information Technology Sri City", city: "Sri City", state: "Andhra Pradesh", type: "IIIT" },
    { name: "Indian Institute of Information Technology Kancheepuram", city: "Kancheepuram", state: "Tamil Nadu", type: "IIIT" },
    { name: "Indian Institute of Information Technology Gwalior", city: "Gwalior", state: "Madhya Pradesh", type: "IIIT" },
    { name: "Indian Institute of Information Technology Jabalpur", city: "Jabalpur", state: "Madhya Pradesh", type: "IIIT" },
    { name: "Indian Institute of Information Technology Kalyani", city: "Kalyani", state: "West Bengal", type: "IIIT" },
    { name: "Indian Institute of Information Technology Una", city: "Una", state: "Himachal Pradesh", type: "IIIT" }
];

const seedColleges = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        const allColleges = [...IITs, ...NITs, ...IIITs];
        let createdCount = 0;
        let updatedCount = 0;

        console.log(`\n🚀 Seeding ${allColleges.length} colleges (${IITs.length} IITs, ${NITs.length} NITs, ${IIITs.length} IIITs)...\n`);

        for (const col of allColleges) {
            const slug = col.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            const result = await College.findOneAndUpdate(
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
                        type: col.type,
                        aliases: [col.type],
                        'location.city': col.city,
                        'location.state': col.state,
                        'location.country': 'India',
                        streams: ['Engineering'],
                        coursesOffered: [
                            { courseName: 'B.Tech', duration: '4 years', eligibility: 'JEE Main/Advanced' }
                        ],
                        ingestionMetadata: {
                            lastEnrichedAt: new Date(),
                            source: 'manual_seed'
                        }
                    }
                },
                { upsert: true, new: true }
            );
            
            if (result.isNew !== false) {
                createdCount++;
            } else {
                updatedCount++;
            }
        }

        console.log(`✅ IITs seeded: ${IITs.length}`);
        console.log(`✅ NITs seeded: ${NITs.length}`);
        console.log(`✅ IIITs seeded: ${IIITs.length}`);
        console.log(`\n📊 Summary: ${createdCount} created, ${updatedCount} updated`);

        // Verify
        const iitCount = await College.countDocuments({ type: 'IIT' });
        const nitCount = await College.countDocuments({ type: 'NIT' });
        const iiitCount = await College.countDocuments({ type: 'IIIT' });
        
        console.log(`\n📊 Database now has:`);
        console.log(`   - ${iitCount} IITs`);
        console.log(`   - ${nitCount} NITs`);
        console.log(`   - ${iiitCount} IIITs`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedColleges();
