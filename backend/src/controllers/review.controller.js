const Review = require('../models/Review.model');
const College = require('../models/College.model');
const mongoose = require('mongoose');

// @desc    Get reviews for a college
// @route   GET /api/reviews/college/:collegeId
// @access  Public
exports.getCollegeReviews = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            return res.status(200).json({
                success: true,
                count: 0,
                total: 0,
                page: 1,
                pages: 0,
                stats: {
                    avgOverall: 0,
                    avgAcademics: 0,
                    avgFaculty: 0,
                    avgInfrastructure: 0,
                    avgPlacements: 0,
                    avgCampusLife: 0,
                    totalReviews: 0
                },
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                data: []
            });
        }

        const reviews = await Review.find({ college: collegeId, isApproved: true })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('user', '_id name');

        const total = await Review.countDocuments({ college: collegeId, isApproved: true });

        // Calculate average ratings
        const stats = await Review.aggregate([
            { $match: { college: new mongoose.Types.ObjectId(collegeId), isApproved: true } },
            {
                $group: {
                    _id: null,
                    avgOverall: { $avg: '$overallRating' },
                    avgAcademics: { $avg: '$academicsRating' },
                    avgFaculty: { $avg: '$facultyRating' },
                    avgInfrastructure: { $avg: '$infrastructureRating' },
                    avgPlacements: { $avg: '$placementsRating' },
                    avgCampusLife: { $avg: '$campusLifeRating' },
                    totalReviews: { $sum: 1 },
                    ratingDistribution: {
                        $push: '$overallRating'
                    }
                }
            }
        ]);

        // Calculate rating distribution
        let ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (stats.length > 0 && stats[0].ratingDistribution) {
            stats[0].ratingDistribution.forEach(r => {
                ratingDist[Math.round(r)] = (ratingDist[Math.round(r)] || 0) + 1;
            });
        }

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            stats: stats[0] || {
                avgOverall: 0,
                avgAcademics: 0,
                avgFaculty: 0,
                avgInfrastructure: 0,
                avgPlacements: 0,
                avgCampusLife: 0,
                totalReviews: 0
            },
            ratingDistribution: ratingDist,
            data: reviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (logged in users)
exports.createReview = async (req, res) => {
    try {
        console.log('--- CREATE REVIEW ---');
        console.log('Body:', JSON.stringify(req.body));
        console.log('User:', req.user ? req.user._id : 'NO USER');

        const { 
            collegeId, 
            overallRating, 
            academicsRating, 
            facultyRating, 
            infrastructureRating, 
            placementsRating,
            campusLifeRating,
            title, 
            reviewText, 
            pros, 
            cons,
            courseName,
            graduationYear
        } = req.body;

        // 1. Basic Validation
        if (!collegeId) {
            return res.status(400).json({ success: false, message: 'College ID is required' });
        }
        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            return res.status(400).json({ success: false, message: 'Invalid College ID format' });
        }
        if (!overallRating || overallRating < 1 || overallRating > 5) {
            return res.status(400).json({ success: false, message: 'Overall rating is required and must be between 1 and 5' });
        }
        if (!title || title.trim() === '') {
            return res.status(400).json({ success: false, message: 'Review title is required' });
        }
        if (!reviewText || reviewText.trim() === '') {
            return res.status(400).json({ success: false, message: 'Review text is required' });
        }

        // 2. Auth Check (Double check even with protect middleware)
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'Not authorized, user data missing' });
        }

        // 3. College Check
        const college = await College.findById(collegeId);
        if (!college) {
            return res.status(404).json({ success: false, message: 'College not found' });
        }

        // 4. Duplicate Check
        const existingReview = await Review.findOne({ college: collegeId, user: req.user._id });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this college' });
        }

        // 5. Create Review
        const review = await Review.create({
            college: collegeId,
            user: req.user._id,
            overallRating: Number(overallRating),
            academicsRating: academicsRating ? Number(academicsRating) : undefined,
            facultyRating: facultyRating ? Number(facultyRating) : undefined,
            infrastructureRating: infrastructureRating ? Number(infrastructureRating) : undefined,
            placementsRating: placementsRating ? Number(placementsRating) : undefined,
            campusLifeRating: campusLifeRating ? Number(campusLifeRating) : undefined,
            title,
            reviewText,
            pros,
            cons,
            authorName: req.user.name || 'Anonymous',
            courseName,
            graduationYear: graduationYear ? Number(graduationYear) : undefined
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });
    } catch (error) {
        console.error('SERVER ERROR IN createReview:', error);
        
        // Handle Mongoose Validation Errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this college' });
        }
        
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (owner only)
exports.updateReview = async (req, res) => {
    try {
        // Validate review ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid review ID format' });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check ownership
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
        }

        const { 
            overallRating, 
            academicsRating, 
            facultyRating, 
            infrastructureRating, 
            placementsRating,
            campusLifeRating,
            title, 
            reviewText, 
            pros, 
            cons,
            courseName,
            graduationYear
        } = req.body;

        // Update fields
        if (overallRating) review.overallRating = overallRating;
        if (academicsRating) review.academicsRating = academicsRating;
        if (facultyRating) review.facultyRating = facultyRating;
        if (infrastructureRating) review.infrastructureRating = infrastructureRating;
        if (placementsRating) review.placementsRating = placementsRating;
        if (campusLifeRating) review.campusLifeRating = campusLifeRating;
        if (title) review.title = title;
        if (reviewText) review.reviewText = reviewText;
        if (pros !== undefined) review.pros = pros;
        if (cons !== undefined) review.cons = cons;
        if (courseName !== undefined) review.courseName = courseName;
        if (graduationYear) review.graduationYear = graduationYear;

        await review.save();

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: review
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res) => {
    try {
        // Validate review ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid review ID format' });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check if user already marked
        if (review.helpfulBy.includes(req.user._id)) {
            // Remove the mark
            review.helpfulBy = review.helpfulBy.filter(id => id.toString() !== req.user._id.toString());
            review.helpfulCount = Math.max(0, review.helpfulCount - 1);
        } else {
            review.helpfulBy.push(req.user._id);
            review.helpfulCount += 1;
        }

        await review.save();

        res.status(200).json({
            success: true,
            helpfulCount: review.helpfulCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a review (own or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        // Validate review ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid review ID format' });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check ownership or admin
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my
// @access  Private
exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('college', 'name slug logo')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
