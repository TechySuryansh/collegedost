import express from 'express';
import {
    getStats,
    getPredictorSettings,
    updatePredictorSettings
} from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are admin-only
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/predictor-settings', getPredictorSettings);
router.put('/predictor-settings', updatePredictorSettings);

export default router;
