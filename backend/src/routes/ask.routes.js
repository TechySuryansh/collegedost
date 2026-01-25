const express = require('express');
const router = express.Router();
const { postQuestion } = require('../controllers/ask.controller');
const { protect } = require('../middleware/authMiddleware');

router.post('/question', protect, postQuestion);

module.exports = router;
