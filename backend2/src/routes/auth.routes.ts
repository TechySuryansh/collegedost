import express from 'express';
import { register, login, googleLogin, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/signup-new', register); // keeping legacy endpoint support
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

export default router;
