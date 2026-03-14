import express from 'express';
import {
    getExams,
    getExamBySlug,
    createExam,
    updateExam,
    deleteExam,
    getExamGuide,
    getExamById,
    getBankingExamsList,
    getExamsListByCategory
} from '../controllers/exam.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getExams)
    .post(protect, authorize('admin'), createExam);

router.get('/banking/list', getBankingExamsList);
router.get('/category/:category/list', getExamsListByCategory);

router.route('/id/:id')
    .get(getExamById);

router.route('/:id')
    .put(protect, authorize('admin'), updateExam)
    .delete(protect, authorize('admin'), deleteExam);

router.route('/:slug/guide')
    .get(getExamGuide);

router.route('/:slug')
    .get(getExamBySlug);

export default router;
