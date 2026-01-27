const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

router.post('/register', register);
router.get('/register', (req, res) => res.json({ message: 'Register endpoint. Send a POST request with user details to sign up.' }));

router.post('/login', login);
router.get('/login', (req, res) => res.json({ message: 'Login endpoint. Send a POST request with email and password to log in.' }));
router.post('/google', require('../controllers/auth.controller').googleLogin);
router.post('/forgot-password', require('../controllers/auth.controller').forgotPassword);
router.post('/reset-password', require('../controllers/auth.controller').resetPassword);

module.exports = router;
