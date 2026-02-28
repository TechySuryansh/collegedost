import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './src/models/College';
import connectDB from './src/config/db';

dotenv.config();

const designColleges = [
    {
        name: "National Institute of Design (NID)",
        city: "Ahmedabad",
        state: "Gujarat",
        nirfRank: 1, // Assumed top for Design
        type: "Government"
    },
    {
        name: "National Institute of Fashion Technology (NIFT)",
        city: "New Delhi",
        state: "Delhi",
        nirfRank: 2,
        type: "Government"
    },
    {
        name: "IDC School of Design, IIT Bombay",
        city: "Mumbai",
        state: "Maharashtra",
        nirfRank: 3,
        type: "Government"
    },
    {
        name: "Department of Design, IIT Delhi",
        city: "New Delhi",
        state: "Delhi",
        nirfRank: 4,
        type: "Government"
    },
    {
        name: "Srishti Manipal Institute of Art, Design and Technology",
        city: "Bangalore",
        state: "Karnataka",
        nirfRank: 5,
        type: "Private"
    },
    {
        name: "Pearl Academy",
        city: "New Delhi",
        state: "Delhi",
        nirfRank: 6,
        type: "Private"
    },
    {
        name: "Unitedworld Institute of Design (UID)",
        city: "Gandhinagar",
        state: "Gujarat",
        nirfRank: 7,
        type: "Private"
    },
    {
        name: "NID Bangalore",
        city: "Bangalore",
        state: "Karnataka",
        nirfRank: 8,
        type: "Government"
    },
    {
        name: "NIFT Mumbai",
        city: "Mumbai",
        state: "Maharashtra",
        nirfRank: 9,
        type: "Government"
    },
    {
        name: "NIFT Bangalore",
        city: "Bangalore",
        state: "Karnataka",
        nirfRank: 10,
        type: "Government"
    }
];

const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 120);
};

const seedDesign = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        for (const col of designColleges) {
            const slug = generateSlug(col.name);

            // Upsert based on slug
            await College.findOneAndUpdate(
                { slug },
                {
                    name: col.name,
                    slug,
                    location: {
                        city: col.city,
                        state: col.state,
                        country: "India"
                    },
                    nirfRank: col.nirfRank,
                    type: col.type,
                    institutionCategory: "Design",
                    description: `${col.name} is a premier design institute located in ${col.city}, ${col.state}.`,
                    rating: 4.5,
                    placements: {
                        averagePackage: 800000,
                        highestPackage: 1500000,
                        placementPercentage: 90
                    },
                    aiGenerated: false
                },
                { upsert: true, new: true }
            );
            console.log(`Seeded: ${col.name}`);
        }

        console.log('Design colleges seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding Design colleges:', error);
        process.exit(1);
    }
};

seedDesign();
