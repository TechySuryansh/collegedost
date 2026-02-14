import express from 'express';
import {
    getColleges,
    getCollegeBySlug,
    searchColleges,
    predictCollegesSimple,
    compareColleges,
    createCollege,
    updateCollege,
    deleteCollege,
    syncColleges,
    getCollegeById
} from '../controllers/college.controller';


import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getColleges)
    .post(protect, authorize('admin'), createCollege);

router.get('/search', searchColleges);
router.get('/predict', predictCollegesSimple);
router.post('/compare', compareColleges);
router.post('/sync', protect, authorize('admin'), syncColleges);
router.get('/id/:id', getCollegeById);


router.route('/:slug')
    .get(getCollegeBySlug);

router.route('/:id')
    .put(protect, authorize('admin'), updateCollege)
    .delete(protect, authorize('admin'), deleteCollege);

export default router;
