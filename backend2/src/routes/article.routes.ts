import express from 'express';
import {
    getArticles,
    getAINews,
    getArticleBySlug,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} from '../controllers/article.controller';

import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/ai-news', getAINews);

router.route('/')
    .get(getArticles)
    .post(protect, authorize('admin'), createArticle);

router.route('/:slug')
    .get(getArticleBySlug);

router.get('/id/:id', getArticleById);

router.route('/:id')
    .put(protect, authorize('admin'), updateArticle)
    .delete(protect, authorize('admin'), deleteArticle);

export default router;
