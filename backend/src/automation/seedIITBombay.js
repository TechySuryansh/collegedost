require('dotenv').config({ path: '../../.env' }); // Adjust path as needed
const mongoose = require('mongoose');
const College = require('../models/College.model');

const iitBombayData = {
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    aliases: ["IITB", "IIT Bombay"],
    location: {
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400076",
        country: "India",
        address: "Powai, Mumbai, Maharashtra 400076",
        coordinates: { lat: 19.1334, lng: 72.9133 },
        mapUrl: "https://maps.google.com/?q=IIT+Bombay"
    },
    type: "Public",
    estYear: 1958,
    website: "https://www.iitb.ac.in",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/1200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
    bannerImage: "https://images.shiksha.com/mediadata/images/1572948773phpOs7jCg.jpeg",
    overview: `
        <p>Indian Institute of Technology Bombay (IIT Bombay), set up in 1958, is recognized worldwide as a leader in the field of engineering education and research. It is known for the outstanding calibre of students graduating from its undergraduate and postgraduate programmes.</p>
        <p>The institute has 15 academic departments, 39 centres, one school and four interdisciplinary programmes. It offers a wide range of courses in engineering, pure sciences, design, management and humanities.</p>
        <p>IIT Bombay is an "Institute of Eminence" as declared by the Government of India. It ranks among the top universities globally.</p>
    `,
    highlights: [
        "Ranked #3 in NIRF Engineering 2024",
        "Institute of Eminence Status",
        "550-acre lush green campus in Powai",
        "Strongest Alumni Network in India",
        "Highest Package: ₹3.67 Crore PA (International)"
    ],
    nirfRank: 3,
    rankings: [
        { source: "NIRF", year: 2024, rank: 3, category: "Engineering" },
        { source: "NIRF", year: 2024, rank: 1, category: "Innovation" },
        { source: "QS World", year: 2024, rank: 149, category: "Overall" }
    ],
    infrastructure: {
        description: "IIT Bombay provides state-of-the-art infrastructure for academics and research. The campus is a mini-township with all modern amenities.",
        facilities: [
            { name: "Central Library", icon: "FaBook", description: "One of the largest libraries in Asia with over 4.5 lakh books." },
            { name: "Hostels", icon: "FaBed", description: "18 hostels with high-speed internet, mess, and gym facilities." },
            { name: "Sports Complex", icon: "FaRunning", description: "Olympic-sized swimming pool, tennis courts, and cricket ground." },
            { name: "Tech Park", icon: "FaMicrochip", description: "Research park for industry-academia collaboration." },
            { name: "Hospital", icon: "FaHospital", description: "Full-fledged campus hospital for students and staff." }
        ],
        images: [
            "https://www.iitb.ac.in/sites/www.iitb.ac.in/files/carousel/Main-Building.jpg",
            "https://www.iitb.ac.in/sites/www.iitb.ac.in/files/carousel/LHC.jpg",
            "https://www.iitb.ac.in/sites/www.iitb.ac.in/files/carousel/Library.jpg"
        ]
    },
    admissionProcess: {
        description: "Admission to B.Tech is through JEE Advanced. Admission to M.Tech is through GATE, and MBA via CAT.",
        eligibility: "Class 12th with Physics, Chemistry, Maths (75% aggregate) + JEE Advanced Rank.",
        documentsRequired: ["JEE Advanced Admit Card", "Class 10 & 12 Marksheets", "Category Certificate (if applicable)", "Seat Acceptance Letter"],
        importantDates: [
            { label: "JEE Main 2026 Session 1", date: "Jan 24 - Feb 01, 2026" },
            { label: "JEE Advanced 2026", date: "May 26, 2026" },
            { label: "JoSAA Counselling Starts", date: "June 15, 2026" }
        ]
    },
    fees: {
        tuition: 220000,
        currency: "INR",
        note: "Per Year (approx) for B.Tech. Exemptions available for SC/ST and economically weaker sections."
    },
    placementStats: {
        year: 2024,
        highestPackage: "₹3.67 Crore (International)",
        averagePackage: "₹23.5 Lakhs",
        medianPackage: "₹19.6 Lakhs",
        placementRate: 88,
        topRecruiters: ["Google", "Microsoft", "Apple", "Qualcomm", "Goldman Sachs", "TATA", "Uber"],
        sectorWiseSplit: [
            { sector: "Engineering & Technology", percentage: 40 },
            { sector: "IT / Software", percentage: 25 },
            { sector: "Finance", percentage: 15 },
            { sector: "Consulting", percentage: 10 }
        ]
    },
    coursesOffered: [
        { courseName: "B.Tech Computer Science & Engineering", duration: "4 Years", fee: 900000, eligibility: "JEE Advanced", seats: 150, examAccepted: "JEE Advanced" },
        { courseName: "B.Tech Electrical Engineering", duration: "4 Years", fee: 900000, eligibility: "JEE Advanced", seats: 90, examAccepted: "JEE Advanced" },
        { courseName: "B.Tech Mechanical Engineering", duration: "4 Years", fee: 900000, eligibility: "JEE Advanced", seats: 120, examAccepted: "JEE Advanced" },
        { courseName: "B.Tech Civil Engineering", duration: "4 Years", fee: 900000, eligibility: "JEE Advanced", seats: 130, examAccepted: "JEE Advanced" },
        { courseName: "B.Tech Aerospace Engineering", duration: "4 Years", fee: 900000, eligibility: "JEE Advanced", seats: 60, examAccepted: "JEE Advanced" },
        { courseName: "M.Tech Computer Science", duration: "2 Years", fee: 100000, eligibility: "GATE", seats: 60, examAccepted: "GATE" },
        { courseName: "MBA", duration: "2 Years", fee: 800000, eligibility: "CAT", seats: 120, examAccepted: "CAT" }
    ],
    galleries: [
        "https://upload.wikimedia.org/wikipedia/commons/2/23/IIT_Bombay_Main_Building_01.jpg",
        "https://www.iitb.ac.in/sites/www.iitb.ac.in/files/carousel/som.jpg"
    ]
};

async function seed() {
    try {
        await mongoose.connect('mongodb+srv://collegedost:collegedost_db@bhumit.4jfsdnd.mongodb.net/collegedost?appName=bhumit');
        console.log('MongoDB Connected');

        // Delete existing if any (to update)
        await College.deleteOne({ slug: 'iit-bombay' });

        const iitb = new College(iitBombayData);
        await iitb.save();

        console.log('✅ IIT Bombay Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
