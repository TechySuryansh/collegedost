const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    predictColleges, 
    seedColleges, 
    predictByPercentile,
    getPredictionById,
    getMyPredictions
} = require('../controllers/predictor.controller');

// NEET Predictor
const { 
    predictNEETColleges, 
    getNEETPredictionById 
} = require('../controllers/neetPredictor.controller');

// JEE Rank Predictor
const {
    predictJEERank,
    getJEERankPredictionById
} = require('../controllers/rankPredictor.controller');

// JEE Main College Predictor Routes
router.post('/jee-main', predictColleges);
router.post('/jee-main-rank', require('../controllers/predictor.controller').predictRank);
router.post('/predict-by-percentile', predictByPercentile); // Enhanced JEE predictor with DB storage
router.get('/prediction/:id', getPredictionById); // Get single JEE prediction by ID

// JEE Main Rank Predictor Routes
router.post('/jee-rank-predict', predictJEERank); // JEE Main rank predictor
router.get('/jee-rank-prediction/:id', getJEERankPredictionById); // Get single rank prediction by ID

// NEET Routes
router.post('/neet-predict', predictNEETColleges); // NEET college predictor
router.get('/neet-prediction/:id', getNEETPredictionById); // Get single NEET prediction by ID

// Common Routes
router.get('/my-predictions', protect, getMyPredictions); // Get user's prediction history
router.get('/colleges', require('../controllers/predictor.controller').getColleges);
router.post('/seed', seedColleges);

module.exports = router;

