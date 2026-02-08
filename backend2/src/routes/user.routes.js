const express = require('express');
const router = express.Router();
const {
    getMe,
    updateDetails,
    updatePassword,
    getUsers,
    getUser,
    deleteUser
} = require('../controllers/user.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

// User profile routes (protected)
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

// Admin routes (protected + admin role required)
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
