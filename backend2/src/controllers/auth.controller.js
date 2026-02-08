const authService = require('../services/auth.service');

// @desc    Register user
// @route   POST /api/auth/signup-new || /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { user, token } = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: 'Registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(400).json({ success: false, message: error.message || 'Registration failed' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        const statusCode = error.message === 'Invalid credentials' ? 401 : 500;
        res.status(statusCode).json({ success: false, message: error.message || 'Login failed' });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    try {
        const { user, token } = await authService.googleLoginUser(req.body.token);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Google Login Error:", error.message);
        res.status(400).json({ success: false, message: error.message || 'Google Login Failed' });
    }
};

// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        // req.user is already set by middleware, but we can refetch if needed or just return it
        const user = await authService.getUserById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
