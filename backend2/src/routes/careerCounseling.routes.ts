import express from 'express';
import { generateReport } from '../controllers/careerCounseling.controller';

const router = express.Router();

// POST /api/career-counseling/generate
router.post('/generate', generateReport);

export default router;
