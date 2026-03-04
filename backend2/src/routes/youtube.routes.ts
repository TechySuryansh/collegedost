import express from 'express';
import {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo
} from '../controllers/youtube.controller';

import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getVideos)
    .post(protect, authorize('admin'), createVideo);

router.route('/:id')
    .get(getVideoById)
    .put(protect, authorize('admin'), updateVideo)
    .delete(protect, authorize('admin'), deleteVideo);

export default router;
