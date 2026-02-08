const express = require('express');
const router = express.Router();
const {
    getStats,
    getPredictorSettings,
    updatePredictorSettings
} = require('../controllers/admin.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

// All routes are admin-only
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/predictor-settings', getPredictorSettings);
router.put('/predictor-settings', updatePredictorSettings);

module.exports = router;
