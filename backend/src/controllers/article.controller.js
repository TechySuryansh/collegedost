const Article = require('../models/Article.model');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
    try {
        const { category } = req.query;
        let query = { isPublished: true };
        
        // Admin might want to see drafts too if accessing this endpoint? 
        // Or we make a separate admin get all endpoint. 
        // For now, let's keep this public. Admin can see draft if we add a 'status' param maybe?
        // Let's stick to simple implementation.
        
        if (category) {
            query.category = category;
        }

        const articles = await Article.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all articles (Admin)
// @route   GET /api/articles/admin/all
// @access  Private/Admin
exports.getAdminArticles = async (req, res) => {
    try {
        const articles = await Article.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single article by Slug
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single article by ID
// @route   GET /api/articles/id/:id
// @access  Private/Admin
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private (Admin)
exports.createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json({ success: true, data: article });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private (Admin)
exports.updateArticle = async (req, res) => {
    try {
        let article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        article = await Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: article });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private (Admin)
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        await article.deleteOne();

        res.status(200).json({ success: true, message: 'Article deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Fetch news from RSS feeds
// @route   POST /api/articles/admin/fetch-news
// @access  Private (Admin)
exports.fetchNews = async (req, res) => {
    try {
        const fetchAndStoreNews = require('../utils/newsFetcher');
        
        // Run the news fetch
        const result = await fetchAndStoreNews();
        
        res.status(200).json({ 
            success: true, 
            message: `News fetch complete. Added ${result.newArticlesCount || result} new articles.`,
            data: result
        });
    } catch (error) {
        console.error('News fetch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
