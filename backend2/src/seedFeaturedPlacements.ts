import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './models/College';
import connectDB from './config/db';

dotenv.config();

const featuredPlacements = [
    { name: "Indian Institute of Technology, Madras", avg: 2148000, high: 6600000 },
    { name: "Indian Institute of Technology Delhi", avg: 2190000, high: 20000000 },
    { name: "Indian Institute of Technology Bombay", avg: 2270000, high: 33000000 },
    { name: "Indian Institute of Management Ahmedabad", avg: 3270000, high: 11500000 },
    { name: "Indian Institute of Management Bangalore", avg: 3380000, high: 11500000 },
    { name: "All India Institute of Medical Sciences, New Delhi", avg: 1240000, high: 2400000 },
    { name: "National Law School of India University, Bangalore", avg: 1600000, high: 2500000 },
    { name: "Birla Institute of Technology & Science -Pilani", avg: 1820000, high: 6075000 },
    { name: "Vellore Institute of Technology", avg: 900000, high: 10200000 },
    { name: "Indian Institute of Technology, Kanpur", avg: 2627000, high: 19000000 },
    { name: "Indian Institute of Management Calcutta", avg: 3507000, high: 12000000 },
    { name: "Indian Institute of Management Lucknow", avg: 3220000, high: 10000000 },
    { name: "SVKM`s Narsee Monjee Institute of Management Studies", avg: 2663000, high: 6780000 },
    { name: "S. P. Jain Institute of Management and Research", avg: 3300000, high: 7780000 },
    { name: "K.J.Somaiya Institute of Management", avg: 1230000, high: 2650000 },
    { name: "SYMBIOSIS Institute of Business Management", avg: 2670000, high: 3500000 },
    { name: "Jamia Hamdard", avg: 1200000, high: 2200000 },
    { name: "National Law University, Delhi", avg: 1900000, high: 4000000 },
    { name: "POST GRADUATE INSTITUTE OF MEDICAL EDUCATION AND RESEARCH AND CAPITAL HOSPITAL, BHUBANESWAR", avg: 1500000, high: 2500000 },
    { name: "PANJAB UNIVERSITY CONSTITUENT COLLEGE ,DHARAMKOT,MOGA", avg: 600000, high: 1000000 }
];

async function seedFeaturedPlacements() {
    try {
        await connectDB();
        console.log('🚀 Seeding real-time placement data for featured colleges...');

        for (const data of featuredPlacements) {
            // Try robust matching: exact, then without comma, then with comma
            const nameVariations = [
                data.name,
                data.name.replace(/, /g, ' '),
                data.name.replace(/ (Madras|Delhi|Bombay|Kanpur|Kharagpur|Roorkee|Guwahati|Hyderabad|Indore|Patna|Mandi|Jodhpur|Ropar|Bhubaneswar|Gandhinagar|Jammu|Palakkad|Tirupati|Bhilai|Dharwad)/g, ', $1')
            ];

            let college = null;
            for (const name of nameVariations) {
                college = await College.findOne({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
                if (college) break;
            }

            if (!college) {
                // Last resort: partial match
                college = await College.findOne({ name: new RegExp(data.name.split(' ').slice(0, 4).join(' '), 'i') });
            }

            if (college) {
                await College.updateOne(
                    { _id: college._id },
                    {
                        $set: {
                            placements: {
                                averagePackage: data.avg,
                                highestPackage: data.high,
                                placementPercentage: 90
                            }
                        }
                    }
                );
                console.log(`✅ Updated ${data.name}: Avg ${data.avg}, High ${data.high}`);
            } else {
                console.warn(`⚠️ College not found: ${data.name}`);
            }
        }

        console.log('\n🎉 Placement seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding placements:', error);
        process.exit(1);
    }
}

seedFeaturedPlacements();
