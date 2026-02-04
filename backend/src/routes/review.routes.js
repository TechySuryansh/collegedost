const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getCollegeReviews,
    createReview,
    updateReview,
    markHelpful,
    deleteReview,
    getMyReviews
} = require('../controllers/review.controller');

// Public routes
router.get('/college/:collegeId', getCollegeReviews);

// Handle GET /api/reviews without collegeId - return helpful message instead of 400 to debug
router.get('/', (req, res) => {
    console.log('--- REVIEW BASE ROUTE HIT ---');
    console.log('Method:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Referer:', req.headers.referer);
    console.log('Query:', req.query);
    
    return res.status(200).json({ 
        success: true, 
        message: 'Endpoint reached. College ID is required for filtered results.',
        debug: {
            url: req.originalUrl,
            method: req.method,
            referer: req.headers.referer
        }
    });
});



// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.post('/:id/helpful', protect, markHelpful);
router.delete('/:id', protect, deleteReview);
router.get('/my', protect, getMyReviews);
router.get('/test', (req, res) => res.json({ message: 'Reviews API is working' }));

module.exports = router;
