const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/google', require('../controllers/auth.controller').googleLogin);
router.post('/forgot-password', require('../controllers/auth.controller').forgotPassword);
router.post('/reset-password', require('../controllers/auth.controller').resetPassword);

module.exports = router;
