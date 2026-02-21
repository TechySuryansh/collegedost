
export const medicineRankings = [
    { name: "Top Medical Colleges in India", link: "/tools/colleges?stream=Medicine" },
    { name: "Top Government Medical Colleges", link: "/tools/colleges?stream=Medicine&ownership=Government" },
    { name: "Top Private Medical Colleges", link: "/tools/colleges?stream=Medicine&ownership=Private" },
    { name: "Top AIIMS Colleges", link: "/tools/colleges?stream=Medicine&search=AIIMS" },
    { name: "Top Dental (BDS) Colleges", link: "/tools/colleges?stream=Medicine&search=BDS" },
    { name: "Top Pharmacy Colleges", link: "/tools/colleges?stream=Pharmacy" },
    { name: "Best Medical Colleges State Wise", link: "/tools/colleges?stream=Medicine" },
    { name: "NIRF Medical Rankings 2025", link: "/tools/colleges?stream=Medicine" }
];

export const medicineExams = [
    { name: "NEET UG 2025", link: "#" },
    { name: "NEET PG 2025", link: "#" },
    { name: "INI CET 2025", link: "#" },
    { name: "NEET MDS", link: "#" },
    { name: "FMGE 2025", link: "#" },
    { name: "AIAPGET", link: "#" },
    { name: "JIPMER PG", link: "#" },
    { name: "CMSE", link: "#" }
];

export const featuredMedicineColleges = [
    {
        id: 'med1',
        name: "AIIMS New Delhi",
        location: "New Delhi, Delhi",
        rating: "NIRF #1",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/All_India_Institute_of_Medical_Sciences%2C_New_Delhi_logo.svg/1200px-All_India_Institute_of_Medical_Sciences%2C_New_Delhi_logo.svg.png",
        tags: ["Public", "MBBS", "Research"],
        fees: "₹ 5.8K Total Fees",
        placement: "Top Residency",
        link: "/tools/colleges/aiims-delhi"
    },
    {
        id: 'med2',
        name: "PGIMER Chandigarh",
        location: "Chandigarh",
        rating: "NIRF #2",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/PGIMER_Logo.svg/1200px-PGIMER_Logo.svg.png",
        tags: ["Public", "MD/MS", "Research"],
        fees: "₹ 7K Total Fees",
        placement: "Best Clinical Exposure",
        link: "/tools/colleges/pgimer-chandigarh"
    },
    {
        id: 'med3',
        name: "CMC Vellore",
        location: "Vellore, Tamil Nadu",
        rating: "NIRF #3",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Christian_Medical_College_Vellore_logo.svg/1200px-Christian_Medical_College_Vellore_logo.svg.png",
        tags: ["Private", "MBBS", "Service Bond"],
        fees: "₹ 1.5L Total Fees",
        placement: "100% Placement",
        link: "/tools/colleges/cmc-vellore"
    },
    {
        id: 'med4',
        name: "JIPMER Puducherry",
        location: "Puducherry",
        rating: "NIRF #5",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/JIPMER_Logo.svg/1200px-JIPMER_Logo.svg.png",
        tags: ["Public", "MBBS", "INI"],
        fees: "₹ 12K Total Fees",
        placement: "Central Govt Jobs",
        link: "/tools/colleges/jipmer-puducherry"
    }
];

export const medicineCounsellingData = [
    {
        title: "NEET Rank Predictor",
        description: "Know your expected rank based on your marks.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        cta: "Predict Rank",
        link: "#",
        color: "bg-blue-50"
    },
    {
        title: "MBBS College Predictor",
        description: "Predict chances of getting AIIMS/Govt colleges.",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        cta: "Predict College",
        link: "#",
        color: "bg-green-50"
    }
];

export const medicineCoursesData = [
    {
        title: "UG Courses",
        items: [
            { name: "MBBS (Bachelor of Medicine/Surgery)", link: "#" },
            { name: "BDS (Dental Surgery)", link: "#" },
            { name: "BAMS (Ayurveda)", link: "#" },
            { name: "BHMS (Homeopathy)", link: "#" },
            { name: "B.U.M.S (Unani)", link: "#" },
            { name: "B.Sc Nursing", link: "#" },
            { name: "BPT (Physiotherapy)", link: "#" },
            { name: "B.V.Sc & AH (Veterinary)", link: "#" }
        ]
    },
    {
        title: "PG & Specializations",
        items: [
            { name: "Doctor of Medicine (MD)", link: "#" },
            { name: "Master of Surgery (MS)", link: "#" },
            { name: "DM (Doctorate Of Medicine)", link: "#" },
            { name: "M.Ch (Master Of Chirurgiae)", link: "#" },
            { name: "MDS (Dental)", link: "#" },
            { name: "MPH (Public Health)", link: "#" },
            { name: "Diploma in Clinical Pathology", link: "#" },
            { name: "Fellowship Courses", link: "#" }
        ]
    }
];

export const medicineCities = [
    { name: "Medical Colleges in Delhi", link: "/tools/colleges?goal=Colleges&search=Medical&city=Delhi" },
    { name: "Medical Colleges in Bangalore", link: "/tools/colleges?goal=Colleges&search=Medical&city=Bangalore" },
    { name: "Medical Colleges in Chennai", link: "/tools/colleges?goal=Colleges&search=Medical&city=Chennai" },
    { name: "Medical Colleges in Mumbai", link: "/tools/colleges?goal=Colleges&search=Medical&city=Mumbai" },
    { name: "Medical Colleges in Kolkata", link: "/tools/colleges?goal=Colleges&search=Medical&city=Kolkata" },
    { name: "Medical Colleges in Pune", link: "/tools/colleges?goal=Colleges&search=Medical&city=Pune" },
    { name: "Medical Colleges in Hyderabad", link: "/tools/colleges?goal=Colleges&search=Medical&city=Hyderabad" },
    { name: "Medical Colleges in Lucknow", link: "/tools/colleges?goal=Colleges&search=Medical&city=Lucknow" }
];
