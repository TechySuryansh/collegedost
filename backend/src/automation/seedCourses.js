require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const slugify = require('slugify');
const Course = require('../models/Course.model');

const courses = [
    {
        courseName: "B.Tech (Bachelor of Technology)",
        shortName: "B.Tech",
        degreeLevel: "Undergraduate",
        duration: "4 Years",
        icon: "FaLaptopCode",
        highlights: {
            "Level": "Undergraduate",
            "Duration": "4 Years",
            "Eligibility": "10+2 with Physics, Chemistry, Maths",
            "Admission Process": "Entrance Exams (JEE Main, etc.)",
            "Average Fee": "INR 2 Lakh - 15 Lakh",
            "Average Salary": "INR 4 Lakh - 25 Lakh"
        },
        overview: `
            <p><strong>B.Tech (Bachelor of Technology)</strong> is the most popular undergraduate engineering course in India. It is a 4-year program divided into 8 semesters. The course focuses on technical skills, theoretical knowledge, and practical applications in various engineering fields.</p>
            <p class="mt-4">Students can choose from various specializations like Computer Science, Mechanical, Civil, Electrical, and Electronics Engineering. B.Tech graduates are in high demand in the IT sector, core engineering industries, and research organizations.</p>
        `,
        eligibility: `
            <ul class="list-disc pl-5 space-y-2">
                <li>Candidates must have passed <strong>Class 12</strong> (Science stream) from a recognized board.</li>
                <li>Compulsory subjects: <strong>Physics and Mathematics</strong> along with Chemistry/Biology/Biotechnology/Technical Vocational subject.</li>
                <li>Minimum aggregate marks required usually range from <strong>50% to 75%</strong> depending on the college and category.</li>
                <li>Admission is primarily based on entrance exams like <strong>JEE Main, JEE Advanced, BITSAT, VITEEE, SRMJEEE</strong>, etc.</li>
            </ul>
        `,
        admissionProcess: `
            <p>The admission process generally involves:</p>
            <ol class="list-decimal pl-5 space-y-2 mt-2">
                <li><strong>Entrance Exam:</strong> Appear for national or state-level entrance exams.</li>
                <li><strong>Counselling:</strong> Participate in counselling processes (like JoSAA, CSAB) based on ranks.</li>
                <li><strong>Seat Allotment:</strong> Seats are allocated based on merit and preference.</li>
                <li><strong>Document Verification:</strong> Verify original documents at the allotted institute.</li>
            </ol>
        `,
        subjects: ["Engineering Mathematics", "Engineering Physics", "Data Structures", "Digital Logic", "Operating Systems", "Computer Networks", "DBMS", "Artificial Intelligence"],
        syllabus: [
            { semester: "Semester 1", subjects: ["Mathematics I", "Physics", "Basic Electrical Engg", "Engineering Graphics"] },
            { semester: "Semester 2", subjects: ["Mathematics II", "Chemistry", "Programming in C", "English Communication"] },
            { semester: "Semester 3", subjects: ["Data Structures", "Digital Electronics", "Discrete Maths", "Object Oriented Programming"] }
        ],
        entranceExams: [
            { name: "JEE Main", mode: "Online" },
            { name: "JEE Advanced", mode: "Online" },
            { name: "BITSAT", mode: "Online" },
            { name: "VITEEE", mode: "Online" }
        ],
        careerOptions: ["Software Engineer", "Data Scientist", "Mechanical Engineer", "Civil Engineer", "Product Manager"],
        jobRoles: [
            { role: "Software Developer", avgSalary: "INR 6-12 LPA" },
            { role: "Data Analyst", avgSalary: "INR 5-9 LPA" },
            { role: "System Engineer", avgSalary: "INR 4-8 LPA" }
        ],
        topRecruiters: ["Google", "Microsoft", "TCS", "Infosys", "Wipro", "Amazon", "L&T"],
        averageStartingSalary: "INR 5-8 LPA"
    },
    {
        courseName: "B.Sc (Bachelor of Science)",
        shortName: "B.Sc",
        degreeLevel: "Undergraduate",
        duration: "3 Years",
        icon: "FaMicroscope",
        highlights: {
            "Level": "Undergraduate",
            "Duration": "3 Years",
            "Eligibility": "10+2 with Science (PCB/PCM)",
            "Admission Process": "Merit-based / Entrance Exams",
            "Average Fee": "INR 20,000 - 2 Lakh",
            "Average Salary": "INR 3 Lakh - 7 Lakh"
        },
        overview: `
            <p><strong>B.Sc (Bachelor of Science)</strong> is a 3-year undergraduate degree for students who want to build a career in science, research, and technology. It provides deep theoretical and practical knowledge in subjects like Physics, Chemistry, Mathematics, Botany, Zoology, etc.</p>
        `,
        eligibility: `
            <ul class="list-disc pl-5 space-y-2">
                <li>Passed 10+2 with Science stream (Physics, Chemistry, Maths/Biology).</li>
                <li>Minimum marks requirements vary from 50% to 60%.</li>
            </ul>
        `,
        admissionProcess: `
            <p>Admission is often merit-based (marks in Class 12), though top universities like BHU, DU (via CUET) conduct entrance exams.</p>
        `,
        subjects: ["Physics", "Chemistry", "Mathematics", "Zoology", "Botany", "Computer Science"],
        entranceExams: [
            { name: "CUET (UG)", mode: "Online" },
            { name: "NEST", mode: "Online" }
        ],
        careerOptions: ["Research Scientist", "Lecturer", "Chemist", "Lab Technician", "Data Analyst"],
        jobRoles: [
            { role: "Research Associate", avgSalary: "INR 3-5 LPA" },
            { role: "Analytical Chemist", avgSalary: "INR 4-6 LPA" }
        ],
        topRecruiters: ["ISRO", "DRDO", "Cipla", "Dr. Reddy's", "Infosys (B.Sc freshers)"],
        averageStartingSalary: "INR 3-6 LPA"
    },
    {
        courseName: "B.Com (Bachelor of Commerce)",
        shortName: "B.Com",
        degreeLevel: "Undergraduate",
        duration: "3 Years",
        icon: "FaChartLine",
        highlights: {
            "Level": "Undergraduate",
            "Duration": "3 Years",
            "Eligibility": "10+2 with Commerce/Science",
            "Admission Process": "Merit / CUET",
            "Average Fee": "INR 10,000 - 1.5 Lakh",
            "Average Salary": "INR 3 Lakh - 6 Lakh"
        },
        overview: `
            <p><strong>B.Com</strong> is a fundamental degree for commerce students focusing on Financial Accounting, Business Law, Economics, Taxation, and Auditing. It opens doors to careers in Finance, Banking, and Corporate sectors.</p>
        `,
        eligibility: `
             <ul class="list-disc pl-5 space-y-2">
                <li>10+2 from a recognized board (Commerce stream preferred).</li>
                <li>Many colleges require Maths as a subject for B.Com (Hons).</li>
            </ul>
        `,
        admissionProcess: "Admission via CUET for central universities; merit-based for others.",
        subjects: ["Financial Accounting", "Corporate Law", "Microeconomics", "Income Tax", "Cost Accounting"],
        entranceExams: [{ name: "CUET", mode: "Online" }, { name: "IPU CET", mode: "Online" }],
        careerOptions: ["Accountant", "Financial Analyst", "Tax Consultant", "Banker"],
        jobRoles: [{ role: "Accountant", avgSalary: "INR 3-4 LPA" }, { role: "Financial Analyst", avgSalary: "INR 4-7 LPA" }],
        topRecruiters: ["Deloitte", "KPMG", "EY", "HDFC Bank", "ICICI Bank"],
        averageStartingSalary: "INR 3-6 LPA"
    },
    {
        courseName: "B.A (Bachelor of Arts)",
        shortName: "B.A",
        degreeLevel: "Undergraduate",
        duration: "3 Years",
        icon: "FaPalette",
        highlights: {
            "Level": "Undergraduate",
            "Duration": "3 Years",
            "Eligibility": "10+2 (Any Stream)",
            "Admission Process": "Merit / CUET",
            "Average Fee": "INR 5,000 - 1 Lakh",
            "Average Salary": "INR 2 Lakh - 5 Lakh"
        },
        overview: `
            <p><strong>B.A</strong> offers a diverse range of specializations in Humanities and Social Sciences like English, History, Political Science, Psychology, Sociology, and Economics. Ideally for students aiming for Civil Services, Teaching, or Creative Arts.</p>
        `,
        eligibility: "Passed Class 12 from any stream with min 50% marks.",
        admissionProcess: "Primarily through CUET for top colleges like DU, JNU, BHU.",
        subjects: ["English Literature", "Political Science", "History", "Psychology", "Sociology", "Economics"],
        entranceExams: [{ name: "CUET", mode: "Online" }],
        careerOptions: ["Content Writer", "Civil Servant", "Teacher", "Journalist", "Psychologist"],
        jobRoles: [{ role: "Content Writer", avgSalary: "INR 2.5-4 LPA" }, { role: "Teacher", avgSalary: "INR 3-5 LPA" }],
        topRecruiters: ["Schools", "Media Houses", "NGOs", "Government"],
        averageStartingSalary: "INR 3-5 LPA"
    }

];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://collegedost:collegedost_db@bhumit.4jfsdnd.mongodb.net/collegedost?appName=bhumit');
        console.log('MongoDB Connected');

        // Clear existing courses with these names to update them
        const names = courses.map(c => c.courseName);
        console.log("Seeding courses:", names);

        // We can use bulkWrite or just iterate. Let's delete matching slug or name first.
        for (const course of courses) {
            const slug = slugify(course.courseName, { lower: true });
            await Course.findOneAndDelete({ slug: slug });

            // Re-create
            const newCourse = new Course({ ...course, slug });
            await newCourse.save();
        }

        console.log('✅ Courses seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
}

seed();
