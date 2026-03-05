const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin', 'SRIC', 'Inspector'), getDashboardStats);

module.exports = router;
