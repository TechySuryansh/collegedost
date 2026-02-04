const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Ratings (1-5)
    overallRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    academicsRating: {
        type: Number,
        min: 1,
        max: 5
    },
    facultyRating: {
        type: Number,
        min: 1,
        max: 5
    },
    infrastructureRating: {
        type: Number,
        min: 1,
        max: 5
    },
    placementsRating: {
        type: Number,
        min: 1,
        max: 5
    },
    campusLifeRating: {
        type: Number,
        min: 1,
        max: 5
    },
    // Review Content
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    reviewText: {
        type: String,
        required: true,
        maxlength: 2000
    },
    pros: {
        type: String,
        maxlength: 500
    },
    cons: {
        type: String,
        maxlength: 500
    },
    // User Details (for display)
    authorName: {
        type: String,
        required: true
    },
    courseName: String,     // "B.Tech CSE"
    graduationYear: Number, // 2024
    isVerified: {
        type: Boolean,
        default: false
    },
    // Moderation
    isApproved: {
        type: Boolean,
        default: true  // Auto-approve for now, can change to false for moderation
    },
    // Engagement
    helpfulCount: {
        type: Number,
        default: 0
    },
    helpfulBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

// Compound index to prevent duplicate reviews
reviewSchema.index({ college: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
