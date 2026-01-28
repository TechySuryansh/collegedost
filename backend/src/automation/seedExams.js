require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const Exam = require('../models/Exam.model');

// Data extracted from Careers360 for JEE Main 2026
const jeeMainData = {
    examName: "JEE Main",
    examSlug: "jee-main",
    conductingAuthority: "National Testing Agency (NTA)",
    examLevel: "National",
    description: "Joint Entrance Examination (Main) is a national level entrance exam conducted by NTA for admission to B.E./B.Tech, B.Arch, and B.Planning courses at NITs, IIITs, and CFTIs.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/NTA_logo.svg/1200px-NTA_logo.svg.png",

    // Overview HTML
    details: `
        <p>The <strong>Joint Entrance Examination (Main)</strong>, popularly known as JEE Main, is the gateway to undergraduate engineering programs at NITs, IIITs, and other Centrally Funded Technical Institutes (CFTIs). It also serves as the eligibility test for <strong>JEE Advanced</strong>, which corresponds to admission to the prestigious Indian Institutes of Technology (IITs).</p>
        
        <h3 class="text-lg font-bold mt-4 mb-2">JEE Main 2026 Key Highlights</h3>
        <ul class="list-disc pl-5 space-y-1">
             <li><strong>Sessions:</strong> Two sessions per year (January & April).</li>
             <li><strong>Mode:</strong> Computer Based Test (CBT).</li>
             <li><strong>Duration:</strong> 3 Hours (4 Hours for PwD candidates).</li>
             <li><strong>Papers:</strong> Paper 1 (B.E./B.Tech), Paper 2A (B.Arch), Paper 2B (B.Planning).</li>
             <li><strong>Languages:</strong> English, Hindi, Assamese, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu, and Urdu.</li>
        </ul>

        <h3 class="text-lg font-bold mt-4 mb-2">Why Take JEE Main?</h3>
        <p>JEE Main acts as a single window for admission to 31 NITs, 25 IIITs, and 28 Government Funded Technical Institutes (GFTIs). Top 2.5 Lakh rank holders are eligible to sit for JEE Advanced.</p>
    `,

    // Syllabus HTML
    syllabus: `
        <h3 class="text-lg font-bold mb-2 text-brand-blue">Mathematics</h3>
        <ul class="list-disc pl-5 mb-4 space-y-1">
            <li>Sets, Relations, and Functions</li>
            <li>Complex Numbers and Quadratic Equations</li>
            <li>Matrices and Determinants</li>
            <li>Permutations and Combinations</li>
            <li>Binomial Theorem</li>
            <li>Sequence and Series</li>
            <li>Limits, Continuity, and Differentiability</li>
            <li>Integral Calculus & Differential Equations</li>
            <li>Coordinate Geometry (Straight Lines, Circles, Conic Sections)</li>
            <li>Three Dimensional Geometry & Vector Algebra</li>
            <li>Statistics and Probability</li>
            <li>Trigonometry</li>
        </ul>

        <h3 class="text-lg font-bold mb-2 text-brand-blue">Physics</h3>
        <ul class="list-disc pl-5 mb-4 space-y-1">
            <li>Physics and Measurement</li>
            <li>Kinematics</li>
            <li>Laws of Motion</li>
            <li>Work, Energy, and Power</li>
            <li>Rotational Motion</li>
            <li>Gravitation</li>
            <li>Properties of Solids and Liquids</li>
            <li>Thermodynamics & Kinetic Theory of Gases</li>
            <li>Oscillations and Waves</li>
            <li>Electrostatics & Current Electricity</li>
            <li>Magnetic Effects of Current and Magnetism</li>
            <li>Electromagnetic Induction and Alternating Currents</li>
            <li>Optics (Ray & Wave)</li>
            <li>Dual Nature of Matter and Radiation</li>
            <li>Atoms and Nuclei</li>
            <li>Electronic Devices</li>
        </ul>

        <h3 class="text-lg font-bold mb-2 text-brand-blue">Chemistry</h3>
        <p class="font-bold mt-2">Physical Chemistry:</p>
        <ul class="list-disc pl-5 mb-2 space-y-1">
            <li>Some Basic Concepts in Chemistry</li>
            <li>Atomic Structure</li>
            <li>Chemical Bonding and Molecular Structure</li>
            <li>Chemical Thermodynamics</li>
            <li>Solutions</li>
            <li>Equilibrium</li>
            <li>Redox Reactions and Electrochemistry</li>
            <li>Chemical Kinetics</li>
        </ul>
        <p class="font-bold mt-2">Inorganic Chemistry:</p>
        <ul class="list-disc pl-5 mb-2 space-y-1">
            <li>Classification of Elements and Periodicity</li>
            <li>p-Block Elements</li>
            <li>d- and f- Block Elements</li>
            <li>Coordination Compounds</li>
        </ul>
        <p class="font-bold mt-2">Organic Chemistry:</p>
        <ul class="list-disc pl-5 mb-2 space-y-1">
            <li>Purification and Characterisation of Organic Compounds</li>
            <li>Some Basic Principles of Organic Chemistry</li>
            <li>Hydrocarbons</li>
            <li>Organic Compounds Containing Halogens, Oxygen, Nitrogen</li>
            <li>Biomolecules</li>
            <li>Principles Related to Practical Chemistry</li>
        </ul>
    `,

    // Exam Pattern HTML
    examPattern: `
        <table class="w-full text-sm border border-gray-200 mt-2">
            <thead class="bg-gray-100 font-bold">
                <tr>
                    <th class="p-2 border">Section</th>
                    <th class="p-2 border">No. of Questions</th>
                    <th class="p-2 border">Marks</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="p-2 border">Mathematics</td>
                    <td class="p-2 border">20 (MCQ) + 10* (Numerical)</td>
                    <td class="p-2 border">100</td>
                </tr>
                <tr>
                    <td class="p-2 border">Physics</td>
                    <td class="p-2 border">20 (MCQ) + 10* (Numerical)</td>
                    <td class="p-2 border">100</td>
                </tr>
                <tr>
                    <td class="p-2 border">Chemistry</td>
                    <td class="p-2 border">20 (MCQ) + 10* (Numerical)</td>
                    <td class="p-2 border">100</td>
                </tr>
                <tr class="bg-blue-50 font-bold">
                    <td class="p-2 border">Total</td>
                    <td class="p-2 border">90 Questions</td>
                    <td class="p-2 border">300 Marks</td>
                </tr>
            </tbody>
        </table>
        <p class="text-xs mt-2 text-gray-500">*Candidates need to attempt only 5 out of 10 Numerical Value questions in each subject.</p>
        
        <h4 class="font-bold mt-4">Marking Scheme:</h4>
        <ul class="list-disc pl-5">
            <li><strong>+4</strong> for every correct answer.</li>
            <li><strong>-1</strong> for every incorrect answer (Negative Marking).</li>
            <li><strong>0</strong> for unattempted questions.</li>
        </ul>
    `,

    // Eligibility HTML
    eligibility: `
        <h4 class="font-bold mb-2">Age Limit:</h4>
        <p>There is <strong>no age limit</strong> for the candidates. The candidates who have passed the class 12/equivalent examination in 2024, 2025, or appearing in 2026 irrespective of their age can appear in JEE (Main) - 2026 examination.</p>
        
        <h4 class="font-bold mt-4 mb-2">Qualifying Examination:</h4>
        <ul class="list-disc pl-5 space-y-1">
            <li>Candidates must have passed <strong>Class 12th</strong> or equivalent examination.</li>
            <li><strong>Physics and Mathematics</strong> are compulsory subjects along with one of Chemistry/Biotechnology/Biology/Technical Vocational subject.</li>
            <li>Candidates appearing for Class 12 exams in 2026 are also eligible.</li>
        </ul>

        <h4 class="font-bold mt-4 mb-2">Number of Attempts:</h4>
        <p>Candidates can appear for JEE Main for <strong>three consecutive years</strong>.</p>
    `,

    applicationProcess: {
        fee: "INR 1000 (General/OBC Boys), INR 800 (Girls)",
        steps: [
            "Registration: Sign up using Email ID and Mobile Number.",
            "Fill Application Form: Enter personal, academic, and contact details.",
            "Upload Documents: Scanned photo, signature, and category certificate (if any).",
            "Payment: Pay the application fee online via Debit/Credit Card, Net Banking, or UPI.",
            "Download Confirmation Page: Save the acknowledgment for future reference."
        ],
        websiteUrl: "https://jeemain.nta.nic.in"
    },

    importantDates: [
        { title: "Session 1 Registration Starts", date: new Date("2025-11-01"), isTentative: true },
        { title: "Session 1 Exam Date", date: new Date("2026-01-24"), isTentative: true },
        { title: "Session 2 Registration Starts", date: new Date("2026-02-02"), isTentative: true },
        { title: "Session 2 Exam Date", date: new Date("2026-04-01"), isTentative: true },
        { title: "Result Announcement", date: new Date("2026-04-25"), isTentative: true }
    ],

    registrationLink: "https://jeemain.nta.nic.in",
    rssFeedUrl: "https://news.google.com/rss/search?q=JEE+Main+Exam&hl=en-IN&gl=IN&ceid=IN:en"
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://collegedost:collegedost_db@bhumit.4jfsdnd.mongodb.net/collegedost?appName=bhumit');
        console.log('MongoDB Connected');

        // Update or Insert JEE Main
        await Exam.findOneAndUpdate(
            { examSlug: 'jee-main' },
            jeeMainData,
            { upsert: true, new: true, runValidators: true }
        );

        console.log('✅ JEE Main rich data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding exam:', error);
        process.exit(1);
    }
}

seed();
