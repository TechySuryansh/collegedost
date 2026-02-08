const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Register a new user
 * @param {Object} userData
 * @returns {Object} { user, token }
 */
exports.registerUser = async (userData) => {
    const { name, email, mobile, password, currentClass, interest, city } = userData;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) {
        throw new Error('User with this email or mobile already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        mobile,
        password,
        currentClass,
        interest,
        city,
        isVerified: true
    });

    const token = user.getSignedJwtToken();

    return { user, token };
};

/**
 * Login user
 * @param {String} email
 * @param {String} password
 * @returns {Object} { user, token }
 */
exports.loginUser = async (email, password) => {
    if (!email || !password) {
        throw new Error('Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = user.getSignedJwtToken();

    return { user, token };
};

/**
 * Google Login
 * @param {String} token
 * @returns {Object} { user, token }
 */
exports.googleLoginUser = async (token) => {
    if (!token) throw new Error('Google token is required');

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
        if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }
    } else {
        user = await User.create({
            name,
            email,
            googleId,
            password: crypto.randomBytes(20).toString('hex'), // Random password for google users
            mobile: '' // Optional or handle later
        });
    }

    const jwtToken = user.getSignedJwtToken();

    return { user, token: jwtToken };
};

/**
 * Get user by ID
 * @param {String} id
 * @returns {Object} user
 */
exports.getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
