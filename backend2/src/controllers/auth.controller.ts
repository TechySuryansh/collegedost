import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Register user
// @route   POST /api/auth/signup-new || /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error("Registration Error:", error.message);
        res.status(400).json({ success: false, message: error.message || 'Registration failed' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error("Login Error:", error.message);
        const statusCode = error.message === 'Invalid credentials' ? 401 : 500;
        res.status(statusCode).json({ success: false, message: error.message || 'Login failed' });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error("Google Login Error:", error.message);
        res.status(400).json({ success: false, message: error.message || 'Google Login Failed' });
    }
};

// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
// Using AuthRequest to access req.user
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        // req.user is already set by middleware
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const user = await authService.getUserById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
