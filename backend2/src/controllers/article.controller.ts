import { Request, Response } from 'express';
import Article from '../models/Article';

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const query: any = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } }
            ];
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const articles = await Article.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Article.countDocuments(query);

        res.status(200).json({
            success: true,
            count: articles.length,
            pagination: {
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                total
            },
            data: articles
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get article by slug
// @route   GET /api/articles/:slug
// @access  Public
export const getArticleBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });

        if (!article) {
            res.status(404).json({ success: false, message: 'Article not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Private/Admin
export const createArticle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title } = req.body;

        // Generate slug if not provided
        if (!req.body.slug && title) {
            req.body.slug = title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
        }

        const article = await Article.create(req.body);

        res.status(201).json({
            success: true,
            data: article
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
export const updateArticle = async (req: Request, res: Response): Promise<void> => {
    try {
        let article = await Article.findById(req.params.id);

        if (!article) {
            res.status(404).json({ success: false, message: 'Article not found' });
            return;
        }

        // Generate slug if title is updated and slug is not provided
        if (req.body.title && !req.body.slug) {
            req.body.slug = req.body.title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
        }

        article = await Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            res.status(404).json({ success: false, message: 'Article not found' });
            return;
        }

        await article.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get article by ID
// @route   GET /api/articles/id/:id
// @access  Public
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            res.status(404).json({ success: false, message: 'Article not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get AI Generated News
// @route   GET /api/articles/ai-news
// @access  Public
export const getAINews = async (req: Request, res: Response): Promise<void> => {
    try {
        // Find news from the last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);

        let articles = await Article.find({
            createdAt: { $gte: oneDayAgo }
        }).sort({ createdAt: -1 });

        // If we have fewer than 4 recent news, generate more using AI
        if (articles.length < 4) {
            const { generateLatestArticles } = require('../services/gemini.service');
            const aiNews = await generateLatestArticles();

            const savedNews = [];
            for (const item of aiNews) {
                // Check if title already exists to avoid duplicates
                const exists = await Article.findOne({ title: item.title });
                if (!exists) {
                    const slug = item.title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 5);
                    const newArticle = await Article.create({
                        ...item,
                        slug
                    });
                    savedNews.push(newArticle);
                }
            }

            // Re-fetch all recent news including newly generated ones
            articles = await Article.find({
                createdAt: { $gte: oneDayAgo }
            }).sort({ createdAt: -1 }).limit(8);
        }

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error: any) {
        console.error('[Article Controller] Error getting AI news:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
