import { Request, Response } from 'express';
import College from '../models/College';
import { generateCollegeContent, validatePlacementStats } from '../services/collegeAI';

// @desc    Get all colleges with filters and pagination
// @route   GET /api/colleges
// @access  Public
export const getColleges = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            search, state, city, course, branch, type,
            fees, rating, sort, page = 1, limit = 20,
            management, collegeType, institutionCategory, locationType,
            stream
        } = req.query;

        const conditions: any[] = [];

        // Normalize sort (IMPORTANT FOR PRODUCTION)
        const sortValue = (sort as string || '').trim();

        const isNirfSort =
            sortValue === '' ||
            sortValue === 'nirfRank' ||
            sortValue === 'undefined' ||
            sortValue === 'null';

        // Search
        if (search) {
            const searchTerm = search as string;
            const isAcronym = /^[A-Z]{2,6}$/i.test(searchTerm.trim());

            // Acronym expansion map for common college abbreviations
            const acronymExpansions: Record<string, string> = {
                'IIM': 'Indian Institute of Management',
                'IIT': 'Indian Institute of Technology',
                'NIT': 'National Institute of Technology',
                'IIIT': 'Indian Institute of Information Technology',
                'NLU': 'National Law University',
                'AIIMS': 'All India Institute of Medical Sciences',
                'BITS': 'Birla Institute of Technology and Science',
                'NIFT': 'National Institute of Fashion Technology',
                'NID': 'National Institute of Design',
            };

            const upperTerm = searchTerm.trim().toUpperCase();
            const expansion = acronymExpansions[upperTerm];

            if (expansion) {
                // Search for both the acronym (word-bounded) and the expanded name
                conditions.push({
                    $or: [
                        { name: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
                        { name: { $regex: expansion, $options: 'i' } },
                        { 'location.city': { $regex: searchTerm, $options: 'i' } },
                        { 'location.state': { $regex: searchTerm, $options: 'i' } },
                        { aisheCode: { $regex: searchTerm, $options: 'i' } }
                    ]
                });
            } else {
                const regex = isAcronym ? `\\b${searchTerm}\\b` : searchTerm;
                conditions.push({
                    $or: [
                        { name: { $regex: regex, $options: 'i' } },
                        { 'location.city': { $regex: regex, $options: 'i' } },
                        { 'location.state': { $regex: regex, $options: 'i' } },
                        { aisheCode: { $regex: searchTerm, $options: 'i' } }
                    ]
                });
            }
        }

        // Filters
        if (state) conditions.push({ 'location.state': { $in: (state as string).split(',') } });
        if (city) conditions.push({ 'location.city': { $in: (city as string).split(',') } });
        if (type) conditions.push({ type: { $in: (type as string).split(',') } });
        if (rating) conditions.push({ rating: { $gte: Number(rating) } });

        if (management) conditions.push({ management: { $in: (management as string).split(',') } });
        if (collegeType) conditions.push({ collegeType: { $in: (collegeType as string).split(',') } });
        if (institutionCategory) conditions.push({ institutionCategory: { $in: (institutionCategory as string).split(',') } });
        if (locationType) conditions.push({ locationType: { $in: (locationType as string).split(',') } });

        // Stream filter
        if (stream) {
            const streamArray = (stream as string).split(',');
            const streamKeywords: Record<string, string[]> = {
                'Management': ['Management', 'Business', 'PGDM', 'Indian Institute of Management', 'FMS', 'XLRI'],
                'Engineering': ['Engineering', 'Technology', 'B.Tech', 'Indian Institute of Technology', 'National Institute of Technology', 'Indian Institute of Information Technology'],
                'Medicine': ['Medical', 'Medicine', 'All India Institute of Medical Sciences', 'MBBS', 'Dental', 'Nursing'],
                'Law': ['Law', 'Legal', 'National Law University', 'LLB', 'LLM'],
                'Pharmacy': ['Pharmacy', 'Pharma'],
                'Science': ['Science', 'Research'],
                'Commerce': ['Commerce', 'Economics', 'Finance'],
                'Arts': ['Arts', 'Humanities'],
                'Design': ['Design', 'National Institute of Design', 'National Institute of Fashion Technology'],
                'Education': ['Education', 'B.Ed'],
                'Hospitality': ['Hospitality', 'Hotel'],
                'Media': ['Media', 'Journalism'],
                'Architecture': ['Architecture', 'Planning'],
                'Computer Application': ['Computer', 'MCA', 'BCA']
            };

            const allKeywords = streamArray.flatMap(s => streamKeywords[s] || [s]);
            // Wrap each keyword with word boundaries to prevent partial matches
            // e.g. \bMBA\b won't match inside "Mumbai" or "Bombay"
            const boundedKeywords = allKeywords.map(k => `\\b${k}\\b`);
            const streamRegex = new RegExp(boundedKeywords.join('|'), 'i');

            conditions.push({
                $or: [
                    { name: { $regex: streamRegex.source, $options: 'i' } },
                    { collegeType: { $regex: streamRegex.source, $options: 'i' } }
                ]
            });
        }

        // Course filter
        if (course) {
            const courseArray = (course as string).split(',');
            const regexPatterns = courseArray.map(c =>
                c.split(/[/,]/).map(part =>
                    part.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                ).filter(Boolean).join('|')
            );

            conditions.push({
                coursesOffered: {
                    $elemMatch: { name: { $regex: regexPatterns.join('|'), $options: 'i' } }
                }
            });
        }

        // Branch filter
        if (branch) {
            const branchArray = (branch as string).split(',');
            const regexPatterns = branchArray.map(b =>
                b.split(/[/,]/).map(part =>
                    part.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                ).filter(Boolean).join('|')
            );

            conditions.push({
                cutoffs: {
                    $elemMatch: { branch: { $regex: regexPatterns.join('|'), $options: 'i' } }
                }
            });
        }

        // Fees filter
        if (fees) {
            let feeRange: any = {};
            switch (fees) {
                case 'under_1l': feeRange = { $lt: 100000 }; break;
                case '1l_3l': feeRange = { $gte: 100000, $lte: 300000 }; break;
                case '3l_5l': feeRange = { $gte: 300000, $lte: 500000 }; break;
                case '5l_10l': feeRange = { $gte: 500000, $lte: 1000000 }; break;
                case 'above_10l': feeRange = { $gt: 1000000 }; break;
            }
            if (Object.keys(feeRange).length > 0) {
                conditions.push({ 'coursesOffered.fee': feeRange });
            }
        }

        // ✅ Default NIRF filter
        if (isNirfSort) {
            conditions.push({ nirfRank: { $ne: null, $gt: 0 } });
        }

        const query = conditions.length > 0 ? { $and: conditions } : {};

        // Sort option
        let sortOption: any = { _sortRank: 1 };

        switch (sortValue) {
            case 'rating':
                sortOption = { rating: -1 };
                break;
            case 'fees_low':
                sortOption = { 'coursesOffered.0.fee': 1 };
                break;
            case 'fees_high':
                sortOption = { 'coursesOffered.0.fee': -1 };
                break;
            case 'name':
                sortOption = { name: 1 };
                break;
            case 'newest':
                sortOption = { yearOfEstablishment: -1 };
                break;
            case 'nirfRank':
            default:
                sortOption = { _sortRank: 1 };
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        // Aggregation with safety fallback
        const pipeline: any[] = [
            { $match: query },
            {
                $addFields: {
                    _sortRank: {
                        $cond: {
                            if: { $and: [{ $ne: ['$nirfRank', null] }, { $gt: ['$nirfRank', 0] }] },
                            then: '$nirfRank',
                            else: 999999
                        }
                    }
                }
            },
            ...(isNirfSort ? [{ $match: { _sortRank: { $lt: 999999 } } }] : []),
            { $sort: sortOption },
            { $skip: skip },
            { $limit: limitNum },
            { $project: { _sortRank: 0 } }
        ];

        const colleges = await College.aggregate(pipeline);
        const total = await College.countDocuments(query);

        res.status(200).json({
            success: true,
            count: colleges.length,
            pagination: {
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                total
            },
            data: colleges
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single college by slug
// @route   GET /api/colleges/:slug
// @access  Public
export const getCollegeBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const college = await College.findOne({ slug: req.params.slug });

        if (!college) {
            res.status(404).json({ success: false, message: 'College not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: college
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search colleges (Autocomplete)
// @route   GET /api/colleges/search
// @access  Public
export const searchColleges = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;

        if (!q) {
            res.status(400).json({ success: false, message: 'Please provide a search term' });
            return;
        }

        const colleges = await College.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { aisheCode: { $regex: q, $options: 'i' } }
            ]
        })
            .select('name slug location type logo institutionCategory management')
            .limit(10);

        res.status(200).json({
            success: true,
            data: colleges
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Predict colleges based on rank (Simple)
// @route   GET /api/colleges/predict
// @access  Public
export const predictCollegesSimple = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rank, category, state, exam, quota } = req.query;

        if (!rank) {
            res.status(400).json({ success: false, message: 'Please provide a rank' });
            return;
        }

        const rankNum = Number(rank);
        const examStr = (exam as string) || 'JEE Main';
        const categoryStr = (category as string) || 'General';
        const stateStr = (state as string) || '';
        const quotaStr = (quota as string) || ''; // AI, HS, OS or empty for all

        // Wide range: find colleges where closing rank is between 0.5x and 2.5x of user rank
        const lowerBound = Math.floor(rankNum * 0.5);
        const upperBound = Math.ceil(rankNum * 2.5);

        // Build cutoff match conditions
        const cutoffMatch: any = {
            exam: examStr,
            category: categoryStr,
            closingRank: { $gte: lowerBound, $lte: upperBound }
        };

        // If specific quota requested, add it to the match
        if (quotaStr) {
            cutoffMatch.quota = quotaStr;
        }

        // Build location filter for state-based quota
        const locationMatch: any = {};
        if (quotaStr === 'HS' && stateStr) {
            // Home State Quota: only show colleges in user's state
            locationMatch['location.state'] = { $regex: new RegExp(stateStr, 'i') };
        } else if (quotaStr === 'OS' && stateStr) {
            // Other State Quota: only show colleges NOT in user's state
            locationMatch['location.state'] = { $not: { $regex: new RegExp(stateStr, 'i') } };
        }

        const pipeline: any[] = [
            {
                $match: {
                    ...locationMatch,
                    cutoffs: { $elemMatch: cutoffMatch }
                }
            },
            {
                $addFields: {
                    matchingCutoffs: {
                        $filter: {
                            input: '$cutoffs',
                            as: 'cutoff',
                            cond: {
                                $and: [
                                    { $eq: ['$$cutoff.exam', examStr] },
                                    { $eq: ['$$cutoff.category', categoryStr] },
                                    { $gte: ['$$cutoff.closingRank', lowerBound] },
                                    { $lte: ['$$cutoff.closingRank', upperBound] },
                                    ...(quotaStr ? [{ $eq: ['$$cutoff.quota', quotaStr] }] : [])
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    location: 1,
                    type: 1,
                    nirfRank: 1,
                    matchingCutoffs: {
                        $map: {
                            input: '$matchingCutoffs',
                            as: 'c',
                            in: {
                                branch: '$$c.branch',
                                closing: '$$c.closingRank',
                                category: '$$c.category',
                                quota: { $ifNull: ['$$c.quota', 'AI'] },
                                year: '$$c.year'
                            }
                        }
                    }
                }
            },
            { $limit: 100 }
        ];

        const colleges = await College.aggregate(pipeline);

        res.status(200).json({
            success: true,
            count: colleges.length,
            data: colleges
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Compare multiple colleges
// @route   POST /api/colleges/compare
// @access  Public
export const compareColleges = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ids, slugs } = req.body;

        let query: any = {};
        if (ids && ids.length > 0) {
            query._id = { $in: ids };
        } else if (slugs && slugs.length > 0) {
            query.slug = { $in: slugs };
        } else {
            res.status(400).json({ success: false, message: 'Please provide college IDs or slugs to compare' });
            return;
        }

        const colleges = await College.find(query);

        res.status(200).json({
            success: true,
            data: colleges
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new college
// @route   POST /api/colleges
// @access  Private/Admin
export const createCollege = async (req: Request, res: Response): Promise<void> => {
    try {
        const college = await College.create(req.body);

        // Fire-and-forget AI content generation (non-blocking)
        if (process.env.OPENAI_API_KEY) {
            generateCollegeContent(college)
                .then(async (aiContent) => {
                    const stats = validatePlacementStats(aiContent.placementStats);
                    aiContent.placementStats = stats;
                    await College.findByIdAndUpdate(college._id, {
                        aiContent,
                        aiGenerated: true,
                        aiGeneratedAt: new Date()
                    });
                    console.log(`AI content generated for: ${college.name}`);
                })
                .catch((err) => {
                    console.error(`AI generation failed for ${college.name}: ${err.message}`);
                });
        }

        res.status(201).json({
            success: true,
            data: college
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update college
// @route   PUT /api/colleges/:id
// @access  Private/Admin
export const updateCollege = async (req: Request, res: Response): Promise<void> => {
    try {
        let college = await College.findById(req.params.id);

        if (!college) {
            res.status(404).json({ success: false, message: 'College not found' });
            return;
        }

        college = await College.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: college
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete college
// @route   DELETE /api/colleges/:id
// @access  Private/Admin
export const deleteCollege = async (req: Request, res: Response): Promise<void> => {
    try {
        const college = await College.findById(req.params.id);

        if (!college) {
            res.status(404).json({ success: false, message: 'College not found' });
            return;
        }

        await college.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Sync colleges with external data
// @route   POST /api/colleges/sync
// @access  Private/Admin
export const syncColleges = async (req: Request, res: Response): Promise<void> => {
    try {
        // Placeholder for sync logic
        res.status(200).json({
            success: true,
            message: 'Colleges synchronized successfully'
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get single college by ID
// @route   GET /api/colleges/id/:id
// @access  Public
export const getCollegeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const college = await College.findById(req.params.id);

        if (!college) {
            res.status(404).json({ success: false, message: 'College not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: college
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Generate AI content for a college
// @route   POST /api/colleges/:id/generate-ai
// @access  Private/Admin
export const generateAIContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const college = await College.findById(req.params.id);

        if (!college) {
            res.status(404).json({ success: false, message: 'College not found' });
            return;
        }

        // If already generated, return existing content
        if (college.aiGenerated && college.aiContent) {
            res.status(200).json({
                success: true,
                message: 'AI content already exists',
                data: college.aiContent
            });
            return;
        }

        // Generate AI content
        const aiContent = await generateCollegeContent(college);

        // Validate placement stats
        aiContent.placementStats = validatePlacementStats(aiContent.placementStats);

        // Save to database
        college.aiContent = aiContent;
        college.aiGenerated = true;
        college.aiGeneratedAt = new Date();
        await college.save();

        res.status(200).json({
            success: true,
            message: 'AI content generated successfully',
            data: aiContent
        });
    } catch (error: any) {
        console.error(`AI content generation error: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
