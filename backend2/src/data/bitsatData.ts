
const bitsData = [
    {
        name: "BITS Pilani, Pilani Campus",
        slug: "bits-pilani-pilani",
        location: { city: "Pilani", state: "Rajasthan", country: "India" },
        type: "Deemed University",
        nirfRank: 25,
        rating: 4.8,
        coursesOffered: [
            { name: "B.E. Computer Science", fee: 541000, duration: "4 Years", type: "Full-time" },
            { name: "B.E. Electrical and Electronics", fee: 541000, duration: "4 Years", type: "Full-time" },
            { name: "B.E. Mechanical", fee: 541000, duration: "4 Years", type: "Full-time" },
            { name: "B.Pharm", fee: 541000, duration: "4 Years", type: "Full-time" }
        ],
        cutoffs: [
            // 2023 Cutoffs (estimated)
            { exam: "BITSAT", branch: "Computer Science", category: "General", closingRank: 331, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Electronics & Communication", category: "General", closingRank: 296, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Electrical & Electronics", category: "General", closingRank: 272, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Mechanical", category: "General", closingRank: 244, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Chemical", category: "General", closingRank: 224, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Civil", category: "General", closingRank: 213, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "B.Pharm", category: "General", closingRank: 153, year: 2023, quota: "AI" },
            // 2022
            { exam: "BITSAT", branch: "Computer Science", category: "General", closingRank: 320, year: 2022, quota: "AI" },
            { exam: "BITSAT", branch: "Electrical & Electronics", category: "General", closingRank: 258, year: 2022, quota: "AI" }
        ],
        logo: "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg",
        backgroundImg: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200",
        placements: { averagePackage: 2090000, highestPackage: 6075000, placementPercentage: 97 }
    },
    {
        name: "BITS Pilani, K.K. Birla Goa Campus",
        slug: "bits-pilani-goa",
        location: { city: "Zuarinagar", state: "Goa", country: "India" },
        type: "Deemed University",
        nirfRank: 25,
        rating: 4.7,
        coursesOffered: [
            { name: "B.E. Computer Science", fee: 541000, duration: "4 Years", type: "Full-time" },
            { name: "B.E. Electronics & Communication", fee: 541000, duration: "4 Years", type: "Full-time" }
        ],
        cutoffs: [
            { exam: "BITSAT", branch: "Computer Science", category: "General", closingRank: 295, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Electronics & Communication", category: "General", closingRank: 267, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Electrical & Electronics", category: "General", closingRank: 252, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Mechanical", category: "General", closingRank: 223, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Chemical", category: "General", closingRank: 209, year: 2023, quota: "AI" }
        ],
        logo: "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg",
        backgroundImg: "https://images.unsplash.com/photo-1590012314607-cda9d9b6a919?auto=format&fit=crop&w=1200",
        placements: { averagePackage: 1910000, highestPackage: 5000000, placementPercentage: 95 }
    },
    {
        name: "BITS Pilani, Hyderabad Campus",
        slug: "bits-pilani-hyderabad",
        location: { city: "Hyderabad", state: "Telangana", country: "India" },
        type: "Deemed University",
        nirfRank: 25,
        rating: 4.6,
        coursesOffered: [
            { name: "B.E. Computer Science", fee: 541000, duration: "4 Years", type: "Full-time" },
            { name: "B.E. Electronics & Communication", fee: 541000, duration: "4 Years", type: "Full-time" }
        ],
        cutoffs: [
            { exam: "BITSAT", branch: "Computer Science", category: "General", closingRank: 284, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Electronics & Communication", category: "General", closingRank: 265, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Electrical & Electronics", category: "General", closingRank: 251, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Mechanical", category: "General", closingRank: 218, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "Chemical", category: "General", closingRank: 207, year: 2023, quota: "AI" },
            { exam: "BITSAT", branch: "B.Pharm", category: "General", closingRank: 143, year: 2023, quota: "AI" }
        ],
        logo: "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg",
        backgroundImg: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?auto=format&fit=crop&w=1200",
        placements: { averagePackage: 1850000, highestPackage: 4500000, placementPercentage: 94 }
    }
];

export default bitsData;
