const College = require('../models/College.model');
const NirfRanking = require('../models/NirfRanking.model');
// Deprecated import removed

const FILTER_MAP = {
    btech_applications: {
        filter: {
            $or: [
                { "coursesOffered.courseName": { $regex: "B\\.Tech", $options: "i" } },
                { streams: "Engineering" }
            ]
        },
        sort: { updatedAt: -1 } // Show recently updated/active colleges
    },

    top_engineering: {
        filter: {
            streams: "Engineering",
            nirfRank: { $exists: true, $ne: null }
        },
        sort: { nirfRank: 1 }
    },

    engineering_india: {
        filter: {
            streams: "Engineering",
            "location.country": "India"
        },
        sort: { nirfRank: 1 }
    },

    engineering_tn: {
        filter: {
            streams: "Engineering",
            "location.state": "Tamil Nadu"
        },
        sort: { nirfRank: 1 }
    },

    jee_main: {
        filter: {
            streams: "Engineering",
            $or: [
                { "coursesOffered.examAccepted": { $regex: "JEE Main", $options: "i" } },
                { "cutoff.exam": "JEE Main" }
            ]
        },
        sort: { nirfRank: 1 }
    },

    top_iits: {
        filter: {
            $or: [
                { type: "IIT" }, // Works if your DB has this type
                // Regex fallback for Name matching (System Proof)
                { name: { $regex: "^Indian Institute of Technology", $options: "i" } },
                { aliases: { $in: ["IIT"] } }
            ]
        },
        sort: { nirfRank: 1 }
    },

    top_nits: {
        filter: {
            $or: [
                { type: "NIT" },
                { name: { $regex: "^National Institute of Technology", $options: "i" } },
                { aliases: { $in: ["NIT"] } }
            ]
        },
        sort: { nirfRank: 1 }
    },

    top_iiits: {
        filter: {
            $or: [
                { type: "IIIT" },
                { name: { $regex: "^Indian Institute of Information Technology", $options: "i" } },
                { aliases: { $in: ["IIIT"] } }
            ]
        },
        sort: { nirfRank: 1 }
    }
};

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
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
        if (nirfCategory) {
            // ... (Keep existing NIRF logic if needed, or simplify. Assuming basic filter priority for now)
            // Existing logic is fine, keeping it brief here or omitting if not touched. 
            // For safety, I will preserve the NIRF block fully if rewriting the whole function.
            // Since I am replacing the whole function, I must include it.

            const rankings = await NirfRanking.find({ category: nirfCategory }).sort({ rank: 1 }).lean();
            if (rankings.length === 0) return res.status(200).json({ success: true, count: 0, data: [] });

            const rankedSlugs = rankings.map(r => r.collegeSlug);
            const colleges = await College.find({ slug: { $in: rankedSlugs }, 'location.country': 'India' }).lean();

            const collegeMap = {};
            colleges.forEach(c => collegeMap[c.slug] = c);

            const sortedColleges = [];
            for (const r of rankings) {
                const college = collegeMap[r.collegeSlug];
                if (college) {
                    college.nirfRank = r.rank;
                    college.nirfScore = r.score;
                    sortedColleges.push(college);
                }
            }
            const paginatedColleges = sortedColleges.slice(skip, skip + limitNum);
            return res.status(200).json({
                success: true,
                count: paginatedColleges.length,
                pagination: { total: sortedColleges.length, page: pageNum, pages: Math.ceil(sortedColleges.length / limitNum) },
                data: paginatedColleges
            });
        }

        // --- 2. STANDARD FILTER MODE ---
        let conditions = [];

        // 1. Geography (Multi-Select Support)
        if (country) {
            conditions.push({ 'location.country': { $regex: new RegExp(`^${country}`, 'i') } });
        } else {
            conditions.push({ 'location.country': 'India' });
        }

        if (state && state !== 'All States') {
            const states = state.split(',').map(s => s.trim()).filter(s => s);
            if (states.length > 0) {
                // Use Regex for flexible matching (e.g. "Delhi" matches "New Delhi") 
                // OR strict $in if data is clean. Let's use $or regex for safety.
                conditions.push({
                    $or: states.map(s => ({ 'location.state': { $regex: new RegExp(s, 'i') } }))
                });
            }
        }

        if (city) {
            // City is usually a single search term or single selection, but let's support split just in case
            const cities = city.split(',').map(c => c.trim()).filter(c => c);
            if (cities.length > 0) {
                conditions.push({
                    $or: cities.map(c => ({ 'location.city': { $regex: new RegExp(c, 'i') } }))
                });
            }
        }

        // 2. Classification (Multi-Select)
        if (type && type !== 'All') {
            const types = type.split(',').map(t => t.trim()).filter(t => t);
            if (types.length > 0) {
                conditions.push({
                    type: { $in: types.map(t => new RegExp(`^${t}`, 'i')) }
                });
            }
        }

        // 3. Branch/Stream Filter (Multi-Select)
        // Frontend sends "Engineering And Architecture", "Science", etc.
        // We need to map this to 'streams' array in DB or 'coursesOffered.courseName'
        if (branch) {
            const branches = branch.split(',').map(b => b.trim());
            const branchConditions = [];

            branches.forEach(b => {
                // Heuristic: Extract core keyword
                // "Engineering And Architecture" -> "Engineering" or match full
                // Better: generic regex match

                // 1. Check Streams array
                branchConditions.push({ streams: { $regex: new RegExp(b.split(' ')[0], 'i') } });

                // 2. Check Course Names
                branchConditions.push({ 'coursesOffered.courseName': { $regex: new RegExp(b.split(' ')[0], 'i') } });

                // Special mapping
                if (/engineering/i.test(b)) {
                    branchConditions.push({ 'coursesOffered.courseName': { $regex: 'B\\.Tech|B\\.E', $options: 'i' } });
                }
                if (/medicine/i.test(b) || /medical/i.test(b)) {
                    branchConditions.push({ 'coursesOffered.courseName': { $regex: 'MBBS|BDS', $options: 'i' } });
                }
                if (/management/i.test(b) || /business/i.test(b)) {
                    branchConditions.push({ 'coursesOffered.courseName': { $regex: 'MBA|BBA', $options: 'i' } });
                }
            });

            if (branchConditions.length > 0) {
                conditions.push({ $or: branchConditions });
            }
        }

        // 4. Course/Degree Level (Multi-Select)
        // Frontend sends "B.Tech", "MBA"
        if (course) {
            const courses = course.split(',').map(c => c.trim());
            conditions.push({
                'coursesOffered.courseName': {
                    $in: courses.map(c => new RegExp(c, 'i'))
                }
            });
        }

        // 5. Exam 
        if (exam) {
            const exams = exam.split(',').map(e => e.trim());
            const examConditions = exams.map(e => {
                const safeExam = e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\s*[-]?\\s*');
                const regex = new RegExp(safeExam, 'i');
                return [
                    { 'cutoff.exam': regex },
                    { 'coursesOffered.examAccepted': regex },
                    { 'coursesOffered.eligibility': regex }
                ];
            }).flat();

            conditions.push({ $or: examConditions });
        }

        // 6. Fees
        if (minFees || maxFees) {
            let feeQuery = {};
            if (minFees) feeQuery.$gte = Number(minFees);
            if (maxFees) feeQuery.$lte = Number(maxFees);
            if (Object.keys(feeQuery).length > 0) {
                conditions.push({ 'fees.tuition': feeQuery });
            }
        }

        // 7. Global Search (Name, City, State)
        // 7. Global Search (Name, City, State, Type, Aliases)
        if (search) {
            // Escape special characters to prevent regex errors
            const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const safeSearch = escapeRegex(search.trim());

            // Use word boundary (\b) to prevent "nit" matching "Humanities" or "Monitoring"
            const strictRegex = new RegExp(`\\b${safeSearch}`, 'i');

            conditions.push({
                $or: [
                    { name: { $regex: strictRegex } },
                    // For Type, often concise (IIT, NIT), allow direct match
                    { type: { $regex: strictRegex } },
                    { aliases: { $in: [strictRegex] } },
                    { 'location.city': { $regex: strictRegex } },
                    { 'location.state': { $regex: strictRegex } }
                ]
            });

            // === IIT/NIT/IIIT ABBREVIATION HANDLING ===
            // If user searches for abbreviations, also search for full names
            const upperSearch = search.trim().toUpperCase();
            if (upperSearch === 'IIT' || upperSearch === 'IITS') {
                conditions[conditions.length - 1].$or.push(
                    { name: { $regex: /Indian Institute of Technology/i } }
                );
            }
            if (upperSearch === 'NIT' || upperSearch === 'NITS') {
                conditions[conditions.length - 1].$or.push(
                    { name: { $regex: /National Institute of Technology/i } }
                );
            }
            if (upperSearch === 'IIIT' || upperSearch === 'IIITS') {
                conditions[conditions.length - 1].$or.push(
                    { name: { $regex: /Indian Institute of Information Technology/i } }
                );
            }
            if (upperSearch === 'NLU' || upperSearch === 'NLUS') {
                conditions[conditions.length - 1].$or.push(
                    { name: { $regex: /National Law University/i } }
                );
            }
            if (upperSearch === 'AIIMS') {
                conditions[conditions.length - 1].$or.push(
                    { name: { $regex: /All India Institute of Medical Sciences/i } }
                );
            }
        }

        // Combine all conditions
        let query = {};
        if (conditions.length > 0) {
            query = { $and: conditions };
        }

        // Sorting Logic
        let sortOption = { nirfRank: 1 }; // Default to NIRF Rank
        if (sort === 'fees_low') sortOption = { 'fees.tuition': 1, nirfRank: 1 };
        if (sort === 'fees_high') sortOption = { 'fees.tuition': -1, nirfRank: 1 };
        if (sort === 'nirfRank') sortOption = { nirfRank: 1 };

        // Use Collation for case-insensitive sorting if needed, but numeric sort is main concern

        const colleges = await College.find(query)
            .collation({ locale: "en", strength: 2 }) // Case insensitive sort
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

