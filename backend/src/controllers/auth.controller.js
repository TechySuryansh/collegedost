const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, mobile, password, currentClass, interest, city } = req.body;

        // Check if user exists (Mobile)
        const userExists = await User.findOne({ mobile });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this mobile number' });
        }

        // Check if user exists (Email)
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            mobile,
            password,
            currentClass,
            interest: interest || null, // Ensure empty string becomes null for cleaner DB
            city,
            isVerified: true // Explicitly set as they passed verification
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'Registered successfully',
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    mobile: user.mobile,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }

    } catch (error) {
        console.error("Registration Error:", error);
        if (error.code === 11000) {
            // Check which field caused the duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            const message = field ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` : 'Email or Mobile already exists';
            return res.status(400).json({ success: false, message });
        }
        // Return actual error message for debugging
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const { OAuth2Client } = require('google-auth-library');
// Note: If GOOGLE_CLIENT_ID is not set, this will fail verification if not handled carefully.
// Ensure you set GOOGLE_CLIENT_ID in .env
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body; // ID Token from frontend

        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            payload = ticket.getPayload();
        } catch (verifyError) {
            console.error("Google verify error:", verifyError);
            return res.status(401).json({ success: false, message: 'Invalid Google Token' });
        }

        const { name, email, sub: googleId } = payload;

        let user = await User.findOne({
            $or: [{ googleId }, { email }]
        });

        if (user) {
            // Update googleId if missing
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create user
            // Note: Mobile is optional thanks to schema update
            user = await User.create({
                name,
                email,
                googleId
            });
        }

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                googleId: user.googleId,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        // Get reset token (OTP)
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. \n\n Your Password Reset Code is: ${resetToken}`;
        const html = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h1 style="color: #1e3a8a;">Reset Password Code</h1>
                <p>You requested a password reset. Please use the following code to reset your password:</p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a; padding: 20px 0;">${resetToken}</div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Code',
                message,
                html
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email, OTP and new password' });
        }

        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(otp.toString()) // Ensure string
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            data: 'Password updated successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
