import express from 'express';
import {
    getCourses,
    getCourseBySlug,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseGuide,
    getCourseById
} from '../controllers/course.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getCourses)
    .post(protect, authorize('admin'), createCourse);

router.route('/:slug/guide')
    .get(getCourseGuide);

router.route('/:slug')
    .get(getCourseBySlug);

router.route('/id/:id')
    .get(getCourseById)
    .put(protect, authorize('admin'), updateCourse)
    .delete(protect, authorize('admin'), deleteCourse);

export default router;
