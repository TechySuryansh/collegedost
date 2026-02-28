import express from 'express';
import {
    getMe,
    updateDetails,
    updatePassword,
    getUsers,
    getUser,
    deleteUser,
    toggleBookmark,
    exportUsers
} from '../controllers/user.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// User profile routes (protected)
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/bookmark', protect, toggleBookmark);

// Admin routes (protected + admin role required)
router.get('/export', protect, authorize('admin'), exportUsers);
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
