const express = require('express');
const router = express.Router();
const { getExams, getExamBySlug, createExam, deleteExam, refreshExamNews, autoIngestExams } = require('../controllers/exam.controller');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getExams);
router.post('/ingest', autoIngestExams); // Public for now to run easily
router.get('/:slug', getExamBySlug);

// Protected routes (Add 'admin' check middleware in future)
router.post('/', protect, createExam);
router.delete('/:id', protect, deleteExam);
router.post('/:id/refresh-news', protect, refreshExamNews);

module.exports = router;
