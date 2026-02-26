
export const engineeringRankings = [
    { name: "Top Engineering Colleges in India", link: "/tools/colleges?stream=Engineering" },
    { name: "Top IITs in India", link: "/tools/colleges?stream=Engineering&search=IIT" },
    { name: "Top NITs in India", link: "/tools/colleges?stream=Engineering&search=NIT" },
    { name: "Top IIITs in India", link: "/tools/colleges?stream=Engineering&search=IIIT" },
    { name: "Top Private Engineering Colleges", link: "/tools/colleges?stream=Engineering&ownership=Private" },
    { name: "Top Govt Engineering Colleges", link: "/tools/colleges?stream=Engineering&ownership=Government" },
    { name: "Colleges Accepting JEE Main", link: "/tools/colleges?stream=Engineering&search=JEE" },
    { name: "NIRF Engineering Rankings 2025", link: "/tools/colleges?stream=Engineering" }
];

export const engineeringExams = [
    { name: "JEE Main 2026", link: "/tools/exams/jee-main" },
    { name: "JEE Advanced 2026", link: "/coming-soon" },
    { name: "BITSAT 2026", link: "/predictors/bitsat-predictor" },
    { name: "VITEEE 2026", link: "/predictors/viteee-predictor" },
    { name: "SRMJEEE 2026", link: "/coming-soon" },
    { name: "WBJEE 2026", link: "/coming-soon" },
    { name: "MHT CET 2026", link: "/coming-soon" },
    { name: "GATE 2026", link: "/coming-soon" }
];

export const featuredEngineeringColleges = [
    {
        id: 'eng1',
        name: "IIT Madras",
        location: "Chennai, Tamil Nadu",
        rating: "NIRF #1",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/1200px-IIT_Madras_Logo.svg.png",
        tags: ["Public", "B.Tech", "Institute of Eminence"],
        fees: "₹ 8.5L Total Fees",
        placement: "₹ 21.5L Avg Package",
        link: "/tools/colleges/iit-madras"
    },
    {
        id: 'eng2',
        name: "IIT Delhi",
        location: "New Delhi, Delhi",
        rating: "NIRF #2",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/IIT_Delhi_Logo.svg/1200px-IIT_Delhi_Logo.svg.png",
        tags: ["Public", "B.Tech", "Research"],
        fees: "₹ 8.6L Total Fees",
        placement: "₹ 24L Avg Package",
        link: "/tools/colleges/iit-delhi"
    },
    {
        id: 'eng3',
        name: "IIT Bombay",
        location: "Mumbai, Maharashtra",
        rating: "NIRF #3",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/1200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
        tags: ["Public", "B.Tech", "Top Placement"],
        fees: "₹ 8.8L Total Fees",
        placement: "₹ 25L Avg Package",
        link: "/tools/colleges/iit-bombay"
    },
    {
        id: 'eng4',
        name: "BITS Pilani",
        location: "Pilani, Rajasthan",
        rating: "AAAA+",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/BITS_Pilani-Logo.svg/1200px-BITS_Pilani-Logo.svg.png",
        tags: ["Private", "B.E.", "No Reservation"],
        fees: "₹ 19L Total Fees",
        placement: "₹ 30L Avg Package",
        link: "/tools/colleges/bits-pilani"
    }
];

export const engineeringCounsellingData = [
    {
        title: "JEE Main College Predictor",
        description: "Predict your college based on JEE/NTA score.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        cta: "Predict College",
        link: "/predictors/jee-main-predictor",
        color: "bg-orange-50"
    },
    {
        title: "BITSAT College Predictor",
        description: "Predict your BITS campus based on BITSAT score.",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        cta: "Predict Now",
        link: "/predictors/bitsat-predictor",
        color: "bg-blue-50"
    },
    {
        title: "VITEEE College Predictor",
        description: "Predict your VIT campus and category based on rank.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        cta: "Predict Now",
        link: "/predictors/viteee-predictor",
        color: "bg-indigo-50"
    },
    {
        title: "GATE College Predictor",
        description: "Predict IIT/NIT M.Tech admissions based on GATE score.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        cta: "Predict Now",
        link: "/predictors/gate-predictor",
        color: "bg-emerald-50"
    }
];

export const engineeringCoursesData = [
    {
        title: "Trending B.Tech Branches",
        items: [
            { name: "Computer Science Engineering", link: "#" },
            { name: "Electronics & Communication", link: "#" },
            { name: "Mechanical Engineering", link: "#" },
            { name: "Civil Engineering", link: "#" },
            { name: "Electrical Engineering", link: "#" },
            { name: "Information Technology", link: "#" },
            { name: "Artificial Intelligence", link: "#" },
            { name: "Aerospace Engineering", link: "#" }
        ]
    },
    {
        title: "Other Popular Courses",
        items: [
            { name: "Bachelor of Architecture (B.Arch)", link: "#" },
            { name: "B.Planning", link: "#" },
            { name: "M.Tech", link: "#" },
            { name: "Diploma in Engineering", link: "#" },
            { name: "Robotics Engineering", link: "#" },
            { name: "Biotechnology", link: "#" },
            { name: "Chemical Engineering", link: "#" },
            { name: "Marine Engineering", link: "#" }
        ]
    }
];

export const engineeringCities = [
    { name: "Engineering Colleges in Delhi", link: "/tools/colleges?goal=Colleges&search=Engineering&city=Delhi" },
    { name: "Engineering Colleges in Bangalore", link: "/tools/colleges?goal=Colleges&search=Engineering&city=Bangalore" },
    { name: "Engineering Colleges in Chennai", link: "/tools/colleges?goal=Colleges&search=Engineering&city=Chennai" },
    { name: "Engineering Colleges in Mumbai", link: "/tools/colleges?goal=Colleges&search=Engineering&city=Mumbai" },
    { name: "Engineering Colleges in Pune", link: "/tools/colleges?goal=Colleges&search=Engineering&city=Pune" },
    { name: "Engineering Colleges in Hyderabad", link: "/tools/colleges?goal=Colleges&search=Engineering&city=Hyderabad" },
    { name: "Engineering Colleges in Kolkata", link: "/tools/colleges?goal=Colleges&search=Engineering&city=Kolkata" },
    { name: "Engineering Colleges in Jaipur", link: "/tools/colleges?goal=Colleges&search=Engineering&city=Jaipur" }
];
