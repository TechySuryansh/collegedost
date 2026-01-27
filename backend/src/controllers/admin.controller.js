const User = require('../models/User.model');
const College = require('../models/College.model');
const Article = require('../models/Article.model');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalColleges = await College.countDocuments();
        const totalArticles = await Article.countDocuments();

        const recentUsers = await User.find()
            .select('name email role createdAt mobile')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            stats: {
                users: totalUsers,
                colleges: totalColleges,
                articles: totalArticles
            },
            recentUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
