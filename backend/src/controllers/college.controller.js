const College = require('../models/College.model');
const NirfRanking = require('../models/NirfRanking.model');

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
exports.getColleges = async (req, res) => {
    try {
        const { state, city, type, exam, course, search, branch, minFees, maxFees, sort, country, nirfCategory, page = 1, limit = 20 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // --- 1. SPECIAL CASE: NIRF RANKING MODE ---
        // If nirfCategory is present, we fetch rankings FIRST, then get colleges.
        if (nirfCategory) {
            console.log(`[Detailed Fetch] Fetching NIRF rankings for category: ${nirfCategory}`);
            
            // 1. Get Ranked Slugs
            const rankings = await NirfRanking.find({ category: nirfCategory })
                .sort({ rank: 1 })
                .lean();

            console.log(`[Detailed Fetch] Found ${rankings.length} ranking entries.`);

            if (rankings.length === 0) {
                 return res.status(200).json({ success: true, count: 0, data: [] });
            }

            const rankedSlugs = rankings.map(r => r.collegeSlug);

            // 2. Fetch College Details for these slugs
            // We must filter by Country=India implicitly for NIRF (Indian Ranking)
            const colleges = await College.find({ 
                slug: { $in: rankedSlugs },
                'location.country': 'India' // Ensure only Indian colleges match
            }).lean();

            // 3. Merge Access Data (Rank needs to be attached to the college object for display)
            // And IMPORTANT: Sort them in the order of 'rankings' (NirfRanking collection order)
            
            const collegeMap = {};
            colleges.forEach(c => collegeMap[c.slug] = c);

            const sortedColleges = [];
            for (const r of rankings) {
                const college = collegeMap[r.collegeSlug];
                if (college) {
                    // Inject the specific rank/score for this category
                    college.nirfRank = r.rank;
                    college.nirfScore = r.score;
                    sortedColleges.push(college);
                }
            }
            
            // Pagination (Manual, since we fetched all to sort)
            // For large datasets this might need optimization, but likely < 200 items per category.
            const paginatedColleges = sortedColleges.slice(skip, skip + limitNum);

            return res.status(200).json({
                success: true,
                count: paginatedColleges.length,
                pagination: {
                    total: sortedColleges.length,
                    page: pageNum,
                    pages: Math.ceil(sortedColleges.length / limitNum)
                },
                data: paginatedColleges
            });
        }

        // --- 2. STANDARD FILTER MODE ---
        
        let query = {};
        
        // Use anchored Regex for dropdowns
        if (state) query['location.state'] = { $regex: new RegExp(`^${state}`, 'i') }; 
        if (city) query['location.city'] = { $regex: new RegExp(`^${city}`, 'i') };
        
        // --- SEPARATION LOGIC ---
        // If 'country' is NOT provided, Default to 'India'.
        // This ensures the "Main" list is India only.
        // User must explicitly request country='USA' etc.
        if (country) {
            query['location.country'] = { $regex: new RegExp(`^${country}`, 'i') }; 
        } else {
            query['location.country'] = 'India';
        }

        if (type) query.type = { $regex: new RegExp(`^${type}`, 'i') };
        
        // Exam & Branch
        if (exam) query['cutoff.exam'] = exam;
        if (branch) query.streams = { $regex: branch, $options: 'i' }; 
        if (course) query['coursesOffered.courseName'] = { $regex: course, $options: 'i' };

        // Fees Range
        if (minFees || maxFees) {
            query['fees.tuition'] = {};
            if (minFees) query['fees.tuition'].$gte = Number(minFees);
            if (maxFees) query['fees.tuition'].$lte = Number(maxFees);
        }

        // Global Search
        if (search) {
             query.$or = [
                 { name: { $regex: search, $options: 'i' } },
                 { 'location.city': { $regex: search, $options: 'i' } },
                 { 'location.state': { $regex: search, $options: 'i' } }
             ];
        }

        // Sorting Logic
        let sortOption = { nirfRank: 1 }; // Default to NIRF Rank if available
        if (sort === 'fees_low') sortOption = { 'fees.tuition': 1 };
        if (sort === 'fees_high') sortOption = { 'fees.tuition': -1 };
        if (sort === 'rank') sortOption = { nirfRank: 1 };

        const colleges = await College.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean();

        const total = await College.countDocuments(query);

        res.status(200).json({
            success: true,
            count: colleges.length,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum)
            },
            data: colleges
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single college by slug
// @route   GET /api/colleges/:slug
// @access  Public
exports.getCollegeBySlug = async (req, res) => {
    try {
        const college = await College.findOne({ slug: req.params.slug });

        if (!college) {
            return res.status(404).json({ success: false, message: 'College not found' });
        }

        res.status(200).json({
            success: true,
            data: college
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Predict colleges based on rank
// @route   GET /api/colleges/predict
// @access  Public
exports.predictColleges = async (req, res) => {
    try {
        const { exam, rank, category, gender, state } = req.query;

        if (!exam || !rank) {
            return res.status(400).json({ success: false, message: 'Please provide exam and rank' });
        }

        const userRank = parseInt(rank);
        const userCategory = category || 'General';

        // Find colleges where at least one cutoff meets the criteria:
        // 1. Exam matches
        // 2. Category matches (or is general/open if specific not found - strict for now)
        // 3. User Rank <= Closing Rank (meaning user is within the cutoff)
        
        const colleges = await College.find({
            cutoff: {
                $elemMatch: {
                    exam: exam,
                    category: userCategory,
                    closing: { $gte: userRank }
                }
            }
        }).select('name location nirfRank type cutoff website');

        // Filter the specific cutoff entries to only return the relevant ones for display
        const results = colleges.map(college => {
            const relevantCutoffs = college.cutoff.filter(c => 
                c.exam === exam && 
                c.category === userCategory && 
                c.closing >= userRank
            );
            
            return {
                ...college.toObject(),
                matchingCutoffs: relevantCutoffs
            };
        });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Live Search Suggestions (Autocomplete)
// @route   GET /api/colleges/search?q=...
exports.searchColleges = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
             return res.status(200).json({ success: true, data: [] });
        }

        const colleges = await College.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { 'location.city': { $regex: q, $options: 'i' } }
            ]
        })
        .select('name slug location.city type nirfRank')
        .limit(8);

        res.status(200).json({ success: true, count: colleges.length, data: colleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new college
// @route   POST /api/colleges
// @access  Private (Admin)
exports.createCollege = async (req, res) => {
    try {
        const college = await College.create(req.body);
        res.status(201).json({ success: true, data: college });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get Top Ranked Colleges by Category (using Aggregation)
// @route   GET /api/colleges/top/:category
exports.getTopColleges = async (req, res) => {
    try {
        const { category } = req.params; // e.g. "Engineering"
        
        // Use Aggregation to filter ranking array and sort
        const colleges = await College.aggregate([
            { $match: { 
                "rankings": { 
                    $elemMatch: { source: "NIRF", category: category } 
                } 
            }},
            { $addFields: {
                specificRankObj: {
                    $filter: {
                        input: "$rankings",
                        as: "r",
                        cond: { 
                            $and: [
                                { $eq: ["$$r.source", "NIRF"] },
                                { $eq: ["$$r.category", category] }
                            ]
                        }
                    }
                }
            }},
            { $addFields: { sortRank: { $arrayElemAt: ["$specificRankObj.rank", 0] } } },
            { $sort: { sortRank: 1 } },
            { $limit: 20 }
        ]);

        res.status(200).json({ success: true, count: colleges.length, data: colleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Colleges by State
// @route   GET /api/colleges/state/:state
exports.getCollegesByState = async (req, res) => {
    try {
        const { state } = req.params;
        const colleges = await College.find({
            "location.state": { $regex: new RegExp(`^${state}$`, "i") } 
        }).limit(50);
        res.status(200).json({ success: true, count: colleges.length, data: colleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Colleges by City
// @route   GET /api/colleges/city/:city
exports.getCollegesByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const colleges = await College.find({
            "location.city": { $regex: new RegExp(`^${city}$`, "i") }
        }).limit(50);
        res.status(200).json({ success: true, count: colleges.length, data: colleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Best ROI (Placement %)
// @route   GET /api/colleges/best-roi
exports.getBestROI = async (req, res) => {
    try {
        // Proxy ROI with Placement Percentage for now
        const colleges = await College.find({
            "placements.placementPercentage": { $exists: true, $ne: null }
        })
        .sort({ "placements.placementPercentage": -1 })
        .limit(20);
        res.status(200).json({ success: true, count: colleges.length, data: colleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// @desc    Seed NIRF Data (Manual Trigger)
// @route   GET /api/colleges/seed-nirf
exports.seedNirfData = async (req, res) => {
    try {
        console.log("Starting Manual NIRF Seed...");
        const nirfData = [
            
            // --- Engineering ---
            { rank: 1, name: "Indian Institute of Technology Madras", category: "Engineering" },
            { rank: 2, name: "Indian Institute of Technology Delhi", category: "Engineering" },
            { rank: 3, name: "Indian Institute of Technology Bombay", category: "Engineering" },
            { rank: 4, name: "Indian Institute of Technology Kanpur", category: "Engineering" },
            { rank: 5, name: "Indian Institute of Technology Roorkee", category: "Engineering" },
            { rank: 6, name: "Indian Institute of Technology Kharagpur", category: "Engineering" },
            { rank: 7, name: "Indian Institute of Technology Guwahati", category: "Engineering" },
            { rank: 8, name: "Indian Institute of Technology Hyderabad", category: "Engineering" },
            { rank: 9, name: "National Institute of Technology Tiruchirappalli", category: "Engineering" },
            { rank: 10, name: "Indian Institute of Technology Varanasi", category: "Engineering" }, 
            { rank: 11, name: "Vellore Institute of Technology", category: "Engineering" }, // Private
            { rank: 12, name: "National Institute of Technology Karnataka", category: "Engineering" },
            { rank: 13, name: "Anna University", category: "Engineering" },
            { rank: 14, name: "Indian Institute of Technology Indore", category: "Engineering" },
            { rank: 15, name: "Institute of Chemical Technology", category: "Engineering" },
            { rank: 16, name: "National Institute of Technology Rourkela", category: "Engineering" },
            { rank: 17, name: "Indian Institute of Technology Mandi", category: "Engineering" },
            { rank: 18, name: "Amrita Vishwa Vidyapeetham", category: "Engineering" }, // Private
            { rank: 19, name: "Indian Institute of Technology Gandhinagar", category: "Engineering" },
            { rank: 20, name: "Jamia Millia Islamia", category: "Engineering" },
            { rank: 21, name: "Thapar Institute of Engineering and Technology", category: "Engineering" }, // Private
            { rank: 22, name: "National Institute of Technology Warangal", category: "Engineering" },
            { rank: 23, name: "Indian Institute of Technology Ropar", category: "Engineering" },
            { rank: 24, name: "National Institute of Technology Calicut", category: "Engineering" },
            { rank: 25, name: "BITS Pilani", category: "Engineering" }, // Private (Birla Institute)
            
            // --- Management ---
            { rank: 1, name: "Indian Institute of Management Ahmedabad", category: "Management" },
            { rank: 2, name: "Indian Institute of Management Bangalore", category: "Management" },
            { rank: 3, name: "Indian Institute of Management Kozhikode", category: "Management" },
            { rank: 4, name: "Indian Institute of Technology Delhi", category: "Management" },
            { rank: 5, name: "Indian Institute of Management Calcutta", category: "Management" },
            { rank: 6, name: "Indian Institute of Management Mumbai", category: "Management" },
            { rank: 7, name: "Indian Institute of Management Lucknow", category: "Management" },
            { rank: 8, name: "Indian Institute of Management Indore", category: "Management" },
            { rank: 9, name: "Xavier Labour Relations Institute (XLRI)", category: "Management" },
            { rank: 10, name: "Indian Institute of Technology Bombay", category: "Management" },

             // --- Pharmacy ---
            { rank: 1, name: "Jamia Hamdard", category: "Pharmacy" },
            { rank: 2, name: "National Institute of Pharmaceutical Education and Research Hyderabad", category: "Pharmacy" },
            { rank: 3, name: "Birla Institute of Technology & Science - Pilani", category: "Pharmacy" },
            { rank: 4, name: "JSS College of Pharmacy", category: "Pharmacy" },
            { rank: 5, name: "Institute of Chemical Technology", category: "Pharmacy" },

             // --- Medical ---
            { rank: 1, name: "All India Institute of Medical Sciences, Delhi", category: "Medical" },
            { rank: 2, name: "Post Graduate Institute of Medical Education and Research", category: "Medical" },
            { rank: 3, name: "Christian Medical College", category: "Medical" },
            { rank: 4, name: "National Institute of Mental Health & Neuro Sciences", category: "Medical" },
            { rank: 5, name: "Jawaharlal Institute of Post Graduate Medical Education & Research", category: "Medical" },
            
            // --- Law ---
            { rank: 1, name: "National Law School of India University", category: "Law" },
            { rank: 2, name: "National Law University", category: "Law" },
            { rank: 3, name: "Nalsar University of Law", category: "Law" },
            { rank: 4, name: "The West Bengal National University of Juridical Sciences", category: "Law" },
            { rank: 5, name: "Symbiosis Law School", category: "Law" },

            // --- Overall ---
             { rank: 1, name: "Indian Institute of Technology Madras", category: "Overall" },
             { rank: 2, name: "Indian Institute of Science", category: "Overall" },
             { rank: 3, name: "Indian Institute of Technology Bombay", category: "Overall" },
             { rank: 4, name: "Indian Institute of Technology Delhi", category: "Overall" },
             { rank: 5, name: "Indian Institute of Technology Kanpur", category: "Overall" },

        ];

        let seededCount = 0;
        const dbColleges = await College.find({ 'location.country': 'India' }).select('name slug').lean();
        const stringSimilarity = require('string-similarity');

        for (const item of nirfData) {
            // Find Matching College in DB
            // 1. Exact Match
            let matchedCollege = dbColleges.find(c => c.name.toLowerCase() === item.name.toLowerCase());
            
            // 2. Fuzzy Match if strict failed
            if (!matchedCollege) {
                const names = dbColleges.map(c => c.name);
                const matches = stringSimilarity.findBestMatch(item.name, names);
                if (matches.bestMatch.rating > 0.4) { // Relaxed threshold for 'Institute' variants
                    matchedCollege = dbColleges.find(c => c.name === matches.bestMatch.target);
                }
            }

            if (matchedCollege) {
                // Upsert Ranking
                await NirfRanking.findOneAndUpdate(
                    { collegeSlug: matchedCollege.slug, category: item.category },
                    {
                        collegeSlug: matchedCollege.slug,
                        instituteName: item.name, // Use the proper name from our curated list
                        category: item.category,
                        year: 2024,
                        rank: item.rank,
                        score: 100 - item.rank, // Dummy score
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );
                seededCount++;
            }
        }

        res.json({ success: true, message: `Seeded ${seededCount} NIRF rankings`, totalAttempted: nirfData.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
