import User, { IUser } from '../models/User';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface RegisterUserData {
    name: string;
    email: string;
    mobile: string;
    password: string;
    currentClass?: string;
    interest?: string;
    city?: string;
}

interface AuthResponse {
    user: IUser;
    token: string;
}

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterUserData): Promise<AuthResponse> => {
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
 */
export const loginUser = async (email?: string, password?: string): Promise<AuthResponse> => {
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
 */
export const googleLoginUser = async (token: string): Promise<AuthResponse> => {
    if (!token) throw new Error('Google token is required');

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid Google Token');

    const { name, email, sub: googleId } = payload;

    if (!email) throw new Error('Email not found in Google Token');

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
        if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }
    } else {
        user = await User.create({
            name: name || 'Google User',
            email,
            googleId,
            password: crypto.randomBytes(20).toString('hex'), // Random password for google users
            mobile: '' // Mobile not provided by Google usually
        });
    }

    const jwtToken = user.getSignedJwtToken();

    return { user, token: jwtToken };
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<IUser> => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
