const User = require('../models/User');
// Import other models as they're created
// const College = require('../models/College');
// const Article = require('../models/Article');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        // Count documents from each collection
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        // These will return 0 until we create the models
        const totalColleges = 0; // await College.countDocuments();
        const totalArticles = 0; // await Article.countDocuments();

        // Get recent users (last 5)
        const recentUsers = await User.find()
            .select('-password')
            .sort('-createdAt')
            .limit(5);

        res.status(200).json({
            success: true,
            stats: {
                users: totalUsers,
                admins: totalAdmins,
                colleges: totalColleges,
                articles: totalArticles,
                recentUsers: recentUsers
            }
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get predictor settings (placeholder)
// @route   GET /api/admin/predictor-settings
// @access  Private/Admin
exports.getPredictorSettings = async (req, res) => {
    try {
        // Placeholder - will implement later when predictor system is built
        res.status(200).json({
            success: true,
            data: {
                enabled: false,
                message: 'Predictor settings will be available after implementing the predictor system'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update predictor settings (placeholder)
// @route   PUT /api/admin/predictor-settings
// @access  Private/Admin
exports.updatePredictorSettings = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Predictor settings endpoint - to be implemented'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