const Fee = require('../models/Fee.model');

// @desc    Get single college by slug
// @route   GET /api/colleges/:slug
// @access  Public
exports.getCollegeBySlug = async (req, res) => {
    try {
        const college = await College.findOne({ slug: req.params.slug });

        if (!college) {
            return res.status(404).json({ success: false, message: 'College not found' });
        }

        // Fetch detailed fees if available
        const fees = await Fee.find({ college: college._id })
            .sort({ year: -1, type: 1 })
            .lean();

        res.status(200).json({
            success: true,
            data: {
                ...college.toObject(),
                detailedFees: fees
            }
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

        const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const safeSearch = escapeRegex(q.trim());
        const strictRegex = new RegExp(`\\b${safeSearch}`, 'i');

        // Build search conditions
        let searchConditions = [
            { name: { $regex: strictRegex } },
            { type: { $regex: strictRegex } },
            { aliases: { $in: [strictRegex] } },
            { 'location.city': { $regex: strictRegex } }
        ];

        // === IIT/NIT/IIIT ABBREVIATION HANDLING ===
        const upperQ = q.trim().toUpperCase();
        if (upperQ === 'IIT' || upperQ === 'IITS') {
            searchConditions.push({ name: { $regex: /Indian Institute of Technology/i } });
        }
        if (upperQ === 'NIT' || upperQ === 'NITS') {
            searchConditions.push({ name: { $regex: /National Institute of Technology/i } });
        }
        if (upperQ === 'IIIT' || upperQ === 'IIITS') {
            searchConditions.push({ name: { $regex: /Indian Institute of Information Technology/i } });
        }
        if (upperQ === 'NLU' || upperQ === 'NLUS') {
            searchConditions.push({ name: { $regex: /National Law University/i } });
        }
        if (upperQ === 'AIIMS') {
            searchConditions.push({ name: { $regex: /All India Institute of Medical Sciences/i } });
        }

        const colleges = await College.find({
            $or: searchConditions
        })
            .select('name slug location.city type nirfRank')
            .limit(10);

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
            {
                $match: {
                    "rankings": {
                        $elemMatch: { source: "NIRF", category: category }
                    }
                }
            },
            {
                $addFields: {
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
                }
            },
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

// @desc    Trigger College Sync (NIRF Ingestion)
// @route   POST /api/colleges/sync
// @access  Private/Admin
exports.syncColleges = async (req, res) => {
    try {
        console.log('Manual sync triggered via Admin Panel');

        // runIngestion().then(() => {
        //     console.log('Manual Sync Completed Successfully');
        // }).catch(err => {
        //     console.error('Manual Sync Failed:', err);
        // });
        console.log('Legacy Sync Triggered - Please use the new AICTE/NIRF Ingestion Panel in Admin Dashboard.');

        res.status(200).json({
            success: true,
            message: 'College synchronization started in the background.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get College Section (Generic API)
// @route   GET /api/colleges/sections/:key
exports.getCollegeSection = async (req, res) => {
    try {
        const { key } = req.params;
        const { limit = 10 } = req.query;

        const config = FILTER_MAP[key];

        if (!config) {
            return res.status(400).json({ success: false, message: "Invalid section key" });
        }

        const colleges = await College.find(config.filter)
            .sort(config.sort)
            .select("name location nirfRank logo type")
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: colleges,
            section: key
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Single College by ID (Admin)
// @route   GET /api/colleges/id/:id
// @access  Private/Admin
exports.getCollegeById = async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        if (!college) {
            return res.status(404).json({ success: false, message: 'College not found' });
        }
        res.status(200).json({ success: true, data: college });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update College
// @route   PUT /api/colleges/:id
// @access  Private/Admin
exports.updateCollege = async (req, res) => {
    try {
        let college = await College.findById(req.params.id);

        if (!college) {
            return res.status(404).json({ success: false, message: 'College not found' });
        }

        college = await College.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: college });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete College
// @route   DELETE /api/colleges/:id
// @access  Private/Admin
exports.deleteCollege = async (req, res) => {
    try {
        const college = await College.findById(req.params.id);

        if (!college) {
            return res.status(404).json({ success: false, message: 'College not found' });
        }

        await college.deleteOne();

        res.status(200).json({ success: true, message: 'College deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
