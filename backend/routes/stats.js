const express = require('express');
const router = express.Router();
const { getPostStats } = require('../controllers/statsController');
const { protect, authorizeRoles } = require('../middleware/auth');

// Admin-only stats endpoint
router.get('/posts', protect, authorizeRoles('admin'), getPostStats);

module.exports = router;
