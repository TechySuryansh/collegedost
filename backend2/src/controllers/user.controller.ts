import { Response } from 'express';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('savedColleges', 'name slug location type logo')
            .populate('savedArticles', 'title slug category date');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update user details (name, mobile, city, etc.)
// @route   PUT /api/users/updatedetails
// @access  Private
export const updateDetails = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const fieldsToUpdate: any = {
            name: req.body.name,
            mobile: req.body.mobile,
            city: req.body.city,
            currentClass: req.body.currentClass,
            interest: req.body.interest
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => {
            if (fieldsToUpdate[key] === undefined) {
                delete fieldsToUpdate[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error: any) {
        console.error('Update Details Error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update profile'
        });
    }
};

// @desc    Update password
// @route   PUT /api/users/updatepassword
// @access  Private
export const updatePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update Password Error:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to update password'
        });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/**
 * @desc    Toggle Bookmark for College or Article
 * @route   POST /api/users/bookmark
 * @access  Private
 */
export const toggleBookmark = async (req: AuthRequest, res: Response) => {
    try {
        const { type, id } = req.body;

        if (!type || !id) {
            return res.status(400).json({ success: false, message: 'Please provide type and id' });
        }

        if (!['college', 'article'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid bookmark type' });
        }

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const field = type === 'college' ? 'savedColleges' : 'savedArticles';
        // @ts-ignore
        const itemIds: any[] = user[field];

        const index = itemIds.indexOf(id);

        if (index > -1) {
            // Remove bookmark
            itemIds.splice(index, 1);
            await user.save();
            return res.status(200).json({
                success: true,
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} removed from bookmarks`,
                isBookmarked: false
            });
        } else {
            // Add bookmark
            itemIds.push(id);
            await user.save();
            return res.status(200).json({
                success: true,
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} added to bookmarks`,
                isBookmarked: true
            });
        }
    } catch (error) {
        console.error('Toggle Bookmark Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
