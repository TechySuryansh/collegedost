import express from 'express';
import {
    getExams,
    getExamBySlug,
    createExam,
    updateExam,
    deleteExam,
    getExamGuide,
    getExamById
} from '../controllers/exam.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getExams)
    .post(protect, authorize('admin'), createExam);

router.route('/:slug')
    .get(getExamBySlug);

router.route('/:slug/guide')
    .get(getExamGuide);

router.route('/id/:id')
    .get(getExamById)
    .put(protect, authorize('admin'), updateExam)
    .delete(protect, authorize('admin'), deleteExam);

export default router;
