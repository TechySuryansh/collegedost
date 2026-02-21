import { Request, Response } from 'express';
import College from '../models/College';

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

        // Search
        if (search) {
            const searchTerm = search as string;
            // For short acronyms (2-4 chars), use word boundaries to avoid partial matches (e.g., MBA matching Mumbai)
            const isAcronym = /^[A-Z]{2,4}$/.test(searchTerm);
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

        // Filters
        if (state) conditions.push({ 'location.state': { $in: (state as string).split(',') } });
        if (city) conditions.push({ 'location.city': { $in: (city as string).split(',') } });
        if (type) conditions.push({ type: { $in: (type as string).split(',') } });
        if (rating) conditions.push({ rating: { $gte: Number(rating) } });

        // New AISHE filters
        if (management) conditions.push({ management: { $in: (management as string).split(',') } });
        if (collegeType) conditions.push({ collegeType: { $in: (collegeType as string).split(',') } });
        if (institutionCategory) conditions.push({ institutionCategory: { $in: (institutionCategory as string).split(',') } });
        if (locationType) conditions.push({ locationType: { $in: (locationType as string).split(',') } });

        // Stream fallback filtering (for data without explicit course details)
        if (stream) {
            const streamArray = (stream as string).split(',');
            const streamKeywords: Record<string, string[]> = {
                'Management': ['Management', 'Business', 'MBA', 'IIM', 'PGDM', 'BBA', 'FMS', 'XLRI', 'Entrepreneurship'],
                'Engineering': ['Engineering', 'Technology', 'B.Tech', 'IIT', 'NIT', 'IIIT', 'Polytechnic', 'B.E.', 'Industrial'],
                'Medicine': ['Medical', 'Medicine', 'AIIMS', 'MBBS', 'Dental', 'Nursing', 'Health', 'Pharmacology'],
                'Law': ['Law', 'Legal', 'NLU', 'LLB', 'LLM', 'Juridical', 'Justice'],
                'Pharmacy': ['Pharmacy', 'Pharma', 'Pharmaceutical'],
                'Science': ['Science', 'Theoretical', 'Research'],
                'Commerce': ['Commerce', 'Accountancy', 'Economics', 'Finance'],
                'Arts': ['Arts', 'Social Sciences', 'Humanities', 'Fine Arts'],
                'Design': ['Design', 'NID', 'NIFT', 'Fashion', 'Apparel'],
                'Education': ['Education', 'Teacher', 'Training', 'B.Ed', 'M.Ed'],
                'Hospitality': ['Hospitality', 'Hotel', 'Catering', 'Tourism'],
                'Media': ['Media', 'Journalism', 'Mass Communication', 'Broadcasting'],
                'Architecture': ['Architecture', 'Planning', 'B.Arch', 'M.Arch'],
                'Computer Application': ['Computer', 'Applications', 'MCA', 'BCA', 'Information Technology']
            };

            const allKeywords = streamArray.flatMap(s => streamKeywords[s] || [s]);
            const streamRegex = new RegExp(allKeywords.join('|'), 'i');

            conditions.push({
                $or: [
                    { name: { $regex: streamRegex.source, $options: 'i' } },
                    { collegeType: { $regex: streamRegex.source, $options: 'i' } }
                ]
            });
        }

        // Complex filters for nested arrays (courses and cutoffs)
        if (course) {
            const courseArray = (course as string).split(',');
            const regexPatterns = courseArray.map(c => {
                // Split by "/" or "," to handle mixed naming (e.g., "B.E / B.Tech")
                return c.split(/[/,]/).map(part =>
                    part.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                ).filter(Boolean).join('|');
            });
            conditions.push({
                coursesOffered: {
                    $elemMatch: { name: { $regex: regexPatterns.join('|'), $options: 'i' } }
                }
            });
        }

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

        if (fees) {
            let feeRange: any = {};
            switch (fees) {
                case 'under_1l':
                    feeRange = { $lt: 100000 };
                    break;
                case '1l_3l':
                    feeRange = { $gte: 100000, $lte: 300000 };
                    break;
                case '3l_5l':
                    feeRange = { $gte: 300000, $lte: 500000 };
                    break;
                case '5l_10l':
                    feeRange = { $gte: 500000, $lte: 1000000 };
                    break;
                case 'above_10l':
                    feeRange = { $gt: 1000000 };
                    break;
            }
            if (Object.keys(feeRange).length > 0) {
                conditions.push({ 'coursesOffered.fee': feeRange });
            }
        }

        const query = conditions.length > 0 ? { $and: conditions } : {};

        // Sort — use computed field so colleges without nirfRank go to bottom
        let sortOption: any = { _sortRank: 1 }; // Default sort by ranking
        if (sort === 'rating') sortOption = { rating: -1 };
        if (sort === 'fees_low') sortOption = { 'coursesOffered.0.fee': 1 };
        if (sort === 'fees_high') sortOption = { 'coursesOffered.0.fee': -1 };
        if (sort === 'name') sortOption = { name: 1 };
        if (sort === 'newest') sortOption = { yearOfEstablishment: -1 };
        if (sort === 'nirfRank') sortOption = { _sortRank: 1 };

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        // Use aggregation to add computed sort field for NIRF ranking
        // This ensures colleges without nirfRank appear at the bottom
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
            { $sort: sortOption },
            { $skip: skip },
            { $limit: limitNum },
            { $project: { _sortRank: 0 } } // Remove the computed field from output
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
        const { rank, category, state, exam } = req.query;

        if (!rank) {
            res.status(400).json({ success: false, message: 'Please provide a rank' });
            return;
        }

        const rankNum = Number(rank);

        // Basic logic: Find colleges where cutoff for the category is >= user rank
        // This is a simplified version. Real prediction is complex.
        const colleges = await College.aggregate([
            {
                $match: {
                    cutoffs: {
                        $elemMatch: {
                            exam: exam || 'JEE Advanced', // Default
                            category: category || 'General',
                            closingRank: { $gte: rankNum }
                        }
                    }
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
                                    { $eq: ['$$cutoff.exam', exam || 'JEE Advanced'] },
                                    { $eq: ['$$cutoff.category', category || 'General'] },
                                    { $gte: ['$$cutoff.closingRank', rankNum] }
                                ]
                            }
                        }
                    }
                }
            },
            { $limit: 20 }
        ]);

        res.status(200).json({
            success: true,
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

